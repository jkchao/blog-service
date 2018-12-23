import { Document } from 'mongoose';
import { HerosInfoDto } from '../dto/heros.dto';

export interface HerosHasId extends HerosInfoDto, Document {
  _doc: any;
  _id: string;
}
