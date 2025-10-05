import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';
import { FavoriteCarService } from 'src/domain/favoriteCar/services/favorite-car.service';
import { FavoriteCarController } from './controllers/favorite-car.controller';
import { UserModule } from '../user/user.module';
import { SaleCarModule } from '../sale-car/sale-car.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteCar]), UserModule, SaleCarModule],
  providers: [FavoriteCarService],
  controllers: [FavoriteCarController],
})
export class FavoriteCarModule {}
