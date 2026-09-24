# Explore Myanmar MVP implementation checklist

- [x] Inspect repository (empty Git seed; no infrastructure to preserve).
- [x] Establish Next.js/TypeScript architecture, content model, persistence boundary, and PostgreSQL schema.
- [x] Build the playable Yangon scene, third-person controls, collision, interaction registry, and day/night cycle.
- [x] Implement guest identity, authoritative API mutations, economy, discoveries, progress, and saves.
- [x] Add NPC dialogue, foods, attraction, photography challenges, quests, journal, and map.
- [x] Add server-timed sleep/travel state machine and Bagan completion flow.
- [x] Add development tools, automated game-logic tests, production checks, and operating documentation.

The vertical slice deliberately uses procedural geometry and authored content. Rendering, simulation,
content, persistence, server actions, and interface modules remain separate so production GLBs and
additional destination packs can replace content without rewriting the engine.
