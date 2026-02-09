import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Card } from '../../cards/entities/card.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateOfBirth?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  addressStreet?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  addressCity?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  addressState?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  addressZip?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Account], { nullable: true })
  @OneToMany(() => Account, (account) => account.user)
  accounts?: Account[];

  @Field(() => [Card], { nullable: true })
  @OneToMany(() => Card, (card) => card.user)
  cards?: Card[];
}
