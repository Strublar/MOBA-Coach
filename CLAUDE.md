# MOBA-Coach — CLAUDE.md

## Project Overview

A mobile-friendly, pure client-side MOBA simulator. Two AI teams (blue vs red) play
a 5v5 match on a three-lane map. The user watches; there is no interaction beyond
pause / speed controls. The game runs entirely in the browser — no server, no login,
no data persistence.

## Tech Stack

- **React 18 + TypeScript 5** — typed entity model, declarative HUD overlay
- **HTML5 Canvas 2D** — rendering 50+ moving entities per frame; no WebGL complexity
- **Vite 5** — near-instant dev server, native TS support
- **Vitest** — shares Vite config, runs in Node without a browser
- **Tailwind CSS v3** — mobile-first utility classes for the UI shell
- **No backend** — entire simulation runs in `requestAnimationFrame` in the browser

## Key Architectural Decisions

### Simulation ↔ Renderer decoupled via GameState snapshot
`GameEngine.ts` owns all state and runs the deterministic simulation tick.
`Renderer.ts` reads a `GameState` snapshot each frame and draws it.
They are fully decoupled: tests advance the engine without touching a canvas.

### Fixed-timestep simulation
The engine ticks at a fixed interval (100 ms logical time per tick).
`GameLoop.ts` accumulates real elapsed time and calls `engine.tick(dt)` in
fixed increments. AI and physics are deterministic regardless of frame rate.

### Entity system (class-based, not ECS)
Entities are TypeScript classes with inheritance (`Entity → Hero`, `Entity → Minion`, etc.).
A full ECS would be over-engineered for 50–60 entities. `SpatialGrid.ts` handles
the performance-critical "find nearby entities" query.

### AI as a pure function (per tick)
Each hero AI tick receives a read-only snapshot of game state and returns an Action
(`move`, `attack`, `useSkill`, `retreat`). The engine applies the action.
This makes AI logic testable without running a full game loop.

### Skills as data
Skill effects are plain objects conforming to `SkillDefinition`. Heroes reference
skill IDs; `SkillSystem.ts` resolves them. Adding a new hero means adding one file
in `src/skills/heroSkills/` — no changes to the engine.

### Canvas scaling
The logical map is 1600×900 units. `Camera.ts` projects these to physical canvas
pixels using a scale factor derived from `window.innerWidth / 1600`. On portrait
mobile the map is shown with a horizontal scroll or a letterboxed zoom-to-fit mode
(configurable via `constants/game.ts: MOBILE_ORIENTATION`).

## Folder Structure

```
src/
├── main.tsx                    React entry point
├── App.tsx                     Root component: GameCanvas + HUD shell
├── constants/
│   ├── game.ts                 MAP_WIDTH, MAP_HEIGHT, TICK_MS, SPAWN_INTERVAL_MS, etc.
│   ├── heroes.ts               Hero stat templates (name, hp, damage, skill definitions)
│   └── balance.ts              Tower damage, minion HP/damage, monster XP tables
├── engine/
│   ├── GameEngine.ts           Master simulation class: tick(), getState(), reset()
│   ├── GameLoop.ts             requestAnimationFrame + fixed-timestep accumulator
│   ├── EventBus.ts             Typed publish/subscribe for game events
│   ├── SpatialGrid.ts          2D spatial hash for O(1) nearby-entity queries
│   └── GameState.ts            Serialisable snapshot of all entities
├── entities/
│   ├── Entity.ts               Abstract base: id, position, team, hp, takeDamage()
│   ├── Hero.ts                 level, xp, skills, respawnTimer
│   ├── Minion.ts               lane, pathIndex, speed, attackTimer
│   ├── Tower.ts                attackRange, attackCooldown, targetId
│   ├── Base.ts                 isNexus, ownedByTeam
│   ├── Projectile.ts           sourceId, targetId, position, speed, damage, onHit
│   └── JungleMonster.ts        campId, respawnTimer, isAggressive
├── map/
│   ├── MapLayout.ts            Lane waypoints, jungle camp positions, river bounds
│   ├── LaneManager.ts          Spawn timer per lane, MINION_SPAWNED events
│   ├── JungleCampManager.ts    Camp alive/dead/respawning state
│   └── CollisionBounds.ts      Impassable terrain rectangles
├── ai/
│   ├── AIController.ts         Per-hero entry point called by GameEngine
│   ├── HeroAI.ts               FSM: LANING | FIGHTING | RETREATING | JUNGLING | DEAD
│   ├── MinionAI.ts             Advance-and-attack walk-the-path logic
│   ├── TowerAI.ts              Target selection: heroes > siege > normal minions
│   ├── SkillAI.ts              When/where to use skill and ultimate
│   └── TeamStrategyAI.ts       Macro: lane pressure, rotation signals
├── skills/
│   ├── SkillSystem.ts          Cooldown ticking, target validation, effectFn dispatch
│   ├── SkillDefinition.ts      SkillType, TargetType, SkillDefinition interface
│   ├── effects/
│   │   ├── DamageEffect.ts
│   │   ├── HealEffect.ts
│   │   ├── SlowEffect.ts
│   │   └── StunEffect.ts
│   └── heroSkills/
│       └── index.ts + [HeroName].ts (one file per hero)
├── renderer/
│   ├── Renderer.ts             Canvas orchestrator: clears frame, calls draw* in order
│   ├── Camera.ts               World-to-screen projection, mobile scaling
│   ├── drawMap.ts              Static map cached to offscreen canvas
│   ├── drawEntities.ts         Heroes, minions, towers, monsters each frame
│   ├── drawProjectiles.ts      In-flight projectiles
│   ├── drawHealthBars.ts       HP bars above entities
│   ├── drawEffects.ts          Short-lived visual effects (explosions, floating numbers)
│   ├── drawHUD.ts              In-canvas overlays: kill counters, timer
│   └── AssetLoader.ts          Image cache with shape fallback
├── ui/
│   ├── GameCanvas.tsx          Owns <canvas>, starts GameEngine + GameLoop
│   ├── HUD.tsx                 Timer, team scores, stats drawer
│   ├── GameOverScreen.tsx      Win announcement + restart button
│   ├── SpeedControl.tsx        1× / 2× / 4× selector
│   └── MobileControls.tsx      Touch-friendly bottom bar
└── utils/
    ├── math.ts                 distance, lerp, clamp, vecNormalize, Vec2
    ├── idGen.ts                createId() factory
    ├── pathfinding.ts          advanceAlongPath() for minions and heroes
    └── logger.ts               Dev-mode logger (suppressed in production)
```

## Development Commands

```bash
npm install          # install dependencies
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # production build to dist/
npm run preview      # serve production build locally
npm run test         # Vitest in watch mode
npm run test:run     # run tests once (CI mode)
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Testing Approach

- All game logic (engine, AI, entities, skills, map, utils) has unit tests in `src/tests/`
- Tests are pure Node — no canvas, no DOM (except jsdom where needed)
- Mock the `EventBus` when testing components that publish events
- Target: every public method on `GameEngine`, every AI FSM branch, all skill effects
- Renderer and UI components are NOT unit-tested (visual regression is manual)

## Coding Conventions

- One class per file; filename matches the export name
- No default exports on utility modules; named exports only
- `src/constants/` values are `as const` — no magic numbers in logic files
- All entity positions are in logical map units (0–1600, 0–900), never pixels
- Comment non-obvious AI decisions with `// WHY: ...`

## Common Gotchas

- `GameEngine.tick()` mutates entity state in-place; **never** pass live entities
  to the renderer — always take a `GameState` snapshot first
- Tower target priority: heroes > siege minions > normal minions, nearest-first
- Hero respawn: dead heroes are NOT removed from the entity list; they have
  `alive = false` and `respawnTimer > 0`; the renderer shows a death marker
- Minion waves: `LaneManager` fires `MINION_SPAWNED` events; `GameEngine` handles
  them by creating 18 entities per wave (3 minions × 2 teams × 3 lanes)
- Projectile targets: if a target dies before impact, remove the projectile silently
  (do NOT call `onHit`)
