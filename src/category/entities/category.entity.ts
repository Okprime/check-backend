import { Menu } from '../../menu/entities/menu.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300, nullable: false })
  name: string;

  @OneToMany(() => Menu, (menu) => menu.category, { eager: true })
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
