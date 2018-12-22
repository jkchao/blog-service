import { Injectable } from '@nestjs/common';
import { Document } from 'mongoose';
import { ArticleMongo } from '../articles/interface/articles.interface';
import { CommentMongo } from '../comments/interface/comments.interface';
import { LikeInfo } from './interface/like.interface';
import { ArticlesSercice } from '../articles/articles.service';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class LikeService {
  constructor(private readonly articlesService: ArticlesSercice, private readonly commentsService: CommentsService) {}

  public async createLike(info: LikeInfo) {
    let result: ArticleMongo | CommentMongo | null;
    if (info.type === 0) {
      result = await this.articlesService.findOneArticle({ _id: info._id });
      if (result) {
        result.meta.likes += 1;
      }
    } else {
      result = await this.commentsService.findComment({ _id: info._id });
      if (result) result.likes += 1;
    }

    return result && (result as Document).save();
  }
}
