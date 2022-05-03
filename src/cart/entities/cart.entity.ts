import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 10, nullable: false })
  totalAmount: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.cart, { eager: true })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.myCarts, { eager: true })
  @JoinColumn({ name: 'User_id' })
  user: User;

  @Column({
    type: 'jsonb',
    default: () => "'[]'",
    nullable: false,
  })
  orders: Order[];
}

// @Entity()
// export class CartTest {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'int', width: 10, nullable: false })
//   totalAmount: number;

//   @ManyToOne(() => Restaurant, (restaurant) => restaurant.cart, { eager: true })
//   @JoinColumn({ name: 'restaurant_id' })
//   restaurant: Restaurant;

//   @Column()
//   @CreateDateColumn()
//   createdAt: Date;

//   @Column()
//   @UpdateDateColumn()
//   updatedAt: Date;

//   @ManyToOne(() => User, (user) => user.myCarts, { eager: true })
//   @JoinColumn({ name: 'User_id' })
//   user: User;

//   @Column({
//     type: 'jsonb',
//     default: () => "'[]'",
//     nullable: false,
//   })
//   orders: Order[];
// }
