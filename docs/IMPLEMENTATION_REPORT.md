# Infinite Compute — implementation report

Recorded 2026-09-08, Europe/Madrid. Work stopped at the user's request after completing and verifying **Phase 3: Workstation and Research**. Phases 0–3 are complete; **v1 is not complete**. No Rack or Data Center implementation was started.

## What you can play

The game currently takes a beige family PC through Home PC into a Workstation. Jobs earn Cash, hardware changes throughput and bottlenecks, Benchmarks grant automation, and the Workstation splits a finite machine capacity between useful work and Research. Heat Soak Certification is the latest implemented required milestone. After that, the player can explore all eight Research nodes, tune profiles and continue Jobs; the next Era is not available yet.

Open the existing preview at [127.0.0.1:5173](http://127.0.0.1:5173/). Use the application dock or Current Objective button to navigate. The main dashboard fits the browser viewport without vertical scrolling. The computer is drawn from SVG/CSS parts and responds to hardware, activity, Research allocation, temperature and fan control. No generated bitmap is used for the main computer.

The preview remains running in development-server session `49432`. If it has stopped, run these commands from the repository:

```sh
cd '/Users/kirilpetrovski/Documents/coding/Game Dev/computer incremental'
npm run dev -- --port 5173 --strictPort
```

For a fresh installation, use the Node version described in [README.md](../README.md), then `npm ci` and `npx playwright install chromium`. For a production preview, run `npm run build` followed by `npm run preview`. Saves belong to the browser origin: export through Settings before changing browsers or ports. Hidden tabs pause; there is no offline catch-up.

## Delivered scope

| Roadmap phase / ticket | Execution | Delivered boundary |
| --- | --- | --- |
| Phase 0 / [01](../.scratch/v1/issues/01-repository-scaffold.md) | Complete | Repository scripts, typed React shell, checks, full-viewport game presentation and animated component-based PC |
| Phase 1 / [02](../.scratch/v1/issues/02-first-five-minutes.md) | Complete | First Jobs/purchases, CPU/RAM, optional timing or untimed decision, Safe Mode Payroll, auto-run, saves and audio |
| Phase 2 / [03](../.scratch/v1/issues/03-home-pc-automation.md) | Complete | Home PC, Storage, graphics/cooling, Memory Pressure, Batch Queue, software tradeoffs and recorded story |
| Phase 3 / [04](../.scratch/v1/issues/04-workstation-research.md) | Complete | Workstation, Research/profiles/respec, power/heat, Thermal Window, Heat Soak and automatic fan curve |
| Phase 4 / [05](../.scratch/v1/issues/05-rack-network.md) | Not started | Rack, Network, bandwidth/remote Jobs, Packet Route, Brownout Drill, Incidents and operations policies |
| Phase 5 / [06](../.scratch/v1/issues/06-data-center-finale.md) | Not started | Data Center, facility/grid, closing Research, Packet Loss Audit and recoverable v1 ending |
| Phase 6 / [07](../.scratch/v1/issues/07-balance-and-release.md) | Not started | Full-run balance, independent playtesting, final content/accessibility/audio QA and release candidate |

### Shell and presentation

- Full-viewport CRT-style OS: persistent status, Current Objective, focused application, system message and dock. Smaller browser panels show one application in place; controls are paged rather than stacked into a scrolling dashboard.
- Code-authored monitor, case, CPU, RAM, storage, graphics cards and fans. Hardware inspection highlights actual components. The scene grows into a Home desk and then a Workstation with two displays.
- Terminal activity, installed parts, Research activity and fan behavior use actual game snapshots. Animation can be paused and respects reduced motion. Sound is opt-in, with volume and mute controls and distinct Workstation cues.
- The earlier generated-PC exploration is retained only at `docs/art/archive/beige-pc.png`; it is not shipped in the game. The licensed Silkscreen font and small SVG icon remain.

### Opening and Home PC

- A deterministic Job loop earns Cash and finances CPU/RAM. Optional bonuses reward a timing decision or an explained untimed choice; repeated clicking cannot supply authoritative rewards.
- Safe Mode Payroll preserves ordinary work, tests a familiar constraint and permanently unlocks auto-run. Required progress remains possible without optional bonuses.
- Storage enables photo work; a Wide bus and component preparation lead to Home PC. Memory Pressure explains a stall, supports safe configuration/retry and grants Batch Queue.
- GPU specialization changes which Jobs are attractive. Cooling restores graphics airflow, with explicit raw-to-effective rates. Queue policies state the next action or waiting reason.
- Optional Renewal Systems software exposes its fee, renewal, suspension and cancellation behavior. Cosmetic scores do not secretly improve real throughput.
- The OS narrates its growing ambition through ordinary progress. Announcements, milestone messages, cosmetic achievements and the Question Archive preserve history. Required progression does not depend on random events or opening the Archive.

### Workstation and Research

- Transition requires Memory Pressure, CPU 12 / RAM 8 / Storage 4 / GPU 4 / Cooling 3 and $2,500. Existing work, parts, automation, software and history survive the transition; it grants 5 Research once.
- Workstation scales raw CPU/GPU capacity and subsequent repeatable hardware prices by 10. Hardware caps become CPU 16, RAM 12, Storage 6, GPU 6 and Cooling 5; Power has two upgrades.
- Jobs and Research share one finite capacity budget. Balanced reserves 25% for Research, Throughput 10%, Research 70%; idle/setup capacity and incompatible spare graphics capacity can be used for Research.
- Research normally earns one point per 10,000 allocated work. Current points, fractional progress, lifetime earnings, permanent discoveries and the paid cost of tuning are tracked separately.
- Protein work units provide a graphics-compatible Job: 50,000 work, $16,000 base payout, 36 MB and four seconds of base setup. The first completion awards 5 Research once.
- Profiles preserve queue policy, enabled tuning and Eco/Standard clock intent. Applying a profile only enables owned tuning. Refunded selections remain visible as unavailable intent; applying a profile never silently buys them.
- Recompile refunds the exact paid tuning costs, preserves permanent discoveries and milestones, and ends the current optional boost. No Research purchase is permanently exclusive.

| Research node | Cost | Ownership | Effect |
| --- | --- | --- | --- |
| Parallel Library | 40 | Permanent | Unlock protein work units |
| Queue Compiler | 60 | Permanent; Library required | Future setup takes 60% of its previous duration |
| Branch Cache | 25 | Refundable tuning | +15% raw CPU |
| Wide Vectors | 25 | Refundable tuning | +25% raw GPU |
| Thermal Model | 70 | Permanent; Library required | Unlock Thermal Window and Heat Soak |
| Open Interconnect | 100 | Permanent; Compiler required | Reduce modeled power demand by 15% |
| Efficient Pages | 35 | Refundable tuning | Memory efficiency ×1.1, capped at 100% |
| Research Notebook | 50 | Refundable tuning; Thermal Model required | +20% Research conversion from allocated work |

### Power, heat and thermal mastery

- Task Manager and Hardware Manager show demand, supply, temperature, equilibrium and the exact power/heat efficiency factors. Memory and graphics airflow remain part of the same explanation.
- Supply starts at 450 W; each Power upgrade adds 150 W. Standard uses full clock/draw. Eco uses 80% clock and 65% draw. The modeled temperature approaches equilibrium gradually; warning begins at 60°C and throttling above 70°C reaches 50% efficiency at 90°C.
- Thermal Window is an optional 15-second overclock opportunity, available once per 60 seconds of ordinary active time. Two broad timing adjustments or an explained untimed cooling plan maintain the boost. Mistakes end only that opportunity, without destroying Cash, Research, Jobs or hardware.
- Heat Soak requires Thermal Model, previously observed ordinary warmth and CPU 14 / RAM 10 / Cooling 4 / Power 1. Its changed rule fixes effective Cooling at 2. It requires 1.2 million work and a finishing temperature at or below 70°C.
- The test isolates and preserves ordinary Jobs, Research generation, software renewal, temperature and optional window/cooldown. Attempts survive reload. Unsafe Standard attempts can fail with a clear free exit/change/retry path; Eco is a free safe solution.
- A safe but initially hot machine can finish work before it finishes cooling. It now displays “Cooling to certify,” retains that state across reload and passes once the temperature is safe.
- Success grants a permanent automatic fan curve and exactly 10 Research once, then restores ordinary work. Required progress never demands the optional Thermal Window.

Full formulas and execution evidence are in the [Workstation contract](WORKSTATION_CONTRACT.md); opening and Home rules are in the [opening](OPENING_CONTRACT.md) and [Home-PC](HOME_PC_CONTRACT.md) contracts.

## Architecture and save reliability

React renders snapshots and sends typed commands to a framework-independent TypeScript simulation. Content/tuning data lives outside React. The simulation uses deterministic stepping and seeded state; tests exercise the public command/state interface. Research and thermal calculations have separate modules behind that interface. Matt Pocock's codebase-design and TDD skills were used for these seams and behavior tests. No new dependency was added during the v1 continuation.

The current save envelope is **schema 8**, with game version `0.3.0`. Migrations accept schemas 1–7 and supply new fields without erasing previous progress. Validation checks finite values, prerequisites, ownership, paid tuning conservation, profile intent, hardware caps, thermal windows and isolated Benchmark states.

Persistence includes a backup, recovery for corrupt primary data, export of rejected/future saves, deliberate import/reset flows and a single-writer policy across tabs. Failed reads/writes preserve existing progress and expose the storage problem. Autosaving is periodic at two seconds and also flushed by commands. Development-only speed/trace controls do not ship as usable production shortcuts; the speed multiplier resets on reload.

## Verification results

Final code verification on 2026-09-08:

| Command / check | Result |
| --- | --- |
| `npm run lint` | Passed, including ESLint and Prettier |
| `npm test -- --disableConsoleIntercept` | **39 tests passed across 10 files** |
| `npm run typecheck` | Passed |
| `git diff --check` | Passed |
| `npm run test:e2e` | **32 tests passed**; production build/typecheck also passed |
| Manual live Workstation play | Passed the exercised flows below |
| Final compact-screen image inspection | Six 640×480 thermal/application screenshots inspected |

The lint/unit/typecheck batch was session `75253`. The full production browser suite was session `93516` and finished in 1.3 minutes. It built 53 modules; production JS was 310.35 kB (96.14 kB gzip), CSS 34.60 kB (7.83 kB gzip). Browser processes emitted a harmless conflicting `NO_COLOR`/`FORCE_COLOR` warning; there was no failing test.

Browser projects cover normal 1440×900 and reduced-motion 1280×720 configurations, plus smaller desktop panels down to 640×480. Checks cover keyboard navigation, visible controls/text bounds, attempted page scrolling, component inspection, motion controls, hidden-time pausing, audio opt-in/mute, purchases, automation, software, archive, Research/profile/refund flows and thermal failure/reload/recovery. Save checks cover corrupt/future saves, import/reset, writer transfer and read/write failures.

Thermal unit checks include simultaneous bottlenecks, finite allocation, exact milestone rewards, preserved ordinary state at the success boundary, repeated-input protection, timing/decision parity, Notebook conversion/refund, migration and a hot fully populated machine that must cool after finishing the test workload.

Manual live checks used the existing saved game and actual UI actions, including the Workstation transition, component purchases, Research purchase by keyboard, tuning refund, saved-profile missing-selection feedback, protein completion, ordinary warmth, Standard Heat Soak failure at 77.8°C, free Eco retry, reload during the attempt, successful fan curve and restored ordinary output. Development acceleration was used for portions of manual preparation; timing claims below come from separate deterministic routes. The final 668×862 machine/shell screenshot and six final compact thermal screens were visually inspected.

Generated screenshots and the Playwright report remain under `test-results/` and `playwright-report/`. These are ignored, reproducible artifacts that the next test run may overwrite. Ticket comments retain earlier red tests, intermediate failures and final corrections.

### Measured progression

These are simulation traces through real commands, not independent novice playtests. The baseline uses the graphics-first Home route; the inefficient route buys CPU first and overpopulates the Workstation before recovering its bottlenecks. Neither uses paid software or optional bonuses after Payroll.

| Milestone | Baseline | Inefficient route |
| --- | --- | --- |
| First CPU | 24s with opening decisions | Same shared opening |
| Safe Mode Payroll / auto-run | 3m15s | 3m15s |
| Home PC | 8m54.1s | 8m54.1s |
| Memory Pressure passed | 15m55.9s | 15m55.9s |
| Workstation / Research unlocked | **21m49.6s** | 30m15.4s |
| First permanent Research purchase | **22m19.8s** — 30.2s after unlock | 30m45.5s — 30.1s after unlock |
| Heat Soak passed | **26m58.0s** | 38m49.7s |
| All eight Research nodes owned | **28m47.2s** | 40m02.9s |
| Longest single Workstation wait | 74.9s | 85.8s |

Ignoring opening bonuses gives a first CPU at 36 seconds. A separate allocation-probe route buys its first 25-point tuning 17 seconds after Research unlock. The baseline satisfies the 18–22 minute Research window and first-purchase-within-two-minutes criterion. The slower route demonstrates recovery from poor purchase order; it does not establish the final v1 timing target.

Reproduce the complete traces with:

```sh
npm test -- src/game/engine/home-route.test.ts --disableConsoleIntercept
npm test -- src/game/engine/workstation-route.test.ts --disableConsoleIntercept
```

### Problems found and resolved

- Compact Research controls and Task Manager/Job Runner text could overlap or fall outside their window. Layout constraints and redundant copy were corrected; the final suite checks the bounds and the screenshots were inspected.
- Eco at 70% draw did not safely certify a fully populated inefficient route. The verified setting is 65% draw at 80% clock.
- A hot, fast machine could complete the Heat Soak workload above the limit even with a safe equilibrium. The explicit saved cooling-to-certify state fixes this without adding a purchase or timing requirement.
- A browser assertion observed the previous periodic save instead of the live thermal cooldown. The test now observes the UI and verifies the next command-flushed save; production autosave timing was retained.
- Multi-file development HMR temporarily mixed journal definitions and state earlier in the work. The preview was stopped during subsequent schema/core changes and reloaded after validation. Final retrieved live errors were historical, ending at **07:16:40 UTC**; no newer error appeared. Production boot/reload regressions passed.

No required check is currently failing. Final documentation checks verified 39 Markdown files, 148 resolving local links, all seven ticket execution states, and the 61-line continuity handoff; whitespace passed. All 59 pre-continuation baseline files remain, including 32 byte-identical files; the other 27 contain authorized continuation changes. Independent player comprehension, subjective sound quality and whole-v1 balance remain unverified release work.

## Files and repository state

| Area | Main files |
| --- | --- |
| Browser lifecycle / OS composition | `src/app/App.tsx`, `game-session.ts`, `use-game.ts`, `navigation.ts` |
| Simulation | `src/game/engine/game.ts`, `research.ts`, `thermal.ts`, `journal.ts` |
| Content and tuning | `src/game/content/opening.ts`, `home.ts`, `software.ts`, `journal.ts`, `workstation.ts`, `thermal.ts` |
| Save migrations / validation | `src/game/persistence/save.ts` |
| Workstation applications | `src/ui/apps/ResearchLab.tsx`, `Capacity.tsx`, `Operations.tsx`, `HeatSoak.tsx`, `ThermalWindow.tsx`, `WorkstationTasks.tsx` |
| Machine / presentation | `src/ui/components/MachineVisual.tsx`, `src/ui/theme/machine.css`, `gameplay.css`, `desktop.css` |
| Audio | `src/audio/synth.ts` |
| Repeatable routes | `src/test/home-route.ts`, `workstation-route.ts` and corresponding engine tests |
| Production browser tests | `e2e/`, especially `workstation.spec.ts`, `thermal.spec.ts`, `persistence.spec.ts`, `viewport.spec.ts` |
| Durable implementation rules | Opening, Home-PC and Workstation contracts; canonical mechanics/balance/technical/content docs |
| Current handoff | [CONTINUITY.md](CONTINUITY.md), [ticket 04](../.scratch/v1/issues/04-workstation-research.md), decision D-026 |

Repository: `/Users/kirilpetrovski/Documents/coding/Game Dev/computer incremental`.

Branch: `kp/phase-0-scaffold`. HEAD: `1bbdb5ed7a01987f5aae6d249a33cd7bcaa4972b`. The working tree is intentionally dirty: the user's preexisting planning documentation and the implementation remain uncommitted. No commit, PR, deployment or public release was made. No baseline file was deleted; unrelated planning files are preserved. `package.json` and `package-lock.json` remain byte-identical to the pre-v1-continuation baseline. The baseline at `/private/tmp/infinite-compute-v1-baseline` is temporary evidence, not a durable backup strategy.

### Live preview at handoff

- Workstation; CPU 14 / RAM 10 / Storage 4 / GPU 4 / Cooling 4 / Power 1; Heat Soak passed and automatic fan curve active.
- Last observed: **$781,187**, **1,190 Jobs completed**, **4,164 Research**, **58.2°C**. Research continues to increase during visible standby, so its value will change.
- Parallel Library and Thermal Model owned; Branch Cache was refunded. The saved Research profile retains its unavailable Branch Cache intent. Other Research choices remain for the user to explore.
- Job Runner selected; no ordinary Job in progress after the final one completed. Auto-run restored to paused, queue policy Cash, Research profile active, ordinary clock Standard, thermal interaction set to Untimed plan.
- Free software, score/sound off, animation on, development speed 1×. The live save was preserved and advanced through UI play; it was not replaced by the automated test fixtures.
- Dev server session `49432` remains on port 5173. The final production-test server has exited. No background implementation or scheduled continuation was created.

## What remains and how to resume

The next task is **ticket 05 / Phase 4: Rack and network**. Its dependency, ticket 04, is complete, but ticket 05 remains `Execution: not-started`. No further work should start without a new user request. The original v1 goal remains unfinished and has not been marked achieved. At 11:00 Europe/Madrid it was marked `blocked` after the user-stop condition persisted through the wrap-up and two automatic continuation turns. Implementation cannot proceed without a new user request; this records the withdrawn continuation authorization, not a technical failure. D-026, ticket 04 and continuity retain the resume condition.

On an explicit resume, start from the repository with:

```sh
cat docs/CONTINUITY.md
cat .scratch/v1/issues/05-rack-network.md
```

Then follow `AGENTS.md` and `docs/agents/build-loop.md`: reread the parent spec, Phase 4 acceptance, relevant canonical docs/readiness findings, verify the actual branch/files/processes and choose the first bounded Rack slice. Preserve the existing Workstation save and all uncommitted documentation. Reassess the baseline transition budget against the verified Workstation trace before selecting Rack costs.

Beyond Rack, v1 still needs Data Center progression, its ending and recovery behavior, full content, representative complete runs, independent novice comprehension checks, subjective audio review and release QA. The 55–75 minute v1 target has not been demonstrated. Later Chapters remain plans only. Mobile, Firefox/Safari coverage, deployment and public release were not part of this verification.

Latest observed account usage was **41% consumed / 59% remaining in the seven-day window**, with no reached limit. Remaining-context telemetry was unavailable; no context or usage blocker caused this stop. No reset credit was redeemed. The stopping reason is the user's instruction to finish the current work and report it.
