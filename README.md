# asset-service

NestJS + TypeORM (PostgreSQL) service for managing assets.

## Setup

```bash
npm install
cp .env.example .env         # adjust values if needed
docker compose up -d         # local PostgreSQL on 127.0.0.1:5432
npm run migration:run
npm run start:dev
```

- Health check: `GET http://localhost:3002/health`
- API docs (Swagger): `http://localhost:3002/docs` (set `DOCS_ENABLED=false` to turn off)

## Conventions

- Every response is wrapped as `{ status, message, data }` by `TransformInterceptor`;
  errors use the same shape via `AllExceptionsFilter`. Use `@ResponseMessage('...')` to
  change the message.
- Each request gets an `X-Request-Id` header (reused from the client if valid) that
  appears in the logs.
- Entities extend `BaseEntity` (`src/common/entities/base.entity.ts`) for a UUID `id`
  and `created_at` / `updated_at`, and are picked up automatically when their module
  registers them with `TypeOrmModule.forFeature`.
- The schema is managed by migrations only; keep `DATABASE_SYNCHRONIZE=false`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start in watch mode |
| `npm run build` / `npm run start:prod` | Build to `dist/` and run it |
| `npm run lint` / `npm run format` | oxlint / prettier |
| `npm test` | Unit tests (`*.spec.ts`) |
| `npm run test:e2e` | E2E tests (`test/*.e2e-spec.ts`), needs the database running |
| `npm run migration:generate` | Build, then generate a migration from entity changes |
| `npm run migration:create` | Create an empty migration |
| `npm run migration:run` / `migration:revert` / `migration:show` | Build, then apply / undo / list migrations |

The migration scripts build first and run the TypeORM CLI against
`dist/database/data-source.js`, so migration files must be in
`src/database/migrations/`.
