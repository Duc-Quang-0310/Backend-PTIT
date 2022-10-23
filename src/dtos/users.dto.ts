import { UserRole, UserStatus } from '@/interfaces/users.interface';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class SignUpUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsOptional()
  public firstName?: string;

  @IsOptional()
  public lastName?: string;

  @IsOptional()
  @IsIn([UserRole.SPECIALIST, UserRole.USER, UserRole.ADMIN])
  public role?: UserRole;

  @IsOptional()
  @IsIn([UserStatus.ACTIVE, UserStatus.BAN, UserStatus.IN_ACTIVE])
  public status?: UserStatus;
}

export class CheckEmailExistDto {
  @IsEmail()
  public email: string;
}
export class CreateUserDto {}

export class ChangeAccountPasswordDto {
  @IsNotEmpty()
  public oldPassword: string;

  @IsNotEmpty()
  public newPassword: string;

  @IsNotEmpty()
  public userId: string;
}
