import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { ConcessionaryAgency } from 'src/domain/concessionaryAgency/entities/ConcessionaryAgency';
import { Buyer } from 'src/domain/user/entities/Buyer';
import { Concessionary } from 'src/domain/user/entities/Concessionary';
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

  @ManyToOne(() => Concessionary, (concessionary) => concessionary.sales)
  soldBy: Concessionary;
}
