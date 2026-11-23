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

## D-012 — Era control-compression pattern

**Status:** Accepted
**Decision:** Each Era follows “perform, understand, automate, configure, compress, then face a new decision.” A deterministic Benchmark concludes the Era by temporarily changing one familiar rule, diagnosing the limiting Bottleneck, and awarding related permanent relief. This applies the strongest shared lessons from Magic Research 2 and Antimatter Dimensions without adding prestige to v1.

## D-013 — Reversible Research and automation configuration

**Status:** Accepted
**Decision:** Research introduces a small reversible configuration with no permanently exclusive nodes. Task Manager automation matures from auto-run to queue policy to operations policy, preserves configured intent before capacity exists, and gains a small set of named Operating Profiles.

## D-014 — The Quest for Meaning is the main background story

**Status:** Accepted; explicit user direction, 2026-09-07.
**Decision:** The computer pursues Infinite Compute to answer an inherited request about existence. The full-game result is 42; the point is the distinction between finding an answer and understanding the question. Technology-industry satire must recur through gameplay and the background narrative across the entire campaign. The user's thematic reference is *The Hitchhiker's Guide to the Galaxy*; create original characters, situations, dialogue, and visual identity.
**Clarifies:** D-002, D-005, and D-006. The literary premise can be explicit in internal design documents. V1 establishes the quest through ordinary play; it does not postpone the main story to a sequel or reveal 42 early.

## D-015 — Plan the complete campaign; keep implementation paused

**Status:** Accepted scope; explicit user direction, 2026-09-07.
**Decision:** Audit and improve the plan and define the rest of the game. This session changes documentation only. Chapter I remains the bounded v1 delivery; planning later Chapters does not authorize starting runtime work now.
**Clarifies:** D-009. The data-center endpoint is a release boundary, not the limit of the design. FULL_GAME.md and the expanded ROADMAP.md own the complete campaign.

## D-016 — A finite campaign pursuing Infinite Compute

**Status:** Planned design baseline; pacing and staging require playtests.
**Decision:** Use five Chapters from household computing through planetary, stellar, and cosmic federation, then an authored result and epilogue. Provisionally target 8–12 attentive hours including v1, with no enforced minimum wait. Infinite Compute names the ambition, not a literal attained balance value. The Final Answer is a reproducible fictional-model output whose significance remains undefined without a meaningful question. The final useful Job preserves the value of the player's engineering.
**Clarifies:** D-006. The story resolves without asserting that physical infinity is achieved or that a number proves the meaning of life.

## D-017 — Forward growth, compressed controls, and a bounded resource set

**Status:** Planned design baseline; validate each new Era before expanding its content.
**Decision:** Preserve the same machine and save across forward Transitions. No required prestige or nested reset currencies in the authored campaign. Add Fabrication once when orbital construction replaces commercial procurement; keep power, cooling, and transport as reusable Capacities. Offline progress, scripting, and movable windows remain optional decisions independent of campaign completion.
**Clarifies:** D-007, D-009, and D-012. Compression supplies the relief and scale usually associated with resets. New chapters must earn different decisions rather than repeat a new currency shop.

## D-018 — Opening Automation ownership and accessible Benchmarks

**Status:** Planned design correction, supersedes conflicting phase/ticket descriptions.
**Decision:** Phase 1 / ticket 02 owns Safe Mode Payroll and basic Task Manager auto-run at 3–5 minutes. Phase 2 extends queue policy and adds Memory Pressure Test. Each Era has one formal Benchmark, which may precede its final Transition. Benchmarks alter a familiar rule and support untimed configuration; baseline Job work and relaxed decision controls prevent reflex precision from gating the story.
**Clarifies:** D-004 and D-012. The perform/automate/compress arc remains; Benchmark placement serves pacing rather than forcing Automation to arrive only at the Era's last purchase.

## D-019 — Honest objectives and safe reversible Research

**Status:** Planned design correction.
**Decision:** Separate concrete Current Objectives from the inherited Impossible Question. The V1 Ending cannot estimate completion of an unspecified request; show that condition rather than effectively zero percent. Permanent Research discoveries remain owned and nonrefundable; reversible tuning refunds exactly its paid cost without duplicating rewards or removing unlocks. Jobs and Research share one delivered Compute budget.
**Clarifies:** D-003 and D-013 and supersedes old v1 endpoint wording in ticket 06 and earlier handoffs. The OS may misunderstand purpose while the actionable interface remains trustworthy.

## D-020 — Rick and Morty as a major creative influence

**Status:** Accepted direction; explicit user request, 2026-09-07.
**Decision:** Incorporate many of the show's appealing broad concepts and optional references: reckless inventions, worlds inside worlds, alternate selves, cosmic bureaucracy, absurd broadcasts, and intelligence without self-understanding. Develop original situations, voices, names, and visuals inside the computer-first game. The Quest for Meaning and planned 42 ending remain the main story.
**Clarifies:** D-002, D-014, and the original-parody direction. This is a substantial creative influence, not a crossover or instruction to copy characters, dialogue, or episode plots. The user has not resumed implementation.

## D-021 — Hosted worlds and divergent selves within the existing campaign

**Status:** Planned content and mechanics baseline; validate in the owning chapter slices.
**Decision:** Use three recurring threads: the civilization in the diagnostics, the committee of possible selves, and the perfect shortcut. Sandbox Worlds consume host capacity and yield finite discoveries; OS Forks inhabit existing autonomous sites with distinct histories. Fictional gateways connect hosted experiments and do not erase physical latency. V1 substitutes two small content slots; later threads reuse Research, policies, placement, and verification. The influence adds no required Chapter, resource, prestige layer, or alternate true ending.
**Clarifies:** D-016 and D-017. COSMIC_ABSURDITY.md under docs/content owns the reference menu, original scenes, and scope budgets; the canonical campaign and roadmap place their required beats.

## D-022 — Resume implementation for Phase 0 only

**Status:** Accepted; explicit user direction, 2026-09-07.
**Decision:** Implement the repository scaffold ticket, preserve existing uncommitted documentation, verify all required scripts and the OS shell manually, update execution/continuity, and stop after verified Phase 0 completion. Routine engineering choices are authorized. The next phase is not part of this task.
**Supersedes:** The planning-only execution pause in D-015 and the historical authorization note in D-020. Campaign scope and all later-phase design gates remain as planned.

## D-023 — Full-screen game presentation without dashboard scrolling

**Status:** Accepted requirement; explicit user feedback, 2026-09-07. CRT/pixel-art treatment is the implemented visual direction, subject to further visual feedback.
**Decision:** The main dashboard fills the available browser viewport and never scrolls vertically. Preserve visible status, Current Objective, active application, and application dock. At narrow widths show one application at a time and switch through the shared navigation command; do not stack windows into a long page or simply clip needed controls. Use a strongly stylized game presentation: physical CRT framing, restrained static scanlines, phosphor/amber colors, tactile controls, pixel typography, and original computer artwork.
**Clarifies:** D-007 and D-022. This reopens Phase 0 presentation only, preserves coordinate-independent application contents, and does not authorize Phase 1 gameplay or browser fullscreen API activation.


## D-024 — The computer is a stateful drawing, not a generated image

**Status:** Accepted; explicit user feedback, 2026-09-07.
**Decision:** Build the main computer from code-authored, independently animated parts. Hardware changes, Jobs, and machine state must be able to alter individual components, screen contents, and motion. Phase 0 implements an SVG monitor/case/CPU/fan/RAM with real application and component inspection state, pause animation and reduced-motion support. Future gameplay states arrive with their owning slices. Remove the generated PC image from runtime and preserve it only as an archived exploration. Simplify decorative scene framing and slogan-like copy so the machine carries the presentation.
**Clarifies:** D-023's no-scroll and stylized game requirements remain. Its generated pixel-art approach is superseded for the main machine; this does not authorize Phase 1 economy or generic animation infrastructure.


## D-025 — Implement through the v1 release candidate

**Status:** Accepted; explicit user authorization, 2026-09-07: continue working and create a goal to reach v1.
**Decision:** Complete tickets 02–07 / roadmap Phases 1–6, checking each acceptance boundary and maintaining execution/continuity. Preserve existing uncommitted work, the full-viewport dashboard, and the code-authored animated computer. Routine implementation/tuning choices are authorized. Stop at verified Chapter I / v1 completion; no later Chapter, deployment, or public release is implied. Follow the build-loop resource checkpoint procedure if continuation becomes unreliable.
**Supersedes:** D-022's Phase-0-only stopping boundary. D-023 and D-024's visual requirements remain.


## D-026 — Stop after the current Workstation phase and report the work

**Status:** Accepted; explicit user direction, 2026-09-08: “please finish up wherever you got to. report everything in a file”.
**Decision:** Finish verification and documentation for the current Phase 3 Workstation implementation, write a comprehensive implementation report, and stop before Phase 4. Preserve the local preview and existing uncommitted work. V1 remains unfinished; do not mark its goal complete or schedule further work. Resume the next phase only after a new user instruction.
**Supersedes:** D-025’s instruction to continue automatically through remaining v1 phases. The planned v1 boundary and all product/visual invariants remain unchanged.
