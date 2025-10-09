import { IsUUID } from 'class-validator';

export class AddFavoriteCarDto {
  @IsUUID()
  saleCarId: string;
}
