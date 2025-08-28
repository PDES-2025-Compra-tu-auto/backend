import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateConcessionaryAgencyDto {
  @IsString()
  @MinLength(1)
  @Transform(({ value }) => value.trim())
  concessionaryName: string;

  @IsEmail()
  email: string;
}
