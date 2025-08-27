import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleCar } from 'src/domain/car/entities/SaleCar';

@Module({
  imports: [TypeOrmModule.forFeature([SaleCar])],
})
export class SaleCarModule {}
