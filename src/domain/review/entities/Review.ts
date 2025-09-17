import { ModelCar } from 'src/domain/car/entities/ModelCar';
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

  @ManyToOne(() => ModelCar, (model) => model.reviews)
  modelCar: ModelCar;

  @Column({ type: 'int' })
  score: number;

  @Column()
  comment: string;
}
