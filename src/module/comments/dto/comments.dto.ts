import { Document } from 'mongoose';

export class CommentInfoDto {
  // tslint:disable-next-line:variable-name
  public post_id: number;
  public pid: number;
  public content: string;
  public author: Author;
  public ip?: string;
  public agent?: string;
  public city?: string;
  public range?: number[];
  public country?: string;
  public likes?: number;
}

export class Author {
  public name: string;
  public email: string;
  public site: string;
}

export class QueryCommentDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
  public state?: number;
  // tslint:disable-next-line:variable-name
  public post_id: number;
  public sort?: number;
}

export class UpdateCommentDto {
  public _id: string;
  public name?: string;
  public content?: string;
  public state?: number;
}
