import { IsUUID, IsNumber, IsString, Min } from 'class-validator';

export class CreatePurchaseDto {
  @IsUUID()
  buyerId: string;

  @IsUUID()
  saleCarId: string;

  @IsUUID()
  concessionaryId: string;

  @IsNumber()
  @Min(0)
  purchasedPrice: number;

  @IsString()
  patent: string;
}
