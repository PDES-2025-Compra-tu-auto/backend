import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  score?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
