# MVP implementation status

## Implemented

- Persistent guest entry and autosave; validated, server-calculated economy mutations.
- Playable third-person procedural Yangon scene with Rapier collision, follow camera, roads, buildings, foliage, landmark, shops, hotel, bus stop, and interaction markers.
- Game clock, dynamic day/night light, energy, MMK, reusable interactions, NPC dialogue, three foods, landmark hours, discoveries, progression, three photo challenge IDs, map, journal/timeline, and Bagan unlock.
- Explicit `EXPLORING / SLEEPING / TRAVELLING / LONG_ACTIVITY` model; authoritative UTC sleep/travel countdowns and idempotent resolution.
- Bagan completion presentation, disabled semantic ad placements, modular avatar inventory, developer controls, content definitions, Prisma production schema, and high-risk rule tests.

## Deliberate MVP constraints / next production steps

- The local runnable adapter stores atomic JSON snapshots. Wire `server-store.ts` to Prisma transactions before multi-instance deployment.
- Procedural avatar animation is movement-driven but has no authored skeletal clips. Photography records validated metadata rather than uploading image pixels.
- Ambient audio has an extension point but no bundled recording, avoiding unlicensed media.
- Expand controller camera occlusion, formal quest criteria, accessibility/settings, Playwright browser coverage, and GLB art in the next pass.
