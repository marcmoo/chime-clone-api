# Chime Clone API

## Project Overview
NestJS GraphQL backend for the Chime Clone banking app. Provides authentication, user management, accounts, cards, and transactions via a GraphQL API.

## Tech Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** NestJS 11
- **API:** GraphQL (Apollo Server)
- **Database:** MySQL with TypeORM
- **Auth:** JWT (Passport)

## Project Structure
```
src/
  modules/
    auth/         # Login/signup, JWT strategy, guards
    users/        # User CRUD, entity, resolver
    accounts/     # Checking/savings accounts
    cards/        # Debit/credit builder cards
    transactions/ # Transaction history
  common/
    enums/        # Shared enums (AccountType, CardType, etc.)
    guards/       # GqlAuthGuard
    decorators/   # CurrentUser decorator
  database/
    seed/         # Database seeding (run-seed.ts, seed.service.ts)
```

## Key Commands
```bash
npm run start:dev     # Development with hot reload
npm run build         # Compile TypeScript to dist/
npm run start:prod    # Production (node dist/main)
npm run seed          # Seed database (creates tables + sample data)
npm run test          # Unit tests
npm run test:e2e      # E2E tests
```

## Environment Variables
Defined in `.env` (local) or `.env.production` (server):
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_EXPIRATION`
- `HASH_SALT_ROUNDS`
- `PORT` (default: 4000)
- `CORS_ORIGIN` (frontend URL)
- `NODE_ENV` (production disables synchronize + playground)

## Production Deployment
- **Server:** Hostinger KVM 2 VPS (193.46.198.236)
- **Path:** `/var/www/chime-clone-api`
- **Process manager:** PM2 (name: `chime-api`)
- **Reverse proxy:** Nginx at `/chime/graphql`
- **Database:** MySQL `chime_production`
- **Deploy script:** `./deploy-production.sh`

## Conventions
- Entity files: `*.entity.ts` with `@Entity('table_name')` decorator
- Resolvers handle GraphQL queries/mutations
- Services contain business logic
- Guards protect routes via `@UseGuards(GqlAuthGuard)`
- `@CurrentUser()` decorator extracts user from JWT
- TypeORM `synchronize` is OFF in production — use seed script for schema changes
