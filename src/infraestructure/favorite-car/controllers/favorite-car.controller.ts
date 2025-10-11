import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoriteCarService } from 'src/domain/favoriteCar/services/favorite-car.service';
import { AddFavoriteCarDto } from '../dtos/add-favorite-car.dto';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { UuidParam } from 'src/infraestructure/decorators/uuui-param.decorator';

@ApiTags('FavoriteCar')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.BUYER)
@Controller('favorite-car')
export class FavoriteCarController {
  constructor(private readonly favoriteCarService: FavoriteCarService) {}

  @Post()
  async addFavoriteCar(
    @ActiveUser() user: UserActiveI,
    @Body() dto: AddFavoriteCarDto,
  ) {
    return this.favoriteCarService.addFavoriteCar(user.sub, dto);
  }

  @Get('me')
  async getMyFavorites(@ActiveUser() user: UserActiveI) {
    return this.favoriteCarService.getFavoritesByBuyer(user.sub);
  }

  @Delete(':id')
  async removeFavoriteCar(
    @ActiveUser() user: UserActiveI,
    @UuidParam('id') id: string,
  ) {
    return await this.favoriteCarService.removeFavoriteCar(id, user.sub);
  }
}
