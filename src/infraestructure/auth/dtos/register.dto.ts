import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from 'src/domain/user/enums/UserRole';

export class RegisterDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullname: string;

  @IsEnum(UserRole, {
    message: 'role must be one of BUYER, DEALER, ADMINISTRATOR',
  })
  role: UserRole;

  @ValidateIf((o) => o.role === UserRole.DEALER)
  @IsString({ message: 'agencyId must be a string' })
  @IsNotEmpty({ message: 'agencyId is required when role is DEALER' })
  @Transform(({ obj, value }) =>
    obj.role === UserRole.DEALER ? value : undefined,
  )
  agencyId?: string;
}
