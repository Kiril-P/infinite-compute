# V1: Beige PC to data-center supercomputer

Status: accepted

## Outcome

Deliver the roughly 60-minute desktop-browser vertical slice defined by [the product brief](../../docs/PRODUCT.md). A beige family PC earns Cash from timing-based Jobs, gains configurable Automation and Research, learns to manage hardware Bottlenecks, and completes five deterministic Benchmarks across its growth into a data-center supercomputer. The Operating System narrates the journey and ends by finding that completion cannot be estimated for the inherited, unspecified Impossible Question. This is Chapter I of the full campaign planned in the product documents; it establishes the quest and withholds 42.

## Canonical context

- Domain language: [CONTEXT.md](../../CONTEXT.md)
- Mechanics and Benchmarks: [game design](../../docs/GAME_DESIGN.md)
- Timing and economy targets: [balance model](../../docs/BALANCE.md)
- Module seams and validation: [technical design](../../docs/TECHNICAL_DESIGN.md)
- Narrative boundaries: [content guide](../../docs/CONTENT_GUIDE.md)
- Comparative evidence: [Magic Research 2](../../docs/research/MAGIC_RESEARCH_2.md) and [Antimatter Dimensions](../../docs/research/ANTIMATTER_DIMENSIONS.md)

## Primary test seam

Exercise economy and progression through one framework-independent simulation interface that can create a game from seed/state, accept typed commands, advance elapsed time, and return a player-facing snapshot plus domain events. Browser tests cross the application seam only for critical interaction, persistence, accessibility, and visual transitions.

## Acceptance boundary

- The full critical path is reachable without random events, rapid clicking, an external guide, or destructive failure.
- Each Era performs, teaches, automates, configures, and compresses one control before adding the next.
- Each Benchmark changes one known rule, explains the current Bottleneck, supports exit/retry, and awards related permanent relief.
- First Automation appears in 3-5 minutes; Research appears around 18-22 minutes; completion occurs in 55-75 minutes for a baseline first run.
- The Operating System, computer, room, applications, soundscape, and announcements visibly transform across all five Eras.
- The inherited directive, one essential normal-play beat per Era, and a small playable satire chain establish the quest before the V1 Ending.
- The opening slice owns Safe Mode Payroll and auto-run; later slices extend that capability. All required Benchmarks support accessible configuration decisions.
- Saves are versioned and recoverable; deterministic tests cover economy, progression, content integrity, Automation, Benchmarks, and persistence.

## Ticket order

Tickets are tracer-bullet slices under `issues/`. Their `Blocked by` edges define execution order. Follow [the build loop](../../docs/agents/build-loop.md): select an authorized, unblocked `ready-for-agent` ticket whose `Execution` is not complete, verify its dependencies and resume condition, and update its checkpoint and `docs/CONTINUITY.md` at each handoff. Current authorization covers all v1 tickets through 07 / Phase 6 under D-025; Phase 0 is verified, so continue from ticket 02 and stop at verified v1 completion. Resolved planning-audit comments on tickets supersede conflicting originating descriptions.
