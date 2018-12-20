import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { ArticleMongo } from './interface/articles.interface';

@Injectable()
export class ArticlesSercice {
  constructor(@InjectModel('Articles') private readonly articlesModel: PaginateModel<ArticleMongo>) {}

  public deleteArticle(_id: string) {
    return this.articlesModel.findByIdAndRemove(_id);
  }
}
