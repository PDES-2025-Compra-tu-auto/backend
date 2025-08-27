import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from 'src/domain/purchase/entities/Purchase';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase])],
})
export class PurchaseModule {}
