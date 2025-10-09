import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PurchaseService } from 'src/application/purchase/services/purchase.service';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('dealership-sales')
  async getMySales(@ActiveUser() user: UserActiveI) {
    return this.purchaseService.findAllByConcesionary(user.sub);
  }

  @Post()
  async createPurchase(@Body() dto: CreatePurchaseDto) {
    return this.purchaseService.createPurchase(
      dto.buyerId,
      dto.saleCarId,
      dto.concessionaryId,
      dto.purchasedPrice,
      dto.patent,
    );
  }
}
