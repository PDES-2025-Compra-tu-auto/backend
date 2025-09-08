import { Entity, OneToMany, ManyToOne } from 'typeorm';
import { User } from './User';
import { Purchase } from 'src/domain/purchase/entities/Purchase';
import { ConcessionaryAgency } from 'src/domain/concessionaryAgency/entities/ConcessionaryAgency';

@Entity()
export class Dealer extends User {
  @OneToMany(() => Purchase, (purchase) => purchase.soldBy)
  sales: Purchase[];

  @ManyToOne(() => ConcessionaryAgency, (agency) => agency.employees)
  agency: ConcessionaryAgency;
}
