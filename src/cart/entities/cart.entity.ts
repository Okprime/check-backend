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
import { CartStatus, PaymentType } from '../types/cart.types';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 10, nullable: false })
  totalAmount: number;

  @Column({ type: 'int', width: 10, nullable: true })
  table: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.cart)
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

  @Column({
    type: 'enum',
    enum: CartStatus,
    nullable: false,
    default: CartStatus.PENDING,
  })
  status: CartStatus;

  @Column({
    type: 'enum',
    enum: PaymentType,
    nullable: false,
  })
  paymentType: PaymentType;
}
