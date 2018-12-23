import { Document } from 'mongoose';
import { ArticleInfoDto } from '../dto/article.dto';

export interface ArticleMongo extends ArticleInfoDto, Document {
  _doc: ArticleMongo;
  _id: string;
}

export enum Publish {
  PUBLIC = 1,
  PRIVATE
}

export enum ArticleType {
  CODE = 1,
  THINK,
  FOLK
}

export enum ArticleState {
  RELEASE = 1,
  DRAFT
}
