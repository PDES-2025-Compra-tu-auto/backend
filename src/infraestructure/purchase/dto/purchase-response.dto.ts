import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/infraestructure/user/dto/user-response.dto';
import { SaleCarResponseDto } from 'src/infraestructure/sale-car/dto/sale-car-response.dto';

export class PurchaseResponseDto {
  @Expose()
  id: string;

  @Expose()
  purchasedPrice: number;

  @Expose()
  patent: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  buyer: UserResponseDto;

  @Expose()
  @Type(() => SaleCarResponseDto)
  saleCar: SaleCarResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  soldBy: UserResponseDto;
}
