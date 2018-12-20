import { Document } from 'mongoose';
import { TagInfoDto } from '../dto/tag.dto';

export interface TagMongo extends TagInfoDto, Document {
  _id: string;
}
