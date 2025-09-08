import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dealer } from 'src/domain/user/entities/Dealer';

@Module({
  imports: [TypeOrmModule.forFeature([Dealer])],
  exports: [TypeOrmModule],
})
export class DealerModule {}
