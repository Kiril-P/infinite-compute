---
status: accepted
---

# Keep simulation independent from React

The incremental economy, clock, commands, unlocks, events, and derived values will live behind a small framework-independent TypeScript interface, while React only renders snapshots and sends commands. Directly storing economy rules in React would be faster for the opening prototype, but this seam makes time-based behavior deterministic, concentrates balance logic, supports fake-clock tests and accelerated playthroughs, and permits the interface to evolve from fixed panels to movable windows without rewriting the game.

