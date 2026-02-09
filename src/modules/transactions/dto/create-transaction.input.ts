import { InputType, Field, Float } from '@nestjs/graphql';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransactionType } from '../../../common/enums';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsUUID()
  accountId: string;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  merchantName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;
}
