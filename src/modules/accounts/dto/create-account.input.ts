import { InputType, Field } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { AccountType } from '../../../common/enums';

@InputType()
export class CreateAccountInput {
  @Field(() => AccountType)
  @IsEnum(AccountType)
  accountType: AccountType;
}
