import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateSaleCarDto {
  @IsUUID()
  @IsNotEmpty()
  modelCarId: string;

  @IsNumber()
  price: number;
}
