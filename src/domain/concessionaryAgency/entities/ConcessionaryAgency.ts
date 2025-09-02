import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistrationStatus } from '../enums/RegistrationStatus';
import { Dealer } from 'src/domain/user/entities/Dealer';

@Entity()
export class ConcessionaryAgency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  concessionaryName: string;

  @OneToMany(() => Dealer, (employee) => employee.agency)
  employees: Dealer[];

  @OneToMany(() => SaleCar, (car) => car.agency)
  carsForSale: SaleCar[];

  @Column({ default: 0 })
  totalSales: number;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: RegistrationStatus })
  registrationStatus: RegistrationStatus;
}
