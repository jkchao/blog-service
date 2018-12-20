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

export class AuthInfoDto {
  public _id?: string;
  public name?: string;
  public username?: string;
  public slogan?: string;
  public gravatar?: string;
  public password?: string;
  public oldPassword?: string;
}

export class InfoRequredDto extends AuthInfoDto {
  public oldPassword: string;
}
