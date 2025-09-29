// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/domain/user/entities/Admin';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { Concesionary } from 'src/domain/user/entities/Concesionary';
import { User } from 'src/domain/user/entities/User';

@Module({
   imports: [TypeOrmModule.forFeature([User,Concesionary,Buyer,Admin])],
   exports: [TypeOrmModule],
})
export class UserModule {}
