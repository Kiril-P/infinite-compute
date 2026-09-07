# V1: Beige PC to data-center supercomputer

Status: accepted

## Outcome

Deliver the roughly 60-minute desktop-browser vertical slice defined by [the product brief](../../docs/PRODUCT.md). A beige family PC earns Cash from timing-based Jobs, gains configurable Automation and Research, learns to manage hardware Bottlenecks, and completes five deterministic Benchmarks before becoming a data-center supercomputer. The Operating System narrates the journey and ends by recognizing that its Compute is effectively zero relative to the Impossible Question.

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
- Saves are versioned and recoverable; deterministic tests cover economy, progression, content integrity, Automation, Benchmarks, and persistence.

## Ticket order

Tickets are tracer-bullet slices under `issues/`. Their `Blocked by` edges define execution order. Implement the first unblocked `ready-for-agent` ticket and update `docs/CONTINUITY.md` after each one.
