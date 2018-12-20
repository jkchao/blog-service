import { Document } from 'mongoose';
import { ArticleInfoDto } from '../dto/article.dto';

export interface ArticleMongo extends ArticleInfoDto, Document {
  _id: string;
}
