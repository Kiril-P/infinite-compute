# First five minutes: Clock Cycle to first Automation

Type: task
Status: ready-for-agent
Execution: complete
Blocked by: 01

## Outcome

Build the deterministic simulation seam and a playable opening with Clock Cycle, Cash, Jobs, first CPU/RAM purchases, visible breakpoints, contextual help, persistence, and the first Automation unlock.

## Acceptance

- Satisfy Phase 1 of `docs/ROADMAP.md`.
- First action is understood in under 20 seconds and first purchase occurs in 20-40 seconds during baseline play.
- Rapid clicking cannot outperform accurate timing.
- Fake-clock/seed tests cover economy and reload restores meaningful state.

## Comments

Planning audit, 2026-09-07: this slice owns Safe Mode Payroll, basic Task Manager auto-run, and its 3–5 minute unlock. Include the inherited directive, baseline Job completion, one-shot optional timing, and equivalent relaxed decision controls. Phase 1 now states the acceptance checks. Ticket 03 extends this Automation rather than implementing it again.


### Active checkpoint — opening contract and first playable loop

Checkpoint: 2026-09-07 / Phase 1
Execution: complete
Owner: none (completed by task `01a07c46-9241-7461-8ab4-3cb90c39a927`)
Authorization: D-025, user-created v1 goal; Phase 0 dependency verified complete.
Branch / HEAD: `kp/phase-0-scaffold`, `1bbdb5ed7a01987f5aae6d249a33cd7bcaa4972b`; all previous uncommitted work preserved. Baseline `/private/tmp/infinite-compute-v1-baseline`.
Grounding: continuity, full ticket/spec, Phase 1 roadmap, game design, balance, technical/ADR, glossary/content/product, readiness R1–R4 and existing source/tests.
Contract: `docs/OPENING_CONTRACT.md`; provisional opening constants, single-attempt timing/decision reward, isolated payroll, single-writer/failed-storage behavior. Readiness findings remain validation-pending until their implementation checks pass.
Verification: strict typecheck, formatting/lint and 12 unit tests pass. Production build + 16 Playwright tests pass across desktop/reduced motion and five smaller viewports: real UI first CPU at 24 seconds, Payroll at 3–5 minutes, partial reload/auto-run, keyboard/motion/no-scroll, export/import/reset, backup/future recovery, two-tab transfer/write failure, initial storage-read failure. Final hidden-time/audio test added; focused rerun session 76245 pending. Initial failure asserted periodically saved Cash before autosave cadence, while visible state correctly showed $8; now asserts visible state.
Manual QA: first two real-time decision Jobs; CPU/RAM purchases, memory penalty/recovery, explanatory Payroll strategies, Small pages completion and auto-run pause; 668x862 screenshot, sound opt-in and restore to off / normal clock. Subsequent preparation used visible development acceleration. No browser warnings/errors. Agent play does not establish independent player comprehension or sound quality.
Resolved: StrictMode Web Lock acquisition race (queued abortable acquisition), save takeover refusal when current writer cannot persist, initial-read-failure overwrite protection, dialog-close mount guard, stale preview assertions. Fault-injection tests restore the real browser storage method via a saved closure; injecting into an iframe duplicated the fault and was removed.
Usage/context: 2026-09-08 account seven-day 0%, no limit; context telemetry unavailable, no blocker. Previous turn progress, not a wait or blocked state.
Running: user preview Vite 5173 (PID 26164 observed), no source mutation command in flight. Browser 76245 owns disposable production preview 4173 until completion.
Next: collect final hidden-time/audio result, inspect production artifacts, reconcile canonical docs/readiness and preservation/status; complete Phase 1 only after all gates. Then ticket 03 under the active v1 goal.

### Completion — 2026-09-08

Phase 1 verified. Final `npm run format && npm run lint && npm test && git diff --check` passed (12 unit tests). Final `npm run test:e2e` passed strict typecheck, production build, and all 18 browser tests. Inspected production screenshots at 1440x900, 1280x720 reduced motion, and 640x480, plus actual 668x862 manual play described above. No scroll/clipping or runtime error observed. Native audio creation is tested before/after opt-in/mute; acoustic quality and independent first-time-player comprehension remain release playtest limitations, not invented evidence.

Canonical opening contract, technical design, README and machine art guidance match behavior. R1–R4 implementation findings closed with this evidence. Local Markdown link check and baseline comparison passed; direct dependencies/lockfile and unrelated documentation remain unchanged. All source/documentation remains uncommitted on the recorded branch. User preview remains live, normal speed, sound off, auto-run paused after manual QA. Current seven-day usage 2%; no limit/context blocker.

Next exact task: ticket 03 / Phase 2, beginning with Storage → photo Job → Wide bus → Home-PC Transition and save migration. Then Memory Pressure Test/queue policy, GPU/cooling/software, satire/history/achievements and full Phase 2 verification. Do not reimplement Payroll or require it twice.
