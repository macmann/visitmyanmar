# Explore Myanmar

A playable, online single-player 3D travel-game vertical slice. Visitors can keep a secure browser-bound guest journey or create an account without losing that journey.

## Stack and architecture

- **Next.js / React / TypeScript / Tailwind**, with a responsive overlay UI.
- **Three.js / React Three Fiber / Drei / Rapier** for client-rendered simulation and collision.
- **Zustand** for transient UI/game presentation state; server saves are canonical.
- **PostgreSQL / Prisma** for authoritative saves, account identity, and opaque sessions.
- Node's built-in, versioned **scrypt** password hashing and 256-bit random, HTTP-only session cookies. Raw session tokens are never stored in PostgreSQL.
- `src/content` owns tuneable destinations, spots, foods, NPCs, quests, accommodation, and routes.
- `src/components/game` owns rendering and browser simulation; `src/components/ui` owns HUD and modal flows.
- `src/lib/rules.ts` contains pure clock/progression/state-machine logic; `src/app/api/player` validates and calculates authoritative mutations.

No multiplayer, payments, live ads, or AI dialogue are included.

## Run locally

Requires Node 20+.

```bash
npm install
cp .env.example .env
npm run dev
```

Create the PostgreSQL database configured by `DATABASE_URL`, then run `npx prisma migrate deploy`. Open `http://localhost:3000`, choose **Play as Guest**, click the 3D view, and use WASD, Shift, E, C, M, J, and Escape. Guest and registered sessions use the same HTTP-only cookie and survive normal browser refresh/reopen for 30 days.

### PostgreSQL / production persistence

Create a PostgreSQL database, set `DATABASE_URL`, then run:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
```

`prisma/schema.prisma` separates `User` credentials from `Player` save data and independently auditable persistent actions. Existing player rows remain guests after migration. Guest-to-account conversion links the existing player inside the same transaction that creates the user and session, so all progress and timers remain attached.

### Account security

Gameplay routes derive the player exclusively from a random session cookie; client-supplied player IDs are rejected. Cookies are HTTP-only, SameSite=Lax, expire after 30 days, and gain the Secure flag in production. Passwords must be 10–128 characters and are hashed with salted scrypt. Email is normalized to lowercase and uniquely indexed. Use HTTPS in production. Sessions are server-side and can be invalidated by **Log Out**.

Manual account check: play as a guest, earn MMK and start sleep, open **Profile → Save My Journey**, register, and refresh during the timer. Log out after it completes, sign back in, and verify the same journey. Then create a second account in a separate browser profile and verify its MMK, journal, and timers are independent.

### Complete validation runbook

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run typecheck
npm run lint
npm test
npm run build
DEV_TIMER_SCALE=0.001 npm run dev
# production smoke test (use another port if dev is still running)
npm run start
```

Open `http://localhost:3000`. In development, use Field Kit to fund/unlock test paths and set `DEV_TIMER_SCALE=0.001` **before** starting the server. Exercise discovery, repeat the same discovery/photo to confirm no duplicate reward, buy food, photograph, sleep, refresh while sleeping, wake, buy a bus ticket, refresh while travelling, and reach the Bagan Coming Soon screen. Confirm the ticket is charged once and inspect both browser and server consoles. For a genuine end-to-end progression check, use the controls only to shorten timers—not to bypass progression.

## Save, authority, and clocks

The browser owns movement and presentation. The API owns MMK, rewards, energy mutation, unlocks, food purchases, and persistent actions. Requests submit action/content IDs—not reward values. One-time arrays make rewards idempotent. Important mutations go through one atomic repository write.

Game time advances through authored activities and exploration checkpoints. Persistent **sleep** and **travel** use API-created UTC `startedAt` / `completesAt` timestamps. GET and mutation requests idempotently resolve elapsed actions against server time; changing a device clock cannot finish one. `DEV_TIMER_SCALE=0.01` accelerates newly created timers locally.

## Content authoring

All authored definitions live in `src/content/game.ts`:

- **Destination/zone:** add metadata and a lazily imported scene pack, then reference its ID from routes and spots.
- **Attraction:** add a `WorldSpot` with `kind: 'attraction'`; schedules and rewards are evaluated by generic server rules.
- **Food:** append a food record containing price, restoration, reward, description, and ID. The menu renders it automatically.
- **NPC:** add dialogue under the matching spot ID in `NPCS`; `Dialogue` consumes the definition.
- **Quest:** append to `QUESTS` and connect completion criteria in the rule evaluator.
- **Photo challenge:** register its ID/region criteria in the photography rules, then point attraction content to it.

Do not place economy values in scene meshes. Expand the content schemas when adding destinations rather than branching throughout rendering code.

## Assets and performance

The vertical slice uses original procedural geometry only, so there are no external asset licenses. `World.tsx` provides reusable patterns for buildings, foliage, roads, lamps/markers, and landmark forms. Replace a procedural group with a Drei `useGLTF` component behind the same transform/interaction definition. Export Blender work as optimized GLB, merge static meshes, reuse materials, compress textures, and add LODs. Destination scene packs should remain dynamically imported; never preload future cities.

The scene uses modest geometry, fog-limited draw distance, one shadow-casting sun, reusable materials, and static Rapier bodies. Production asset packs should use instancing and KTX2/Draco where appropriate.

## Development tools

The Field Kit menu exposes development-only MMK, Bagan unlock, and sunset controls. The API rejects every `dev` action in production. It also supports timer completion internally for automated testing. Set `DEV_TIMER_SCALE` before starting the server to accelerate sleep/travel.

## Extension points

`AdSlot` uses semantic placement labels (`SLEEP_SCREEN`, `TRAVEL_SCREEN`, `MAP`) but serves no ads. Inventory/equipment already use named slots and contain no gameplay advantage. Audio, screenshot upload, analytics, account attachment, and premium entitlement providers should be adapters—not scene concerns. Premium currency must never share the MMK ledger.

## Assumptions

Opening hours and prices are fictional **game data**, not real visitor guidance. The landmark is a respectful, abstract Yangon-inspired garden rather than a factual reconstruction. All MMK is fictional gameplay currency. Real action duration follows the requested 10× conversion; development acceleration is opt-in.

## Playable / Visual Alpha v0.2

Yangon is now an intentionally composed compact district with a guesthouse quarter, tea-shop seating, market lane, crossroads, ticket station, alleys, a hidden garden viewpoint, and a skyline-scale procedural golden pagoda. The third-person controller uses camera-relative WASD movement, smooth acceleration and turning, Shift jogging, drag-to-orbit camera control, and wheel zoom.

The travel journal (`J`), field map (`M`), camera mode (`C`, then Space), contextual interaction (`E`), and settings panel remain presentation layers over the existing server-authoritative economy and persistent sleep/travel state. Graphics and audio preferences are stored locally. Future licensed/commissioned GLBs and audio should be registered in `src/content/assets.ts`; missing production assets are never requested, and procedural scene modules remain the alpha fallback.
