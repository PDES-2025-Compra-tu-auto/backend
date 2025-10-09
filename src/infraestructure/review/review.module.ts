import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/domain/review/entities/Review';
import { UserModule } from '../user/user.module';
import { ModelCarModule } from '../model-car/model-car.module';
import { ReviewService } from 'src/application/review/services/review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UserModule, ModelCarModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
