import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ModelCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  description: string;

  @Column()
  year: string;
}
