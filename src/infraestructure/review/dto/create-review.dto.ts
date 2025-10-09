import { IsNotEmpty, IsInt, Min, Max, IsUUID, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  modelCarId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  score: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
