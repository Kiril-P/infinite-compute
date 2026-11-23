# Implementation roadmap

This is the complete campaign delivery roadmap. [FULL_GAME.md](FULL_GAME.md) owns the later chapter design. Phases 0–6 deliver Chapter I / v1; Phases 7–15 extend the same save through the full ending.

Current execution: stopped at the user’s 2026-09-08 request after verified Phase 3 (D-026). Phases 0–3 / tickets 01–04 are complete; tickets 05–07 remain not-started. The v1 goal from D-025 is unfinished. Resume with Phase 4 only when the user asks; the intended v1 boundary remains Phase 6. Build in vertical slices with verified checks and synchronized ticket/continuity. Later Chapters and deployment remain outside that goal.

Later phases are planning envelopes. Before implementing one, turn its smallest demonstrable behavior into a local ticket with schema/state, commands, UI, persistence, and tests together. Validate the new decision before expanding its content. Split any phase too large for a fresh context; phase completion still requires the whole listed acceptance boundary.

For implementation and continuation, follow [the build loop](agents/build-loop.md). Ticket execution state, verified checkpoints, and resource-stop rules govern progress through these phases.

## Phase 0: Repository scaffold

### Work

- Scaffold React, TypeScript, and Vite.
- Add strict TypeScript, linting, formatting, Vitest, and Playwright.
- Create the proposed source layout without speculative empty modules.
- Add CI-ready scripts: `dev`, `build`, `typecheck`, `lint`, `test`, and `test:e2e`.
- Add a minimal OS shell and smoke test.
- Add shared Current Objective, global status, and application-focus seams using placeholder content.

### Acceptance

- Fresh install and every script run successfully.
- Production build loads without console errors.
- Unit and browser smoke tests pass.
- README commands match reality.
- The main dashboard fills the viewport without vertical scrolling, including narrow desktop browser panels; application switching preserves visible controls and keyboard focus. Its visual presentation feels like the fictional OS game (D-023).
- The main PC uses code-authored layers, responds to application/component inspection, and supports pausing animation and reduced motion (D-024); no generated main-PC bitmap is used.

## Phase 1: First five minutes

### Work

- Implement deterministic clock, `GameState`, command path, and selectors.
- Create the beige OS shell, Job Runner, timing interaction, Cash, first job, and first CPU/RAM purchases.
- Add visible component breakpoints and the first contextual Help Center entry.
- Add visual and synthesized audio feedback.
- Add save schema v1, autosave, reset, and development time controls.
- Add Safe Mode Payroll and basic Task Manager auto-run with next-action/waiting text; this phase owns the 3–5 minute Automation unlock.
- Establish the inherited background directive and first short OS observation through normal play. Add relaxed decision controls alongside timing input.

### Acceptance

- First-time player understands the interaction without instructions beyond one sentence.
- First purchase is reachable in 20-40 seconds.
- Clicking rapidly provides no advantage over accurate timing.
- The Current Objective states exact requirements and focuses the relevant application.
- Economy tests use a fake clock and fixed seed.
- Reload restores the exact meaningful state.
- Safe Mode Payroll grants auto-run at 3–5 minutes without requiring Automation or precise reflexes; duplicate completion cannot duplicate rewards.
- The opening directive survives the first Job without hiding the concrete Current Objective.

## Phase 2: Automation and home PC

### Work

- Extend the existing Task Manager with queue policy and policy explanations; auto-run and Safe Mode Payroll are already complete in Phase 1.
- Add storage, software, GPU, and cooling in an unfolding order.
- Add named upgrades, tooltips, announcements, achievements, and first environment transformation.
- Add Batch Queue active interaction or a simplified v1 version.
- Add the Memory Pressure Test, queue policy, and visible compression of the opening Job.
- Use two existing content slots for the One-Function Wonder peripheral Job and Completion Contractor queue message from the cosmic-absurdity treatment; this adds no v1 subsystem.

### Acceptance

- The Phase 1 auto-run remains available; Home-PC progression adds no repeated requirement to earn it.
- Old manual processing becomes optional but active play remains valuable.
- No visible locked feature lacks a useful explanation.
- Home-PC transformation is visually unmistakable.
- At least one short, reversible satirical software choice has a clear real effect and a viable ordinary alternative. A normal-play OS beat connects it to the inherited directive.

## Phase 3: Workstation and Research

### Work

- Add Research currency and Research Lab.
- Add the small reversible Research configuration and initial Operating Profiles.
- Implement spare-compute research generation and milestone research rewards.
- Add power, overclocking, thermal inefficiency, Thermal Window interaction, and workstation jobs.
- Add the Heat Soak Certification and automatic fan-curve reward.
- Expand the OS narrator's personality and industry satire.

### Acceptance

- Research unlocks around 18-22 minutes.
- First research purchase is reachable within two minutes.
- Heat and power causes and effects are explainable from the UI.
- Overclock failure ends a bonus but never destroys progress.
- Job and Research allocations never spend the same capacity twice. Recompile conserves refundable Research and preserves permanent discoveries.
- Heat Soak tests an already introduced constraint and supports an untimed configuration solution.

## Phase 4: Rack and network

### Work

- Add the first rack transition, Network app, bandwidth, remote jobs, and Packet Route interaction.
- Add the Brownout Drill and operations-policy controls.
- Add brief grid/network incidents and questionable-upgrade consequences.
- Introduce stronger automation summaries so interface complexity remains manageable.

### Acceptance

- Rack transition occurs around 30-35 minutes in baseline play.
- Network adds a new opportunity rather than another identical multiplier.
- Incidents state cause, effect, duration, and recovery.
- Earlier chores require no repeated attention.
- Remote Job output shows transfer constraints; unrelated local Jobs retain their correct processing rate. Random disruption cannot stack with a Benchmark.

## Phase 5: Data-center climax

### Work

- Add facility, grid, rack expansion, late hardware tiers, and the Chapter I closing Research chain.
- Add Packet Loss Audit and the subsequent interface-driven V1 Ending; the final calculation is not a second hidden Benchmark.
- Implement Incident Console, controlled-chaos presentation, and final benchmark sequence.
- Complete v1 announcement, achievement, job, and upgrade content.
- Add credits/about and an explicit “v1 complete” continuation state.

### Acceptance

- Baseline completion falls within 55-75 minutes.
- The final transformation and benchmark are visually and sonically distinct.
- V1 establishes the quest through normal-play beats and ends with an undefined completion estimate for the inherited request, without revealing 42.
- Continued play remains stable after the ending.
- Reload during each presentation phase restores a safe state; completion rewards occur once and the ending can be replayed.

## Phase 6: Polish and release candidate

### Work

- Run multiple instrumented balance playthroughs.
- Fix stalls, dead purchases, unreadable states, overflow, and save edge cases.
- Complete keyboard, reduced-motion, sound, and viewport QA.
- Verify historical/technical claims and finalize parody names.
- Remove development shortcuts from production builds or gate them securely.

### Acceptance

- All automated checks pass.
- No progression blocker appears across representative purchase orders.
- No critical-path purchase order or Benchmark solution requires an external guide.
- Reload, import, migration, and reset are verified.
- No required interaction depends on sound, color alone, or rapid clicking.
- The repository continuity document describes any known limitations.
- A playtester who ignored the archive can describe the OS ambition and at least one satirical incentive. Configuration-only progression after auto-run is viable.
- The first Automation, Benchmark, and Transition schedule agrees with the recorded baseline trace.
- Early references work as original jokes without recognizing Rick and Morty and add no required interaction or extra Automation delay.

## Phase 7: Regional placement slice — Chapter II

**Depends on:** Phase 6 and a completed v1 save fixture.

Deliver one distributed Job across three representative sites, with data locality, a visible serial stage, placement forecasts, and The Perfect Scaling Demonstration. Carry owned upgrades and policy intent into the new chapter. Add one platform contract with an ordinary alternative and the OS's observation about competing success metrics. Dress an existing Research experiment as the first Sandbox World with a visible host budget and a short petition; validate one world before adding variants.

**Acceptance:** placement can outperform raw expansion for an explained reason; serial work cannot be accelerated indefinitely by replicas; the Benchmark awards automatic dispatch; previous saves migrate and previous production remains available. Validate this decision before adding the remaining regional Jobs.

## Phase 8: Planetary coordination — Chapter II completion

**Depends on:** Phase 7.

Deliver inter-region batches, delay-aware forecasts, regional scheduling, The Planetary All-Hands, a globe transformation, and the orbital construction objective. Continue the diagnostics civilization through existing Research content; optional strange broadcasts and labeled counterfactual builds foreshadow later events.

**Acceptance:** bandwidth and latency have distinguishable effects; local Jobs proceed during coordination; safe default policies complete the critical path; no individual rack demands attention. The satire of competing universal standards and the quest's unresolved requirements are visible during ordinary play.

## Phase 9: Orbital construction slice — Chapter III

**Depends on:** Phase 8.

Deliver the seed foundry purchase, Fabrication, one complete collector/radiator/processor construction loop, allocation forecasts, and The Vacuum Cooling Demonstration. Extend safe saves and profile switching through construction cancellation. Reuse the existing power/thermal concepts. The Elsewhere Exhaust vendor callback uses the same truthful thermal breakdown; it cannot actually remove heat from accounting.

**Acceptance:** the first producer has a guaranteed bootstrap path; zero spendable Fabrication can recover; resource handoff preserves old balances; more collection can be useless without radiators; the first construction template removes repeat provisioning. Validate the allocation decision before multiplying build tiers.

## Phase 10: Stellar swarm — Chapter III completion

**Depends on:** Phase 9.

Deliver finite aggregate swarm growth, throughput/efficiency profiles, The Infinite Growth Forecast, autonomous provisioning, stellar presentation, and seed-fleet readiness. Add specialized quantum Jobs only if they create a clear choice in the prototype; they remain optional. Continue the Sandbox story with an authored nested-research disclosure and sky-advertising proposal within the same bounded host allocation.

**Acceptance:** hardware, energy, and heat have explainable tradeoffs; one smarter configuration visibly outperforms brute-force growth; numbers remain finite and purchase comparisons reliable; the player can name the misleading assumption in the vendor's infinity forecast.

## Phase 11: Interstellar delegation slice — Chapter IV

**Depends on:** Phase 10.

Deliver two representative distant regions, scheduled message/result transit, local policies, age/location labels, and The Reply-All Incident. Start with one clear latency scenario before expanding the network. Existing regional OS Forks gain distinct histories and messages; no additional sites or duplicate economy are created for their personalities.

**Acceptance:** local progress continues while reports are delayed; undelivered output is not credited early; delegated policy is demonstrably better than central approval for the taught case; reload preserves transit and reward ordering. Keep ordinary safe production independent of timely player responses.

## Phase 12: Cosmic verification — Chapter IV completion

**Depends on:** Phase 11.

Deliver bounded regional aggregation, independent result verification, model/provenance comparison, The Universal Compatibility Test, and explicit final-run readiness. Audit arithmetic against the actual maximum chapter values before expanding scale. Stage the verification Benchmark as the Standards Committee of Me, with a normal-play callback from a Sandbox World asking its creator about purpose.

**Acceptance:** duplicate results are distinct from independent verification; comparison uses clearly identified assumptions; pending/inaccessible results do not count; the verification decision is understandable without specialist knowledge. The full ending becomes reachable through finite conditions.

## Phase 13: Final calculation and useful purpose — Chapter V

**Depends on:** Phase 12.

Deliver playable readiness work, the checkpointed calculation, verified 42 result, inspection of the inherited request, and a choice among three bounded useful Jobs through existing controls. Complete the selected Job, sensory callback, credits, replay, and optional continued play. A preserved Sandbox World or a fork's memory can personalize the epilogue; provide the ordinary equivalent for players who skipped optional story content.

**Acceptance:** the number is earned and reproducible in the fictional model; the missing purpose is understandable without archive hunting; no philosophical guess or manual entry of 42 gates completion. Every epilogue choice is valid and remains reversible after its scene. Saves survive every phase and no progress is reset.

## Phase 14: Campaign integration and balance

**Depends on:** Phase 13.

Run full-save migrations and representative playthroughs across all Chapters. Tune the provisional 8–12 hour attentive budget; shorten or merge weak Eras rather than stretch waits. Verify the ordinary route without optional events, dubious contracts, reflex bonuses after auto-run, or offline progress.

**Acceptance:** each Era earns its distinct decision; resource introduction has no circular dependency; all Benchmark exit/retry and profile/refund cases preserve recovery; compressed systems remain inspectable. Players recognize recurring satire, OS continuity, and the final distinction between answer and purpose.

## Phase 15: Full-game release candidate

**Depends on:** Phase 14.

Complete performance, keyboard/relaxed controls, reduced motion, audio, small target viewport, long-save, import/export, and ending interruption QA. Verify factual tooltips against primary sources, finalize fictional identities, and remove or securely gate development controls.

**Acceptance:** all required checks pass; unsupported/corrupt saves recover without silent loss; runtime work scales with representative groups, not fictional machine count; chapter and final replays cannot duplicate rewards. Verify that comic fake memories, forecasts, and promotional metrics never alter saved facts or actual resource accounting. Record measured pacing, content limitations, and the exact delivered campaign state in continuity.

## Optional features outside the critical path

Offline progress, movable windows, scripting, and replay/prestige modes require their own value test and scope decision. They do not block the planned full ending. Multiplayer, loot/trading, nested resets, and further multiverse escalation are outside this campaign baseline.
