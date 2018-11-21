import { Document } from 'mongoose';

export interface Links {
  name: string;
  url: string;
}

export interface LinksHasId extends Links, Document {
  id: string;
}

export interface LinksQuery {
  offset?: string;
  limit?: string;
  keyword?: string;
}
