import { Type, Transform } from 'class-transformer';
import { StateEnum } from '../enum/state';

export class Item {
  @Transform((v: keyof typeof StateEnum) => StateEnum[v])
  public state: string;
}

export class ListSerializate {
  public limit: number;
  public total: number;
  public offset: number;

  @Type(() => Item)
  public docs: Item[];
}
