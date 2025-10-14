import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/application/user/services/user.service';
import { ModelCarService } from 'src/application/model-car/services/model-car.service';

import { plainToInstance } from 'class-transformer';
import { Review } from 'src/domain/review/entities/Review';
import { CreateReviewDto } from 'src/infraestructure/review/dto/create-review.dto';
import { ReviewResponseDto } from 'src/infraestructure/review/dto/review-response.dto';
import { UpdateReviewDto } from 'src/infraestructure/review/dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly userService: UserService,
    private readonly modelCarService: ModelCarService,
  ) {}

  async createReview(buyerId: string, dto: CreateReviewDto) {
    const buyer = await this.userService.findEntityById(buyerId);
    const modelCar = await this.modelCarService.findById(dto.modelCarId);

    const existingReview = await this.reviewRepository.findOne({
      where: {
        buyer: { id: buyerId },
        modelCar: { id: dto.modelCarId },
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Ya has realizado una reseña para este modelo de auto',
      );
    }

    const review = this.reviewRepository.create({
      buyer,
      modelCar,
      score: dto.score,
      comment: dto.comment,
    });

    const saved = await this.reviewRepository.save(review);

    return plainToInstance(ReviewResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async getReviewsByModel(modelCarId: string) {
    const modelCar = await this.modelCarService.findById(modelCarId);

    const reviews = await this.reviewRepository.find({
      where: { modelCar },
      relations: ['modelCar','buyer'],
      order: { createdAt: 'DESC' },
    });

    return plainToInstance(ReviewResponseDto, reviews, {
      excludeExtraneousValues: true,
    });
  }

  async findReviewById(reviewId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['buyer', 'modelCar'],
    });

    if (!review) throw new NotFoundException('Reseña no encontrada');

    return review;
  }

  async updateReview(reviewId: string, buyerId: string, dto: UpdateReviewDto) {
    const review = await this.findReviewById(reviewId);

    if (review.buyer.id !== buyerId) {
      throw new ForbiddenException('No podés editar reseñas de otro usuario');
    }

    if (dto.score !== undefined) review.score = dto.score;
    if (dto.comment !== undefined) review.comment = dto.comment;

    const updated = await this.reviewRepository.save(review);
    return plainToInstance(ReviewResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  async getAllReviews() {
    const reviews = await this.reviewRepository.find({
      relations: ['buyer', 'modelCar'],
      order: { createdAt: 'DESC' },
    });
    return plainToInstance(ReviewResponseDto, reviews, {
      excludeExtraneousValues: true,
    });
  }

  async deleteReview(reviewId: string, buyerId: string) {
    const review = await this.findReviewById(reviewId);

    if (review.buyer.id !== buyerId) {
      throw new ForbiddenException('No podés eliminar reseñas de otro usuario');
    }

    await this.reviewRepository.remove(review);
    return { message: 'Reseña eliminada correctamente' };
  }
}
