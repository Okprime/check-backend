import { Menu } from '../../menu/entities/menu.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderType } from '../types/order.types';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderType,
    nullable: true,
  })
  orderType: OrderType;

  @Column({ type: 'int', width: 10, nullable: false })
  amount: number;

  @Column({
    type: 'jsonb',
    default: () => "'[]'",
    nullable: false,
  })
  menuItems: Menu[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.myOrders, { eager: true })
  @JoinColumn({ name: 'User_id' })
  user: User;
}
