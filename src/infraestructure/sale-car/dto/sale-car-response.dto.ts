import { Expose, Type } from 'class-transformer';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { ModelCarDto } from 'src/infraestructure/model-car/dto/model-car-response.dto';

export class ConcesionaryDto {
  @Expose()
  id: string;

  @Expose()
  concessionaryName: string;

  @Expose()
  email: string;
}

export class SaleCarResponseDto {
  @Expose()
  id: string;

  @Expose()
  price: number;

  @Expose()
  status: StatusCar;

  @Expose()
  @Type(() => ModelCarDto)
  modelCar: ModelCarDto;

  @Expose()
  @Type(() => ConcesionaryDto)
  concesionary: ConcesionaryDto;

  @Expose()
  favoritedByUser?: boolean;
}
