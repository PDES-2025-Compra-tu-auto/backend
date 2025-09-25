import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusCar } from '../enums/StatusCar';
import { ModelCar } from './ModelCar';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';
import { Purchase } from 'src/domain/purchase/entities/Purchase';
import { Concesionary } from 'src/domain/user/entities/Concesionary';

@Entity()
export class SaleCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ModelCar)
  modelCar: ModelCar;

  @ManyToOne(() => Concesionary, (concesionary) => concesionary.carsForSale)
  concesionary: Concesionary;

  @Column('decimal')
  price: number;

  @Column({ type: 'enum', enum: StatusCar })
  status: StatusCar;

  @OneToMany(() => Purchase, (purchase) => purchase.saleCar)
  purchases: Purchase[];

  @OneToMany(() => FavoriteCar, (favorite) => favorite.saleCar)
  favorites: FavoriteCar[];
}
