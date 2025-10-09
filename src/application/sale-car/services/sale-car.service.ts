import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelCarService } from 'src/application/model-car/services/model-car.service';
import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { StatusCar } from 'src/domain/car/enums/StatusCar';
import { CreateSaleCarDto } from 'src/infraestructure/sale-car/dto/create-sale-car.dto';
import { UpdateSaleCarDto } from 'src/infraestructure/sale-car/dto/update-sale.car.dto';
import { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { Repository } from 'typeorm';
import { UserService } from 'src/application/user/services/user.service';
import { plainToInstance } from 'class-transformer';
import { SaleCarResponseDto } from 'src/infraestructure/sale-car/dto/sale-car-response.dto';

@Injectable()
export class SaleCarService {
  constructor(
    @InjectRepository(SaleCar)
    private readonly saleCarRepo: Repository<SaleCar>,
    private readonly modelCarService: ModelCarService,
    private readonly userService: UserService,
  ) {}

  async create(
    dto: CreateSaleCarDto,
    userSesionActive: UserActiveI,
  ): Promise<SaleCarResponseDto> {
    const user = await this.userService.findEntityById(userSesionActive.sub);
    const modelCar = await this.modelCarService.findById(dto.modelCarId);

    const saleCar = this.saleCarRepo.create({
      modelCar,
      price: dto.price,
      status: StatusCar.AVAILABLE,
      concesionary: user,
    });

    const savedSaleCar = await this.saleCarRepo.save(saleCar);

    return plainToInstance(SaleCarResponseDto, savedSaleCar, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(status?: StatusCar): Promise<SaleCarResponseDto[]> {
    const whereClause = status ? { status } : {};
    const saleCars = await this.saleCarRepo.find({
      where: whereClause,
      relations: ['modelCar', 'concesionary'],
    });

    return plainToInstance(SaleCarResponseDto, saleCars, {
      excludeExtraneousValues: true,
    });
  }

  async findSaleCar(
    id: string,
    relations: string[] = ['modelCar'],
  ): Promise<SaleCarResponseDto> {
    const saleCar = await this.saleCarRepo.findOne({
      where: { id },
      relations,
    });

    if (!saleCar) {
      throw new NotFoundException(`SaleCar with id ${id} not found`);
    }

    return plainToInstance(SaleCarResponseDto, saleCar, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: UpdateSaleCarDto): Promise<SaleCarResponseDto> {
    const { price, status } = dto;

    const updatedFields: Partial<SaleCar> = {};
    if (price !== undefined) updatedFields.price = price;
    if (status !== undefined) updatedFields.status = status;

    await this.saleCarRepo.update(id, updatedFields);

    return this.findSaleCar(id);
  }
}
