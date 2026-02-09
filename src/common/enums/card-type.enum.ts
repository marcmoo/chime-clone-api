import { registerEnumType } from '@nestjs/graphql';

export enum CardType {
  DEBIT = 'DEBIT',
  CREDIT_BUILDER = 'CREDIT_BUILDER',
}

registerEnumType(CardType, {
  name: 'CardType',
});
