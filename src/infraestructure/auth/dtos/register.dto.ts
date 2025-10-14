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
    message: 'role must be one of BUYER, CONCESIONARY, ADMINISTRATOR',
  })
  role: UserRole;

  @ValidateIf((o) => o.role === UserRole.CONCESIONARY)
  @IsString({ message: 'concesionaryName must be a string' })
  @IsNotEmpty({ message: 'concesionaryName is required when role is CONCESIONARY' })
  @Transform(({ obj, value }) =>
    obj.role === UserRole.CONCESIONARY ? value : undefined,
  )
  concesionaryName?:string

  
  @ValidateIf((o) => o.role === UserRole.CONCESIONARY)
  @IsString({ message: 'concesionaryCuit must be a string' })
  @IsNotEmpty({ message: 'concesionaryCuit is required when role is CONCECIONARY' })
  @Transform(({ obj, value }) =>
    obj.role === UserRole.CONCESIONARY ? value : undefined,
  )
  concesionaryCuit?: string
}
