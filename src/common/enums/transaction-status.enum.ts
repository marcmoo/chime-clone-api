import { registerEnumType } from '@nestjs/graphql';

export enum TransactionStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  DECLINED = 'DECLINED',
}

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});
