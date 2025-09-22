import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { ModelCarModule } from '../modelCar/model-car.module';
import { ConcessionaryAgencyModule } from '../concessionaryAgency/concessionary-agency.module';
import { UserRepositoryModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleCar]),
    ModelCarModule,
    ConcessionaryAgencyModule,
    UserRepositoryModule,
  ],
})
export class SaleCarModule {}
