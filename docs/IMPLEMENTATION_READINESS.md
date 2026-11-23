# Implementation readiness audit

Date: 2026-09-07. Scope: the current canonical plan, v1 ticket graph, architecture, balance, full campaign, and cosmic-absurdity integration. This is an audit, not a new game-design expansion. Findings below remain open unless explicitly marked otherwise.

## Verdict

**Ready to begin Phase 0 and a staged opening prototype. Not ready to treat the full campaign as an executable production specification.** No product decision blocks the scaffold. Phase 1 needs a small concrete behavior contract as its first step; the implementing agent can choose provisional numbers and document them without another product interview.

The theme, release boundary, technology direction, simulation Interface, deterministic testing approach, and first slice are sufficiently clear. The missing evidence is chiefly playable behavior. Additional speculative chapters would not resolve it.

At audit time the user's implementation pause remained in force. The later explicit request resumed Phase 0 only; [continuity](CONTINUITY.md) and [ticket 01](../.scratch/v1/issues/01-repository-scaffold.md) own its execution evidence. The audit's original findings and absence-of-runtime observations below describe the pre-scaffold state; no finding is closed merely by creating the shell.

## Opening implementation resolution — 2026-09-08

R1–R4 are closed for Phase 1 by [OPENING_CONTRACT.md](OPENING_CONTRACT.md), the deterministic engine/persistence/session implementation and [ticket 02 verification](../.scratch/v1/issues/02-first-five-minutes.md). The reference route reaches the first CPU at 24 seconds with bonuses or 36 seconds ignored; Payroll grants auto-run at 3–5 minutes. Tests cover alternate preparation, single-attempt parity/anti-spam, isolated attempts, exact reload, recovery, failed reads/writes and competing writers. Twelve unit and eighteen production browser tests pass, with manual UI/play inspection. Independent player comprehension and acoustic quality remain Phase 6 playtest evidence to collect. Original findings below describe the preimplementation gaps and remain for provenance; later R5–R8 are not implicitly closed.

## Findings that matter to the opening

### R1 — High: pacing targets have no executable opening economy

**Evidence:** [BALANCE.md](BALANCE.md) gives cost-growth ranges, first-purchase and Automation times, and a general Compute formula. [Ticket 02](../.scratch/v1/issues/02-first-five-minutes.md) promises those times, but the plan does not select starting hardware/Cash, the first Job's work and reward, CPU/RAM effects and prices, rounding, or the actual Safe Mode Payroll target and prerequisites.

**Consequence:** two reasonable implementations can have different purchase strategies and unlock times. A test that only asserts whichever constants were invented in implementation cannot establish the intended pacing. The absence of final constants is normal; the absence of even one provisional complete route needs resolving when Phase 1 begins.

**Close in Phase 1, before coding its economy:** write one opening data table and dependency path from new save to first purchase to Safe Mode Payroll to auto-run. Include starter values, cost rounding, Job work/reward, component breakpoints, attempt goal, and reward. Hand-calculate or trace a baseline route; then test that route and an inefficient purchase order through the simulation Interface. Tune from observed play rather than hard-gating time.

### R2 — High: the core active interaction is still a choice between different games

**Evidence:** [GAME_DESIGN.md, Clock Cycle](GAME_DESIGN.md) permits a bonus to reward **or** duration and describes relaxed mode only as a readable untimed choice. It does not define that choice, the target traversal, reward bands, or what happens when a mode switch or completion coincides with an input. Safe Mode Payroll removes the bonus, but has no concrete diagnostic decision yet.

**Consequence:** payout and speed bonuses affect start frequency and automation differently. An unspecified relaxed alternative cannot be tested for equivalent agency or reward. The first Benchmark could become a passive wait rather than a satisfying demonstration.

**Close with R1:** choose one bonus dimension, a provisional timing track and reward function, and an actual untimed decision using the same reward budget. Define attempt consumption, mode switching, and completion ordering. Demonstrate why CPU/RAM preparation changes Safe Mode Payroll's outcome. Test ordinary inputs, repeated inputs, ignored bonuses, and relaxed controls. Prefer revising a tiny playable loop to designing more optional interactions.

### R3 — High: Benchmark isolation does not define ownership of ongoing work

**Evidence:** [GAME_DESIGN.md, Era Benchmarks](GAME_DESIGN.md) defines isolated attempt progress, restoration of ordinary modifiers, and suspended Incidents. It does not settle whether the ordinary Job pauses, runs concurrently, or is replaced, or how its partial progress and later Research allocation interact with an attempt.

**Consequence:** an implementation may double-allocate Compute, discard a partially completed Job, or award the same work through both the ordinary and Benchmark paths. Retry/reload tests need a specified expected result.

**Close before implementing the first Benchmark:** select pause/resume or explicit shared allocation. The simplest opening default is to preserve and pause ordinary Job work during an attempt, then restore it on exit/completion. Document what happens to timing opportunities, policies, purchases, and accrued rewards. Later Research must follow the same declared allocation rule. This is a recommendation, not a rule silently added by this audit.

### R4 — Medium: save validation does not cover save ownership or failed writes

**Evidence:** [TECHNICAL_DESIGN.md, Persistence](TECHNICAL_DESIGN.md) covers envelopes, validation, migration, backup, and import/reset, but contains no policy for two tabs writing the same save or for unavailable/failed storage writes.

**Consequence:** structurally valid saves can still overwrite newer progress, and an autosave indicator could report success when nothing was saved. These are missing requirements, not observed runtime bugs; there is no application yet.

**Close in the first persistence slice:** define one active writer per save and a visible takeover/reload flow for another tab. Define storage failure behavior: retain in-memory progress, show that it is unsaved, and allow export/retry without resetting. Verify competing-tab behavior and a failed write alongside round trips. Choose the concrete browser mechanism during implementation.

## Later contradictions and risks

### R5 — Medium: the full finale refers to an additional undefined Benchmark

**Evidence:** [FULL_GAME.md, Chapter V](FULL_GAME.md) asks the player to complete a “readiness Benchmark.” Its preceding Universal Compatibility Test already grants access to the final calculation. [ROADMAP.md, Phase 13](ROADMAP.md) specifies readiness work and a configuration comparison, but no distinct changed rule, reward, or named Benchmark for Chapter V.

**Consequence:** the final implementation could add an unplanned gate or treat the same completion as two rewards. This repeats the kind of ambiguity previously removed from the v1 finale.

**Close before Chapter V production:** explicitly identify readiness as the already completed Universal Compatibility Test, or define a new Benchmark with its own justified scope. Prefer reuse; the ending already has preparation, revelation, and a useful Job. This does not block v1.

### R6 — Medium: the fork storyline conflates independent methods with different assumptions

**Evidence:** [COSMIC_ABSURDITY.md, Standards Committee of Me](content/COSMIC_ABSURDITY.md) says a matching result from different starting assumptions is useful evidence. [FULL_GAME.md, Universal Compatibility Test](FULL_GAME.md) requires a shared explicit model and matching assumptions. [TECHNICAL_DESIGN.md](TECHNICAL_DESIGN.md) likewise tests independent checks against the declared model.

**Consequence:** the scene's apparent correct answer can disagree with the Benchmark's correct action. Agreement across different models can be a separate observation, but it does not by itself verify one declared calculation.

**Close before the cosmic verification slice:** distinguish independent executions/methods under the same declared assumptions from comparing results across alternative assumptions. Give the player two or three authored cases whose labels and outcomes agree with that distinction. Keep the philosophical observation that agreement alone does not establish relevance.

### R7 — Medium: the ending's interpretation is stronger than its specified calculation

**Evidence:** [FULL_GAME.md, Chapter V](FULL_GAME.md) calls 42 a verified output of a supplied model but never specifies what that model computes or what the result's provenance panel will actually show. The missing-purpose theme is already stated at the end of v1.

**Consequence:** the finale could feel like an arbitrary constant followed by a repeated missing-field joke. The intended distinction between correctness and relevance is good, but its dramatic evidence is not yet concrete.

**Close before committing to full-game narrative production:** write a short playable storyboard with the exact input/model description, what completion verifies, what the output means within that fiction, and what still cannot be inferred. It need not be a scientifically real existential solver. Test whether the ending changes the player's understanding rather than simply repeats Chapter I. No new cosmic systems are needed to test this on paper or with a small later prototype.

### R8 — Medium: milestone tickets and narrative promises are larger than their labels suggest

**Evidence:** [Ticket 02](../.scratch/v1/issues/02-first-five-minutes.md) combines the first engine, economy, two interaction modes, hardware, objectives, saves, audio, and a Benchmark. Later tickets combine whole Eras. [COSMIC_ABSURDITY.md](content/COSMIC_ABSURDITY.md) adds city dioramas, fork identities, broadcasts, and experiment histories, even though it correctly says they reuse existing systems.

**Consequence:** “one ticket” and “no new currency” are not reliable measures of delivery effort. A whole-Era batch can delay feedback on the one unproven decision. Reusing an allocation rule still leaves UI, content, persistence, and QA work.

**Close when each phase is selected:** keep the phase acceptance boundary but divide execution into independently demonstrable vertical slices. For Phase 1: first Job/purchase with save and input behavior; then Safe Mode Payroll/auto-run and its recovery. For later chapters, prove one world or one fork scene before producing all variations. Scope the art/content effort explicitly and keep the sixteen reference-menu entries optional.

## Ready versus deferred

| Area | Readiness | Next evidence needed |
| --- | --- | --- |
| Phase 0: scaffold and minimal OS shell | Ready | Fresh install/scripts, production load, smoke tests, keyboard focus, target-viewport inspection |
| Phase 1: first five minutes | Ready to develop iteratively after R1–R4 are specified within the slice | A real opening route and observed first-purchase/Automation times |
| Remaining v1 | Direction is ready; each slice still needs its local content/requirements table | Full unlock path, new-constraint explanation, baseline and inefficient playthroughs |
| Chapters II–IV | Campaign plan, not final production spec | Distinct playable decisions and bounded content costs; R6 before verification |
| Chapter V | Narrative direction ready; exact scene/calculation not ready | R5 and R7 resolved through a concrete storyboard |
| Art/title/final names | No scaffold blocker | One coherent opening visual treatment before polished content production |

The provisional 8–12 hours is a target, not evidence of enough gameplay. Five v1 Eras and their interactions are also a density risk to measure, not a proven flaw to remove before playing.

## Recommended next sequence

1. When the user resumes implementation, complete Phase 0 without speculative later-game modules.
2. At the start of Phase 1, close R1–R4 with a compact data/behavior contract in the canonical mechanics, balance, and technical documents. Routine choices can be made autonomously and labeled provisional.
3. Deliver the first Job → purchase → save/reload path, then the Benchmark → auto-run path. Observe whether the opening is satisfying before extending it.
4. Continue one Era at a time. Resolve later findings at their owning phase; do not delay the first playable game for final cosmic numbers, art, or all reference content.

## Verification and limits

This review inspected specifications and their cross-document relationships using the codebase-design skill's small-Interface/testable-behavior lens. It did not apply a code-review workflow because there is no runtime code or code diff to review.

Documentation links, numbering, and dependency checks can establish navigability. They cannot establish economy balance, fun, narrative comprehension, or save correctness. No build, gameplay tests, or visual playtest has run. The findings above are specification gaps and design risks, not claims of observed software failures.
