# Repository scaffold and OS smoke slice

Type: task
Status: ready-for-agent
Execution: complete
Blocked by: none

## Outcome

Create the React, TypeScript, and Vite runtime with strict checks, Vitest, Playwright, a minimal fictional OS shell, placeholder Current Objective/global status, and application-focus seam.

## Acceptance

- Satisfy Phase 0 of `docs/ROADMAP.md`.
- Fresh install supports `dev`, `build`, `typecheck`, `lint`, `test`, and `test:e2e`.
- Production build and browser smoke test load without console errors.
- `docs/CONTINUITY.md` records exact verification and points to ticket 02.

## Comments

### Latest checkpoint: animated computer revision complete

User feedback, 2026-09-07: the presentation still feels generic and the main PC must not use ImageGen; it needs independently animated parts that can respond to the machine. This completes the authorized Phase 0 presentation revision, preserving full-viewport behavior and previous uncommitted work.

Checkpoint: 2026-09-07 18:01 Europe/Madrid (UTC+02:00)
Ticket / roadmap phase / execution step: 01 / Phase 0 / verified code-authored machine
Execution: complete
Owner: none (completed by `/root`, task `01a07c46-9241-7461-8ab4-3cb90c39a927`)
Branch / HEAD / working-tree state: `kp/phase-0-scaffold`, `1bbdb5ed7a01987f5aae6d249a33cd7bcaa4972b`; scaffold/docs/revisions remain uncommitted. Pre-revision files are preserved in `/private/tmp/infinite-compute-machine-baseline` (ephemeral). No commit/deployment.
Completed behavior and changed files: `src/ui/components/MachineVisual.tsx` draws the monitor, live terminal/cursor, case cover, CPU/fan, RAM, keyboard, and cables as independent SVG layers. The Hardware Manager crops the same tower drawing; App owns CPU/RAM inspection and animation pause state. Opening Hardware Manager exposes the case and changes the terminal; CPU/RAM buttons highlight the selected part in both views, with RAM displacement. Job Runner navigation closes the case. `machine.css` owns cosmetic cursor/fan loops and case/selection transitions, Pause animation, and reduced motion. Existing full-viewport layout remains. Removed scene grid/corner markers, vertical dock decoration, unused bitmap/board CSS, and slogan-style headline. The prior PNG was moved unchanged to `docs/art/archive/beige-pc.png`, outside shipped assets.
Canonical docs read / decisions recorded: continuity/build loop, full ticket and v1 spec, Phase 0 roadmap, root instructions, technical design and ADR 0001, product/content, relevant interface/game design, glossary, readiness audit, existing shell/tests. Codebase-design and TDD skills applied at established rendered-shell/browser seams. D-024 records a code-authored stateful protagonist; product/roadmap/game/technical docs, README, and art guidance match the result. No ImageGen was used for this revision.
Verification: `npm run format && npm run lint && npm test && npm run test:e2e` passed after final source edits: formatting, ESLint, 3 Vitest tests, strict typecheck/build, and 6 Playwright tests across two projects and seven distinct viewport sizes. See the detailed checks below. Documentation/preservation validation and whitespace checks passed.
Unfinished work / known failures: none for the requested presentation. Machine inspection is UI-only; Jobs, purchases, machine load/heat, hardware values, and gameplay-driven transitions remain for their owning phases. No speculative future machine-state props or simulation were added. Only Chromium/macOS was tested; other engines and Linux CI not run.
Stop reason and evidence: none; stopping at verified Phase 0 scope.
Usage/context observation: account-wide seven-day usage 24% on grounding, 25% before final checks; no reached limit. Context telemetry unavailable; no recovery blocker. No reset/credit, automation, or pending approval.
Running processes / artifacts: Vite dev server at `http://127.0.0.1:5173/`, recorded session 24941, remains running with the user's in-app preview open on Job Runner and animation enabled. No viewport override applied this revision. Playwright's port 4173 server stopped. Ignored `dist/`, `playwright-report/`, and `test-results/` are reproducible outputs. The current SVG is source; historical PNG and font/license are preserved.
Resume condition: none for this completed ticket. Further gameplay implementation requires authorization beyond Phase 0.
Next action: when Phase 1 is authorized, from the repository run `cat docs/CONTINUITY.md .scratch/v1/issues/02-first-five-minutes.md docs/IMPLEMENTATION_READINESS.md`. Follow the build loop, close R1–R4 with a compact opening contract, then implement ticket 02. Connect real Job/hardware states to the existing drawing as their behavior is built. Tickets 02–07 remain `Execution: not-started`.

### Animated computer verification

- TDD red: `npm test` failed the new rendered-shell inspection test because no accessible stateful PC existed; then passed 3/3 after implementing its view/selection behavior.
- First `npm run format && npm run lint && npm run test:e2e`: formatting/lint/typecheck/build passed; preview startup hit sandbox `listen EPERM` at 127.0.0.1:4173. Authorized escalation allowed the browser suite to run; no approval rejection remains.
- Browser follow-up exposed the old smoke test's assumption that the Job Runner heading tabs directly to the dock. Updated it to exercise the new CPU and RAM buttons in order. The first animation test then retained a RAM-specific locator after switching to CPU; changed it to the stable Hardware Manager image and kept selected-part assertions separate. Both failures are resolved.
- Final `npm run format && npm run lint && npm test && npm run test:e2e`: passed, 3 unit tests and 6 browser tests. Production smoke covers clean boot/reload, Tab/Shift+Tab/Enter/Space focus, selection, window/footer containment, and no console/runtime/request errors. Both projects cover 800x600, 640x480, 668x862, 960x540, 1280x650 in addition to 1440x900 and 1280x720/reduced motion.
- New `e2e/machine.spec.ts` verifies synchronized case/screen inspection, keyboard RAM/CPU selection, real browser animation running/paused/resumed states, no animation under reduced motion, selection while motion is disabled, unchanged preview Cash/Standby, and no bitmap image requests. Screenshots are `test-results/machine-*/machine-ram-inspection.png`.
- Manual QA: inspected desktop and 1280x720 reduced-motion inspection screenshots plus 640x480 dashboard/inspector screenshots. In the actual 668x862 in-app browser, verified the new computer, opening the case, Space-driven RAM selection/highlighting/focus, pause/resume toggle, and return to Job Runner. Final console warnings/errors: none. The CUA read-only DOM wrapper did not expose `getAnimations`; actual animation-state checks were performed by the production Playwright test instead. A stale manual CPU locator after the visible application changed was resolved by reading the live state; no application failure.
- `python3 /private/tmp/infinite-compute-machine-check.py` and `git diff --check` validate local Markdown links, all seven execution states, dependency/lockfile preservation, source-only main-PC rendering, absence of the old PNG from `public`/`dist`, identical archived artwork, and scoped preservation against the revision baseline. The script/baseline are ephemeral.

### Reopened: full-screen game presentation

User request, 2026-09-07: the main dashboard must never scroll vertically and the shell needs a much more stylized, game-like visual identity. This authorizes a Phase 0 presentation revision only. Preserve the implemented shell/navigation and all earlier uncommitted work; no Phase 1 gameplay is included.

Acceptance: viewport-contained dashboard at 1440x900, 1280x720, and smaller desktop browser panels (800x600 and 640x480); primary status, Current Objective, active application, and dock remain reachable without page scrolling. Use one active application at narrow widths rather than stacking. Preserve real keyboard focus, reduced motion, and clean production load. Add original retro CRT/pixel-art presentation, verify visually, and update the handoff.

### Earlier checkpoint: presentation revision complete

Checkpoint: 2026-09-07 17:15 Europe/Madrid (UTC+02:00)
Ticket / roadmap phase / execution step: 01 / Phase 0 / verified presentation revision
Execution: complete
Owner: none (completed by `/root`, task `01a07c46-9241-7461-8ab4-3cb90c39a927`)
Branch / HEAD / working-tree state: `kp/phase-0-scaffold`, HEAD `1bbdb5ed7a01987f5aae6d249a33cd7bcaa4972b`; all scaffold and presentation changes remain uncommitted. Pre-existing documentation is preserved; no commit or deployment occurred. Revision baseline: `/private/tmp/infinite-compute-redesign-baseline` (ephemeral).
Completed behavior and changed files: bounded full-viewport desktop grid; one active application at widths <=1000px; compact horizontal window contents on short viewports; keyboard focus applied after the selected window becomes visible. CRT bezel, static scanlines, phosphor/amber palette, tactile dock, locally served pixel font, original transparent PC artwork, and a decorative hardware board. Source changes are confined to shell content/navigation, existing OS/app components, and theme CSS; regressions live in `e2e/os-shell.spec.ts` and `e2e/viewport.spec.ts`.
Canonical docs read / decisions recorded: continuity/build loop, full ticket and v1 spec, Phase 0 roadmap, technical design and ADR 0001, product/content, relevant Current Objective/OS mechanics, readiness audit, existing source/tests. D-023 records the full-screen requirement and visual direction; product, roadmap, game/technical design, and README match behavior. `docs/art/BEIGE_PC.md` records the exact built-in ImageGen prompt, saved asset `public/art/beige-pc.png`, and official Silkscreen font attribution/license. Relevant codebase-design, TDD, diagnosing-bugs, and imagegen skills applied.
Verification: final `npm run format && npm run lint && npm run test:e2e` passed; lint includes formatting, and e2e includes strict typecheck/production build. Final Playwright run passed 4 tests across two projects and seven distinct viewport sizes. `npm test` passed 2 tests after UI/navigation changes; only compact CSS and browser assertions changed afterward. Manual screenshots and live mouse/keyboard navigation passed. Documentation/preservation checks are recorded below.
Unfinished work / known failures: none for the requested presentation revision. All displayed economy/hardware remains a preview; gameplay is Phase 1. Browser verification is Chromium on macOS, down to 640x480; other browser engines and Linux CI were not run.
Stop reason and evidence: none; stopping at verified Phase 0 scope.
Usage/context observation: account-wide seven-day usage 21% at revision start, 22% during visual QA, 23% at completion; no reached limit. Context telemetry unavailable; automatic compaction recovered from the saved task/files without a continuation blocker. No reset/credit or automation used.
Running processes / artifacts: user-facing Vite dev server remains running at `http://127.0.0.1:5173/`, session 24941, with the in-app preview open on Job Runner. Playwright's production server is stopped; viewport override reset. Ignored `dist/`, `playwright-report/`, and `test-results/` contain reproducible build/report/screenshots. Artwork and font/license are durable repository assets.
Resume condition: none for this completed ticket; further gameplay implementation requires authorization beyond Phase 0.
Next action: when Phase 1 is authorized, run `cat docs/CONTINUITY.md .scratch/v1/issues/02-first-five-minutes.md docs/IMPLEMENTATION_READINESS.md` from the repository; follow the build loop and close readiness R1–R4 with the opening contract before implementing ticket 02. Tickets 02–07 remain `Execution: not-started`.

### Presentation verification and resolved regressions

- Reproduced the user's 668x862 browser panel with a 1405px-tall document. The first new 800x600 browser regression failed at 869px document height. A bounded viewport grid and switching the active app in place resolved both.
- `npm run lint && npm test && npm run test:e2e` passed after semantic hardware-term assertions replaced a duplicate decorative CPU text match: 2 unit tests, 4 browser tests.
- Final 1280x720 visual review found the hardware footer bottom at 592.046875px outside its 573px window bottom. `npx playwright test e2e/os-shell.spec.ts --project=chromium-compact-reduced-motion` reproduced the new containment assertion failure. Extending the compact horizontal layout to heights <=780px resolved it.
- Final `npm run format && npm run lint && npm run test:e2e` passed: strict typecheck, production build, formatting, lint, and 4 Playwright tests. The two smoke projects cover 1440x900 and 1280x720/reduced motion, clean load/reload, keyboard focus, no runtime/console/request errors, and footer containment. Both projects also run 800x600, 640x480, 668x862, 960x540, and 1280x650: visible status/objective/dock, wheel/PageDown cannot scroll the page, hardware navigation/focus/CPU/RAM visibility, and return to Job Runner.
- Manually inspected final dashboard/hardware screenshots at 640x480, 1280x650, 1280x720, and 1440x900. In the user's actual 668x862 in-app browser, verified mouse switching, Shift+Tab/Enter objective navigation, real heading focus, viewport fit, and zero console warnings/errors. The live preview remains open for user review.
- Screenshots: `test-results/os-shell-*/{os-shell,keyboard-focus}.png` and `test-results/viewport-*/{dashboard,hardware}-<width>x<height>.png`; regenerate with `npm run test:e2e`. Original Phase 0 setup/install verification below remains applicable; dependencies and tooling versions did not change during this revision.
- Documentation/preservation validation passed: `python3 /private/tmp/infinite-compute-redesign-check.py` and `git diff --check`; 35 Markdown files, 98 resolving local links, seven execution states, exact dependency/lockfile pins, continuity at 71 lines, and only the intended 16 changes among 48 baseline files. Of those, eight are documentation files; unrelated baseline documents/source are byte-identical. The checker/baseline are ephemeral.

### Earlier Phase 0 history

Planning audit, 2026-09-07: runtime work is paused by the current user instruction. This remains the next build ticket once implementation is explicitly resumed. The shell may use the updated thematic placeholder from CONTENT_GUIDE.md; no economy or later-chapter scaffolding is included.

Implementation authorized, 2026-09-07: the user superseded the planning-only pause for Phase 0 only. Owner: `/root` (Codex task `01a07c46-9241-7461-8ab4-3cb90c39a927`). No dependencies or open readiness findings block this ticket. Existing uncommitted documentation is preserved.

Completion record, 2026-09-07: all Phase 0 acceptance criteria passed. Two Vitest tests and both production Playwright projects pass; the shell was manually verified. Execution is complete; canonical triage remains `ready-for-agent`. Ticket 02 is next, but implementation stops here under the user's scope.

### Initial scaffold completion checkpoint

Checkpoint: 2026-09-07 16:48 Europe/Madrid (UTC+02:00)
Ticket / roadmap phase / execution step: 01 / Phase 0 / verified completion
Execution: complete
Owner: none (completed by `/root`, task `01a07c46-9241-7461-8ab4-3cb90c39a927`)
Branch / HEAD / working-tree state: `kp/phase-0-scaffold`, HEAD `1bbdb5ed7a01987f5aae6d249a33cd7bcaa4972b`; runtime/config/tests and task documentation are uncommitted. Pre-existing documentation edits/additions remain preserved. No commit or deployment occurred.
Completed behavior and changed files: exact dependency pins/lockfile, strict TypeScript, Vite, ESLint/Prettier, Vitest/Playwright, original SVG computer, fixed responsive Job Runner/Hardware Manager windows, data-driven preview Current Objective/global status, typed application navigation, real keyboard focus, selected-window styling, and thematic System Message. Source occupies only `src/app`, `src/ui/{os,apps,theme}`, and `src/test`; no speculative game/audio modules.
Canonical docs read / decisions recorded: continuity, Phase 0 roadmap, full ticket and parent spec, build loop, issue tracker/triage, readiness audit, glossary, product, content guide, technical design, ADR 0001, decisions, relevant Current Objective/OS sections of game design. Codebase-design and TDD skills applied at the authorized rendered-shell/browser seams. D-022 records Phase 0 authorization; technical design records the actual source surface and supported TypeScript choice. README, tracker/spec authorization, roadmap/product, and historical audit/campaign status pointers are reconciled without rewriting design conclusions.
Verification: all required scripts, fresh install, 2 Vitest tests, 2 Playwright projects, manual shell QA, and final documentation/preservation/whitespace checks passed; exact results below.
Unfinished work / known failures: none in Phase 0. The shell is a preview; economy, Jobs, hardware purchases, saves, audio, and timing remain unimplemented. Phase 1 owns R1–R4; later readiness findings remain open. Browser QA is Chromium only on macOS; Linux CI instructions are documented but not executed here.
Stop reason and evidence: none (completed authorized boundary; no resource blocker).
Usage/context observation: account-wide 7-day usage 18% at grounding, 19% at the shell boundary, 20% before final verification; no reached limit. Context telemetry unavailable; no context warning or recovery blocker. No reset/credit or automation used.
Running processes / artifacts: all task-owned dev/preview/test servers stopped; temporary browser closed and viewport override reset. Generated `dist/`, `playwright-report/index.html`, and `test-results/` are ignored, reproducible artifacts. Original Markdown snapshots/hashes remain at `/private/tmp/infinite-compute-phase0-baseline` (ephemeral preservation evidence).
Resume condition: none for this completed ticket. Further implementation requires authorization beyond Phase 0.
Next action: when Phase 1 is authorized, from the repository run `cat docs/CONTINUITY.md .scratch/v1/issues/02-first-five-minutes.md docs/IMPLEMENTATION_READINESS.md`; follow the build loop and read Phase 1/canonical sources, then specify the R1–R4 opening contract before building ticket 02's first Job/purchase/save path. Do not begin the economy from placeholder shell values.

### Verification results

All commands ran from the repository root on Node `26.8.1`, npm `11.19.0`.

| Check | Result |
| --- | --- |
| `npm install --cache /private/tmp/infinite-compute-npm-cache --no-fund` | Passed; exact versions installed and lockfile generated. |
| `npm ci --cache /private/tmp/infinite-compute-npm-cache --no-fund` | Passed; clean lockfile reinstall, 242 packages added, 0 reported vulnerabilities. npm reported an unapproved optional `fsevents@2.3.3` install script; subsequent dev/build/tests passed without approving it. |
| `npm ls --depth=0` | Passed; all direct versions resolve without invalid/missing peers. |
| `npx playwright install chromium` | Passed; matching Chromium/headless shell installed. |
| `npm run typecheck` | Passed; also run by every production build, including after clean install. |
| `npm run format` | Passed; source/config formatting only, Markdown excluded. |
| `npm run lint` / nested `npm run format:check` | Passed after clean install; zero ESLint warnings, formatting clean. |
| `npm test` | Passed after clean install; 2 rendered-shell/navigation tests. |
| `npm run build` | Passed; also rebuilt by final `test:e2e` after clean install. Outputs `dist/`. |
| `npm run test:e2e` | Passed after clean install; 2/2 projects at 1440x900 and 1280x720/reduced-motion. Production boot, keyboard Tab/Shift+Tab/Enter/Space, objective/taskbar focus, selection, viewport fit, reload, and zero console/runtime/request errors. |
| `npm run preview -- --port 4173 --strictPort` | Passed; manually loaded production in the in-app browser with no warnings/errors; stopped after QA. |
| `npm run dev -- --port 5173 --strictPort` | Passed after clean install; manually loaded in the in-app browser with no warnings/errors; stopped after QA. |
| Manual visual QA | Passed: 1440x900 and 1280x720; readable labels, original beige/teal shell, objective/status/windows/message/taskbar visible together, no clipping/scroll overflow, keyboard focus rings and active application change, mouse objective navigation. Final reduced-motion screenshot inspected as well. No audio exists, so sound checks are not applicable. |
| `python3 /private/tmp/infinite-compute-phase0-check.py` / `git diff --check` | Passed: 34 Markdown files, 97 resolving local links, all 7 ticket execution states, exact pins, continuity below 150 lines, and clean whitespace. 21 original Markdown files are byte-identical; 13 have only allowed task-scoped updates. The validation script and baseline are ephemeral. |

Screenshots are reproduced by `npm run test:e2e`:

- `test-results/os-shell-the-production-OS-fc2ca--keyboard-application-focus-chromium-desktop/os-shell.png`
- `test-results/os-shell-the-production-OS-fc2ca--keyboard-application-focus-chromium-desktop/keyboard-focus.png`
- `test-results/os-shell-the-production-OS-fc2ca--keyboard-application-focus-chromium-compact-reduced-motion/os-shell.png`
- `test-results/os-shell-the-production-OS-fc2ca--keyboard-application-focus-chromium-compact-reduced-motion/keyboard-focus.png`

### Failures resolved during verification

- Expected TDD red checks: App import missing before implementation; hardware heading lacked focus before navigation wiring. Each turned green after its implementation.
- Typecheck initially rejected `workers: undefined` under exact optional types and Testing Library's unsupported `exact` role option. Replaced with a concrete worker count and the library's default exact name matching; strict checks pass.
- Sandbox initially blocked branch creation, npm DNS, and the preview listener (`listen EPERM` at 127.0.0.1:4173). Required execution permissions were granted; subsequent operations passed. No automatic approval rejection remains.
- First running browser tests found vertical overflow at both target viewports. Reduced oversized blank workspace/padding and added compact-height spacing. Both viewport-fit assertions and manual screenshots now pass.
- Playwright emits a host environment `NO_COLOR`/`FORCE_COLOR` warning; it does not appear in the application console and does not fail checks.
