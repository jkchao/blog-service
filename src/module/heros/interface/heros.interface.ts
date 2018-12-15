import { Document } from 'mongoose';

export interface Heros {
  name?: string;
  content?: string;
  state?: string;
  ip?: string;
  city?: string;
  range?: string;
  country?: string;
  agent?: string;
  create_time?: Date;
}

export interface HerosHasId extends Heros, Document {
  _id: string;
}

export interface HerosQuery {
  offset?: string;
  limit?: string;
  keyword?: string;
}
