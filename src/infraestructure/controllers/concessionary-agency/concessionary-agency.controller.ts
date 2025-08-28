import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConcessionaryAgencyService } from 'src/application/concessionary-agency/services/concessionary-agency.service';
import { CreateConcessionaryAgencyDto } from './dto/create-concessionary-agency.dto';

@ApiTags('ConcessionaryAgency')
@Controller('concessionaryAgency')
export class ConcessionaryAgencyController {
  constructor(
    private readonly concessionaryAgencyService: ConcessionaryAgencyService,
  ) {}

  @Post()
  createConcessionaryAgency(
    @Body() createConcessionaryAgencyDto: CreateConcessionaryAgencyDto,
  ) {
    return this.concessionaryAgencyService.create(createConcessionaryAgencyDto);
  }
}
