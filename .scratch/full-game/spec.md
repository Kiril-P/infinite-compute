# Full campaign: The Quest for Meaning

Status: design baseline; later-chapter implementation not authorized

## Problem

The original plan specifies one hour of hardware progression and treats the existential premise mostly as a sequel hook. It does not yet carry the user's intended background quest and technology-industry satire through a complete game.

## Planned outcome

Extend the same computer and save across planetary, stellar, and cosmic Chapters, then deliver an earned 42 result whose interpretation exposes the undefined question. End with a bounded useful Job chosen through familiar controls. The full campaign, including v1, provisionally targets 8–12 attentive hours; this is untested pacing, not a wait requirement.

## Canonical specification

- [Product contract](../../docs/PRODUCT.md): audience, theme, scope and success.
- [Full-game plan](../../docs/FULL_GAME.md): every later Era's loop, new decision, Benchmark, automation reward, satire, story, transformation, and exit.
- [Roadmap](../../docs/ROADMAP.md): Phases 7–15 and their blocking order.
- [Mechanics](../../docs/GAME_DESIGN.md), [balance](../../docs/BALANCE.md), [content](../../docs/CONTENT_GUIDE.md), and [technical design](../../docs/TECHNICAL_DESIGN.md): shared invariants and verification.
- [Cosmic absurdity](../../docs/content/COSMIC_ABSURDITY.md): recurring worlds/forks/shortcuts and optional Rick and Morty references within the existing chapter scope.
- [Planning audit](../../docs/PLAN_AUDIT.md): resolved gaps and outstanding playtest questions.

## Acceptance

- Every new Era earns one distinct decision and removes an old chore; merge Eras that fail this test.
- Cash/Research lead into a single Fabrication introduction with no circular bootstrap dependency; all other supporting limits are reusable Capacities.
- Required progression survives ordinary purchase choices, reversible tuning, cancelled construction, Benchmark retry, and interrupted saves.
- Main story comprehension requires no archive hunting or optional content. Satirical incentives remain visible even when the player chooses ordinary alternatives.
- Full-ending readiness is finite. The Final Answer is not a numerical overflow or random secret. All epilogue Jobs count as valid endings.
- Chapter I saves continue without reset; story history and Automation intent persist across scale.
- Sandbox Worlds share finite host capacity; OS Forks reuse existing sites. Their recurring stories and optional references preserve genuine save history, physical delivery delays, and the original ending path.

## Test seam and delivery

Keep the planned simulation Interface: create/resume state, accept intents, advance logical time, return snapshot/events. Deterministic progression tests cross it; browser tests cover interaction, presentation, saves, and accessible controls. Phase 0 supplies the OS shell and smoke tests; simulation, progression, and persistence begin with the opening gameplay slice.

Future local tickets cut a complete demonstrable path from the prior chapter's save through one new behavior, UI explanation, recovery, and tests. Roadmap phases are planning envelopes, not giant automatically executable tickets. Create the next slice only when its parent phase is selected; do not prebuild a speculative cosmic engine.

## Out of scope

Later-chapter runtime work in the current session (only Phase 0 is authorized); mandatory prestige/restarts; nested reset currencies; required offline progress; mandatory scripting; multiplayer; a larger multiverse after the authored ending.
