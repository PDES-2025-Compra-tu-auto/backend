import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { StatusCar } from 'src/domain/car/enums/StatusCar';

export class UpdateSaleCarDto {
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsEnum(StatusCar)
  @IsOptional()
  status?: StatusCar;
}
