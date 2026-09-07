# Implementation roadmap

Build in vertical slices. A phase is complete only when its acceptance criteria pass and `docs/CONTINUITY.md` is updated.

## Phase 0: Repository scaffold

### Work

- Scaffold React, TypeScript, and Vite.
- Add strict TypeScript, linting, formatting, Vitest, and Playwright.
- Create the proposed source layout without speculative empty modules.
- Add CI-ready scripts: `dev`, `build`, `typecheck`, `lint`, `test`, and `test:e2e`.
- Add a minimal OS shell and smoke test.

### Acceptance

- Fresh install and every script run successfully.
- Production build loads without console errors.
- Unit and browser smoke tests pass.
- README commands match reality.

## Phase 1: First five minutes

### Work

- Implement deterministic clock, `GameState`, command path, and selectors.
- Create the beige OS shell, Job Runner, timing interaction, Cash, first job, and first CPU/RAM purchases.
- Add visual and synthesized audio feedback.
- Add save schema v1, autosave, reset, and development time controls.

### Acceptance

- First-time player understands the interaction without instructions beyond one sentence.
- First purchase is reachable in 20-40 seconds.
- Clicking rapidly provides no advantage over accurate timing.
- Economy tests use a fake clock and fixed seed.
- Reload restores the exact meaningful state.

## Phase 2: Automation and home PC

### Work

- Add Task Manager and automated job processing.
- Add storage, software, GPU, and cooling in an unfolding order.
- Add named upgrades, tooltips, announcements, achievements, and first environment transformation.
- Add Batch Queue active interaction or a simplified v1 version.

### Acceptance

- Automation arrives around 3-5 minutes in baseline play.
- Old manual processing becomes optional but active play remains valuable.
- No visible locked feature lacks a useful explanation.
- Home-PC transformation is visually unmistakable.

## Phase 3: Workstation and Research

### Work

- Add Research currency and Research Lab.
- Implement spare-compute research generation and milestone research rewards.
- Add power, overclocking, thermal inefficiency, Thermal Window interaction, and workstation jobs.
- Expand the OS narrator's personality and industry satire.

### Acceptance

- Research unlocks around 18-22 minutes.
- First research purchase is reachable within two minutes.
- Heat and power causes and effects are explainable from the UI.
- Overclock failure ends a bonus but never destroys progress.

## Phase 4: Rack and network

### Work

- Add the first rack transition, Network app, bandwidth, remote jobs, and Packet Route interaction.
- Add brief grid/network incidents and questionable-upgrade consequences.
- Introduce stronger automation summaries so interface complexity remains manageable.

### Acceptance

- Rack transition occurs around 30-35 minutes in baseline play.
- Network adds a new opportunity rather than another identical multiplier.
- Incidents state cause, effect, duration, and recovery.
- Earlier chores require no repeated attention.

## Phase 5: Data-center climax

### Work

- Add facility, grid, rack expansion, late hardware tiers, and final research chain.
- Implement Incident Console, controlled-chaos presentation, and final benchmark sequence.
- Complete v1 announcement, achievement, job, and upgrade content.
- Add credits/about and an explicit “v1 complete” continuation state.

### Acceptance

- Baseline completion falls within 55-75 minutes.
- The final transformation and benchmark are visually and sonically distinct.
- V1 foreshadows the impossible question without revealing 42.
- Continued play remains stable after the ending.

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
- Reload, import, migration, and reset are verified.
- No required interaction depends on sound, color alone, or rapid clicking.
- The repository continuity document describes any known limitations.

## Later releases, not authorized by this roadmap

- Prestige through architectural redesign or new computing eras
- Offline progress
- Movable windows
- Planetary, stellar, and cosmic computing
- Multiple interacting reset layers
- The ultimate question and answer reveal

