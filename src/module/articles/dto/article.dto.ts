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
  public views: number;
  public likes: number;
  public comments: number;
}

export class QueryArticleDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
  public state?: number;
  public publish?: number;
  public date: string;
  public tag?: string;
  public type?: number;
  public hot?: string;
}
