import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from 'src/domain/purchase/entities/Purchase';
import { PurchaseController } from './controllers/purchase.controller';
import { PurchaseService } from 'src/application/purchase/services/purchase.service';
import { UserModule } from '../user/user.module';
import { SaleCarModule } from '../sale-car/sale-car.module';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase]), UserModule, SaleCarModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
