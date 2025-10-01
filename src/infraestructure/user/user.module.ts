// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/domain/user/entities/Admin';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { Concesionary } from 'src/domain/user/entities/Concesionary';
import { User } from 'src/domain/user/entities/User';
import { UserController } from './controllers/user.controller';
import { UserService } from 'src/application/user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Concesionary, Buyer, Admin])],
  exports: [TypeOrmModule, UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
