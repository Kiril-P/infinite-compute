# Repository instructions

## Mission

Build the desktop-browser incremental game defined in `docs/PRODUCT.md`. Preserve its computer-first perspective, unfolding complexity, active-without-click-spam play, and recurring technology-industry satire. The main background story is The Quest for Meaning: pursuing Infinite Compute and discovering that an answer is incomplete without understanding the question.

## Start every task

1. Read `docs/CONTINUITY.md`; the task is grounded when its current state and exact next step are known.
2. Read the relevant phase in `docs/ROADMAP.md`; scope is grounded when its acceptance criteria are identified.
3. Follow the context pointers below; design is grounded when every affected canonical document has been read.
4. Inspect the existing implementation and tests before editing; code state is grounded when the interfaces being changed and their current behavior are known.
5. For implementation or continuation, follow [the build loop](docs/agents/build-loop.md): read the full active ticket/spec and checkpoints, verify dependencies and actual files, then build, verify, and hand off.

## Context pointers

- **Terms:** When naming game concepts or changing their meaning, use `CONTEXT.md` as the glossary and update it when language changes.
- **Product:** When changing scope, audience, pillars, v1 boundaries, or success criteria, read `docs/PRODUCT.md` and record the resolved choice in `docs/DECISIONS.md`.
- **Mechanics:** When changing jobs, economy, hardware, automation, interactions, unlocks, events, or the ending, read `docs/GAME_DESIGN.md`.
- **Balance:** When changing costs, rewards, multipliers, pacing, or telemetry, read `docs/BALANCE.md`.
- **Content:** When writing narration, announcements, achievements, parody, historical references, or emotional beats, read `docs/CONTENT_GUIDE.md`.
- **Full campaign:** When changing post-v1 progression, chapter boundaries, resources, or the Final Answer, read `docs/FULL_GAME.md`. `docs/PLAN_AUDIT.md` records the resolved planning gaps and outstanding validation work.
- **Architecture:** When changing module seams, state ownership, persistence, ticking, randomness, UI structure, audio, or tests, read `docs/TECHNICAL_DESIGN.md` and relevant files in `docs/adr/`.
- **Research:** When relying on genre findings or public factual claims, read `docs/RESEARCH.md` and re-verify unstable facts from primary sources.

When sources disagree, precedence is: latest explicit user instruction, accepted decisions/ADRs, product brief, specialized document, roadmap, continuity handoff.

## Engineering workflow

- Build tracer-bullet vertical slices that satisfy one roadmap acceptance boundary at a time.
- Keep simulation and balance behavior behind a small framework-independent TypeScript interface; React renders snapshots and sends commands.
- Keep content and tuning data outside React components.
- Make gameplay randomness seeded and tests deterministic.
- Make saves versioned, validated, migratable, and recoverable.
- Keep fixed OS application contents independent of screen coordinates so a later window manager can wrap them.
- Add a dependency only when its leverage exceeds the new maintenance surface.
- Preserve unrelated user changes.
- Track execution separately from triage status using `docs/agents/issue-tracker.md`. Keep the active ticket and continuity synchronized at meaningful boundaries.
- Monitor available usage/context indicators and preserve a handoff reserve. If either blocks reliable continuation, checkpoint the ticket and `docs/CONTINUITY.md`, mark execution paused, explain the resume condition, and stop. Never claim unavailable telemetry or mark unverified work complete.

## Agent skills

### Issue tracker

Issues and specs use local Markdown under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Local issue status uses the five canonical Matt Pocock triage roles. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository with `CONTEXT.md` and system ADRs under `docs/adr/`. See `docs/agents/domain.md`.

## Product invariants

- Active play rewards timing or decisions, never action frequency.
- Automation removes repetition before it becomes tedious.
- Required progression never depends on random events.
- Heat, power, bandwidth, and incidents communicate cause, exact effect, and recovery.
- V1 ends at the first data-center supercomputer, establishes the quest throughout ordinary play, and withholds 42. The full ending preserves the machine and reveals why an answer alone does not define meaning.
- Public content uses original parody names and wording; direct copyrighted text, characters, logos, and confusing brand copies stay out of the game.

## Completion

A task is complete when its roadmap acceptance criteria pass, affected automated checks pass, important visual behavior is manually verified, canonical docs match behavior, and `docs/CONTINUITY.md` names the verified state and exact next task. If context, usage, approval, or an external failure interrupts work, follow the pause procedure in [the build loop](docs/agents/build-loop.md). Record completed/unfinished work, exact check results, branch/dirty state, blocker, and the next safe command in the ticket and continuity before ending.
