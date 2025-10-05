import { Expose, Type } from 'class-transformer';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { ModelCarDto } from 'src/infraestructure/model-car/dto/model-car.dto';

export class ConcesionaryDto {
  id: string;

  @Expose()
  concessionaryName: string;
}

export class SaleCarResponseDto {
  @Expose()
  id: string;

  price: number;
  status: StatusCar;

  @Expose()
  @Type(() => ModelCarDto)
  modelCar: ModelCarDto;

  @Type(() => ConcesionaryDto)
  concesionary: ConcesionaryDto;
}
