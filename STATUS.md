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
# Milestone v0.9 — Provider-Agnostic AI Locals + Dynamic Quest Intelligence

Implemented a server-only `GameLLMService` with OpenAI Responses and DeepSeek chat adapters, environment-selected models, normalized structured output/usage, timeout and authored fallback behavior, and one provider-selection boundary. Tea-shop owner Daw Nwe, market seller May, and neighbourhood local Ko Min share a data-driven dialogue experience with free text, suggested questions, bounded history, curated retrieval, compact persistent memory, rate limiting, diagnostics, and server-validated allowlisted intents. Quest hint selection is constrained to authored targets and existing non-AI progression remains mandatory and playable.

Security posture: no provider keys reach client code; model output cannot directly mutate authoritative economy, inventory, travel, unlock, or quest state; malformed/provider-failure responses do not trigger a second paid provider. The optional country profile field and future Explorer progression/multiplayer hooks are documented without implementing multiplayer.

## Blocking travel completion fix (2026-09-27)

- **Reproduced stop point:** at `00:00`, `TravelExperience` used an effect keyed by both `remaining` and its own `checking` flag. An authoritative response which still contained the active action (the timer/server clock edge or client clock skew) cleared `checking`; that state change immediately ran the zero-time effect again with no delay or per-action request identity. The UI consequently entered an unbounded request/render loop at `TRAVELLING` instead of representing `NOT_READY` and scheduling a retry. The generic player API also exposed no completion result, so the client could not distinguish early, completed, and recovered/idempotent responses.
- Completion now uses the action ID, permits one in-flight reconciliation per travel action, handles explicit `NOT_READY`, retries after 750 ms, backs off after network errors, and offers a manual Retry. The server remains authoritative: it compares its UTC time with `completesAt`, and bootstrap/GET still resolves elapsed sleep and travel actions while the player lock is held.
- Due travel resolution records a completed action and one `TRAVEL_COMPLETED` event, advances the destination to Bagan, and transitions `TRAVELLING` to the explicit `ARRIVAL` presentation state. Repeated reconciliation returns the same completed save without another event, fare deduction, reward, or timeline entry.
- Bagan remains intentionally non-playable. Only `ARRIVAL + BAGAN` opens the UI-only **WELCOME TO BAGAN / COMING SOON** presentation; no Bagan world, Canvas, physics, spawn, or NPC module is loaded.
