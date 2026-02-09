import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { FilterTransactionsInput } from './dto/filter-transactions.input';
import { TransferMoneyInput } from './dto/transfer-money.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [Transaction], { name: 'transactions' })
  @UseGuards(GqlAuthGuard)
  findByAccount(
    @Args('accountId', { type: () => ID }) accountId: string,
    @Args('filters', { nullable: true }) filters?: FilterTransactionsInput,
  ): Promise<Transaction[]> {
    return this.transactionsService.findByAccount(accountId, filters);
  }

  @Query(() => Transaction, { name: 'transaction', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Transaction | null> {
    return this.transactionsService.findById(id);
  }

  @Mutation(() => Transaction)
  @UseGuards(GqlAuthGuard)
  createTransaction(
    @Args('createTransactionInput') createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionInput);
  }

  @Mutation(() => Transaction)
  @UseGuards(GqlAuthGuard)
  postTransaction(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Transaction> {
    return this.transactionsService.postTransaction(id);
  }

  @Mutation(() => [Transaction])
  @UseGuards(GqlAuthGuard)
  transferMoney(
    @Args('transferInput') transferInput: TransferMoneyInput,
  ): Promise<Transaction[]> {
    return this.transactionsService.transferMoney(transferInput);
  }

  @Mutation(() => Transaction)
  @UseGuards(GqlAuthGuard)
  updateTransaction(
    @Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionsService.updateTransaction(updateTransactionInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteTransaction(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.transactionsService.deleteTransaction(id);
  }
}
