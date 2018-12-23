import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Permissions } from '@/common/decorator/Permissions.decorator';
import { CommentsService } from './comments.service';
import { CommentInfoDto, QueryCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { ArticlesSercice } from '../articles/articles.service';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsServer: CommentsService, private readonly articlesService: ArticlesSercice) {}

  @Query()
  public getComments(@Args() args: QueryCommentDto, @Context('request') request: Request) {
    const token = request.headers.authorization;
    if (!token) {
      args.state = 1;
    }
    return this.commentsServer.searchComments(args);
  }

  @Mutation()
  public async createComment(@Args('commentInfo') info: CommentInfoDto, @Context('request') request: Request) {
    const ip = ((request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.ip ||
      request.ips[0]) as string).replace('::ffff:', '');

    info.ip = ip;
    info.agent = request.headers['user-agent'] || info.agent;

    const result = await this.commentsServer.createComment({ ...info, ip });

    const article = await this.articlesService.findOneArticle({ id: info.post_id });

    if (article) {
      this.commentsServer.sendEmail(info, article._id);
    }

    this.commentsServer.updateArticleCommentCount([info.post_id]);

    return result;
  }

  @Mutation()
  @Permissions()
  public updateComment(@Args('commentInfo') info: UpdateCommentDto) {
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
