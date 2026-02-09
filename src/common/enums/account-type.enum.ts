import { registerEnumType } from '@nestjs/graphql';

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
}

registerEnumType(AccountType, {
  name: 'AccountType',
});
