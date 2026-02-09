import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { FilterTransactionsInput } from './dto/filter-transactions.input';
import { TransferMoneyInput } from './dto/transfer-money.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { TransactionStatus, TransactionType } from '../../common/enums';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly accountsService: AccountsService,
  ) {}

  async findByAccount(
    accountId: string,
    filters?: FilterTransactionsInput,
  ): Promise<Transaction[]> {
    const qb = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.accountId = :accountId', { accountId })
      .orderBy('transaction.transactionDate', 'DESC');

    if (filters?.transactionType) {
      qb.andWhere('transaction.transactionType = :transactionType', {
        transactionType: filters.transactionType,
      });
    }

    if (filters?.status) {
      qb.andWhere('transaction.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.startDate) {
      qb.andWhere('transaction.transactionDate >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      qb.andWhere('transaction.transactionDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters?.limit) {
      qb.limit(filters.limit);
    }

    return qb.getMany();
  }

  findById(id: string): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({
      where: { id },
      relations: ['account'],
    });
  }

  async create(createTransactionInput: CreateTransactionInput): Promise<Transaction> {
    const account = await this.accountsService.findById(createTransactionInput.accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const transaction = this.transactionsRepository.create({
      ...createTransactionInput,
      transactionDate: createTransactionInput.transactionDate
        ? new Date(createTransactionInput.transactionDate)
        : new Date(),
      status: TransactionStatus.PENDING,
    });

    const saved = await this.transactionsRepository.save(transaction);

    await this.accountsService.updateBalance(
      createTransactionInput.accountId,
      createTransactionInput.amount,
    );

    return saved;
  }

  async postTransaction(id: string): Promise<Transaction> {
    const transaction = await this.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    transaction.status = TransactionStatus.POSTED;
    transaction.postedDate = new Date();
    return this.transactionsRepository.save(transaction);
  }

  async transferMoney(transferInput: TransferMoneyInput): Promise<Transaction[]> {
    const { fromAccountId, toAccountId, amount, description } = transferInput;

    if (fromAccountId === toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    const fromAccount = await this.accountsService.findById(fromAccountId);
    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    const toAccount = await this.accountsService.findById(toAccountId);
    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }

    if (fromAccount.userId !== toAccount.userId) {
      throw new BadRequestException('Both accounts must belong to the same user');
    }

    if (Number(fromAccount.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const now = transferInput.transactionDate
      ? new Date(transferInput.transactionDate)
      : new Date();

    const debit = this.transactionsRepository.create({
      accountId: fromAccountId,
      transactionType: TransactionType.TRANSFER,
      amount: -amount,
      merchantName: description || `Transfer to ${toAccount.accountType}`,
      description: description || `Transfer to ${toAccount.accountType}`,
      transactionDate: now,
      status: TransactionStatus.PENDING,
    });

    const credit = this.transactionsRepository.create({
      accountId: toAccountId,
      transactionType: TransactionType.TRANSFER,
      amount: amount,
      merchantName: description || `Transfer from ${fromAccount.accountType}`,
      description: description || `Transfer from ${fromAccount.accountType}`,
      transactionDate: now,
      status: TransactionStatus.PENDING,
    });

    const savedDebit = await this.transactionsRepository.save(debit);
    const savedCredit = await this.transactionsRepository.save(credit);

    await this.accountsService.updateBalance(fromAccountId, -amount);
    await this.accountsService.updateBalance(toAccountId, amount);

    return [savedDebit, savedCredit];
  }

  async updateTransaction(
    updateInput: UpdateTransactionInput,
  ): Promise<Transaction> {
    const transaction = await this.findById(updateInput.id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (updateInput.amount !== undefined) {
      const delta = updateInput.amount - Number(transaction.amount);
      await this.accountsService.updateBalance(transaction.accountId, delta);
      transaction.amount = updateInput.amount;
    }

    if (updateInput.merchantName !== undefined) {
      transaction.merchantName = updateInput.merchantName;
    }

    if (updateInput.description !== undefined) {
      transaction.description = updateInput.description;
    }

    return this.transactionsRepository.save(transaction);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const transaction = await this.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Reverse balance for this transaction
    await this.accountsService.updateBalance(
      transaction.accountId,
      -Number(transaction.amount),
    );

    // If this is a transfer, also delete the paired transaction on the other account
    if (transaction.transactionType === TransactionType.TRANSFER) {
      const paired = await this.transactionsRepository.findOne({
        where: {
          transactionType: TransactionType.TRANSFER,
          transactionDate: transaction.transactionDate,
          amount: -Number(transaction.amount) as any,
        },
        relations: ['account'],
      });

      if (paired && paired.id !== transaction.id) {
        await this.accountsService.updateBalance(
          paired.accountId,
          -Number(paired.amount),
        );
        await this.transactionsRepository.remove(paired);
      }
    }

    await this.transactionsRepository.remove(transaction);
    return true;
  }
}
