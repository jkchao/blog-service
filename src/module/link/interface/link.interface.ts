import { Document } from 'mongoose';

export interface Link {
  name: string;
  url: string;
}

export interface LinkHasId extends Link, Document {
  id: string;
}

export interface LinkQuery {
  current_page?: string;
  page_size?: string;
  keyword?: string;
}
