import { Transform } from 'class-transformer';

export enum LikeType {
  Article = 1,
  Comment
}

export class LikeDto {
  public _id: string;

  @Transform(v => LikeType[v])
  public type: number;
}
