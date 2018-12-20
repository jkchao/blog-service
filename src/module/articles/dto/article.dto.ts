export class ArticleInfoDto {
  public keyword: string;
  public title: string;
  public content: string;
  public state: number;
  public publish: number;
  public thumb: string;
  public type: number;
  public name: string;
  public tag: string;
  public meta: ArticleMetaDto;
}

export class ArticleMetaDto {
  public view: number;
  public like: number;
  public comments: number;
}

export class QueryArticleDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
  public state?: number;
  public publish?: number;
  public tag?: string;
  public type?: number;
  public hot?: string;
}
