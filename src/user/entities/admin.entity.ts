import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 300, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable: false, default: 'admin' })
  userRole: string;

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
  countryCode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  guests: User;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.manager)
  resturants: Restaurant[];
}
