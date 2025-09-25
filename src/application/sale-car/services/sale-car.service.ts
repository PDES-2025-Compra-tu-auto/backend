import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelCarService } from 'src/application/model-car/services/model-car.service';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { CreateSaleCarDto } from 'src/infraestructure/sale-car/dto/create-sale-car.dto';
import { UpdateSaleCarDto } from 'src/infraestructure/sale-car/dto/update-sale.car.dto';
import { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entities/User';
import { Concesionary } from 'src/domain/user/entities/Concesionary';

@Injectable()
export class SaleCarService {
  constructor(
    @InjectRepository(SaleCar)
    private readonly saleCarRepo: Repository<SaleCar>,
    private readonly modelCarService: ModelCarService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateSaleCarDto,
    userSesionActive: UserActiveI,
  ): Promise<SaleCar> {
    const repo: Repository<Concesionary> = this
      .userRepository as Repository<Concesionary>;
    const concesionary = await repo.findOne({
      where: { id: userSesionActive.sub },
    });

    if (!concesionary) {
      throw new NotFoundException('Dealer not found');
    }
    const modelCar = await this.modelCarService.findById(dto.modelCarId);

    const saleCar = this.saleCarRepo.create({
      modelCar,
      price: dto.price,
      status: StatusCar.AVAILABLE,
    });

    return this.saleCarRepo.save(saleCar);
  }

  async findAll(status?: StatusCar): Promise<SaleCar[]> {
    const whereClause = status ? { status } : {};
    return this.saleCarRepo.find({
      where: whereClause,
      relations: ['modelCar'],
    });
  }

  async findSaleCar(
    id: string,
    relations: string[] = ['modelCar'],
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

  async update(id: string, dto: UpdateSaleCarDto): Promise<SaleCar> {
    const { price, status } = dto;

    const updatedFields: Partial<SaleCar> = {};
    if (price !== undefined) updatedFields.price = price;
    if (status !== undefined) updatedFields.status = status;

    await this.saleCarRepo.update(id, updatedFields);

    return this.findSaleCar(id);
  }
}
