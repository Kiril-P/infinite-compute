# Infinite Compute

Working title for a desktop-browser incremental game about a beige 1990s family PC that grows into a supercomputer and, eventually, attempts to reach infinite computing power to answer an impossible question.

The first release is a polished 60-minute vertical slice ending at the computer's first data-center-scale supercomputer. It begins cozy, becomes optimization-heavy, and ends in controlled technological chaos. The story is delivered through a fictional operating system, applications, hardware changes, and increasingly alarming world announcements.

## Current status

The repository is in pre-production. No runtime code exists yet. The product direction, v1 scope, technical architecture, content rules, balance targets, implementation roadmap, and agent handoff process are documented.

Start with:

1. [AGENTS.md](AGENTS.md) for repository working rules.
2. [CONTEXT.md](CONTEXT.md) for canonical game terminology.
3. [docs/CONTINUITY.md](docs/CONTINUITY.md) for the current handoff and next task.
4. [docs/PRODUCT.md](docs/PRODUCT.md) for the product contract.
5. [docs/ROADMAP.md](docs/ROADMAP.md) for implementation order and acceptance criteria.
6. [.scratch/v1/spec.md](.scratch/v1/spec.md) for the local agent-ready specification and ticket graph.

## Planned stack

- React + TypeScript + Vite
- Plain TypeScript simulation engine separated from React
- Vitest for simulation and content tests
- Playwright for critical browser flows
- CSS custom properties and ordinary CSS for the fictional OS
- Web Audio for lightweight synthesized UI sound
- LocalStorage with versioned saves

There is no backend, account system, multiplayer, mobile layout, prestige layer, or offline progress in v1.

## Canonical documents

- [Product brief](docs/PRODUCT.md)
- [Game design](docs/GAME_DESIGN.md)
- [Balance model](docs/BALANCE.md)
- [Narrative and content guide](docs/CONTENT_GUIDE.md)
- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Implementation roadmap](docs/ROADMAP.md)
- [Research notes](docs/RESEARCH.md)
- [Magic Research 2 study](docs/research/MAGIC_RESEARCH_2.md)
- [Antimatter Dimensions study](docs/research/ANTIMATTER_DIMENSIONS.md)
- [Decision log](docs/DECISIONS.md)
- [Architecture decisions](docs/adr/)
- [Continuity handoff](docs/CONTINUITY.md)
