import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleCar } from 'src/domain/car/entities/SaleCar';

import { SaleCarController } from 'src/infraestructure/sale-car/controllers/sale-car.controller';
import { SaleCarService } from 'src/application/sale-car/services/sale-car.service';
import { ModelCarModule } from '../model-car/model-car.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleCar]),
    ModelCarModule,
    UserModule,
  ],
  controllers: [SaleCarController],
  providers: [SaleCarService],
  exports: [SaleCarService],
})
export class SaleCarModule {}
