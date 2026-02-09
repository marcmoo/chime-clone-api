import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType, TransactionStatus } from '../../../common/enums';
import { Account } from '../../accounts/entities/account.entity';

@ObjectType()
@Entity('transactions')
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  accountId: string;

  @Field(() => TransactionType)
  @Column({ type: 'enum', enum: TransactionType })
  transactionType: TransactionType;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  merchantName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => TransactionStatus)
  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Field()
  @Column()
  transactionDate: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  postedDate?: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
