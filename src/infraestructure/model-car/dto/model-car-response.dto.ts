import { Expose } from 'class-transformer';

export class ModelCarDto {
  @Expose()
  id: string;

  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  description: string;

  @Expose()
  imageUrl?:string
}
