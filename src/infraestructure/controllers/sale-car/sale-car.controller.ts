import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SaleCarService } from 'src/application/sale-car/services/sale-car.service';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { CreateSaleCarDto } from './dto/create-sale-car.dto';
import { UpdateSaleCarDto } from './dto/update-sale.car.dto';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { UserRole } from 'src/domain/user/enums/UserRole';

@ApiTags('SaleCar')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('saleCar')
export class SaleCarController {
  constructor(private readonly saleCarService: SaleCarService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.DEALER, UserRole.ADMINISTRATOR)
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

  @UseGuards(RolesGuard)
  @Roles(UserRole.DEALER, UserRole.ADMINISTRATOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSaleCarDto,
    @ActiveUser() userSesionActive: UserActiveI,
  ): Promise<SaleCar> {
    return this.saleCarService.update(id, dto, userSesionActive);
  }
}
