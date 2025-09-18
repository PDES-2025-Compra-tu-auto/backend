import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { ModelCarModule } from '../modelCar/model-car.module';
import { ConcessionaryAgencyModule } from '../concessionaryAgency/concessionary-agency.module';
import { UserRepositoryFactory } from 'src/infraestructure/factories/user-repository.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleCar]),
    ModelCarModule,
    ConcessionaryAgencyModule,
    UserRepositoryFactory,
  ],
})
export class SaleCarModule {}
