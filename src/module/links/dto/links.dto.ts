export class QueryLinksDto {
  public offset: number;
  public limit: number;
  public keyword: string;
  public state: number;
}

export class InfoDto {
  public _id: string;
  public name: string;
  public state: 0 | 1 | 2;
  public url: string;
}
