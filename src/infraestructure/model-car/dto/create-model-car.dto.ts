import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModelCarDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  description: string;
}
