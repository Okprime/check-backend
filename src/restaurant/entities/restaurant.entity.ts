import { Menu } from '../../menu/entities/menu.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Table } from '../../table/entities/table.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  city: string;

  @Column({ type: 'int', width: 10, nullable: true })
  noOfTables: number;

  @ManyToOne(() => User, (user) => user.resturants)
  @JoinColumn({ name: 'user_id' })
  manager: User;

  @OneToMany(() => Table, (table) => table.restaurant)
  tables: Table[];

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menu: Menu[];

  @OneToMany(() => Cart, (cart) => cart.restaurant)
  cart: Cart[];

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
