import { OneToMany, ChildEntity, Column } from 'typeorm';
import { User } from './User';
import { Purchase } from 'src/domain/purchase/entities/Purchase';
import { SaleCar } from 'src/domain/car/entities/SaleCar';

@ChildEntity('CONCESIONARY')
export class Concesionary extends User {
  @OneToMany(() => Purchase, (purchase) => purchase.soldBy)
  sales: Purchase[];

  @Column()
  concesionaryCuit: string;

  @OneToMany(() => SaleCar, (car) => car.concesionary)
  carsForSale: SaleCar[];

  @Column({ default: 0 })
  totalSales: number;
}
