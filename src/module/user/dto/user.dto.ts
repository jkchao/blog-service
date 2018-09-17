import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  public readonly userName: string;

  @IsString()
  public readonly userEmail: string;
}
