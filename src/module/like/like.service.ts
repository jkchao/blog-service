import { Injectable } from '@nestjs/common';
import { Document } from 'mongoose';
import { ArticleMongo } from '../articles/interface/articles.interface';
import { CommentMongo } from '../comments/interface/comments.interface';
import { ArticlesSercice } from '../articles/articles.service';
import { CommentsService } from '../comments/comments.service';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class LikeService {
  constructor(private readonly articlesService: ArticlesSercice, private readonly commentsService: CommentsService) {}

  public async createLike(info: LikeDto) {
    let result: ArticleMongo | CommentMongo | null;
    if (info.type === 1) {
      result = (await this.articlesService.findOneArticle({ _id: info._id })) as ArticleMongo | null;
      if (result) {
        result.meta.likes += 1;
      }
    } else {
      result = (await this.commentsService.findComment({ _id: info._id })) as CommentMongo | null;
      if (result) {
        result.likes += 1;
      }
    }

    return result && (result as Document).save();
  }
}
