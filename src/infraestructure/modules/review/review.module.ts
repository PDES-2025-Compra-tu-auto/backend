import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/domain/review/entities/Review';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewModule {}
