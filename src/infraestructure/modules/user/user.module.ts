// user-repository.module.ts
import { Module } from '@nestjs/common';
import { UserRepositoryFactory } from 'src/infraestructure/factories/user-repository.factory';
import { BuyerModule } from '../buyer/buyer.module';
import { DealerModule } from '../dealer/concessionary.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [BuyerModule, DealerModule, AdminModule],
  providers: [UserRepositoryFactory],
  exports: [UserRepositoryFactory],
})
export class UserRepositoryModule {}
