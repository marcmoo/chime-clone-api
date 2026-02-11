import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';
import { Account } from '../../modules/accounts/entities/account.entity';
import { Transaction } from '../../modules/transactions/entities/transaction.entity';
import { Card } from '../../modules/cards/entities/card.entity';
import { AccountType, CardType, TransactionType, TransactionStatus } from '../../common/enums';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Account) private readonly accountsRepository: Repository<Account>,
    @InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(Card) private readonly cardsRepository: Repository<Card>,
  ) {}

  async seed(): Promise<void> {
    // Clear all tables (respecting FK order)
    const dataSource = this.usersRepository.manager.connection;
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('TRUNCATE TABLE `transactions`');
    await dataSource.query('TRUNCATE TABLE `cards`');
    await dataSource.query('TRUNCATE TABLE `accounts`');
    await dataSource.query('TRUNCATE TABLE `users`');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Cleared all tables.');

    const hashedPassword = await bcrypt.hash('doe123', 10);

    // Create users
    const john = await this.usersRepository.save(
      this.usersRepository.create({
        email: 'john@doe.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-123-4567',
        dateOfBirth: '1990-01-15',
        addressStreet: '123 Main St',
        addressCity: 'San Francisco',
        addressState: 'CA',
        addressZip: '94102',
      }),
    );

    const jane = await this.usersRepository.save(
      this.usersRepository.create({
        email: 'jane@doe.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '555-987-6543',
        dateOfBirth: '1992-06-20',
        addressStreet: '456 Oak Ave',
        addressCity: 'Los Angeles',
        addressState: 'CA',
        addressZip: '90001',
      }),
    );

    console.log('Created users: John Doe, Jane Doe');

    // Create accounts
    const johnChecking = await this.accountsRepository.save(
      this.accountsRepository.create({
        userId: john.id,
        accountType: AccountType.CHECKING,
        accountNumber: '300000000000001',
        routingNumber: '071000013',
        balance: 2450.75,
      }),
    );

    const johnSavings = await this.accountsRepository.save(
      this.accountsRepository.create({
        userId: john.id,
        accountType: AccountType.SAVINGS,
        accountNumber: '300000000000002',
        routingNumber: '071000013',
        balance: 10000.0,
        apyRate: 2.0,
      }),
    );

    const janeChecking = await this.accountsRepository.save(
      this.accountsRepository.create({
        userId: jane.id,
        accountType: AccountType.CHECKING,
        accountNumber: '300000000000003',
        routingNumber: '071000013',
        balance: 3200.5,
      }),
    );

    console.log('Created accounts for John (checking + savings) and Jane (checking)');

    // Create cards
    await this.cardsRepository.save(
      this.cardsRepository.create({
        userId: john.id,
        accountId: johnChecking.id,
        cardType: CardType.DEBIT,
        lastFourDigits: '4532',
        expirationDate: '02/29',
        cardholderName: 'John Doe',
      }),
    );

    await this.cardsRepository.save(
      this.cardsRepository.create({
        userId: john.id,
        accountId: johnChecking.id,
        cardType: CardType.CREDIT_BUILDER,
        lastFourDigits: '8891',
        expirationDate: '05/29',
        cardholderName: 'John Doe',
      }),
    );

    await this.cardsRepository.save(
      this.cardsRepository.create({
        userId: jane.id,
        accountId: janeChecking.id,
        cardType: CardType.DEBIT,
        lastFourDigits: '7214',
        expirationDate: '08/29',
        cardholderName: 'Jane Doe',
      }),
    );

    console.log('Created cards for John (debit + credit builder) and Jane (debit)');

    // Create transactions
    const now = new Date();
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    await this.transactionsRepository.save([
      this.transactionsRepository.create({
        accountId: johnChecking.id,
        transactionType: TransactionType.DIRECT_DEPOSIT,
        amount: 2500.0,
        description: 'Payroll - Acme Corp',
        status: TransactionStatus.POSTED,
        transactionDate: daysAgo(14),
        postedDate: daysAgo(14),
      }),
      this.transactionsRepository.create({
        accountId: johnChecking.id,
        transactionType: TransactionType.PURCHASE,
        amount: -42.5,
        merchantName: 'Whole Foods Market',
        description: 'Groceries',
        status: TransactionStatus.POSTED,
        transactionDate: daysAgo(7),
        postedDate: daysAgo(6),
      }),
      this.transactionsRepository.create({
        accountId: johnChecking.id,
        transactionType: TransactionType.PURCHASE,
        amount: -15.99,
        merchantName: 'Netflix',
        description: 'Monthly subscription',
        status: TransactionStatus.POSTED,
        transactionDate: daysAgo(5),
        postedDate: daysAgo(4),
      }),
      this.transactionsRepository.create({
        accountId: johnChecking.id,
        transactionType: TransactionType.ATM_WITHDRAWAL,
        amount: -60.0,
        description: 'ATM Withdrawal',
        status: TransactionStatus.POSTED,
        transactionDate: daysAgo(3),
        postedDate: daysAgo(3),
      }),
      this.transactionsRepository.create({
        accountId: johnChecking.id,
        transactionType: TransactionType.PURCHASE,
        amount: -8.75,
        merchantName: 'Starbucks',
        description: 'Coffee',
        status: TransactionStatus.PENDING,
        transactionDate: daysAgo(1),
      }),
      this.transactionsRepository.create({
        accountId: johnSavings.id,
        transactionType: TransactionType.TRANSFER,
        amount: 500.0,
        description: 'Transfer from checking',
        status: TransactionStatus.POSTED,
        transactionDate: daysAgo(10),
        postedDate: daysAgo(10),
      }),
      this.transactionsRepository.create({
        accountId: janeChecking.id,
        transactionType: TransactionType.DIRECT_DEPOSIT,
        amount: 3200.5,
        description: 'Payroll - Tech Inc',
        status: TransactionStatus.POSTED,
        transactionDate: daysAgo(7),
        postedDate: daysAgo(7),
      }),
    ]);

    console.log('Created sample transactions');
    console.log('Seeding complete!');
  }
}
