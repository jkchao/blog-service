import { Transform } from 'class-transformer';
import { StateEnum } from '../enum/state';

export class StateDto {
  @Transform(v => StateEnum[v])
  public state: number;
}
