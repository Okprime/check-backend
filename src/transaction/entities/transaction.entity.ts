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
import { TransactionStatus, TransactionType } from '../types/transaction.types';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', width: 10, nullable: true })
  amount: number;

  @Column()
  transactionRef: string;

  @ManyToOne(() => User, (user) => user.myTransactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    nullable: true,
  })
  transactionStatus: TransactionStatus;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: true,
  })
  transactionType: TransactionType;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  transferTo: User;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  transferFrom: User;

  @Column({ type: 'varchar', length: 300, nullable: true })
  bankName: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  bankAccountName: string;

  @Column({ type: 'int', width: 30, nullable: true })
  bankAccountNumber: number;
}
