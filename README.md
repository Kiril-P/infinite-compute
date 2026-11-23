# Infinite Compute

Working title for a desktop-browser incremental about a beige family PC growing into a cosmic supercomputer in pursuit of infinite computing power and the meaning of existence.

Jobs finance hardware, automation removes chores, and the fictional operating system becomes self-aware. Technology companies monetize every step with subscriptions, manufactured incompatibility, benchmark theater, AI hype, and infrastructure rent. Rick and Morty also informs the absurd inventions, simulated civilizations, alternate OS selves, and strange broadcasts, developed as original stories in [the cosmic-absurdity treatment](docs/content/COSMIC_ABSURDITY.md). The background story asks why we keep demanding a bigger answer before understanding the question. The full-game result is 42; what the machine does afterward completes the story.

## Current state

The Beige PC and Home PC are playable and verified. Jobs finance CPU/RAM, storage, graphics and cooling; Payroll earns auto-run and Memory Pressure earns Batch Queue. The full-viewport OS includes an animated SVG computer, reversible software, saved story/announcements/achievements, contextual help, recoverable local saves and opt-in sound. The Workstation is also playable and verified: shared Research capacity, eight discoveries/tuning nodes, saved profiles, power and heat, Thermal Window, Heat Soak Certification and an animated lab machine. Rack, Data Center and release validation remain unfinished.

Work stopped at the user’s request after verified Phase 3 (D-026). Read the [implementation report](docs/IMPLEMENTATION_REPORT.md) for the delivered features, checks, limitations and resume point. [Continuity](docs/CONTINUITY.md) records the compact handoff.

The complete campaign is planned as five Chapters, provisionally 8–12 attentive hours. V1 remains a 55–75 minute Chapter I ending at the first data-center supercomputer. Later Chapters reach planetary, stellar, and cosmic scale, followed by an authored ending. Duration and individual later mechanics require playtesting.

## Read the plan

1. [Continuity](docs/CONTINUITY.md): verified state and exact next step.
2. [Product](docs/PRODUCT.md): the fantasy, satire, quest, and scope.
3. [Full-game campaign](docs/FULL_GAME.md): Chapters, later Eras, economy handoffs, Benchmarks, and ending.
4. [Planning audit](docs/PLAN_AUDIT.md): what was wrong, what changed, and what remains untested.
5. [Roadmap](docs/ROADMAP.md): delivery order and acceptance criteria through the full release candidate.

## Design and engineering context

- [Glossary](CONTEXT.md), [decisions](docs/DECISIONS.md), and [repository instructions](AGENTS.md)
- [Mechanics](docs/GAME_DESIGN.md), [balance](docs/BALANCE.md), and [narrative/content](docs/CONTENT_GUIDE.md)
- [Technical design](docs/TECHNICAL_DESIGN.md) and [simulation ADR](docs/adr/0001-framework-independent-simulation.md)
- [Research index](docs/RESEARCH.md), [Magic Research 2](docs/research/MAGIC_RESEARCH_2.md), [Antimatter Dimensions](docs/research/ANTIMATTER_DIMENSIONS.md), and [full-game physical foundations](docs/research/FULL_GAME_FOUNDATIONS.md)
- [V1 specification/tickets](.scratch/v1/spec.md) and [full-game planning specification](.scratch/full-game/spec.md)

## Run locally

Use Node.js 24.15+ within 24.x, or Node.js 26+. `.nvmrc` selects Node 24; exact package versions and the lockfile are recorded in the repository. The scaffold was verified with Node 26.8.1 and npm 11.19.0.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open the URL printed by Vite (normally `http://127.0.0.1:5173`). The dashboard fills the available browser area without vertical scrolling. The Current Objective button and application dock focus the named application; at widths of 1000px or less the selected application replaces the other in place. Use Tab / Shift+Tab to move between buttons, and Enter or Space to activate them. Open Hardware Manager, then select CPU or RAM to expose and highlight that part; the computer screen follows the inspection. The fan, drive, terminal and installed parts reflect actual activity and purchases. Pause animation freezes motion; the system reduced-motion preference disables it automatically. Start a Job and take its optional bonus once. Decision mode replaces timing with an explained strategy choice. Settings controls sound, volume, saves and help. Development builds additionally expose a time multiplier and trace export; production does not.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

`lint` includes the Prettier check. `test` runs Vitest once and exits. `test:e2e` first builds production assets, then starts its own preview on `127.0.0.1:4173`; leave that port free. Playwright exercises the first purchase/Payroll/auto-run, save recovery and competing-tab behavior, plus 1440x900 and 1280x720 plus five smaller desktop browser sizes (800x600, 640x480, 668x862, 960x540, 1280x650), keyboard navigation, component inspection, animation pause/resume, reduced motion, visible controls, scrolling attempts, reload, and console/runtime errors. It saves screenshots under `test-results/` and a report under `playwright-report/`; failure traces are retained. These generated directories are ignored by Git. Linux CI should use `npx playwright install --with-deps chromium` to install browser system dependencies.

```sh
npm run build
npm run preview
npm run format:check
npm run format
```

`build` typechecks and writes `dist/`; `preview` serves that build locally (normally port 4173). `format` rewrites supported source/config files; existing canonical Markdown is intentionally excluded to preserve authored formatting. Local servers run until Ctrl+C. In a restricted agent sandbox, dependency downloads, local server binding, and Chromium launch need the corresponding execution permission.

## Source and next build

`src/app/` composes the shell and owns browser session lifecycle, saving, single-tab control, sound and development clock integration. `src/game/engine/` supplies the framework-independent seeded simulation; `src/game/content/` holds opening rules/content; `src/game/persistence/` validates and recovers saves. `src/ui/` renders snapshots and sends commands; fixed application contents remain independent of screen coordinates. The PC is authored in `MachineVisual.tsx` and CSS, with no generated main-PC bitmap. [Rendering guidance](docs/art/BEIGE_PC.md) preserves that direction.

The v1 goal remains unfinished; no further phase starts until the user asks to resume. [Continuity](docs/CONTINUITY.md) identifies the current ticket and actual verification. No backend or accounts are planned. Progress is local to this browser origin; export before moving browsers or ports. Hidden tabs pause, and offline progress is not credited.

## Home PC progression

The playable Home-PC phase adds Storage/photo Jobs, a Wide bus and desk transformation, Memory Pressure/Batch Queue, specialized graphics and cooling, and the optional Renewal Systems software offer. Shop explains fees and cancellation; Settings → Question Archive preserves messages, announcements and cosmetic achievements. The machine is an animated SVG, and the dashboard remains bounded to the viewport.

Run the reproducible Home-PC routes with `npm test -- src/game/engine/home-route.test.ts --disableConsoleIntercept`. The graphics-first free-edition route prepares workstation parts at 21m46s; the Workstation route opens Research at 21m49.6s. These are simulated routes, not independent human playtests. See [the Home-PC contract](docs/HOME_PC_CONTRACT.md), [Workstation contract](docs/WORKSTATION_CONTRACT.md) and [continuity](docs/CONTINUITY.md) for verified scope and current work.

The complete Workstation routes run with `npm test -- src/game/engine/workstation-route.test.ts --disableConsoleIntercept`. The baseline reaches Heat Soak at 26m58s and all eight Research nodes at 28m47.2s. These are deterministic simulation measurements, not validated full-v1 completion times.
