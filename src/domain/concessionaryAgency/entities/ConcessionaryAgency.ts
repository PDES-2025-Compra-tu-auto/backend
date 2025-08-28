import { SaleCar } from 'src/domain/car/entities/SaleCar';
import { Concessionary } from 'src/domain/user/entities/Concessionary';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RegistrationStatus } from '../enums/RegistrationStatus';

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

  @Column()
  email: string;

  @Column({ type: 'enum', enum: RegistrationStatus })
  registrationStatus: RegistrationStatus;
}
