import { IsIn, ValidateIf } from 'class-validator';

export class QueryLinksDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
  public state?: number;
}

export class InfoDto {
  public name?: string;
  public content?: string;
  public state?: number;
  public ip?: string;
  public city?: string;
  public range?: number[];
  public country?: string;
  public agent?: string;
}

export class UpdateInfoDto extends InfoDto {
  public _id: number;
}
