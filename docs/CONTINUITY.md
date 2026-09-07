# Continuity handoff

Update this file at the end of every implementation task. It is the compact source of current truth for a new coding agent; it should describe current state, not historical narrative.

## Current state

- Status: Pre-production complete; implementation has not started.
- Repository: Git initialized on branch `main`.
- Runtime: None yet.
- Tests: None yet.
- Last updated: 2026-09-07.

## Product snapshot

A desktop-browser incremental game presented entirely as a fictional operating system. A cozy beige PC completes jobs for Cash, gains automation, unlocks Research, encounters heat/power/bandwidth constraints, and grows into a data-center supercomputer over a roughly 60-minute v1. The OS narrates and gradually becomes self-aware while industry satire and world announcements escalate. The long-term goal is infinite compute for an impossible question whose eventual answer is 42; v1 only foreshadows this.

## Completed

- Captured the user-approved product direction and non-goals.
- Recorded genre research and applied conclusions.
- Defined the v1 loop, systems, eras, manual interactions, narrative rules, and endpoint.
- Defined a framework-independent simulation architecture and test strategy.
- Added a canonical domain glossary and an ADR for the simulation/React seam.
- Created a phased roadmap with acceptance criteria.
- Added root repository instructions for future Codex tasks.
- Installed a focused Matt Pocock engineering skill set for use from the next turn.
- Configured Matt Pocock's engineering skills to use committed local Markdown issues under `.scratch/`, default triage roles, and the repository's single domain context.
- Added the accepted v1 specification and seven blocked tracer-bullet tickets under `.scratch/v1/`.
- Researched Magic Research 2 and Antimatter Dimensions against first-party mechanics and labeled community reception evidence.
- Incorporated component breakpoints, Current Objective, configurable Automation, reversible Research, Era Benchmarks, visible control compression, contextual help, and an interface-driven finale into the canonical design.

## Next task

Execute `.scratch/v1/issues/01-repository-scaffold.md`, which implements **Phase 0: Repository scaffold** from `docs/ROADMAP.md`.

Recommended exact task statement:

> Scaffold the React + TypeScript + Vite application described in Phase 0. Add strict checks, Vitest, Playwright, the minimal fictional OS shell, and smoke tests. Do not implement the game economy yet. Verify every repository script and update this continuity file.

## Known unknowns

- Final game title; “Infinite Compute” is a working title.
- Exact visual art direction within the warm CRT/fake-OS concept.
- Final parody company names.
- Final balance constants and exact v1 job list.
- Whether the first timing interaction uses one moving target or a small rhythm sequence; prototype both only if a quick comparison is inexpensive.

These unknowns do not block Phase 0 or the first vertical slice.

## Verification record

- Documentation links and internal scope were reviewed during repository bootstrap.
- No build or tests exist to run yet.

## Handoff rules

- Keep this file under roughly 150 lines.
- Replace stale status instead of accumulating a diary.
- Put durable product decisions in `DECISIONS.md` and specifications in their canonical document.
- Record the exact commands run and any failures after implementation begins.
- If work stops because of context, usage, approval, or external failure, record the precise stopping point and safest next command.
