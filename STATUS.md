# MVP validation status

## Blocking avatar/position bugfix (2026-09-27)

- **Shoe root cause:** the procedural shoes were static children of the avatar root while each leg animated in its own rotating group. They could match the feet in the bind/idle pose only; leg rotation necessarily separated them. Each rigid shoe is now a child of an explicit left/right foot socket inside its animated leg hierarchy, so it inherits the foot transform rather than following guessed world coordinates. The repository currently configures no humanoid GLB (`baseModel` is null), so the active runtime rig is the inspected procedural hierarchy; no independent shoe skeleton exists.
- **Rollback root cause:** every 10-second checkpoint response and 15-second background load called `setPlayer(serverPlayer)`. Those asynchronous snapshots contained the position captured when the request began, replaced the client player object on arrival, and fed that stale position back to the Rapier `RigidBody` `position` prop. Unrelated interaction responses used the same unsafe replacement path. Rapier is now the live exploration authority: background/server merges retain the current physics-authored position, while initial load and explicit location lifecycle transitions use authoritative replacement.
- **Diagnostics:** development builds log all explicit body translations plus throttled physics movement. Add `?playerDebug=1` to show physics, visual, last-saved, safe, last-write, and last-teleport values. The visual avatar is a zero-local-offset child of the Rapier body, so its diagnostic world position intentionally matches physics.
- **Persistence semantics:** autosave still sends current Rapier position and records server acknowledgements as `lastSaved`, but acknowledgements never write to the live body. Refresh still uses the server position on the one-time initial load; fall recovery and Reset Position remain explicit teleports; location exit remains an explicit authoritative server position.

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
