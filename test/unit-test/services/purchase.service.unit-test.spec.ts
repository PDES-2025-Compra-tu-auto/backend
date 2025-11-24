/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../../../src/application/user/services/user.service';
import { SaleCarService } from '../../../src/application/sale-car/services/sale-car.service';
import { Purchase } from '../../../src/domain/purchase/entities/Purchase';
import { PurchaseService } from '../../../src/application/purchase/services/purchase.service';
import { PurchaseResponseDto } from '../../../src/infraestructure/purchase/dto/purchase-response.dto';
import { SaleCarResponseDto } from 'src/infraestructure/sale-car/dto/sale-car-response.dto';
import { User } from 'src/domain/user/entities/User';
import { MetricsService } from 'src/metrics/metrics.service';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let userService: jest.Mocked<UserService>;
  let saleCarService: jest.Mocked<SaleCarService>;
  let purchaseRepo: jest.Mocked<Repository<Purchase>>;

  beforeEach(async () => {
    const mockPurchaseRepo = {
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Purchase>>;

    const mockUserService = {
      findEntityById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const mockSaleCarService = {
      findSaleCar: jest.fn(),
    } as unknown as jest.Mocked<SaleCarService>;

    const mockMetricsService = {
      purchaseCount: { inc: jest.fn() },
      purchaseByDealership: {
        labels: jest.fn().mockReturnValue({ inc: jest.fn() }),
      },
      purchaseByModel: {
        labels: jest.fn().mockReturnValue({ inc: jest.fn() }),
      },
      getMetrics: jest.fn().mockResolvedValue('mock-metrics'),
    } as unknown as jest.Mocked<MetricsService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: getRepositoryToken(Purchase),
          useValue: mockPurchaseRepo,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: SaleCarService,
          useValue: mockSaleCarService,
        },
        {
          provide: MetricsService,
          useValue: mockMetricsService as any,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    purchaseRepo = module.get(getRepositoryToken(Purchase));
    userService = module.get(UserService);
    saleCarService = module.get(SaleCarService);
  });

  describe('createPurchase', () => {
    const buyerId = 'buyer-1';
    const saleCarId = 'saleCar-1';

    it('debería lanzar NotFoundException si no encuentra el usuario', async () => {
      userService.findEntityById.mockRejectedValueOnce(
        new NotFoundException('User not found'),
      );

      await expect(service.createPurchase(buyerId, saleCarId)).rejects.toThrow(
        NotFoundException,
      );

      expect(userService.findEntityById).toHaveBeenCalledWith(buyerId);
    });

    it('debería lanzar NotFoundException si no encuentra el saleCar', async () => {
      userService.findEntityById.mockResolvedValueOnce({ id: buyerId } as User);

      saleCarService.findSaleCar.mockRejectedValueOnce(
        new NotFoundException('SaleCar not found'),
      );

      await expect(service.createPurchase(buyerId, saleCarId)).rejects.toThrow(
        NotFoundException,
      );

      expect(saleCarService.findSaleCar).toHaveBeenCalledWith(saleCarId, [
        'concesionary',
        'modelCar',
      ]);
    });

    it('debería crear y devolver la compra correctamente', async () => {
      const mockBuyer = { id: buyerId, fullname: 'Test Buyer' };
      const mockSaleCar = {
        id: saleCarId,
        modelCar: { id: '2' },
        concesionary: { id: 'cons-1', fullname: 'Dealer SA' },
        price: 10000,
      };
      const mockPurchase = {
        id: 'purchase-1',
        buyer: mockBuyer,
        saleCar: mockSaleCar,
        soldBy: mockSaleCar.concesionary,
        purchasedPrice: mockSaleCar.price,
        patent: '2025',
        createdAt: new Date(),
      };

      userService.findEntityById.mockResolvedValueOnce(mockBuyer as User);
      saleCarService.findSaleCar.mockResolvedValueOnce(
        mockSaleCar as SaleCarResponseDto,
      );
      purchaseRepo.create.mockReturnValueOnce(mockPurchase as Purchase);
      purchaseRepo.save.mockResolvedValueOnce(mockPurchase as Purchase);

      const result = await service.createPurchase(buyerId, saleCarId);

      expect(userService.findEntityById).toHaveBeenCalledWith(buyerId);
      expect(saleCarService.findSaleCar).toHaveBeenCalledWith(saleCarId, [
        'concesionary',
        'modelCar',
      ]);
      expect(purchaseRepo.create).toHaveBeenCalledWith({
        buyer: mockBuyer,
        saleCar: mockSaleCar,
        soldBy: mockSaleCar.concesionary,
        purchasedPrice: mockSaleCar.price,
        patent: expect.any(String),
      });
      expect(purchaseRepo.save).toHaveBeenCalled();

      expect(result).toBeInstanceOf(PurchaseResponseDto);
      expect(result.id).toBe('purchase-1');
      expect(result.purchasedPrice).toBe(10000);
    });
  });
});
