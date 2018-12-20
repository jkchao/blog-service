export class QueryLinksDto {
  public offset: number;
  public limit: number;
  public keyword: string;
}

export class LinksInfoDto {
  public _id: string;
  public name: string;
  public url: string;
}
