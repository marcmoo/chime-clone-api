import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountInput } from './dto/create-account.input';
import { AccountType } from '../../common/enums';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  findAllByUser(userId: string): Promise<Account[]> {
    return this.accountsRepository.find({
      where: { userId },
      relations: ['transactions', 'cards'],
    });
  }

  findById(id: string): Promise<Account | null> {
    return this.accountsRepository.findOne({
      where: { id },
      relations: ['user', 'transactions', 'cards'],
    });
  }

  async create(userId: string, createAccountInput: CreateAccountInput): Promise<Account> {
    const accountNumber = this.generateAccountNumber();
    const routingNumber = '071000013';

    const account = this.accountsRepository.create({
      userId,
      ...createAccountInput,
      accountNumber,
      routingNumber,
      balance: 0,
      apyRate: createAccountInput.accountType === AccountType.SAVINGS ? 2.0 : undefined,
    });

    return this.accountsRepository.save(account);
  }

  async updateBalance(id: string, amount: number): Promise<Account> {
    const account = await this.findById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.balance = Number(account.balance) + amount;
    return this.accountsRepository.save(account);
  }

  async deactivate(id: string): Promise<Account> {
    const account = await this.findById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.isActive = false;
    return this.accountsRepository.save(account);
  }

  private generateAccountNumber(): string {
    let result = '3';
    for (let i = 0; i < 14; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }
}
