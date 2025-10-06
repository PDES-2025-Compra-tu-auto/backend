import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from 'src/infraestructure/admin/controllers/admin.controller';
import { AdminService } from 'src/application/auth/services/admin.service';

import { User } from 'src/domain/user/entities/User';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';
import { Review } from 'src/domain/review/entities/Review';
import { Purchase } from 'src/domain/purchase/entities/Purchase';

@Module({
  imports: [TypeOrmModule.forFeature([User, FavoriteCar, Review, Purchase])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
