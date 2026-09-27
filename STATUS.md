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

## v0.8 quest completeness, luggage, and bus travel (2026-09-27)

- **Bus Station stuck cause:** the old purchase UI sent only `action: travel`, had no request id or configured route identifiers, no pending state, and reused a generic timer overlay. Although the save mutation could enter `TRAVELLING`, the station panel provided no explicit purchase/transition contract or recovery diagnostics. The new confirmation sends `destinationId`, `transportOptionId`, and an idempotency key; the locked serializable mutation resolves fare/duration from `BUS_ROUTE`, deducts and creates the persistent action atomically, and the top-level major-state renderer replaces the station with `TravelExperience`. Development logs identify server validation, debit validation, action creation, state transition, and client presentation.
- **Luggage flow:** check-in and luggage storage are now separate actions and quest events. `luggageState` persists as `CARRYING` or `STORED_AT_GUEST_HOUSE`; Store Luggage and Collect Luggage are idempotent server mutations with pending/error UI and short presentations. Cosmetic ownership/loadout is untouched.
- **Quest audit:** all 16 reachable vertical-slice objectives map to implemented, persisted actions. Day 1 now explicitly sequences check-in, luggage, city activities, sleep, bag collection, station entry, ticket purchase, travel, and the Bagan Coming Soon finale. A development startup validator reports missing event, prerequisite, next-objective, activity, location, food, or route references. The full matrix is in `docs-quest-completeness-v0.8.md`.
- **Progression/soft-lock safety:** Bagan requires the completed core day, two photos, food, landmark discovery, and completed sleep rather than elapsed time or money. Optional item/cosmetic purchases preserve the configured 9,000 MMK ticket reserve. Sleep and travel remain mutually exclusive server-owned actions; travel additionally requires station presence, unlocked progression, and collected luggage.
- **Remaining gaps:** Bagan deliberately has no 3D world in this slice; completed travel ends at the Welcome to Bagan / Coming Soon presentation. Browser automation tooling is not bundled in this repository, so the manual browser acceptance sequence remains a release-environment check even though action/state/refresh/idempotency paths have automated domain coverage.
