import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelCarService } from 'src/application/model-car/services/model-car.service';
import { ModelCar } from 'src/domain/car/entities/ModelCar';
import { ModelCarController } from './controllers/model-car.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModelCar])],
  providers: [ModelCarService],
  exports: [ModelCarService],
  controllers: [ModelCarController],
})
export class ModelCarModule {}
