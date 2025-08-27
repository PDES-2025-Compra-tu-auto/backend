import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concessionary } from 'src/domain/user/entities/Concessionary';

@Module({
  imports: [TypeOrmModule.forFeature([Concessionary])],
})
export class ConcessionaryModule {}
