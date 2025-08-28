import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcessionaryAgencyService } from 'src/application/concessionary-agency/services/concessionary-agency.service';
import { ConcessionaryAgency } from 'src/domain/concessionaryAgency/entities/ConcessionaryAgency';
import { ConcessionaryAgencyController } from 'src/infraestructure/controllers/concessionary-agency/concessionary-agency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConcessionaryAgency])],
  providers: [ConcessionaryAgencyService],
  controllers: [ConcessionaryAgencyController],
})
export class ConcessionaryAgencyModule {}
