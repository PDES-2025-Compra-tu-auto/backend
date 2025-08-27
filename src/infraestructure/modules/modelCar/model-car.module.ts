import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelCar } from 'src/domain/car/entities/ModelCar';

@Module({
  imports: [TypeOrmModule.forFeature([ModelCar])],
})
export class ModelCarModule {}
