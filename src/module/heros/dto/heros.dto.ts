export class QueryLinksDto {
  public offset: number;
  public limit: number;
  public keyword: string;
  public state: number;
}

export class InfoDto {
  public name?: string;
  public content?: string;
  public state?: string;
  public ip?: string;
  public city?: string;
  public range?: string;
  public country?: string;
  public agent?: string;
}
