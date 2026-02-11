# Chime Clone API

GraphQL backend for the Chime Clone banking app, built with NestJS, TypeORM, and MySQL.

## Features

- **Authentication** — JWT-based signup/login
- **Accounts** — Checking and savings accounts with balance tracking
- **Cards** — Debit and credit builder card management
- **Transactions** — Deposits, purchases, transfers, ATM withdrawals
- **Transfer** — Move money between accounts with linked debit/credit transactions

## Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS 11 | Application framework |
| GraphQL (Apollo) | API layer |
| TypeORM | Database ORM |
| MySQL | Database |
| JWT (Passport) | Authentication |
| PM2 | Process management |

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8+

### Installation

```bash
git clone https://github.com/marcmoo/chime-clone-api.git
cd chime-clone-api
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=chime_clone
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
HASH_SALT_ROUNDS=10
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

```bash
# Create the MySQL database
mysql -u root -p -e "CREATE DATABASE chime_clone;"

# Seed with sample data (also creates tables)
npm run seed
```

**Seed users:**
| Email | Password |
|-------|----------|
| john@doe.com | doe123 |
| jane@doe.com | doe123 |

### Running

```bash
# Development (with hot reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

GraphQL Playground available at `http://localhost:4000/graphql` (disabled in production).

## API Overview

### Queries
- `me` — Current authenticated user
- `myAccounts` — User's accounts with balances
- `transactions(accountId)` — Transaction history

### Mutations
- `signup` / `login` — Authentication (returns JWT)
- `createAccount` — Create checking/savings account
- `createTransaction` — Create a transaction
- `transferMoney` — Transfer between accounts
- `updateTransaction` / `deleteTransaction` — Manage transactions

## Project Structure

```
src/
  modules/
    auth/           # JWT auth (signup, login, guards)
    users/          # User entity and resolver
    accounts/       # Account management
    cards/          # Card management
    transactions/   # Transaction CRUD + transfers
  common/
    enums/          # AccountType, CardType, TransactionType, etc.
    guards/         # GqlAuthGuard
    decorators/     # @CurrentUser()
  database/
    seed/           # Database seeding
```

## Production Deployment

**Server:** Hostinger KVM 2 VPS (193.46.198.236)

### Quick Deploy

```bash
./deploy-production.sh
```

### Manual Deploy

```bash
ssh root@193.46.198.236
cd /var/www/chime-clone-api
git pull origin main
npm install
npm run build
cp .env.production .env
pm2 delete chime-api && pm2 start ecosystem.config.js --env production
pm2 save
```

### Server Details

| Component | Value |
|-----------|-------|
| Path | `/var/www/chime-clone-api` |
| PM2 name | `chime-api` |
| Port | 4000 |
| Nginx route | `/chime/graphql` |
| Database | `chime_production` |

## License

MIT
