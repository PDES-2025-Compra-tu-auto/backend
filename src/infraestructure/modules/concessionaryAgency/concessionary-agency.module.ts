import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcessionaryAgency } from 'src/domain/concessionaryAgency/entities/ConcessionaryAgency';

@Module({
  imports: [TypeOrmModule.forFeature([ConcessionaryAgency])],
})
export class ConcessionaryAgencyModule {}
