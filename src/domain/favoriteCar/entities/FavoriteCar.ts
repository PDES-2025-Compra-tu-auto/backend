import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { Buyer } from 'src/domain/user/entities/Buyer';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FavoriteCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Buyer, (buyer) => buyer.favorites)
  buyer: Buyer;

  @ManyToOne(() => SaleCar, (car) => car.favorites)
  saleCar: SaleCar;

  @CreateDateColumn()
  dateAdded: Date;
}
