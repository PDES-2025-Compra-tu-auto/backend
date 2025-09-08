import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConcessionaryAgencyService } from 'src/application/concessionary-agency/services/concessionary-agency.service';
import { CreateConcessionaryAgencyDto } from './dto/create-concessionary-agency.dto';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { UserRole } from 'src/domain/user/enums/UserRole';

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

  //ejemplo de prueba, no va aplicar exactamente asi.
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.DEALER, UserRole.ADMINISTRATOR)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.concessionaryAgencyService.findOneById(id);
  }
}
