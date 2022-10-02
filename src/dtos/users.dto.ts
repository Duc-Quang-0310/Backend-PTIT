import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class SignUpUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsOptional()
  public username?: string;
}
