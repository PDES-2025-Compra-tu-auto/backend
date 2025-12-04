import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from 'src/domain/purchase/entities/Purchase';
import { UserService } from 'src/application/user/services/user.service';
import { SaleCarService } from 'src/application/sale-car/services/sale-car.service';
import { plainToInstance } from 'class-transformer';
import { PurchaseResponseDto } from 'src/infraestructure/purchase/dto/purchase-response.dto';
import { MetricsService } from 'src/metrics/metrics.service';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { UserResponseDto } from 'src/infraestructure/user/dto/user-response.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly userService: UserService,
    private readonly saleCarService: SaleCarService,
    private readonly metricsService: MetricsService,
    private readonly logger: Logger,
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

  async findAllByBuyer(buyerId: string): Promise<PurchaseResponseDto[]> {
    const purchases = await this.purchaseRepository.find({
      where: { buyer: { id: buyerId } },
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
    this.logger.log({ buyerId, saleCarId }, 'Iniciando creación de compra');
    const buyer = await this.userService.findEntityById(buyerId);
    const saleCar = await this.saleCarService.findSaleCar(saleCarId, [
      'concesionary',
      'modelCar',
    ]);

    this.logger.log(
      {
        buyer: buyer.id,
        saleCar: saleCar.id,
        concesionary: saleCar.concesionary.id,
      },
      'Datos obtenidos para la compra',
    );
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

    this.logger.log(
      {
        purchaseId: saved.id,
        buyer: buyer.id,
        concesionary: concesionary.id,
        amount: saleCar.price,
      },
      'Compra creada exitosamente',
    );

    this.metricsService.purchaseCount.inc();

    this.metricsService.purchaseByDealership
      .labels(concesionary.id, concesionary.fullname)
      .inc();

    this.metricsService.purchaseByModel
      .labels(saleCar.modelCar.id, saleCar.modelCar.model)
      .inc();

    return plainToInstance(PurchaseResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async findClientsByConcesionary(concesionaryId: string) {
    const purchases = await this.purchaseRepository.find({
      where: { soldBy: { id: concesionaryId } },
      relations: ['buyer'],
    });

    const uniqueBuyersMap = new Map<string, Buyer>();

    for (const purchase of purchases) {
      const buyer = purchase.buyer;
      if (buyer && !uniqueBuyersMap.has(buyer.id)) {
        uniqueBuyersMap.set(buyer.id, buyer);
      }
    }

    return plainToInstance(
      UserResponseDto,
      Array.from(uniqueBuyersMap.values()),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
