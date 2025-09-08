import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { ConcessionaryAgency } from 'src/domain/concessionaryAgency/entities/ConcessionaryAgency';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { Dealer } from 'src/domain/user/entities/Dealer';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Buyer, (buyer: Buyer) => buyer.purchases)
  buyer: Buyer;

  @ManyToOne(() => SaleCar, (car: SaleCar) => car.purchases)
  saleCar: SaleCar;

  @ManyToOne(() => ConcessionaryAgency)
  agency: ConcessionaryAgency;

  @Column('decimal')
  precioComprado: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Dealer, (dealer) => dealer.sales)
  soldBy: Dealer;
}
