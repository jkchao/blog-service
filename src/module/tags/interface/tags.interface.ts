import { Document } from 'mongoose';
import { TagInfoDto } from '../dto/tag.dto';

export interface TagMo extends TagInfoDto, Document {
  _id: string;
}
