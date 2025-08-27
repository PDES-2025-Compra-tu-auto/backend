import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/domain/user/entities/Admin';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
})
export class AdminModule {}
