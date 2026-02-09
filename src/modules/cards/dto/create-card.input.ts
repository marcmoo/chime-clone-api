import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { CardType } from '../../../common/enums';

@InputType()
export class CreateCardInput {
  @Field()
  @IsUUID()
  accountId: string;

  @Field(() => CardType)
  @IsEnum(CardType)
  cardType: CardType;
}
