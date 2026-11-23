# Home PC: policies, Benchmarks, and visible compression

Type: task
Status: ready-for-agent
Execution: complete
Blocked by: 02

## Outcome

Add Task Manager auto-run, waiting reasons, queue policy, storage/software/GPU/cooling, Safe Mode Payroll, Memory Pressure Test, announcements, achievements, and the first unmistakable environment transformation.

## Acceptance

- Satisfy Phase 2 of `docs/ROADMAP.md`.
- Each Benchmark states its changed rule, diagnosis, retry path, and permanent relief.
- Routine opening Jobs become optional and visibly orders of magnitude faster.
- Secret achievements have no economy effect.

## Comments

Planning audit, 2026-09-07: the originating outcome is superseded where it assigns auto-run and Safe Mode Payroll here; both are delivered by ticket 02. This slice owns queue policy, Memory Pressure Test, the Home-PC Transition, and a small reversible satire chain. Preserve the opening auto-run throughout.

Creative-direction update, 2026-09-07: select the One-Function Wonder Job and Completion Contractor queue message from docs/content/COSMIC_ABSURDITY.md as two existing content slots. This introduces the requested Rick and Morty influence through original writing. No Sandbox World/Fork subsystem, extra Benchmark, or change to the first Automation target belongs in v1.

### Active checkpoint — 2026-09-08

Execution: in-progress. Owner: `/root`, task `01a07c46-9241-7461-8ab4-3cb90c39a927`.
Dependency 02 verified complete: 12 unit / 18 production browser tests plus manual opening/Payroll/viewport inspection. Branch `kp/phase-0-scaffold`, HEAD `1bbdb5ed7a01987f5aae6d249a33cd7bcaa4972b`; all work uncommitted, earlier docs preserved.
Read: full ticket/spec, Phase 2 roadmap, game design/balance/content/glossary, cosmic-absurdity v1 slots, technical design/ADR, readiness. Applying existing Matt Pocock codebase-design and TDD at the agreed engine, persistence and rendered application seams.
Execution slices: (1) Storage/photo/Wide bus/Home Transition + save migration; (2) Memory Pressure Test + queue policy/Batch selection; (3) GPU/cooling/software + original satire/history/achievements + full Phase 2 QA. Phase completion requires all acceptance, not just the first slice.
Verification: new Phase 2 behavior not implemented/tested yet. Baseline before edits is verified Phase 1. Next: write the concrete Home-PC contract and first red transition test, then implement its real UI/migration.
Usage: seven-day 2%, no limit; remaining context telemetry unavailable; no blocker. User preview 5173 live, no production preview remains.

### Slice 1 checkpoint — 2026-09-08 08:29 Europe/Madrid

Implemented Storage/photograph Job, remembered Job selection with eligible household fallback, Wide bus, Home-PC Transition, ×100 base CPU scale/caps/prices, One-Function Wonder Job, and schema 1→2 migration preserving partial work/settings. Independent SVG desk, flat display and speakers plus silver case/blue OS distinguish the new Era; small-screen controls remain bounded. New data/contract: `src/game/content/home.ts`, `docs/HOME_PC_CONTRACT.md`; UI `Chassis.tsx` and existing Job/Hardware/Task Manager; pure engine and persistence extended.

Verification: `npm run format && npm run lint && npm test` passed (14 tests), strict typecheck passed. Full production run passed the previous 18 tests; the new Home-PC test first needed its duplicated waiting-message locator scoped, then exposed real 640×480 clipping. Fixed the compact Job controls grid. `npm run test:e2e -- e2e/home-pc.spec.ts e2e/viewport.spec.ts` now passes all 4 tests and production build/typecheck. Tests cover legacy partial save migration, inaccessible selection/fallback, preserved work at Transition, reload, and 1440×900/1280×720 reduced/640×480/668×862 layouts. Production 640×480 screenshot inspected after fix.

Manual: live schema-1 preview migrated; CPU6/RAM4/Storage1/Wide bus purchases and Home-PC Transition worked; 668×862 transformed machine/OS inspected. User preview now Home PC, normal speed, sound off, auto-run still paused, Cash about $1,795. No production test server left (59561 complete). A few runtime strings still need relocation/content pass with Phase 2 history work.

Unfinished: Memory Pressure Test/queue policy/Batch Queue; GPU/cooling and concrete pricing; reversible software chain, announcements/achievements/Question Archive and Completion Contractor; full Phase 2 timing and end-to-end QA. Phase 2 is not complete. Next exact slice: add Memory Pressure Test with isolated paused Job state and queue-policy reward, retaining v1/v2 migration. Check available usage before the next larger batch.

### Slice 2 checkpoint — 2026-09-08 08:41 Europe/Madrid

Memory Pressure Test, explicit Benchmark kind, isolated oversized stall/safe Small pages, once-only queue-policy reward, remembered queue policy and one-shot Batch Queue are implemented. Added `HomeTasks.tsx`; Job Runner exposes actual eligible batch rates and uses the existing attempt budget. Auto-run enable/pause remains available before and after the Home benchmark. CPU/RAM breakpoint text now follows the active Era. Schema 3 migrates both 1 and 2, preserving partial Jobs/Payroll and adding queue metadata.

Checks: 16 unit tests, formatting/lint and typecheck pass. `npm run test:e2e -- e2e/memory-pressure.spec.ts e2e/home-pc.spec.ts e2e/opening.spec.ts` passed 6 tests. This verifies Memory stall/exit/reload/reward/policy/pending batch and 640×480 controls, Home migration/transformation, and unchanged opening route. A subsequent small fix restores the auto-run button during Memory preparation and updates stale breakpoint/Benchmark display labels; focused Memory rerun session 27261 was started. Manual Memory play and final screenshots still needed.

Next: finish that small verification/manual check, then Phase 2 slice 3: GPU/cooling, spinning-logo Job, disclosed/reversible software lease/permanent alternative, saved story/announcements/achievements/archive, and content cleanup. Do not mark Phase 2 complete yet. Full Phase 2 balance/progression and all-browser regression remain.

Manual Memory follow-up: completed oversized stall → exit → Small pages → queue reward in the live 668×862 preview, using the visible development clock during preparation/attempt. Restored 1×, chose Fastest Cash, verified the readable $80/$35/$104 per-second options and +50% highest-rate reservation, then paused auto-run. Current preview CPU8/RAM5/Storage2, queue unlocked, about $320k, sound off. Browser log retains two historical HMR schema-transition errors (06:20/06:35 UTC); each cleared on reload and production startup checks pass. Add a development session-change reload to avoid retaining an obsolete in-memory schema during future edits.

Final focused Memory command (session 27261) passed both browser projects after the auto-run availability fix. Next graphics/cooling slice has a red engine test and a concrete numeric contract; implementation begins next. No blocker or resource pause.

### Graphics checkpoint — 2026-09-08 09:00 Europe/Madrid

Implemented GPU/Cooling, specialized spinning-logo Job, quantitative airflow/CPU split, inspection controls and independent card/fan SVG layers; schema 4 migrates 1–3. Job duration/progress and queue ranking use the same specialized budget. Development engine changes now reload the session through save migration. Contract values are in `docs/HOME_PC_CONTRACT.md`.
Checks: first focused graphics test failed as expected (missing GPU); implementation then passed 18 unit tests, lint/format and typecheck. Production Home/Memory regressions passed 4 tests. The new graphics browser flow reached all purchase/motion/640×480 checks but failed because its reload assertion read storage after 1s, before the 2s autosave; pagehide correctly saved the additional second. Changed the fixture to read at 2s; focused rerun session 55336 started. Production build passed.
Manual: live 668×862 GPU1–3 and Cooling1–2 bought using existing QA Cash; airflow 77%→100%, graphics 467.3→607.5/s, separate cards/fans inspected, animation pause verified. 640×480 screenshots for cooling, four Batch options and Memory policy manually inspected; primary controls fit without outer scrolling. Preview now GPU3/Cooling2, CPU8/RAM5, Storage2, $294,951, auto-run paused, speed1, sound off, motion paused. No raster asset added.
Next: collect 55336 and proceed to disclosed reversible software, then saved story/announcements/achievements/archive and complete Phase 2 QA. Phase 2 remains in progress. Usage 8% seven-day consumed, no limit; remaining context unavailable. No blocker.

### Software checkpoint — 2026-09-08 09:09 Europe/Madrid

Graphics rerun 55336 passed both browser projects. Implemented Renewal Systems subscription ($1,000 then $600/60s, +15% payout), no-debt suspension/retry, one-action cancellation, permanent $12,000 edition/free reactivation, optional cosmetic Metric Orchard score, new Home-only Shop, schema 5 migration and normal-play offer. Benchmark/hidden time do not accumulate renewal fees. All automatic ranking/UI payout previews use the active software payout.
Verification: 22 unit tests and lint/format pass. First browser launch caught a TypeScript literal widening in an invalid-save fixture; fixed with a literal type and build/typecheck now pass. Graphics browser regression passed 2 tests. Software/viewport run exposed two real UI bugs: Shop was not marked as a utility window and occupied a second desktop row, and default h4 margins pushed compact controls under System Message. Marked every non-primary app as a utility and removed unintended heading margins. Rerun 5644 passed all 4 Software/viewport checks including cancellation, suspension/reload, cosmetic score, preserved auto-run, keyboard and five smaller viewports.
Manual 668×862: offer/prices, subscription/countdown, one paid renewal, cancellation and cosmetic score toggle verified; useful Compute unchanged. Inspected the repaired 640×480 suspension screenshot. Preview now free software (no permanent edition), score off, Cash $293,351, prior parts intact, auto-run/sound off, speed1, motion paused. No production preview remains. Usage now 13% seven-day consumed; no limit, context remaining unavailable. No blocker.
Next: saved narrative/announcements/achievements/Question Archive, content cleanup, then Phase 2 route/pace and full regression. Phase 2 remains incomplete.

### Story work / strict compact verification — 2026-09-08 09:27 Europe/Madrid

Schema 6, saved System history/News/cosmetic achievements, queued/held critical messages and Settings → Question Archive are implemented. Legacy migration reconstructs known milestone times and labels unknown times explicitly. Repeated Wonder completions cannot replace held story beats. 25 unit tests, strict typecheck and lint passed before the latest layout edits. Live migrated archive inspected at 668×862.

Correction to the earlier compact Shop evidence: viewport intersection did not prove that content stayed inside its window. Manual screenshot review found crowding. Split software/display pages and added strict per-control/paragraph bounds. Runs 98301 (hidden subtitle in measurement), 57367/28222 (remaining real overflow), and diagnostic 33604 failed; opening production checks still passed. Computed geometry showed the cancellation/retry row wrapping and two duplicate/archive prose blocks exceeding the available grid row. Shortened the visible cancellation label (accessible label unchanged), removed the duplicate compact Era label, and tightened archive wording while preserving the directive and artifact. Run 40625 verifies these fixes; collect its result next. No claim of compact completion until it passes and screenshots are inspected.

Next: finish compact checks/artifact inspection, then content/help/audio reconciliation, Home-PC route traces and full browser regression. Phase 2 remains in progress. No resource or external blocker. User preview unchanged except saved history; all work uncommitted.


### Phase 2 completion — 2026-09-08 09:38 Europe/Madrid

Execution: complete. Owner: none. All Phase 2 acceptance criteria pass. Phase 1 auto-run survives; queue policy/Batch choices retain active value; all shown requirements have preparation/retry explanations; Home transformation is code-authored and unmistakable; the reversible software offer has disclosed costs, real payouts, free/permanent alternatives and an ordinary-play directive beat. One-Function Wonder and Completion Contractor use existing Job/message slots. Saved history/News/cosmetic achievements preserve story and add no secret economy benefit.

Final verification: `npm run format && npm run lint && npm test && npm run typecheck && git diff --check` passed (27 unit tests after adding two full Home routes). `npm run test:e2e` (60044) passed production build/typecheck and all 28 browser checks. A final manual observation found the idle Job title showing a remembered selection instead of a reserved next batch; corrected the title to the actual eligible next Job. Subsequent lint/27 unit checks and focused production graphics rerun 45749 passed both projects, including a regression for this exact case. No runtime failure remains in the production build.

Manual evidence: original Home transition/Memory flow, GPU/cooling parts and airflow, software offer/subscription/paid renewal/cancellation/cosmetic score, saved Archive, contextual Help→Hardware navigation, and live reserved-batch→spinning-logo behavior inspected at 668×862. Final Shop/Archive System/News/Achievement screenshots at 640×480 were inspected after strict in-window assertions passed (40625); both desktop and reduced-motion projects pass. Animation restored on the live preview. Historical development errors during multi-file schema edits remain in browser logs, last observed 07:16:40 UTC; subsequent reload/migration and live play work. Future core/schema edits should be coordinated before letting the development preview reload; intermediate HMR output is not production evidence. Independent novice comprehension and subjective acoustic quality remain Phase 6 playtest work.

Command-only traces: first CPU 24s, Payroll 3m15s, Home PC 8m54.1s, Memory 15m55.9s. Graphics-first free-edition route prepares every workstation part at 21m46.3s; CPU-first route at 30m09s. Maximum individual waits 2m24.9s / 2m47.7s. No post-Payroll bonus, random event, subscription or injected state was used. Research timing is not yet verified; ticket 04 owns it.

Preservation: baseline comparison found no deleted file and only authorized implementation/goal-doc changes; package/lockfile, SVG icon and local font are unchanged. Local Markdown links and whitespace pass; continuity remains compact. Branch/HEAD unchanged, all work uncommitted. Live 5173 remains; production previews stopped. Latest preview Cash approximately $294,959 after a reserved household batch and a logo, free software, sound off, normal speed, animation on, auto-run paused. Parts/preference are saved; do not reset them.

Usage: 20% seven-day consumed at last observation, no reached limit. Remaining context unavailable, no visible continuation blocker. V1 goal remains active. Exact next task: ticket 04 / Phase 3, first bounded slice: workstation transition → shared Jobs/Research allocation and first reversible Research choices, with contract, migration, UI and tests together. Read ticket 04 and its canonical allocation rules before choosing numeric gates; the baseline preparation time leaves only a small margin before the 22-minute Research target.
