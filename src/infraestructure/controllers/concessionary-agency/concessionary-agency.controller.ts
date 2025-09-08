import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConcessionaryAgencyService } from 'src/application/concessionary-agency/services/concessionary-agency.service';
import { CreateConcessionaryAgencyDto } from './dto/create-concessionary-agency.dto';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';

@ApiTags('ConcessionaryAgency')
@UseGuards(AuthGuard)
@ApiBearerAuth()
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.concessionaryAgencyService.findOneById(id);
  }
}
