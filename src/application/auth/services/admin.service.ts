import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entities/User';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';
import { Review } from 'src/domain/review/entities/Review';
import { Purchase } from 'src/domain/purchase/entities/Purchase';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/infraestructure/user/dto/user-response.dto';
import { FavoriteCarResponseDto } from 'src/infraestructure/favorite-car/dtos/favorite-car-response.dto';
import { ReviewResponseDto } from 'src/infraestructure/review/dto/review-response.dto';
import { PurchaseResponseDto } from 'src/infraestructure/purchase/dto/purchase-response.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(FavoriteCar)
    private readonly favoriteCarRepository: Repository<FavoriteCar>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  async getUsers(role?: UserRole) {
    const where = role ? { role } : {};
    const users = await this.userRepository.find({ where });

    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async getAllFavorites() {
    const favorites = await this.favoriteCarRepository.find({
      relations: ['saleCar', 'buyer', 'saleCar.modelCar'],
    });

    return plainToInstance(FavoriteCarResponseDto, favorites, {
      excludeExtraneousValues: true,
    });
  }

  async getAllReviews() {
    const reviews = await this.reviewRepository.find({
      relations: ['buyer', 'modelCar'],
    });

    return plainToInstance(ReviewResponseDto, reviews, {
      excludeExtraneousValues: true,
    });
  }

  async getAllPurchases() {
    const purchases = await this.purchaseRepository.find({
      relations: ['buyer', 'saleCar', 'saleCar.concesionary', 'soldBy'],
    });

    return plainToInstance(PurchaseResponseDto, purchases, {
      excludeExtraneousValues: true,
    });
  }

  async getTopSoldCars() {
    const topModels = await this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoin('purchase.saleCar', 'saleCar')
      .leftJoin('saleCar.modelCar', 'modelCar')
      .select([
        'modelCar.id AS id',
        'modelCar.brand AS brand',
        'modelCar.model AS model',
        'modelCar.imageUrl AS imageUrl',
        'COUNT(purchase.id) AS "totalSales"',
      ])
      .groupBy('modelCar.id')
      .orderBy('"totalSales"', 'DESC')
      .limit(5)
      .getRawMany();

    return topModels.map((item) => ({
      id: item.id,
      brand: item.brand,
      model: item.model,
      imageUrl: item.imageUrl,
      totalSales: Number(item.totalSales),
    }));
  }
}
