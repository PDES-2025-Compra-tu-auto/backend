import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelCarService } from 'src/application/model-car/services/model-car.service';
import { ModelCar } from 'src/domain/car/entities/ModelCar';

@Module({
  imports: [TypeOrmModule.forFeature([ModelCar])],
  providers: [ModelCarService],
  exports: [ModelCarService],
})
export class ModelCarModule {}
