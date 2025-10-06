// review-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { ModelCarDto } from 'src/infraestructure/model-car/dto/model-car-response.dto';

export class ReviewResponseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  score: number;

  @Expose()
  comment: string;

  @Expose()
  @Type(() => ModelCarDto)
  modelCar: ModelCarDto;
}
