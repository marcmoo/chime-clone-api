import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../../modules/users/entities/user.entity';
import { Account } from '../../modules/accounts/entities/account.entity';
import { Transaction } from '../../modules/transactions/entities/transaction.entity';
import { Card } from '../../modules/cards/entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Transaction, Card])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
