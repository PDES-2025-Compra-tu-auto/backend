import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from 'src/domain/user/entities/Buyer';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
})
export class BuyerModule {}
