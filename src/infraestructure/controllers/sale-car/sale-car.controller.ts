import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SaleCarService } from 'src/application/sale-car/services/sale-car.service';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { CreateSaleCarDto } from './dto/create-sale-car.dto';
import { UpdateSaleCarDto } from './dto/update-sale.car.dto';
import { StatusCar } from 'src/domain/car/enums/StatusCar';

@Controller('saleCar')
export class SaleCarController {
  constructor(private readonly saleCarService: SaleCarService) {}

  @Post()
  create(
    @Body() dto: CreateSaleCarDto,
    @ActiveUser() userSesionActive: UserActiveI,
  ): Promise<SaleCar> {
    return this.saleCarService.create(dto, userSesionActive);
  }

  @Get()
  findAll(@Query('status') status?: StatusCar): Promise<SaleCar[]> {
    return this.saleCarService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SaleCar> {
    return this.saleCarService.findSaleCar(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSaleCarDto,
    @ActiveUser() userSesionActive: UserActiveI,
  ): Promise<SaleCar> {
    return this.saleCarService.update(id, dto, userSesionActive);
  }
}
