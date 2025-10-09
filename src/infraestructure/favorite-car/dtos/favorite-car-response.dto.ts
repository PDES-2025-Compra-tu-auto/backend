import { Expose, Type } from 'class-transformer';
import { SaleCarResponseDto } from 'src/infraestructure/sale-car/dto/sale-car-response.dto';
import { UserResponseDto } from 'src/infraestructure/user/dto/user-response.dto';

export class FavoriteCarResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserResponseDto)
  buyer: UserResponseDto;

  @Expose()
  dateAdded: Date;

  @Expose()
  @Type(() => SaleCarResponseDto)
  saleCar: SaleCarResponseDto;
}
