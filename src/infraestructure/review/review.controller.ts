import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { ReviewService } from 'src/application/review/services/review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import type { UserActiveI } from '../interfaces/user-active.interface';
import { UuidParam } from '../decorators/uuui-param.decorator';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.BUYER)
  @Post()
  createReview(@ActiveUser() user: UserActiveI, @Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(user.sub, dto);
  }

  @Get('model/:modelCarId')
  getReviewsByModel(@UuidParam('modelCarId') modelCarId: string) {
    return this.reviewService.getReviewsByModel(modelCarId);
  }

  @Get()
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.BUYER)
  @Patch(':reviewId')
  updateReview(
    @ActiveUser() user: UserActiveI,
    @UuidParam('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewService.updateReview(reviewId, user.sub, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.BUYER)
  @Delete(':reviewId')
  deleteReview(
    @ActiveUser() user: UserActiveI,
    @UuidParam('reviewId') reviewId: string,
  ) {
    return this.reviewService.deleteReview(reviewId, user.sub);
  }
}
