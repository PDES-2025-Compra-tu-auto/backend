import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { Concesionary } from 'src/domain/user/entities/Concesionary';

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

  @Column('decimal')
  purchasedPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  patent: string;

  @ManyToOne(() => Concesionary, (concesionary) => concesionary.sales)
  soldBy: Concesionary;
}
