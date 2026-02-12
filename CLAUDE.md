# Chime Clone API

## Project Overview
NestJS GraphQL backend for the Chime Clone banking app. Provides authentication, user management, accounts, cards, transactions, and check image uploads via GraphQL + REST APIs.

## Tech Stack
- **Runtime:** Node.js with TypeScript
- **Framework:** NestJS 11
- **API:** GraphQL (Apollo Server) + REST (file uploads)
- **Database:** MySQL with TypeORM
- **Auth:** JWT (Passport)
- **Image Processing:** sharp (compression/resize on upload)

## Project Structure
```
src/
  modules/
    auth/         # Login/signup, JWT strategy, guards
    users/        # User CRUD, entity, resolver
    accounts/     # Checking/savings accounts
    cards/        # Debit/credit builder cards
    transactions/ # Transaction history, check deposit images
    uploads/      # REST file upload (check images via multer + sharp)
  common/
    enums/        # Shared enums (AccountType, CardType, etc.)
    guards/       # GqlAuthGuard
    decorators/   # CurrentUser decorator
  database/
    seed/         # Database seeding (run-seed.ts, seed.service.ts)
migrations/       # SQL migration scripts for production
uploads/          # Uploaded files (gitignored), served statically at /uploads
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

## File Uploads (Check Deposit Images)
- **Endpoint:** `POST /uploads/check-images` (REST, not GraphQL)
- **Auth:** JWT Bearer token via `AuthGuard('jwt')`
- **Processing:** multer memoryStorage → sharp resize (max 1600px width) → JPEG quality 80
- **Storage:** `<cwd>/uploads/check-images/<uuid>.jpg`
- **Serving:** Static files at `/uploads` via `express.static` in `main.ts`
- **Limits:** 2 files max, 10MB each (pre-compression), image MIME types only
- Transaction entity has `frontImageUrl` and `backImageUrl` nullable columns
- `removeTransactionImages` mutation deletes image files from disk + nullifies DB columns
- `deleteTransaction` also cleans up associated image files before removing the record

## Production Deployment
- **Server:** Hostinger KVM 2 VPS (193.46.198.236)
- **Path:** `/var/www/chime-clone-api`
- **Process manager:** PM2 (name: `chime-api`)
- **Reverse proxy:** Nginx at `/chime/graphql` and `/chime/uploads/`
- **Database:** MySQL `chime_production`
- **Deploy script:** `./deploy-production.sh`
- **Migrations:** `migrations/` contains SQL scripts to run manually on production MySQL before deploying (e.g., `add-check-images.sql`)
- **Uploads dir:** `/var/www/chime-clone-api/uploads/check-images/` (auto-created by UploadsController on module init)

## Conventions
- Entity files: `*.entity.ts` with `@Entity('table_name')` decorator
- Resolvers handle GraphQL queries/mutations
- Services contain business logic
- Guards protect routes via `@UseGuards(GqlAuthGuard)`
- `@CurrentUser()` decorator extracts user from JWT
- TypeORM `synchronize` is OFF in production — use migration SQL scripts for schema changes
- REST endpoints (uploads) use standard NestJS controllers with `@UseGuards(AuthGuard('jwt'))`
