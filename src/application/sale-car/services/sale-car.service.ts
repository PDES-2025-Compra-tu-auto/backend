import {
  ForbiddenException,
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
import { UserService } from 'src/application/user/services/user.service';
import { plainToInstance } from 'class-transformer';
import { SaleCarResponseDto } from 'src/infraestructure/sale-car/dto/sale-car-response.dto';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';

@Injectable()
export class SaleCarService {
  constructor(
    @InjectRepository(SaleCar)
    private readonly saleCarRepo: Repository<SaleCar>,
    private readonly modelCarService: ModelCarService,
    private readonly userService: UserService,
    @InjectRepository(FavoriteCar)
    private readonly favoriteCarRepo: Repository<FavoriteCar>,
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

  async findAll(
    buyerId: string,
    filters: {
      status?: StatusCar;
      keyword?: string;
      minPrice?: number;
      maxPrice?: number;
      modelId?: string;
      concesionaryId?: string;
    },
  ): Promise<SaleCarResponseDto[]> {
    const qb = this.saleCarRepo
      .createQueryBuilder('saleCar')
      .leftJoinAndSelect('saleCar.modelCar', 'modelCar')
      .leftJoinAndSelect('saleCar.concesionary', 'concesionary');

    if (filters.status) {
      qb.andWhere('saleCar.status = :status', { status: filters.status });
    }

    if (filters.keyword) {
      qb.andWhere(
        '(LOWER(modelCar.model) LIKE LOWER(:kw) OR LOWER(modelCar.brand) LIKE LOWER(:kw))',
        { kw: `%${filters.keyword}%` },
      );
    }

    if (filters.minPrice) {
      qb.andWhere('saleCar.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      qb.andWhere('saleCar.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.modelId) {
      qb.andWhere('modelCar.id = :modelId', { modelId: filters.modelId });
    }

    if (filters.concesionaryId) {
      qb.andWhere('concesionary.id = :concesionaryId', {
        concesionaryId: filters.concesionaryId,
      });
    }

    const saleCars = await qb.getMany();

    // favoritos
    let favorites: FavoriteCar[] | undefined;

    if (buyerId) {
      favorites = await this.favoriteCarRepo.find({
        where: { buyer: { id: buyerId } },
        relations: ['saleCar'],
      });
    }

    const result = saleCars.map((car) => {
      const favorite = favorites?.find((fav) => fav.saleCar.id === car.id);
      return {
        ...car,
        favoriteId: favorite ? favorite.id : null,
        favoritedByUser: !!favorite,
      };
    });

    return plainToInstance(SaleCarResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findSaleCar(
    id: string,
    relations: string[] = ['modelCar'],
    buyerId?: string,
  ): Promise<SaleCarResponseDto> {
    const saleCar = await this.saleCarRepo.findOne({
      where: { id },
      relations,
    });

    if (!saleCar) {
      throw new NotFoundException(`SaleCar with id ${id} not found`);
    }

    let favoritedByUser = false;
    let favoriteId: string | undefined;
    if (buyerId) {
      const favorite = await this.favoriteCarRepo.findOne({
        where: { saleCar: { id }, buyer: { id: buyerId } },
      });
      favoriteId = favorite?.id;
      favoritedByUser = !!favorite;
    }

    return plainToInstance(
      SaleCarResponseDto,
      { ...saleCar, favoritedByUser, favoriteId: favoriteId ?? null },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async update(
    id: string,
    dto: UpdateSaleCarDto,
    concesionaryId: string,
  ): Promise<SaleCarResponseDto> {
    const saleCar = await this.saleCarRepo.findOne({
      where: { id },
      relations: ['concesionary'],
    });

    if (!saleCar) {
      throw new NotFoundException(`SaleCar with id ${id} not found`);
    }

    if (saleCar.concesionary.id !== concesionaryId) {
      throw new ForbiddenException('No tenés permiso para editar este auto');
    }

    const { price, status } = dto;

    const updatedFields: Partial<SaleCar> = {};
    if (price !== undefined) updatedFields.price = price;
    if (status !== undefined) updatedFields.status = status;

    await this.saleCarRepo.update(id, updatedFields);

    return this.findSaleCar(id);
  }
}
