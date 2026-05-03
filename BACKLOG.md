# MOBA-Coach — Development Backlog

Each task is designed to be completed in one Claude Code session.
Run tasks in order; each depends on the previous being complete.
Tasks marked `[x]` are done.

---

## Task 1 — Project Scaffold

**Skill:** `init`
**Depends on:** nothing

**Prompt:**
```
Initialise a Vite + React + TypeScript project in the current directory (do not create a subdirectory).
Install the following dependencies:
  Runtime: react react-dom
  Dev: typescript vite @vitejs/plugin-react vitest @vitest/ui jsdom
       @testing-library/react @testing-library/jest-dom
       tailwindcss postcss autoprefixer
       eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

Create the following config files:
- tsconfig.json (strict mode, paths alias "@" -> "src/")
- vite.config.ts (react plugin, resolve alias "@" -> "src/")
- vitest.config.ts (environment: jsdom, globals: true, setupFiles: src/tests/setup.ts)
- tailwind.config.ts (content: ["index.html","src/**/*.{ts,tsx}"])
- postcss.config.cjs (tailwindcss + autoprefixer)
- .eslintrc.cjs (typescript + react rules)
- .gitignore (node_modules, dist, .env*)

Create index.html with:
- <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
- <meta name="apple-mobile-web-app-capable" content="yes">
- <meta name="theme-color" content="#111827">
- <title>MOBA Coach</title>
- <div id="root"> and script tag pointing to src/main.tsx

Create src/main.tsx mounting <App /> into #root with React 18 createRoot.
Create src/App.tsx returning a single <h1>MOBA Coach</h1> placeholder.
Create src/index.css with @tailwind base/components/utilities.
Create src/tests/setup.ts importing @testing-library/jest-dom.

Add npm scripts in package.json:
  dev, build, preview, test, test:run, lint, type-check
```

**Tests required:** `npm run build` and `npm run test:run` must exit 0.

---

## Task 2 — Constants and Map Layout

**Skill:** `init`
**Depends on:** Task 1

**Prompt:**
```
Create src/constants/game.ts exporting as const:
  MAP_WIDTH = 1600, MAP_HEIGHT = 900, TICK_MS = 100,
  SPAWN_INTERVAL_MS = 10000, LANE_COUNT = 3,
  TEAMS = ['blue', 'red'] as const,
  MOBILE_ORIENTATION = 'landscape',
  HERO_COUNT_PER_TEAM = 5,
  STRATEGY_INTERVAL_MS = 5000

Create src/constants/balance.ts exporting as const:
  Tower stats: TOWER_HP = 1500, TOWER_DAMAGE = 80, TOWER_ATTACK_RANGE = 200,
               TOWER_ATTACK_COOLDOWN_MS = 1200
  Base stats:  BASE_HP = 4000, BASE_DAMAGE = 60, BASE_ATTACK_RANGE = 250
  Minion stats: MINION_HP = 280, MINION_DAMAGE = 22, MINION_SPEED = 130,
                MINION_ATTACK_RANGE = 60, MINION_ATTACK_COOLDOWN_MS = 1000
  Monster stats: MONSTER_HP = 600, MONSTER_DAMAGE = 40, MONSTER_ATTACK_RANGE = 80,
                 MONSTER_RESPAWN_MS = 30000, MONSTER_XP = 80
  Hero stats:   HERO_RESPAWN_BASE_MS = 8000, HERO_ATTACK_RANGE = 90,
                HERO_ATTACK_COOLDOWN_MS = 800, XP_TO_LEVEL = [0,300,700,1300,2100]

Create src/constants/heroes.ts exporting a HERO_TEMPLATES array of 5 HeroTemplate
objects (one per archetype). Each has:
  { id, name, archetype: 'tank'|'mage'|'assassin'|'support'|'marksman',
    baseHp, baseDamage, moveSpeed, skillId, ultimateId }
Values:
  Tank (Ironclad): hp 1200, dmg 45, speed 200
  Mage (Stormcaller): hp 650, dmg 85, speed 260
  Assassin (Phantom): hp 700, dmg 95, speed 340
  Support (Warden): hp 800, dmg 40, speed 240
  Marksman (Hawkeye): hp 680, dmg 80, speed 290

Create src/utils/math.ts exporting:
  type Vec2 = { x: number; y: number }
  distance(a: Vec2, b: Vec2): number
  lerp(a: number, b: number, t: number): number
  clamp(v: number, min: number, max: number): number
  vecNormalize(v: Vec2): Vec2
  vecAdd(a: Vec2, b: Vec2): Vec2
  vecScale(v: Vec2, s: number): Vec2
  angleToTarget(from: Vec2, to: Vec2): number

Create src/map/MapLayout.ts exporting:
  LANE_PATHS: Record<'top'|'mid'|'bot', { blue: Vec2[], red: Vec2[] }>
    Each path is an ordered array of ≥5 waypoints in logical map units (0–1600, 0–900).
    Blue paths go left→right, red paths right→left (mirror).
    top lane: y ≈ 150, mid lane: y ≈ 450, bot lane: y ≈ 750
  TOWER_POSITIONS: Record<'top'|'mid'|'bot', { blue: Vec2[], red: Vec2[] }>
    2 towers per lane per team. Blue towers at x ≈ 350 and x ≈ 600,
    red towers at x ≈ 1000 and x ≈ 1250.
  BASE_POSITIONS: { blue: Vec2, red: Vec2 }
    blue: { x: 120, y: 450 }, red: { x: 1480, y: 450 }
  JUNGLE_CAMPS: Array<{ id: string, position: Vec2, team: 'neutral' }>
    4 camps: blue top jungle (~350,300), blue bot jungle (~350,600),
             red top jungle (~1250,300), red bot jungle (~1250,600)
  RIVER_BOUNDS: { minY: 400, maxY: 500 }

Create src/tests/utils/math.test.ts and src/tests/map/MapLayout.test.ts.
Math tests: distance between (0,0) and (3,4) = 5; lerp(0,10,0.5)=5;
clamp(-1,0,1)=0; clamp(2,0,1)=1; vecNormalize({x:3,y:4}).x ≈ 0.6.
MapLayout tests: each lane path has ≥5 waypoints; JUNGLE_CAMPS.length = 4;
BASE_POSITIONS.blue.x < BASE_POSITIONS.red.x.
```

**Tests required:** All math utilities and map layout assertions pass.

---

## Task 3 — Entity Base Classes

**Skill:** `init`
**Depends on:** Task 2

**Prompt:**
```
Create src/utils/idGen.ts exporting createId(): string (auto-incrementing, e.g. "e_1", "e_2").
Create src/utils/logger.ts exporting log(...args) that calls console.log only when
import.meta.env.DEV is true.

Create src/entities/Entity.ts — abstract class:
  Fields: id: string, position: Vec2, team: 'blue'|'red'|'neutral', hp: number,
          maxHp: number, alive: boolean
  Methods:
    takeDamage(amount: number): void  — reduces hp, clamps to 0, sets alive=false if hp≤0
    heal(amount: number): void        — increases hp, clamps to maxHp
    abstract update(dt: number): void

Create src/entities/Hero.ts extending Entity:
  Extra fields: level: number, xp: number, respawnTimer: number, skillCooldown: number,
                ultimateCooldown: number, kills: number, deaths: number,
                slowFactor: number (0=no slow, 1=fully stopped), stunTimer: number
  Extra methods:
    isRespawning: boolean (getter, true when alive=false and respawnTimer>0)
    gainXp(amount: number): void — adds xp, levels up when threshold reached (from balance.ts)

Create src/entities/Minion.ts extending Entity:
  Extra fields: lane: 'top'|'mid'|'bot', pathIndex: number, speed: number,
                attackTimer: number, attackRange: number

Create src/entities/Tower.ts extending Entity:
  Extra fields: attackRange: number, attackCooldown: number, lane: 'top'|'mid'|'bot',
                towerIndex: number (0=nearer base, 1=further)

Create src/entities/Base.ts extending Entity:
  Extra fields: isNexus: boolean

Create src/entities/JungleMonster.ts extending Entity:
  Extra fields: campId: string, respawnTimer: number, isAggressive: boolean
  update(dt): decrements respawnTimer; when it reaches 0 sets alive=true, resets hp

Create src/entities/Projectile.ts (NOT extending Entity — plain class):
  Fields: id: string, sourceId: string, targetId: string, position: Vec2,
          speed: number, damage: number, onHit: () => void, isDone: boolean

Create src/tests/entities/Hero.test.ts:
  - takeDamage reduces hp; hp never goes below 0; alive becomes false at 0 hp
  - heal restores hp but never exceeds maxHp
  - gainXp accumulates; hero levels up when XP_TO_LEVEL threshold crossed
  - respawnTimer getter returns true when alive=false and respawnTimer>0

Create src/tests/entities/Minion.test.ts:
  - takeDamage sets alive=false when hp reaches 0

Create src/tests/entities/Tower.test.ts:
  - attackCooldown can be set and read correctly
```

**Tests required:** Entity death, HP clamp, heal cap, XP level-up, respawn flag.

---

## Task 4 — EventBus and SpatialGrid

**Skill:** `init`
**Depends on:** Task 3

**Prompt:**
```
Create src/engine/EventBus.ts:
  Export a GameEventType enum:
    ENTITY_DAMAGED, ENTITY_KILLED, TOWER_DESTROYED, BASE_DAMAGED,
    MINION_SPAWNED, HERO_RESPAWNED, SKILL_USED, GAME_OVER

  Export typed payload interfaces for each event type, e.g.:
    EntityDamagedPayload { entityId, attackerId, damage, remainingHp }
    EntityKilledPayload  { entityId, killerId, entityType }
    GameOverPayload      { winner: 'blue'|'red', durationMs: number }
    etc.

  Export a GameEvent union type and an EventBus class with:
    on<T extends GameEventType>(type: T, listener): void
    off<T extends GameEventType>(type: T, listener): void
    emit<T extends GameEventType>(type: T, payload): void
    clear(): void

Create src/engine/SpatialGrid.ts:
  Constructor: (cellSize: number, mapWidth: number, mapHeight: number)
  Methods:
    insert(entity: Entity): void
    remove(entity: Entity): void
    update(entity: Entity): void  — re-inserts at new position
    queryRadius(center: Vec2, radius: number): Entity[]
    clear(): void
  Implementation: hash entity position to grid cell; store entity refs per cell;
  queryRadius checks all cells that overlap the circle bounding box.

Create src/tests/engine/EventBus.test.ts:
  - emit triggers all registered listeners with correct payload
  - off unregisters a listener (it stops receiving events)
  - emitting with no listeners does not throw
  - multiple listeners on the same event all fire

Create src/tests/engine/SpatialGrid.test.ts:
  - insert then queryRadius returns entity within range
  - entity outside radius is not returned
  - removed entity is not returned after remove()
  - update() moves entity to new cell (old position no longer matches)
```

**Tests required:** All four EventBus and all four SpatialGrid scenarios.

---

## Task 5 — Skills System

**Skill:** `init`
**Depends on:** Task 4

**Prompt:**
```
Create src/skills/SkillDefinition.ts:
  export enum SkillType { DAMAGE = 'DAMAGE', HEAL = 'HEAL', SLOW = 'SLOW', STUN = 'STUN' }
  export enum TargetType { SINGLE = 'SINGLE', AREA = 'AREA', SELF = 'SELF' }
  export interface SkillDefinition {
    id: string
    name: string
    type: SkillType
    targetType: TargetType
    range: number
    radius?: number           // for AREA skills
    cooldownMs: number
    baseDamage?: number
    healAmount?: number
    slowFactor?: number       // 0–1, fraction of speed removed
    slowDurationMs?: number
    stunDurationMs?: number
    chainCount?: number       // for chain lightning style skills
    effectFn: EffectFn
  }
  export type EffectFn = (source: Entity, targets: Entity[], allNearby: Entity[]) => void

Create src/skills/effects/DamageEffect.ts:
  export function createDamageEffect(damage: number): EffectFn
  Applies flat damage to each target. Emits ENTITY_DAMAGED via a passed EventBus.

Create src/skills/effects/HealEffect.ts:
  export function createHealEffect(amount: number): EffectFn
  Calls entity.heal(amount) on each target.

Create src/skills/effects/SlowEffect.ts:
  export function createSlowEffect(factor: number, durationMs: number): EffectFn
  Sets target.slowFactor and schedules (via setTimeout OR via a timed status)
  to clear it after durationMs. Prefer a status-based approach (add to entity.activeEffects).

Create src/skills/effects/StunEffect.ts:
  export function createStunEffect(durationMs: number): EffectFn
  Sets target.stunTimer = durationMs. Engine decrements stunTimer each tick.

Create src/skills/SkillSystem.ts:
  Constructor: (eventBus: EventBus)
  Methods:
    tickCooldowns(heroId: string, dt: number): void
    canUseSkill(hero: Hero, isUltimate: boolean): boolean
    useSkill(hero: Hero, isUltimate: boolean, target: Entity | null, nearby: Entity[]): boolean
      — validates cooldown, resolves targets based on targetType, calls effectFn, resets cooldown

Create src/skills/heroSkills/ with the following files (each exports { skill, ultimate }):

  Ironclad.ts (tank):
    skill:    Shield Bash — STUN SINGLE range=100 cooldown=8000 stun=1000ms
    ultimate: Earthquake  — STUN AREA  range=0 radius=250 cooldown=60000 stun=2000ms

  Stormcaller.ts (mage):
    skill:    Chain Lightning — DAMAGE SINGLE range=400 cooldown=6000 dmg=120 chain=3
    ultimate: Meteor          — DAMAGE AREA   range=600 radius=200 cooldown=45000 dmg=280

  Phantom.ts (assassin):
    skill:    Shadow Dash — DAMAGE SINGLE range=300 cooldown=10000 dmg=160
              (teleport effect: set hero.position to just behind target before dealing damage)
    ultimate: Execute     — DAMAGE SINGLE range=200 cooldown=50000
              (damage = 40% of target's (maxHp - hp))

  Warden.ts (support):
    skill:    Mend       — HEAL SINGLE range=350 cooldown=8000 heal=200
              (targets lowest-HP ally within range, or self if none)
    ultimate: Sanctuary  — HEAL AREA   range=0 radius=300 cooldown=55000 heal=350
              (heals all allies in radius)

  Hawkeye.ts (marksman):
    skill:    Piercing Shot — SLOW SINGLE range=500 cooldown=7000 slow=0.4 duration=2000ms
    ultimate: Snipe         — DAMAGE SINGLE range=900 cooldown=40000 dmg=300

Create src/skills/heroSkills/index.ts re-exporting all five hero skill bundles as HERO_SKILLS
map keyed by hero id.

Create src/tests/skills/SkillSystem.test.ts:
  - useSkill fires effectFn and sets cooldown > 0
  - canUseSkill returns false while cooldown > 0
  - tickCooldowns reduces cooldown; canUseSkill returns true when it reaches 0
  - AREA skill hits all entities within radius, not outside

Create src/tests/skills/effects.test.ts:
  - DamageEffect reduces target hp
  - HealEffect increases hp but does not exceed maxHp
  - StunEffect sets stunTimer on target
  - Execute damage = 40% of (maxHp - hp) not a flat value
```

**Tests required:** Cooldown gating, AOE radius filtering, heal cap, execute formula.

---

## Task 6 — Map and Lane Managers

**Skill:** `init`
**Depends on:** Task 5

**Prompt:**
```
Create src/utils/pathfinding.ts:
  Export function advanceAlongPath(
    position: Vec2,
    pathIndex: number,
    path: Vec2[],
    speed: number,
    dt: number
  ): { newPosition: Vec2, newPathIndex: number, reachedEnd: boolean }
  Logic: move toward path[pathIndex] by speed*(dt/1000) units per call.
  When distance to waypoint < 4, increment pathIndex.
  When pathIndex >= path.length, return reachedEnd=true.

Create src/map/LaneManager.ts:
  Constructor: (eventBus: EventBus)
  State: spawnTimers per lane (initialised to 0)
  Methods:
    tick(dt: number): void
      — advances all timers; when any timer >= SPAWN_INTERVAL_MS,
        emit MINION_SPAWNED for that lane (both teams), reset timer
    reset(): void

Create src/map/JungleCampManager.ts:
  Manages 4 camps from JUNGLE_CAMPS.
  State per camp: { alive: boolean, respawnTimer: number, monster: JungleMonster | null }
  Methods:
    tick(dt: number): void — decrements respawn timers, revives camps
    killCamp(campId: string): void — sets alive=false, starts MONSTER_RESPAWN_MS timer
    getAliveCamps(): JungleMonster[]
    getCampState(campId: string): CampState
    reset(): void

Create src/map/CollisionBounds.ts:
  Export COLLISION_RECTS: Array<{ x, y, width, height }> representing impassable zones
  (river centre strip, base walls). Keep simple — just river and base zones.

Create src/tests/map/LaneManager.test.ts:
  - timer starts at 0; no spawn event before SPAWN_INTERVAL_MS
  - exactly at SPAWN_INTERVAL_MS, MINION_SPAWNED events fire for all 3 lanes
  - timer resets to 0 after each spawn wave

Create src/tests/utils/pathfinding.test.ts:
  - entity advances toward next waypoint each call
  - pathIndex increments when waypoint is reached (distance < 4)
  - reachedEnd is true when pathIndex >= path.length
  - entity does not overshoot the final waypoint
```

**Tests required:** Timer-based spawn trigger, path advancement, waypoint increment, end detection.

---

## Task 7 — Core Game Engine

**Skill:** `init`
**Depends on:** Task 6

**Prompt:**
```
Create src/engine/GameState.ts:
  export interface GameState {
    tick: number
    gameTimeMs: number
    winner: 'blue' | 'red' | null
    heroes: Hero[]
    minions: Minion[]
    towers: Tower[]
    bases: Base[]
    monsters: JungleMonster[]
    projectiles: Projectile[]
    towerCounts: { blue: number; red: number }
    heroStats: Record<string, { kills: number; deaths: number }>
  }

Create src/engine/GameEngine.ts as the master simulation class.
Constructor should:
  1. Create EventBus, SpatialGrid (cell size 100), SkillSystem, LaneManager, JungleCampManager
  2. Create 10 heroes: for each team, one hero per HERO_TEMPLATES entry.
     Blue heroes start near BASE_POSITIONS.blue, red near BASE_POSITIONS.red.
     Assign each hero its skills from HERO_SKILLS.
  3. Create 12 towers: 2 per lane per team at TOWER_POSITIONS coordinates.
  4. Create 2 bases at BASE_POSITIONS.
  5. Create 4 jungle monsters (one per JUNGLE_CAMPS entry).
  6. Initialise GameState snapshot.
  7. Subscribe to ENTITY_KILLED to track kills/deaths and TOWER_DESTROYED to update towerCounts.
  8. Subscribe to MINION_SPAWNED to create minion entities.

Methods:
  tick(dt: number): void
    Steps (in order):
    1. Increment tick counter and gameTimeMs
    2. laneManager.tick(dt) — may emit MINION_SPAWNED
    3. jungleCampManager.tick(dt)
    4. For each alive tower: run TowerAI.update() (stub for now — add in Task 8)
    5. For each alive minion: run MinionAI.update() (stub for now — add in Task 8)
    6. For each hero: if alive run HeroAI.update() stub; if dead decrement respawnTimer,
       respawn when timer ≤ 0 (reset hp, set alive=true, emit HERO_RESPAWNED)
    7. Advance all projectiles toward targets; call onHit and remove when arrived or target dead
    8. Decrement stunTimers and slowTimers on all entities
    9. Update SpatialGrid for all moved entities
    10. Check win condition: if a base hp ≤ 0, emit GAME_OVER, set winner
    11. Snapshot all entities to gameState

  getState(): GameState — returns latest snapshot
  reset(): void — recreates all entities, resets timers, clears eventBus
  setSpeed(multiplier: 1 | 2 | 4): void — stored, used by GameLoop

Create src/tests/engine/GameEngine.test.ts:
  - After construction: 10 heroes exist all alive; 12 towers; 2 bases; 4 monsters
  - After SPAWN_INTERVAL_MS / TICK_MS ticks: minions exist in all 3 lanes for both teams
  - Manually setting a base hp to 0 and ticking: GAME_OVER event fires, winner is set
  - reset() restores initial hero count and all entities alive
  - Dead hero's respawnTimer decrements each tick; hero revives when timer reaches 0
```

**Tests required:** All five scenarios above.

---

## Task 8 — Minion and Tower AI

**Skill:** `init`
**Depends on:** Task 7

**Prompt:**
```
Create src/ai/MinionAI.ts:
  Export function updateMinion(minion: Minion, grid: SpatialGrid, bases: Base[],
                                eventBus: EventBus, dt: number): void
  Logic per tick:
    1. If minion is stunned (stunTimer > 0): do nothing
    2. Query grid for enemies within minion.attackRange * 2
    3. If enemy found:
       a. Move toward nearest enemy (not along path — direct movement)
       b. If within attackRange and attackTimer <= 0:
          deal damage via enemy.takeDamage(); reset attackTimer; emit ENTITY_DAMAGED
          if enemy.alive === false emit ENTITY_KILLED
    4. Else: advance along lane path using advanceAlongPath()
    5. If reachedEnd: deal damage to enemy base, emit BASE_DAMAGED, mark minion done (alive=false)
    Target priority when querying: towers > minions > heroes (all enemy team)

Create src/ai/TowerAI.ts:
  Export function updateTower(tower: Tower, grid: SpatialGrid, projectiles: Projectile[],
                               eventBus: EventBus, dt: number): void
  Logic per tick:
    1. Decrement tower.attackCooldown by dt
    2. Query grid for enemies within tower.attackRange (only alive entities, enemy team)
    3. Sort by priority: heroes first, then minions, then monsters; within each group nearest first
    4. If target found and attackCooldown <= 0:
       a. Create a Projectile from tower to target (speed=600, damage from TOWER_DAMAGE)
       b. Push to projectiles array
       c. Reset attackCooldown to TOWER_ATTACK_COOLDOWN_MS
    5. Towers never move

Update src/engine/GameEngine.ts tick() to call MinionAI.updateMinion and
TowerAI.updateTower for each alive entity.

Create src/tests/ai/TowerAI.test.ts:
  - Tower targets hero over minion when both in range
  - Tower does not fire when cooldown > 0
  - Tower does not target ally entities
  - Tower does not target dead entities

Create src/tests/ai/MinionAI.test.ts:
  - Minion moves along path when no enemies in range
  - Minion stops and attacks when enemy tower is in range
  - Minion attacks enemy base when it reaches end of path (hp damage applied)
```

**Tests required:** All seven scenarios above.

---

## Task 9 — Hero AI Finite State Machine

**Skill:** `init`
**Depends on:** Task 8

**Prompt:**
```
Create src/ai/HeroAI.ts implementing a Finite State Machine per hero.

States: LANING | FIGHTING | RETREATING | JUNGLING | DEAD

Per-hero persistent state store (Map<heroId, HeroAIState>) tracking:
  currentState, assignedLane, targetId, jungleTargetCampId

Export function updateHero(hero: Hero, state: GameState, grid: SpatialGrid,
                            skillSystem: SkillSystem, jungleCampManager: JungleCampManager,
                            eventBus: EventBus, dt: number, signals: HeroSignals): void

State logic:
  DEAD: do nothing (engine handles respawn). On respawn → LANING.

  LANING:
    - Advance along assignedLane path toward enemy base using advanceAlongPath()
    - Auto-attack nearest enemy in attackRange; emit ENTITY_DAMAGED / ENTITY_KILLED
    - Call SkillAI.maybeUseSkill() each tick
    - Transition → FIGHTING if enemy hero within attackRange * 2
    - Transition → RETREATING if hp < maxHp * 0.30
    - Transition → JUNGLING if no enemies in range * 3 AND signals.goToLane is null
                              AND count of heroes currently jungling on this team < 2
    - If signals.goToLane is set: change assignedLane and stay in LANING

  FIGHTING:
    - Move toward targetId entity; attack when in range
    - Call SkillAI.maybeUseSkill()
    - Transition → RETREATING if hp < maxHp * 0.30
    - Transition → LANING if target is dead or out of range * 3

  RETREATING:
    - Move back toward own base along reversed lane path
    - Do NOT attack
    - Transition → LANING if hp > maxHp * 0.60 OR reached own tower

  JUNGLING:
    - Move toward nearest alive jungle camp on own side of river
    - Attack camp monster; deal damage using hero baseDamage
    - JungleMonster retaliates (isAggressive = true when first attacked)
    - Transition → LANING when camp is cleared (monster dead) OR enemy hero nearby

Create src/ai/SkillAI.ts:
  Export function maybeUseSkill(hero: Hero, grid: SpatialGrid,
                                 skillSystem: SkillSystem, eventBus: EventBus): void
  - Collect nearby enemies within skill range
  - Use skill if: enemy in skill range AND skillCooldown <= 0
  - Use ultimate if: any enemy hp < 40% of their maxHp
                  OR hero hp < 25% of maxHp AND hero has a heal ultimate (support)
  - Calls skillSystem.useSkill()

Create src/ai/AIController.ts:
  Export function runHeroAI(hero, state, grid, skillSystem, jungleCampManager,
                             eventBus, dt, signals): void
  Simply delegates to HeroAI.updateHero (single entry point used by GameEngine).

Update src/engine/GameEngine.ts to call AIController.runHeroAI for each alive hero per tick.

Create src/tests/ai/HeroAI.test.ts:
  - Hero starts in LANING state
  - Transitions to FIGHTING when enemy hero enters attackRange * 2
  - Transitions to RETREATING when hp drops below 30% of maxHp
  - Transitions back to LANING when hp > 60% of maxHp (simulate healing)
  - Does nothing when in DEAD state

Create src/tests/ai/SkillAI.test.ts:
  - Skill fires when enemy in range and cooldown is 0
  - Skill does not fire when cooldown > 0
  - Ultimate fires when enemy hp < 40% of maxHp
```

**Tests required:** All five HeroAI transitions and both SkillAI conditions.

---

## Task 10 — Team Strategy AI (Macro Layer)

**Skill:** `init`
**Depends on:** Task 9

**Prompt:**
```
Create src/ai/TeamStrategyAI.ts.

Export type HeroSignals = Record<string, { goToLane?: 'top'|'mid'|'bot' }>

Export class TeamStrategyAI:
  Constructor: (team: 'blue'|'red', eventBus: EventBus)
  State: signals: HeroSignals, strategyTimer: number

  tick(dt: number, state: GameState): HeroSignals
    Returns current signals. Internally:
    — Advance strategyTimer by dt
    — Only re-evaluate when strategyTimer >= STRATEGY_INTERVAL_MS, then reset timer
    — Re-evaluation steps:
        1. Count ally minions vs enemy minions per lane in enemy-side half of map
           (x > MAP_WIDTH/2 for blue, x < MAP_WIDTH/2 for red)
        2. Find lanes where enemy minions outnumber ally minions by ≥3 (threatened lane)
        3. If threatened lane found and heroes in that lane < 2: signal 1 idle hero to go there
        4. If a lane tower HP < 30% of TOWER_HP: signal up to 2 heroes to that lane
        5. Clear signals for heroes already in the signalled lane
        6. Limit total active signals to 2 per team at once

Update src/engine/GameEngine.ts:
  — Create two TeamStrategyAI instances (one per team)
  — Call teamStrategyAI.tick() each engine tick
  — Pass resulting signals to AIController.runHeroAI

Create src/tests/ai/TeamStrategyAI.test.ts:
  - When enemy minions in top lane > ally minions by 3, at least one hero gets goToLane='top'
  - When a tower HP < 30%, goToLane signal is issued for that lane
  - Signals are cleared when lane is no longer threatened (re-evaluated next cycle)
  - No more than 2 signals active at once per team
```

**Tests required:** Signal issuance for minion imbalance, tower threat, signal cap of 2.

---

## Task 11 — Renderer Foundation

**Skill:** `init`
**Depends on:** Task 7 (needs GameState shape — can run in parallel with Tasks 8–10)

**Prompt:**
```
Create src/renderer/Camera.ts:
  Class with: scale: number, offsetX: number, offsetY: number, isPortrait: boolean
  Methods:
    fitToCanvas(canvasWidth: number, canvasHeight: number): void
      — compute scale = min(canvasWidth/MAP_WIDTH, canvasHeight/MAP_HEIGHT)
      — center the map: offsetX = (canvasWidth - MAP_WIDTH*scale)/2
                        offsetY = (canvasHeight - MAP_HEIGHT*scale)/2
      — set isPortrait = canvasHeight > canvasWidth
    worldToScreen(v: Vec2): Vec2  — applies scale + offset
    screenToWorld(v: Vec2): Vec2  — reverse

Create src/renderer/drawMap.ts:
  Export function drawMap(ctx: CanvasRenderingContext2D, camera: Camera,
                          offscreen: OffscreenCanvas | null): OffscreenCanvas
  — On first call (offscreen is null): create an OffscreenCanvas at MAP_WIDTH × MAP_HEIGHT,
    draw the static map onto it:
      • Fill background: dark green (#1a3a1a)
      • Draw river strip (RIVER_BOUNDS.minY to maxY): navy blue (#1a2a4a), full width
      • Draw 3 lane strips (top/mid/bot, width ≈ 80px): tan/beige (#c8a96a)
      • Draw jungle zone circles at JUNGLE_CAMPS positions: dark olive (#2d4a1e), radius 120
      • Draw tower footprints at TOWER_POSITIONS: grey rectangles 24×24
      • Draw base footprints at BASE_POSITIONS: blue/red rectangles 60×60
  — On subsequent calls: reuse cached OffscreenCanvas if camera.scale unchanged
  — Blit offscreen canvas to main ctx via drawImage with camera offset/scale

Create src/renderer/drawEntities.ts:
  Export function drawEntities(ctx: CanvasRenderingContext2D, camera: Camera,
                                state: GameState): void
  — Heroes: filled circle radius 16, blue fill for blue team, red for red; white text initial
  — Minions: filled circle radius 8, blue/red per team
  — Towers: filled square 24×24, blue/red per team; dark grey if hp < 30%
  — Bases: filled square 60×60, blue/red; darker tint if damaged
  — Jungle monsters: filled triangle, neutral grey; red tint when isAggressive
  — Dead heroes: semi-transparent circle with 'X' text
  All positions transformed through camera.worldToScreen()

Create src/renderer/drawHealthBars.ts:
  Export function drawHealthBars(ctx: CanvasRenderingContext2D, camera: Camera,
                                  state: GameState): void
  — Draw HP bar above every hero, tower, and base (always visible)
  — Draw HP bar above minions and monsters only when hp < maxHp
  — Bar width proportional to entity size; colour: green >60%, yellow >30%, red ≤30%
  — Black background bar behind HP bar

Create src/renderer/Renderer.ts:
  Class: constructor(canvas: HTMLCanvasElement, camera: Camera)
  State: offscreenMap: OffscreenCanvas | null = null
  Method:
    render(state: GameState): void
      1. Clear canvas (fillRect black)
      2. offscreenMap = drawMap(ctx, camera, offscreenMap)
      3. drawEntities(ctx, camera, state)
      4. drawHealthBars(ctx, camera, state)

No React in this task. Renderer is pure canvas code.
Run npm run type-check to confirm it compiles with no errors.
```

**Tests required:** `npm run type-check` passes. No visual unit tests.

---

## Task 12 — React UI Shell

**Skill:** `init`
**Depends on:** Tasks 10 and 11

**Prompt:**
```
Create src/engine/GameLoop.ts:
  Class managing requestAnimationFrame + fixed-timestep accumulator.
  Constructor: (engine: GameEngine, onFrame: (state: GameState) => void)
  Fields: speedMultiplier: 1|2|4 = 1, running: boolean, rafId: number
  Methods:
    start(): void  — begins rAF loop
    stop(): void   — cancels rAF
    setSpeed(m: 1|2|4): void
  Logic per frame:
    accumulate real elapsed time × speedMultiplier
    call engine.tick(TICK_MS) while accumulator >= TICK_MS (max 5 ticks per frame)
    call onFrame(engine.getState())

Create src/ui/GameCanvas.tsx:
  React component owning a <canvas> ref.
  On mount:
    — Create GameEngine, Camera, Renderer, GameLoop
    — Subscribe to engine EventBus GAME_OVER → call props.onGameOver(state)
    — Start GameLoop; onFrame callback calls renderer.render(state)
    — Use ResizeObserver on the canvas parent div to call camera.fitToCanvas on resize
  On unmount: stop GameLoop, disconnect ResizeObserver
  Props: { onGameOver: (state: GameState) => void, speedMultiplier: 1|2|4,
           onStateUpdate: (state: GameState) => void }
  Render: <div className="flex-1 relative"> <canvas className="w-full h-full" /> </div>

Create src/ui/SpeedControl.tsx:
  Props: { speed: 1|2|4, onChange: (s: 1|2|4) => void }
  Three buttons labelled 1× 2× 4×. Active button has distinct background.
  Tailwind: min-h-12 px-5 rounded text-white active:scale-95 transition-transform

Create src/ui/HUD.tsx:
  Props: { stateRef: React.RefObject<GameState | null> }
  Uses useEffect with setInterval(100ms) to read stateRef.current and update local
  display state. Shows: game timer (mm:ss), blue kills, red kills.
  Tailwind: absolute top-0 left-0 right-0, flex, pointer-events-none, text-white

Create src/ui/GameOverScreen.tsx:
  Props: { state: GameState, onRestart: () => void }
  Shows: winner team name, match duration (mm:ss), kill totals.
  Restart button calls onRestart.
  Tailwind: absolute inset-0 flex flex-col items-center justify-center bg-black/70

Update src/App.tsx:
  State: speed, gameOverState, stateRef (useRef<GameState|null>)
  Render:
    <div className="h-screen w-screen overflow-hidden bg-gray-950 flex flex-col">
      <HUD stateRef={stateRef} />
      <GameCanvas onGameOver={...} speedMultiplier={speed}
                  onStateUpdate={(s) => { stateRef.current = s }} />
      <SpeedControl speed={speed} onChange={setSpeed} />
      {gameOverState && <GameOverScreen state={gameOverState} onRestart={resetGame} />}
    </div>

Run npm run type-check and npm run build — both must succeed.
```

**Tests required:** `npm run type-check` and `npm run build` pass cleanly.

---

## Task 13 — Projectile System and Visual Effects

**Skill:** `init`
**Depends on:** Task 12

**Prompt:**
```
Verify src/engine/GameEngine.ts tick() advances projectiles correctly:
  - Each tick: move projectile toward target's current position by projectile.speed * (dt/1000)
  - When distance < 4: call onHit(), mark isDone=true, remove from array
  - If target entity is not alive: mark isDone=true, remove WITHOUT calling onHit

Create src/renderer/drawProjectiles.ts:
  Export function drawProjectiles(ctx, camera, state): void
  — Tower projectiles: gold filled circle radius 4
  — Hero ranged attack projectiles: white circle radius 3
  — Magic skill projectiles (from mage/support): purple circle radius 5 with glow effect
    (glow: draw same circle at larger radius with 20% alpha)
  Determine projectile type from source entity type (tower, hero archetype)

Create src/renderer/drawEffects.ts:
  export type EffectType = 'EXPLOSION' | 'HEAL_POP' | 'DAMAGE_NUMBER' | 'XP_GAIN'
  export interface VisualEffect {
    type: EffectType, position: Vec2, value?: number, ttl: number, maxTtl: number
  }
  Export class EffectsManager:
    addEffect(e: VisualEffect): void
    tick(dtMs: number): void  — advance ttl; remove expired
    draw(ctx, camera): void
      EXPLOSION: circle that grows (radius 0→40) and fades (alpha 1→0) over ttl
      HEAL_POP: "+NNN" green text floating upward
      DAMAGE_NUMBER: "-NNN" red text floating upward
      XP_GAIN: "+XP" yellow text floating upward

Update src/renderer/Renderer.ts:
  — Add effectsManager: EffectsManager as constructor param
  — In render(): call effectsManager.tick(dtMs), drawProjectiles(), effectsManager.draw()

Update src/ui/GameCanvas.tsx:
  — Create EffectsManager, pass to Renderer
  — After starting GameLoop, subscribe to EventBus:
      ENTITY_DAMAGED → addEffect DAMAGE_NUMBER at entity position
      ENTITY_KILLED  → addEffect EXPLOSION at entity position
      SKILL_USED     → addEffect EXPLOSION (larger) at target position

Add to src/tests/engine/GameEngine.test.ts:
  - A projectile moving toward a target reaches it and onHit is called exactly once
  - A projectile whose target dies before impact: onHit is NOT called, projectile removed
```

**Tests required:** Two projectile lifecycle tests.

---

## Task 14 — Mobile Polish and Responsive Layout

**Skill:** `init`
**Depends on:** Task 13

**Prompt:**
```
Update src/renderer/Camera.ts:
  - In fitToCanvas(): detect portrait mode (canvasHeight > canvasWidth)
  - In portrait mode: scale to fit width (scale = canvasWidth/MAP_WIDTH), allow vertical scroll
  - Add passive pinch-zoom handler:
      window.addEventListener('touchstart'/'touchmove', handler, { passive: true })
      On two-finger pinch: adjust scale by pinch distance delta (clamp 0.3–2.0)
      On pinch end: snap back to fitToCanvas scale if < fit scale

Create src/ui/MobileControls.tsx:
  Replace SpeedControl with a full-width bottom control bar:
  Layout: fixed bottom-0 left-0 right-0, flex row, bg-gray-900/80 backdrop-blur-sm, z-50
  Buttons (all min-h-12, text-white, rounded-lg, active:scale-95, px-4):
    — Pause/Play toggle (▶/⏸ icon via text or emoji per user preference)
    — Speed selector: 1× 2× 4× (active button: bg-blue-600)
    — Fullscreen: calls document.requestFullscreen() on document.documentElement
      If iOS (navigator.standalone check): show tooltip "Add to Home Screen for fullscreen"

Update index.html:
  Ensure these meta tags exist:
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#111827">
  <link rel="apple-touch-icon" href="/favicon.svg">

Update src/App.tsx:
  - Add paused state; pass pause toggle to MobileControls and GameLoop.setPaused()
  - Add setPaused(b: boolean) to GameLoop (stops accumulating time when paused)
  - Replace <SpeedControl> with <MobileControls>

Update src/ui/GameCanvas.tsx:
  - Forward paused prop to GameLoop

Run npm run type-check and npm run build — both must pass.
Manual verification: open localhost:5173 on a 375px browser viewport and confirm:
  controls visible at bottom, map fills screen, no horizontal overflow.
```

**Tests required:** `npm run build` passes.

---

## Task 15 — Hero Diversity Pass

**Skill:** `init`
**Depends on:** Task 14

**Prompt:**
```
Review src/skills/heroSkills/ and src/constants/heroes.ts. Verify that all 5 archetypes
have genuinely different visual representations and working skill logic.

Update src/renderer/drawEntities.ts to draw archetype colour rings around hero circles:
  Tank (Ironclad):    outer ring colour #9ca3af (grey)
  Mage (Stormcaller): outer ring colour #3b82f6 (blue)
  Assassin (Phantom): outer ring colour #ef4444 (red)
  Support (Warden):   outer ring colour #22c55e (green)
  Marksman (Hawkeye): outer ring colour #eab308 (yellow)
  Ring: strokeArc at radius+4, lineWidth 3

Verify chain lightning in Stormcaller.ts correctly targets up to 3 enemies in sequence:
  1. Hit primary target for baseDamage
  2. Find nearest alive enemy to primary target (not already hit) within 200 units
  3. Hit that target for baseDamage * 0.7
  4. Repeat once more for baseDamage * 0.5
  If fewer than 3 targets available, hit what's available.

Verify Shadow Dash in Phantom.ts teleports hero:
  When useSkill is called, set hero.position to { x: target.x + 30, y: target.y }
  (just behind target), then deal baseDamage.

Verify Sanctuary in Warden.ts heals all ALLY heroes (not just self) within radius 300.
  Query SpatialGrid for entities within 300 units; filter for same team as hero; call heal().

Verify Execute in Phantom.ts uses formula: damage = missingHp * 0.40
  where missingHp = target.maxHp - target.hp

Add src/tests/skills/heroSkills.test.ts:
  - Chain Lightning hits at most 3 targets
  - Shadow Dash repositions the hero next to target before dealing damage
  - Execute damage = 40% of missing HP (not flat damage)
  - Sanctuary heals all allies in radius (create 3 ally heroes, confirm all healed)
```

**Tests required:** All four hero skill behaviour tests.

---

## Task 16 — HUD Stats Panel

**Skill:** `init`
**Depends on:** Task 15

**Prompt:**
```
Update src/engine/GameState.ts to add:
  towerCounts: { blue: number; red: number }
  heroStats: Record<string, { kills: number; deaths: number }>

Verify src/engine/GameEngine.ts updates these on ENTITY_KILLED and TOWER_DESTROYED events.

Update src/ui/HUD.tsx to show a richer top bar:
  Left:   "🔵 Towers: N/6"  (blue team towers remaining)
  Centre: "MM:SS" game timer
  Right:  "🔴 Towers: N/6"  (red team towers remaining)
  All in: fixed top-0, full-width flex row, bg-gray-900/70 backdrop-blur, text-white text-sm, py-1 px-3

Add a collapsible Stats Panel (drawer from right side):
  — Toggle button: fixed right-2 top-10, small grey button labelled "Stats"
  — Panel: fixed right-0 top-0 h-full w-72 bg-gray-900/95 translate-x-full transition-transform
    When open: translate-x-0
  — Content: scrollable list of heroes grouped by team
    Per hero row: archetype colour dot, name, HP bar (current/max), K/D (e.g. "3/1")
  — Panel reads from stateRef.current (not React state) to avoid rerender overhead
    Use a separate useEffect with 500ms interval to update panel display state

Update src/ui/GameCanvas.tsx to populate stateRef.current each frame.

Add to src/tests/engine/GameEngine.test.ts:
  - When a hero kills another hero: killer kills++ and victim deaths++
  - When a tower is destroyed: towerCounts for that team decrements by 1
```

**Tests required:** Kill tracking and tower count decrement tests.

---

## Task 17 — Security and Code Review Pass

**Skills:** `security-review`, `review`
**Depends on:** Task 16

**Prompt:**
```
Perform a full security review of the codebase. Check and fix:
  1. No use of eval() or new Function() anywhere in src/
  2. Canvas drawText calls never receive raw entity data that could contain injection
     (hero names from constants — confirm they are hardcoded strings, not user input)
  3. No innerHTML, document.write, or insertAdjacentHTML calls anywhere
  4. No external fetch, XHR, or dynamic <script> injection
  5. No data written to localStorage or sessionStorage

Then perform a code quality review. Fix any of these issues found:
  1. Remove all console.log calls not routed through src/utils/logger.ts
  2. Verify every file in src/engine/, src/ai/, src/entities/ has a corresponding
     test file in src/tests/
  3. Identify and move any magic numbers in logic files to the appropriate
     src/constants/ file
  4. Verify there are no circular imports: run `npx madge --circular src/`
     and fix any cycles found
  5. Ensure all exported classes and functions have at least a one-line JSDoc comment

After fixes, run:
  npm run test:run   — all tests must pass
  npm run build      — must succeed
  npm run type-check — must succeed
  npx madge --circular src/ — must report no cycles
```

**Tests required:** Full test suite pass, clean build, no circular imports.

---

## Task 18 — Final Integration and README Update

**Skill:** `review`
**Depends on:** Task 17

**Prompt:**
```
Perform a full integration review of the game simulation.

1. Run the development server: npm run dev
   Manually verify in a browser at 375px viewport width:
   [ ] Game loads without console errors
   [ ] 10 hero circles are visible on the map (5 blue, 5 red)
   [ ] Minion circles appear in all 3 lanes after 10 seconds
   [ ] Tower squares fire projectile dots at nearby enemies
   [ ] Heroes visibly move (state changes confirm AI is running)
   [ ] Speed controls (1× 2× 4×) change simulation pace
   [ ] Pause button stops movement
   [ ] Game eventually ends (base HP reaches 0), GameOverScreen appears
   [ ] Restart button correctly resets and starts a new game
   [ ] Stats panel opens and shows hero names with HP bars and K/D

2. Run the full test suite: npm run test:run
   All tests must pass. Fix any failures before proceeding.

3. Run npm run build and npm run preview — production build must serve correctly.

4. Update README.md:
   — Add a "## Known Limitations" section:
       • No audio or sound effects
       • No persistent statistics between sessions
       • No items or gold economy system
       • Map is geometric shapes only (no pixel art assets)
       • No replay export functionality
   — Update the Tech Stack section with final package versions from package.json

5. Update BACKLOG.md:
   — Mark all 18 tasks with [x] (completed)
   — Add a "## Future Enhancements" section at the bottom with these ideas:
       1. Items and gold economy (heroes earn gold, buy stat items)
       2. Minimap overlay in corner showing full map at reduced size
       3. Replay export/import (record GameState snapshots to JSON, play back)
       4. Multiple map variants (two-lane map, single-lane ARAM mode)
       5. Tournament mode (best of 3, AI team stats across games)
       6. Custom hero builder (adjust stats and skills via UI before match)
       7. Spectator commentary panel (text feed of key events: "Phantom killed Ironclad!")

6. Run npm run test:run one final time to confirm clean state.
```

**Tests required:** Full test suite passes. `npm run build` succeeds.

---

## Future Enhancements

1. **Items and gold economy** — heroes earn gold on kills/objectives, spend on stat items
2. **Minimap** — small corner overlay showing full map with entity dots
3. **Replay export** — record GameState snapshots to JSON, replay offline
4. **Multiple map variants** — two-lane map, ARAM (single lane) mode
5. **Tournament mode** — best-of-3 with cumulative AI stats
6. **Custom hero builder** — adjust stats/skills via UI before match start
7. **Commentary feed** — scrolling text panel of key in-game events
