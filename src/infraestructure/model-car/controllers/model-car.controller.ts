import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { ModelCarService } from 'src/application/model-car/services/model-car.service';
import { CreateModelCarDto } from '../dto/create-model-car.dto';

@ApiTags('ModelCar')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMINISTRATOR, UserRole.CONCESIONARY)
@Controller('model-cars')
export class ModelCarController {
  constructor(private readonly modelCarService: ModelCarService) {}

  @Post()
  createModelCar(@Body() dto: CreateModelCarDto) {
    return this.modelCarService.createModelCar(dto);
  }

  @Get()
  getAllModels() {
    return this.modelCarService.findAll();
  }

  @Get(':id')
  getModel(@Param('id') id: string) {
    return this.modelCarService.findById(id);
  }
}
