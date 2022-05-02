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

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  image?: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  address: string;

  @Column({ type: 'varchar', length: 300, nullable: false, default: 'user' })
  city: string;

  @Column({ type: 'int', width: 10, nullable: true })
  noOfTables: number;

  @ManyToOne(() => User, (user) => user.resturants, { eager: true })
  @JoinColumn({ name: 'user_id' })
  manager: User;

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menu: Menu[];

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
