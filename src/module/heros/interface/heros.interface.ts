import { Document } from 'mongoose';
import { InfoDto } from '../dto/heros.dto';

export interface HerosHasId extends InfoDto, Document {
  _id: string;
}
