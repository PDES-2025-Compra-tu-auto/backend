import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelCar } from 'src/domain/car/entities/ModelCar';
import { Repository } from 'typeorm';

@Injectable()
export class ModelCarService {
  constructor(
    @InjectRepository(ModelCar)
    private readonly modelCarRepo: Repository<ModelCar>,
  ) {}

  async findById(id: string): Promise<ModelCar> {
    const model = await this.modelCarRepo.findOne({ where: { id } });
    if (!model) throw new NotFoundException(`ModelCar ${id} not found`);
    return model;
  }

  findAll(): Promise<ModelCar[]> {
    return this.modelCarRepo.find();
  }
}
