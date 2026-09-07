# Decision log

Material decisions are append-only. A later decision may supersede an earlier one but should not silently rewrite its history.

## D-001 — Computer-first perspective

**Status:** Accepted  
**Decision:** There is no player avatar or player-character emphasis. The computer and its changing environment are the subject of the story.

## D-002 — Narrative and tone arc

**Status:** Accepted  
**Decision:** Begin as a cozy computer experience, escalate through obsessive optimization and hectic complexity, then enter absurd science fiction. Satirize the technology industry throughout and retain an emotionally sincere undertone.

## D-003 — Core economy

**Status:** Accepted  
**Decision:** Begin with Cash earned by jobs. Introduce Research later. Treat compute as a derived capability in v1 rather than another spendable currency.

## D-004 — Active and idle balance

**Status:** Accepted  
**Decision:** The initial manual task is a simple timing/rhythm interaction. Do not reward click-spamming. Automation becomes central, while era-specific short interactions keep active play valuable.

## D-005 — Narrator

**Status:** Accepted  
**Decision:** The operating system narrates the game and gradually becomes self-aware.

## D-006 — Ultimate premise

**Status:** Accepted  
**Decision:** The computer seeks infinite computing power to answer an impossible question about existence. The eventual answer is 42. Keep the literary homage subtle and avoid copied characters or prose.

## D-007 — OS presentation

**Status:** Accepted  
**Decision:** All systems appear as applications inside a fictional operating system. V1 uses fixed panels disguised as windows, with boundaries that permit movable windows later.

## D-008 — Hardware depth

**Status:** Accepted  
**Decision:** Use CPU, RAM, storage, GPU, cooling, power, networking, and software as systems. Motherboards, chassis, racks, rooms, and electrical service act as milestone gates. Compatibility is light and expressed as bonuses and bottlenecks.

## D-009 — V1 endpoint

**Status:** Accepted  
**Decision:** Target roughly 60 minutes and end at the first data-center-scale supercomputer. Planetary computing, prestige, and the final answer belong to later releases.

## D-010 — Failure and consequences

**Status:** Accepted  
**Decision:** Heat, power, and bandwidth primarily cause inefficiency. Short outages and incidents are allowed, but v1 has no destructive failure. Questionable industry upgrades may have small gameplay consequences without overwhelming the core loop.

## D-011 — Initial technical architecture

**Status:** Accepted provisionally  
**Decision:** Use React, TypeScript, and Vite with a framework-independent simulation engine, versioned local saves, Vitest, and Playwright. Revisit only if scaffolding reveals a concrete incompatibility. The simulation seam and trade-off are recorded in `docs/adr/0001-framework-independent-simulation.md`.
