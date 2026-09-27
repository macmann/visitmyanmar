# Runtime asset slots

The alpha intentionally uses procedural fallbacks. Add optimized, licensed runtime files to the category directories and enable them through `src/content/assets.ts`; do not hard-code asset URLs in scene components.

## Production humanoid handoff

The game currently ships a lightweight procedural traveler so the repository has no unlicensed external dependency. A production replacement should be a local, browser-optimized GLB with one consistently named humanoid skeleton, skinned body/clothing meshes, and `Idle`, `Walk`, and `Run` clips (optional future clips: `Sleep`, `Sit`, `Eat`, `Drink`, `Photo`, `Talk`, and `Wave`). Keep the feet at model-space Y=0, face +Z, use metres, and keep textures compressed and modest. Add the licensed file under `public/assets/characters/` and set `AVATAR_ASSETS.baseModel` in `src/content/avatar.ts`; gameplay physics and preview code need no rewrite.
