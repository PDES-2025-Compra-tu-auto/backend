import { Entity, OneToMany, Column, ChildEntity } from 'typeorm';
import { User } from './User';
import { FavoriteCar } from 'src/domain/favoriteCar/entities/FavoriteCar';
import { Purchase } from 'src/domain/purchase/entities/Purchase';

@ChildEntity('BUYER')
export class Buyer extends User {
  @OneToMany(() => FavoriteCar, (favorite: FavoriteCar) => favorite.buyer)
  favorites: FavoriteCar[];

  @OneToMany(() => Purchase, (purchase: Purchase) => purchase.buyer)
  purchases: Purchase[];

  @Column({ default: 0 })
  cantPurchases: number;
}
