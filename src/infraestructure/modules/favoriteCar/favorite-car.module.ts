import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteCar])],
})
export class FavoriteCarModule {}
