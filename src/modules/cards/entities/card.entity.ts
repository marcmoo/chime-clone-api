import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CardType } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';

@ObjectType()
@Entity('cards')
export class Card {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  @Field()
  @Column()
  accountId: string;

  @Field(() => CardType)
  @Column({ type: 'enum', enum: CardType })
  cardType: CardType;

  @Field()
  @Column({ length: 4 })
  lastFourDigits: string;

  @Field()
  @Column()
  expirationDate: string;

  @Field()
  @Column()
  cardholderName: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isBlocked: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.cards)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
