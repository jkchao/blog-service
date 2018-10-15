import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
