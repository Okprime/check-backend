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

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 10, nullable: false })
  totalAmount: number;

  @Column({ type: 'int', width: 10, nullable: false })
  quantity: number;

  @ManyToOne(() => Menu)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.myOrders)
  @JoinColumn({ name: 'User_id' })
  user: User;
}
