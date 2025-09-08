import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcessionaryAgency } from 'src/domain/concessionaryAgency/entities/ConcessionaryAgency';
import { RegistrationStatus } from 'src/domain/concessionaryAgency/enums/RegistrationStatus';
import { CreateConcessionaryAgencyDto } from 'src/infraestructure/controllers/concessionary-agency/dto/create-concessionary-agency.dto';
import { Not, Repository } from 'typeorm';

@Injectable()
export class ConcessionaryAgencyService {
  constructor(
    @InjectRepository(ConcessionaryAgency)
    private readonly concessionaryAgencyRepository: Repository<ConcessionaryAgency>,
  ) {}

  async create(createConcessionaryAgencyDto: CreateConcessionaryAgencyDto) {
    const emailExists = await this.concessionaryAgencyRepository.findOne({
      where: {
        email: createConcessionaryAgencyDto.email,
        registrationStatus: Not(RegistrationStatus.REJECTED),
      },
    });

    if (emailExists) {
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }

    const payload = {
      ...createConcessionaryAgencyDto,
      registrationStatus: RegistrationStatus.WAIT,
    };
    return await this.concessionaryAgencyRepository.save(payload);
  }

  async findOneById(id: string) {
    const agency = await this.concessionaryAgencyRepository.findOne({
      where: { id },
    });

    if (!agency) {
      throw new BadRequestException(
        `ConcessionaryAgency with id ${id} not found`,
      );
    }

    return agency;
  }
}
