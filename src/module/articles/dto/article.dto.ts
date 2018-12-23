import { Transform, Type } from 'class-transformer';
import { ArticleState, Publish, ArticleType } from '../interface/articles.interface';

export class ArticleTransformDto {
  @Transform(v => ArticleState[v])
  public state: number;

  @Transform(v => Publish[v])
  public publish: number;

  @Transform(v => ArticleType[v])
  public type: number;
}

export class ArticleInfoDto extends ArticleTransformDto {
  public _id: string;
  public keyword: string;
  public title: string;
  public content: string;
  public thumb: string;
  public name: string;
  public tag: string;
  public meta: ArticleMetaDto;
}

export class ArticleMetaDto {
  public views: number;
  public likes: number;
  public comments: number;
}

export class QueryArticleDto extends ArticleTransformDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
  public date: string;
  public tag?: string;
  public hot?: string;
}
