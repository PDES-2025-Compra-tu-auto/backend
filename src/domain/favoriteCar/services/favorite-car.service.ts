import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteCar } from '../entities/FavoriteCar';
import { AddFavoriteCarDto } from 'src/infraestructure/favorite-car/dtos/add-favorite-car.dto';
import { UserService } from 'src/application/user/services/user.service';
import { SaleCarService } from 'src/application/sale-car/services/sale-car.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FavoriteCarResponseDto } from 'src/infraestructure/favorite-car/dtos/favorite-car-response.dto';

export class FavoriteCarService {
  constructor(
    @InjectRepository(FavoriteCar)
    private readonly favoriteCarRepository: Repository<FavoriteCar>,
    private readonly userService: UserService,
    private readonly saleCarService: SaleCarService,
  ) {}

  async addFavoriteCar(buyerId: string, dto: AddFavoriteCarDto) {
    const { saleCarId } = dto;
    const buyer = await this.userService.findEntityById(buyerId);
    const saleCar = await this.saleCarService.findSaleCar(saleCarId);

    const existing = await this.favoriteCarRepository.findOne({
      where: { buyer: { id: buyerId }, saleCar: { id: saleCarId } },
    });
    if (existing) {
      throw new BadRequestException('El auto ya está en favoritos');
    }

    const newFavorite = await this.favoriteCarRepository.save({
      saleCar,
      buyer,
    });

    return plainToInstance(FavoriteCarResponseDto, newFavorite, {
      excludeExtraneousValues: true,
    });
  }

  async getFavoritesByBuyer(buyerId: string) {
    const favorites = await this.favoriteCarRepository.find({
      where: { buyer: { id: buyerId } },
      relations: ['saleCar', 'saleCar.modelCar'],
      order: { dateAdded: 'DESC' },
    });

    return plainToInstance(FavoriteCarResponseDto, favorites, {
      excludeExtraneousValues: true,
    });
  }

  async findFavoriteById(favoriteId: string): Promise<FavoriteCar> {
    const favorite = await this.favoriteCarRepository.findOne({
      where: { id: favoriteId },
      relations: ['saleCar', 'buyer'],
    });

    if (!favorite) {
      throw new NotFoundException('El auto en favoritos no existe');
    }

    return favorite;
  }

  async removeFavoriteCar(favoriteId: string, buyerId: string) {
    const favorite = await this.findFavoriteById(favoriteId);

    if (favorite.buyer.id !== buyerId) {
      throw new ForbiddenException(
        'No podés eliminar favoritos de otro usuario',
      );
    }

    await this.favoriteCarRepository.remove(favorite);
    return { message: 'Auto eliminado de favoritos correctamente' };
  }
}
