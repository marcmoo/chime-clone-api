import { registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  ATM_WITHDRAWAL = 'ATM_WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  DIRECT_DEPOSIT = 'DIRECT_DEPOSIT',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});
