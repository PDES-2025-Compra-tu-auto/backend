import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcessionaryAgencyService } from 'src/application/concessionary-agency/services/concessionary-agency.service';
import { ModelCarService } from 'src/application/model-car/services/model-car.service';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { CreateSaleCarDto } from 'src/infraestructure/sale-car/dto/create-sale-car.dto';
import { UpdateSaleCarDto } from 'src/infraestructure/sale-car/dto/update-sale.car.dto';
import { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entities/User';
import { Dealer } from 'src/domain/user/entities/Dealer';

@Injectable()
export class SaleCarService {
  constructor(
    @InjectRepository(SaleCar)
    private readonly saleCarRepo: Repository<SaleCar>,
    private readonly modelCarService: ModelCarService,
    private readonly agencyService: ConcessionaryAgencyService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateSaleCarDto,
    userSesionActive: UserActiveI,
  ): Promise<SaleCar> {
    const repo:Repository<Dealer> = this.userRepository as Repository<Dealer>
    const dealer = await repo.findOne({
      where: { id: userSesionActive.sub },
      relations: ['agency'],
    });

    if (!dealer) {
      throw new NotFoundException('Dealer not found');
    }
    const modelCar = await this.modelCarService.findById(dto.modelCarId);

    const saleCar = this.saleCarRepo.create({
      modelCar,
      agency: dealer.agency,
      price: dto.price,
      status: StatusCar.AVAILABLE,
    });

    return this.saleCarRepo.save(saleCar);
  }

  async findAll(status?: StatusCar): Promise<SaleCar[]> {
    const whereClause = status ? { status } : {};
    return this.saleCarRepo.find({
      where: whereClause,
      relations: ['agency', 'modelCar'],
    });
  }

  async findSaleCar(
    id: string,
    relations: string[] = ['agency', 'modelCar'],
  ): Promise<SaleCar> {
    const saleCar = await this.saleCarRepo.findOne({
      where: { id },
      relations,
    });

    if (!saleCar) {
      throw new NotFoundException(`SaleCar with id ${id} not found`);
    }

    return saleCar;
  }

  async update(
    id: string,
    dto: UpdateSaleCarDto,
    userSesionActive: UserActiveI,
  ): Promise<SaleCar> {
    const dealerRepo :Repository<Dealer> = this.userRepository as Repository<Dealer>
    const dealer = await dealerRepo.findOne({
      where: { id: userSesionActive.sub },
      relations: ['agency'],
    });

    if (!dealer || !dealer.agency) {
      throw new ForbiddenException('Dealer does not belong to any agency');
    }

    const saleCar = await this.findSaleCar(id, ['agency']);

    if (saleCar.agency.id !== dealer.agency.id) {
      throw new ForbiddenException(
        'You cannot update SaleCars from another agency',
      );
    }

    const { price, status } = dto;

    const updatedFields: Partial<SaleCar> = {};
    if (price !== undefined) updatedFields.price = price;
    if (status !== undefined) updatedFields.status = status;

    await this.saleCarRepo.update(id, updatedFields);

    return this.findSaleCar(id);
  }
}
