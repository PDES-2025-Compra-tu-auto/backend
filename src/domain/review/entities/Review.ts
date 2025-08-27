import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { Buyer } from 'src/domain/user/entities/Buyer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Buyer)
  buyer: Buyer;

  @ManyToOne(() => SaleCar, (car) => car.reviews)
  car: SaleCar;

  @Column({ type: 'int' })
  score: number;

  @Column()
  comment: string;
}
