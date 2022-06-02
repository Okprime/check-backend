import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Order } from '../../order/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable: false, default: 'user' })
  role: string;

  @Column({ type: 'int', width: 10, nullable: false, default: 0 })
  balance: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, select: false })
  salt?: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, select: false })
  hash?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  countryCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.manager)
  resturants: Restaurant[];

  @OneToMany(() => Order, (order) => order.user)
  myOrders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  myCarts: Cart[];

  @Column({ type: 'varchar', length: 700, nullable: true })
  deviceToken: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  myTransactions: Transaction[];
}
