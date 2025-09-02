import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { Admin } from 'src/domain/user/entities/Admin';
import { Dealer } from 'src/domain/user/entities/Dealer';
import { UserRole } from 'src/domain/user/enums/UserRole';

@Injectable()
export class UserRepositoryFactory {
  constructor(
    @InjectRepository(Buyer)
    private buyerRepo: Repository<Buyer>,
    @InjectRepository(Dealer)
    private dealerRepo: Repository<Dealer>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {}

  getRepository(role: UserRole): Repository<any> {
    switch (role) {
      case UserRole.BUYER:
        return this.buyerRepo;
      case UserRole.DEALER:
        return this.dealerRepo;
      case UserRole.ADMINISTRATOR:
        return this.adminRepo;
      default:
        throw new Error(
          `Repository not implemented for role: ${role as string}`,
        );
    }
  }
}
