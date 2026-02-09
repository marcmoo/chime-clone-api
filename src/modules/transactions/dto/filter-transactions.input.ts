import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsInt, IsDateString } from 'class-validator';
import { TransactionType, TransactionStatus } from '../../../common/enums';

@InputType()
export class FilterTransactionsInput {
  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @Field(() => TransactionStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  limit?: number;
}
