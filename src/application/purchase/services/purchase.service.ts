import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from 'src/domain/purchase/entities/Purchase';
import { UserService } from 'src/application/user/services/user.service';
import { SaleCarService } from 'src/application/sale-car/services/sale-car.service';
import { plainToInstance } from 'class-transformer';
import { PurchaseResponseDto } from 'src/infraestructure/purchase/dto/purchase-response.dto';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly userService: UserService,
    private readonly saleCarService: SaleCarService,
  ) {}

  async findAllByConcesionary(
    concesionaryId: string,
  ): Promise<PurchaseResponseDto[]> {
    const purchases = await this.purchaseRepository.find({
      where: { soldBy: { id: concesionaryId } },
      relations: ['buyer', 'saleCar', 'saleCar.modelCar', 'soldBy'],
      order: { createdAt: 'DESC' },
    });

    return plainToInstance(PurchaseResponseDto, purchases, {
      excludeExtraneousValues: true,
    });
  }

  async createPurchase(
    buyerId: string,
    saleCarId: string,
  ): Promise<PurchaseResponseDto> {
    const buyer = await this.userService.findEntityById(buyerId);
    const saleCar = await this.saleCarService.findSaleCar(saleCarId, [
      'concesionary',
      'modelCar',
    ]);
    const concesionary = saleCar.concesionary;
    const purchasedPrice = saleCar.price;
    const patent = new Date().getFullYear().toString();
    const purchase = this.purchaseRepository.create({
      buyer,
      saleCar,
      soldBy: concesionary,
      purchasedPrice,
      patent,
    });

    const saved = await this.purchaseRepository.save(purchase);

    return plainToInstance(PurchaseResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }
}
