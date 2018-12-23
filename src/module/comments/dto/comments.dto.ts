import { Document } from 'mongoose';
import { Transform } from 'class-transformer';
import { StateDto } from '@/common/dto/state.dto';

export class CommentInfoDto extends StateDto {
  // tslint:disable-next-line:variable-name
  public post_id: number;
  public pid: number;
  public content: string;
  public author: Author;
  public ip: string;
  public agent: string;
  public city: string;
  public range: number[];
  public country: string;
  public likes: number;
}

export class Author {
  public name: string;
  public email: string;
  public site: string;
}

export class QueryCommentDto extends StateDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
  // tslint:disable-next-line:variable-name
  public post_id: number;
  public sort?: number;
}

export class UpdateCommentDto extends StateDto {
  public _id: string;
  public name?: string;
  public content?: string;
}
