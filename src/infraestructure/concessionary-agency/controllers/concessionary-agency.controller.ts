import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConcessionaryAgencyService } from 'src/application/concessionary-agency/services/concessionary-agency.service';
import { CreateConcessionaryAgencyDto } from '../../concessionary-agency/dto/create-concessionary-agency.dto';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { RegistrationStatus } from 'src/domain/concessionaryAgency/enums/RegistrationStatus';

@ApiTags('ConcessionaryAgency')
@ApiBearerAuth()
@UseGuards(AuthGuard)
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

  @Get()
  @ApiQuery({
    name: 'status',
    enum: RegistrationStatus,
    required: false,
    description: 'Filtrar por estado de registro',
  })
  async findAll(@Query('status') status?: RegistrationStatus) {
    return await this.concessionaryAgencyService.findAll(status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  @ApiBearerAuth()
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RegistrationStatus,
  ) {
    return await this.concessionaryAgencyService.updateStatus(id, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.concessionaryAgencyService.findOneById(id);
  }
}
