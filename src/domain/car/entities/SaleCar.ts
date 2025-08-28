import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusCar } from '../enums/StatusCar';
import { ModelCar } from './ModelCar';
import { Review } from 'src/domain/review/entities/Review';
import { ConcessionaryAgency } from 'src/domain/concessionaryAgency/entities/ConcessionaryAgency';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';
import { Purchase } from 'src/domain/purchase/entities/Purchase';

@Entity()
export class SaleCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ModelCar)
  modelCar: ModelCar;

  @OneToMany(() => Review, (review) => review.car)
  reviews: Review[];

  @Column()
  patent: string;

  @ManyToOne(() => ConcessionaryAgency, (agency) => agency.carsForSale)
  agency: ConcessionaryAgency;

  @Column('decimal')
  price: number;

  @Column({ type: 'enum', enum: StatusCar })
  status: StatusCar;

  @OneToMany(() => Purchase, (purchase) => purchase.saleCar)
  purchases: Purchase[];

  @OneToMany(() => FavoriteCar, (favorite) => favorite.saleCar)
  favorites: FavoriteCar[];
}
