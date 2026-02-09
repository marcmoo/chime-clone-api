import { InputType, Field, Float } from '@nestjs/graphql';
import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

@InputType()
export class TransferMoneyInput {
  @Field()
  @IsUUID()
  fromAccountId: string;

  @Field()
  @IsUUID()
  toAccountId: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;
}
