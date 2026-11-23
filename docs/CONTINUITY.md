# Continuity handoff

This is the compact source of current truth. Replace stale state rather than accumulating a diary.

## Current state

- **Stopped at the user’s request after verified Phase 3. V1 is unfinished.** Latest instruction: “please finish up wherever you got to. report everything in a file”. D-026 supersedes automatic continuation under D-025. No further phase starts until a new user request.
- Phases 0–3 / tickets 01–04 are `Execution: complete`. No active ticket owner. Tickets 05–07 remain `not-started`; next is `.scratch/v1/issues/05-rack-network.md`, Phase 4 Rack/network.
- Full report: [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md). Final Phase 3 evidence: ticket 04 and [WORKSTATION_CONTRACT.md](WORKSTATION_CONTRACT.md).
- Repository: `kp/phase-0-scaffold`, HEAD `1bbdb5ed7a01987f5aae6d249a33cd7bcaa4972b`; all implementation and preexisting planning changes remain uncommitted. No commit, PR or deployment. Preserve all existing documentation. Pre-v1 baseline: `/private/tmp/infinite-compute-v1-baseline` (ephemeral).
- Runtime: deterministic Jobs/bonuses, CPU/RAM and Payroll/auto-run; Home PC, Storage/photo/Wide bus, Memory Pressure/Batch Queue, GPU/Cooling/logo specialization, reversible software and saved story/News/cosmetic achievements/Question Archive. Workstation adds eight Research nodes, finite allocation, profiles/refunds, protein, power/heat, Thermal Window and Heat Soak/fan curve. Schema 8 migrates schemas 1–7.
- Full-viewport no-scroll game OS and code-authored independently animated machine remain required. No ImageGen asset is used for the main PC.
- Preview: restarted for the user’s localhost launch request; dev server session `16185` on `http://127.0.0.1:5173/` is running. Previous session `49432` no longer existed. Final production browser-test preview exited normally. No scheduled work or automation.

## Product and planning context to retain

A desktop-browser incremental about a beige family PC pursuing Infinite Compute and the meaning of existence. The fictional OS is the protagonist; recurring technology-industry satire targets subscriptions, metric manipulation, platform rent, AI hype, and infrastructure claims. Original simulated civilizations, divergent OS selves, reckless inventions, and strange broadcasts supply cosmic absurdity. The Quest for Meaning distinguishes an answer from understanding the question and preserves the value of the machine's useful work.

V1 is Chapter I: five Eras through a data-center supercomputer, targeting 55–75 minutes. It establishes the directive from the opening and withholds 42. Later planetary, stellar, cosmic, and ending Chapters are planned, provisionally 8–12 attentive hours total; those mechanics and durations remain unvalidated. `docs/FULL_GAME.md`, `docs/PLAN_AUDIT.md`, and `docs/content/COSMIC_ABSURDITY.md` preserve the full planning work. D-026 now stops execution after verified Phase 3; the user must ask before further implementation.

- Phase 1 owns Safe Mode Payroll and basic auto-run at 3–5 minutes; Phase 2 extends policy and adds Memory Pressure Test.
- A Benchmark may precede its Era's Transition, tests a familiar rule, and supports accessible configuration. Required progression never depends on randomness or rapid input.
- Job cycles have baseline completion and one optional bonus opportunity; UI input cannot supply authoritative rewards or accuracy.
- Permanent Research discoveries are separate from refundable tuning; Jobs and Research share a finite capacity budget.
- The V1 Ending cannot quantify completion of an unspecified question; ending phases/rewards must recover after reload.
- Later growth preserves the machine/save, compresses controls, and adds only Fabrication as a new spendable resource beyond Cash/Research.
- Sandbox Worlds consume finite host capacity; OS Forks occupy existing sites with distinct histories. Fictional shortcuts cannot bypass physical delivery or overwrite actual save history. V1 substitutes two content slots without world/fork architecture.
- Infinite Compute names the ambition; playable quantities remain finite.

## Verified state and limits

- Final code batch session 75253: `npm run lint` (ESLint + Prettier), `npm test -- --disableConsoleIntercept` (39 tests across 10 files), `npm run typecheck`, `git diff --check` all passed. Full `npm run test:e2e` session 93516: production build/typecheck and all 32 browser tests passed. No failing required check remains.
- Unit coverage includes finite allocation, exact tuning refunds/permanent ownership, mixed bottlenecks, optional boost failure/parity, Notebook conversion, schema 7 migration, ordinary-state isolation, once-only Heat Soak reward and saved cooling-to-certify for hot fast hardware. Browser suites cover normal/reduced motion, saves/recovery/writer ownership, hidden time/audio, interactions and compact control/text bounds.
- Manual Workstation UI verified at 668×862: transition and actual hardware/Research purchases, keyboard purchase, tuning/refund/saved intent, protein, Standard Heat Soak failure at 77.8°C, Eco retry/reload and success/fan curve/restored work. Final machine screenshot and six final thermal/app screenshots at 640×480 inspected; controls fit without dashboard scrolling. Earlier Phase 0–2 evidence remains in tickets 01–03.
- Baseline real-command route: first CPU 24s with decisions (36s ignored), Payroll/auto-run 3m15s, Home 8m54.1s, Memory 15m55.9s, Research 21m49.6s, first permanent purchase 30.2s later, Heat Soak 26m58s, all eight Research nodes 28m47.2s. Inefficient route: Research 30m15.4s, Heat Soak 38m49.7s, all nodes 40m02.9s. Longest Workstation waits 74.9s / 85.8s.
- Routes live in `src/test/home-route.ts` / `workstation-route.ts`; run corresponding engine route tests with `--disableConsoleIntercept` for traces. These are deterministic simulation measurements, not independent human timing. Full v1 55–75-minute acceptance, novice comprehension and subjective acoustic quality remain unverified Phase 6 work.
- Eco now uses 80% clock / 65% draw after an inefficient-route failure at 70% draw. Safe hot Heat Soak attempts retain test load while cooling to certify; failure never destroys ordinary work. Numerical rules are recorded in the Workstation contract.
- Final live log observation showed only historical multi-file HMR errors ending 07:16:40 UTC; subsequent reload/migration and production regression passed. Stop the owned dev server during future coordinated schema/core changes rather than exposing intermediate state.

## Live save and artifacts

- Preserved QA save: Workstation, CPU14/RAM10/Storage4/GPU4/Cooling4/Power1; Heat Soak passed, automatic fan curve, Parallel Library and Thermal Model owned. Branch Cache refunded; saved Research profile retains unavailable Branch Cache intent.
- Final observation: $781,187, 1,190 completed Jobs, 4,164 Research, 58.2°C. Research continues during visible standby; inspect current balance rather than treating this as a frozen save.
- Job Runner selected, no ordinary Job after final completion; auto-run restored to paused, queue Cash, Research profile, Standard clock, Untimed thermal plan, free software, score/sound off, animation on, speed1. Browser 2 / tab 2. Preserve this save; use isolated fixtures for repeatable tests.
- Current machine: `src/ui/components/MachineVisual.tsx` and `src/ui/theme/machine.css`; rendering guidance `docs/art/BEIGE_PC.md`. Archived generated PNG `docs/art/archive/beige-pc.png` is unchanged and not shipped. Licensed font/icon retained.
- Generated `dist/`, `test-results/`, `playwright-report/` are ignored/reproducible; the next browser run overwrites screenshots. Six thermal screenshots are under `test-results/thermal-*/`.
- No pre-v1 baseline file deleted; dependencies/lockfile unchanged. Final handoff checks passed: 39 Markdown files, 148 local links, seven execution states, 61-line continuity and whitespace; all 59 baseline files retained, 32 byte-identical. Old `/private/tmp/infinite-compute-machine-check.py` applies only to the historical Phase 0 boundary; its no-game-module/ticket assumptions are obsolete for v1 and must not be reused unchanged.

## Stop and resource observation

2026-09-08: user-requested stop at the completed boundary. Seven-day usage last observed 41% consumed / 59% remaining, no reached limit; remaining context telemetry unavailable. No resource blocker or reset redemption. V1 goal remains unfinished and was marked `blocked` at 11:00 Europe/Madrid after the user-stop condition persisted through the wrap-up and two automatic continuation turns. Further implementation requires a new user request under D-026; this is an authorization stop, not a technical or resource failure. No phase status changed.

## Exact next task — only on explicit resume

From `/Users/kirilpetrovski/Documents/coding/Game Dev/computer incremental`, run `cat docs/CONTINUITY.md`, then read `.scratch/v1/issues/05-rack-network.md` in full. Read its parent spec, Phase 4 roadmap and affected canonical/readiness docs under `AGENTS.md` and `docs/agents/build-loop.md`; verify branch/files/processes and dependency 04’s completion. Choose the first bounded Rack/network slice and recheck its transition budget against the measured Workstation route. Do not implement another Era as part of this wrap-up.

If the local preview has stopped and the user only wants to play, run `npm run dev -- --port 5173 --strictPort`; this does not authorize Phase 4. Save data is origin-local; export before changing browsers/ports.

## Handoff rules

Keep this file under roughly 150 lines. Durable choices belong in decisions/contracts; detailed execution/failures belong in tickets. On interruption record completed/unfinished work, exact checks, branch/dirty state, resources, processes and next safe command. Never claim unavailable telemetry or an unrun check.
