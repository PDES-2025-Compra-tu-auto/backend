import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SaleCarService } from 'src/application/sale-car/services/sale-car.service';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { CreateSaleCarDto } from '../dto/create-sale-car.dto';
import { UpdateSaleCarDto } from '../dto/update-sale.car.dto';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { SaleCarResponseDto } from '../dto/sale-car-response.dto';
import { UuidParam } from 'src/infraestructure/decorators/uuui-param.decorator';

@ApiTags('SaleCar')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sale-car')
export class SaleCarController {
  constructor(private readonly saleCarService: SaleCarService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.CONCESIONARY)
  @Post()
  create(
    @Body() dto: CreateSaleCarDto,
    @ActiveUser() userSesionActive: UserActiveI,
  ): Promise<SaleCarResponseDto> {
    return this.saleCarService.create(dto, userSesionActive);
  }

  @ApiQuery({
    name: 'status',
    enum: StatusCar,
    required: false,
    description: 'Filtrar por status',
  })
  @Get()
  findAll(
    @ActiveUser() userSesionActive: UserActiveI,
    @Query('status') status?: StatusCar,
  ): Promise<SaleCarResponseDto[]> {
    const buyerId = userSesionActive.sub;
    return this.saleCarService.findAll(buyerId, status);
  }

  @Get(':id')
  findOne(
    @UuidParam('id') id: string,
    @ActiveUser() userSesionActive: UserActiveI,
  ): Promise<SaleCarResponseDto> {
    const buyerId = userSesionActive.sub;

    return this.saleCarService.findSaleCar(
      id,
      ['modelCar', 'concesionary'],
      buyerId,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.CONCESIONARY)
  @Patch(':id')
  update(
    @UuidParam('id') id: string,
    @Body() dto: UpdateSaleCarDto,
    @ActiveUser() user: UserActiveI,
  ): Promise<SaleCarResponseDto> {
    const concesionaryId = user.sub;
    return this.saleCarService.update(id, dto, concesionaryId);
  }
}
