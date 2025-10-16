import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ModelCar } from 'src/domain/car/entities/ModelCar';
import { CreateModelCarDto } from 'src/infraestructure/model-car/dto/create-model-car.dto';
import { ModelCarDto } from 'src/infraestructure/model-car/dto/model-car-response.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ModelCarService {
  constructor(
    @InjectRepository(ModelCar)
    private readonly modelCarRepo: Repository<ModelCar>,
  ) {}

  async createModelCar(dto: CreateModelCarDto) {
    const model = this.modelCarRepo.create(dto);
    const saved = await this.modelCarRepo.save(model);
    return plainToInstance(ModelCarDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: string): Promise<ModelCarDto> {
    const model = await this.modelCarRepo.findOne({ where: { id } });
    if (!model) throw new NotFoundException(`ModelCar ${id} not found`);
    return plainToInstance(ModelCarDto, model, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ModelCarDto[]> {
    const models = await this.modelCarRepo.find();
    return plainToInstance(ModelCarDto, models, {
      excludeExtraneousValues: true,
    });
  }
}
