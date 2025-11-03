import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { RolesGuard } from 'src/infraestructure/guards/roles.guard';
import { Roles } from 'src/infraestructure/decorators/roles.decorator';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { AdminService } from 'src/application/auth/services/admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMINISTRATOR)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiQuery({
    name: 'role',
    enum: UserRole,
    required: false,
    description: 'Filtrar por rol (ej: ADMIN, BUYER, CONCESSIONARY)',
  })
  getUsers(@Query('role') role?: UserRole) {
    return this.adminService.getUsers(role);
  }

  @Get('favorites')
  getAllFavorites() {
    return this.adminService.getAllFavorites();
  }

  @Get('reviews')
  getAllReviews() {
    return this.adminService.getAllReviews();
  }

  @Get('purchases')
  getAllPurchases() {
    return this.adminService.getAllPurchases();
  }

  @Get('reports/top-sold-cars')
  getTopSoldCars() {
    return this.adminService.getTopSoldCars();
  }

  @Get('reports/top-buyers')
  getTopBuyers() {
    return this.adminService.getTopBuyers();
  }

  @Get('reports/top-rated-cars')
  getTopRatedCars() {
    return this.adminService.getTopRatedCars();
  }

  @Get('reports/top-agencies')
  getTopAgencies() {
    return this.adminService.getTopAgencies();
  }
}
