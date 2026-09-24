# MVP validation status

## Hardened implementation

- PostgreSQL is the mandatory production store. Development can explicitly use `STORE_ADAPTER=json` (and falls back to it when `DATABASE_URL` is absent).
- Player mutation, ticket debit, and sleep/travel creation run in a serializable Prisma transaction with a locked player row and retry on write conflicts.
- Active sleep/travel actions are also recorded in `PersistentAction`; resolution is idempotent and recorded with `resolvedAt`.
- API-created UTC timestamps remain authoritative: loading a save resolves elapsed sleep/travel on the server, never from a client completion request.
- The JSON adapter serializes mutations inside one development process and is not enabled in production.
- A checked-in PostgreSQL migration is available under `prisma/migrations`.

## Validation performed in this environment (2026-09-24)

- Repository inspection: MVP files from the merged vertical-slice commit `678e0f8` are present. The requested object `eedc903` is not present in the repository object database.
- GitHub publication could not be verified or performed because this checkout has no configured Git remote.
- Dependency installation was attempted but the environment proxy returned HTTP 403 for `registry.npmjs.org`.
- PostgreSQL client/server binaries are unavailable in this container.
- Consequently Prisma generation/migration, typecheck, lint, Vitest, production build, browser automation, and live console inspection remain to be executed in an environment with npm registry access and PostgreSQL.

## Remaining validation gate

Follow the README validation runbook on a machine with Node 20+, npm registry access, and PostgreSQL. Do not call the MVP production-validated until every command and manual core-loop check there passes.
