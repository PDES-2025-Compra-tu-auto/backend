import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PurchaseService } from 'src/application/purchase/services/purchase.service';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { UuidParam } from 'src/infraestructure/decorators/uuui-param.decorator';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.CONCESIONARY)
  @Get('dealership-sales')
  async getMySales(@ActiveUser() user: UserActiveI) {
    return this.purchaseService.findAllByConcesionary(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.BUYER)
  @Get('my-purchases')
  async getMyPurchases(@ActiveUser() user: UserActiveI) {
    return this.purchaseService.findAllByBuyer(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.CONCESIONARY)
  @Get('my-clients')
  async getMyClients(@ActiveUser() user: UserActiveI) {
    return this.purchaseService.findClientsByConcesionary(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.BUYER)
  @Post(':saleCarId')
  async createPurchase(
    @UuidParam('saleCarId') saleCarId: string,
    @ActiveUser() user: UserActiveI,
  ) {
    const buyerId = user.sub;
    return this.purchaseService.createPurchase(buyerId, saleCarId);
  }
}
