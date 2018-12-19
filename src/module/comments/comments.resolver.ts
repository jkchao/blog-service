import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Permissions } from '@/common/decorator/Permissions.decorator';
import { CommentsService } from './comments.service';
import { Info } from './decorators/comments.decprator';
import { CommentInfoDto, QueryCommentDto } from './dto/comments.dto';
import { Request } from 'express';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsServer: CommentsService) {}

  @Query()
  public getComments(@Args() args: QueryCommentDto, @Context('request') request: Request) {
    const token = request.headers.authorization;
    if (!token) {
      args.state = 1;
    }
    return this.commentsServer.searchComments(args);
  }

  @Mutation()
  public async createComment(@Info() info: CommentInfoDto, @Context('request') request: Request) {
    const ip = ((request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.ip ||
      request.ips[0]) as string).replace('::ffff:', '');

    info.ip = ip;
    info.agent = request.headers['user-agent'] || info.agent;

    const result = await this.commentsServer.createComment({ ...info, ip });

    this.commentsServer.sendEmail(info, '');

    return result;
  }

  @Mutation()
  public updateComment() {
    // ..
  }

  @Mutation()
  @Permissions()
  public async deleteHero(@Args('_id') _id: string) {
    const res = await this.commentsServer.deleteComment(_id);
  }
}
