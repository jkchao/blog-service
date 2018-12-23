import { StateDto } from '@/common/dto/state.dto';

export class QueryHerosDto extends StateDto {
  public offset?: number;
  public limit?: number;
  public keyword?: string;
}

export class HerosInfoDto extends StateDto {
  public name?: string;
  public content?: string;
  public ip?: string;
  public city?: string;
  public range?: number[];
  public country?: string;
  public agent?: string;
}

export class UpdateInfoDto extends HerosInfoDto {
  public _id: number;
}
