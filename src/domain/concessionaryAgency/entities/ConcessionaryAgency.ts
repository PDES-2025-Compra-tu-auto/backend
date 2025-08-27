import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { Concessionary } from 'src/domain/user/entities/Concessionary';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConcessionaryAgency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  concessionaryName: string;

  @OneToMany(() => Concessionary, (employee) => employee.agency)
  employees: Concessionary[];

  @OneToMany(() => SaleCar, (car) => car.agency)
  carsForSale: SaleCar[];

  @Column({ default: 0 })
  totalSales: number;
}
