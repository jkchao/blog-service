import { Document } from 'mongoose';

export interface Links {
  name: string;
  url: string;
}

export interface LinksMongo extends Links, Document {
  _id: string;
}

export interface LinksQuery {
  offset?: string;
  limit?: string;
  keyword?: string;
}
