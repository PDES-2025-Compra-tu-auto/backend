import { Review } from 'src/domain/review/entities/Review';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Review, (review) => review.modelCar)
  reviews: Review[];
}
