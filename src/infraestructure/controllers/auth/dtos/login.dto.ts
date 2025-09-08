import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/domain/user/enums/UserRole';

export class LoginDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  password: string;

  @IsEnum(UserRole, {
    message: 'role must be one of BUYER, DEALER, ADMINISTRATOR',
  })
  role: UserRole;
}
