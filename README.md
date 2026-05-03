# MOBA-Coach

Watch two AI teams battle it out in a 5v5 MOBA match — straight from your phone browser.
No accounts, no downloads, no interaction required. Just open and watch.

## What is this?

MOBA-Coach is a browser-based simulator of a Multiplayer Online Battle Arena (MOBA) game.
Two teams of five AI-controlled heroes fight across a three-lane map. Minions spawn every
10 seconds, towers defend each lane, and each hero has unique abilities. The game ends when
one team destroys the other's base.

## How to Watch

1. Open the URL in any modern mobile or desktop browser.
2. The match starts automatically.
3. Use the bottom controls to:
   - **Pause / Resume** the simulation
   - **Speed up** (1× · 2× · 4×)
   - **Toggle fullscreen**
4. A typical match lasts 10–25 minutes of simulated time (2–5 minutes at 4× speed).

## Heroes

Each team has five heroes, one per archetype:

| Archetype | Hero | Skill | Ultimate |
|---|---|---|---|
| Tank | Ironclad | Shield Bash (stun) | Earthquake (AOE stun) |
| Mage | Stormcaller | Chain Lightning (chain dmg) | Meteor (AOE nuke) |
| Assassin | Phantom | Shadow Dash (teleport + dmg) | Execute (% missing HP) |
| Support | Warden | Mend (heal ally) | Sanctuary (AOE heal) |
| Marksman | Hawkeye | Piercing Shot (slow) | Snipe (long-range nuke) |

## The Map

```
[BLUE BASE] ──[T]──────── top lane ────────[T]── [RED BASE]
                 \                              /
           jungle █   ·  ·  river  ·  ·   █ jungle
                 /                              \
[BLUE BASE] ──[T]──────── bot lane ────────[T]── [RED BASE]
                      ─── mid lane ───
```

- **3 lanes** (top, mid, bot) connect the two bases
- **2 towers per team per lane** defend the path (T = tower)
- **River** splits the map horizontally through the centre
- **Jungle camps** on each side contain neutral monsters

## Minion Waves

Every 10 seconds, 3 minions per team spawn in each lane (18 total per wave).
Minions march along their lane, attack enemies they encounter, and deal damage
to the enemy base when they reach it.

## Tech Stack

React · TypeScript · HTML5 Canvas · Vite · Tailwind CSS · Vitest

## Development

See [CLAUDE.md](./CLAUDE.md) for full developer documentation, architecture decisions,
folder structure, and development commands.

## Building

```bash
npm install
npm run dev       # http://localhost:5173
npm run test:run  # run test suite
npm run build     # production build
```

## Contributing

This project is generated and maintained by Claude Code. To add features or fix bugs,
refer to [BACKLOG.md](./BACKLOG.md) for the ordered task list and follow the prompts there.
Each task is self-contained and designed for a single Claude Code session.

## License

MIT
