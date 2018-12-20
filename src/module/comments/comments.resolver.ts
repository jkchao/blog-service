import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Permissions } from '@/common/decorator/Permissions.decorator';
import { CommentsService } from './comments.service';
import { Info } from './decorators/comments.decprator';
import { CommentInfoDto, QueryCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

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

    // TODO: 根据评论获取文章链接

    this.commentsServer.sendEmail(info, '');

    this.commentsServer.updateArticleCommentCount([info.post_id]);

    return result;
  }

  @Mutation()
  @Permissions()
  public updateComment(@Info() info: UpdateCommentDto) {
    if (info.state && ![0, 1, 2].includes(info.state)) {
      throw new BadRequestException('state should in [0, 1, 2]');
    }
    return this.commentsServer.updateComment(info);
  }

  @Mutation()
  @Permissions()
  public async deleteComment(@Args('_id') _id: string, @Args('post_ids') postIds: number) {
    await this.commentsServer.deleteComment(_id);
    const ids = Array.of(postIds);
    await this.commentsServer.updateArticleCommentCount(ids);
    return { message: 'success' };
  }
}
