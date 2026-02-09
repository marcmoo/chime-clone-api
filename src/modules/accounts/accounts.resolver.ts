import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { AccountsService } from './accounts.service';
import { CreateAccountInput } from './dto/create-account.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query(() => [Account], { name: 'myAccounts' })
  @UseGuards(GqlAuthGuard)
  findAllByUser(@CurrentUser() user: User): Promise<Account[]> {
    return this.accountsService.findAllByUser(user.id);
  }

  @Query(() => Account, { name: 'account', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Account | null> {
    return this.accountsService.findById(id);
  }

  @Mutation(() => Account)
  @UseGuards(GqlAuthGuard)
  createAccount(
    @CurrentUser() user: User,
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
  ): Promise<Account> {
    return this.accountsService.create(user.id, createAccountInput);
  }

  @Mutation(() => Account)
  @UseGuards(GqlAuthGuard)
  deactivateAccount(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Account> {
    return this.accountsService.deactivate(id);
  }
}
