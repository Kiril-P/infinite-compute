# Technical design

Phase 3 is implemented and verified under the [Workstation contract](WORKSTATION_CONTRACT.md): transition, shared Jobs/Research capacity, eight discoveries/tuning nodes, refundable tuning, saved profiles, protein work units, power/heat, Thermal Window, Heat Soak and schema 8. Ticket 04 records acceptance evidence; the [implementation report](IMPLEMENTATION_REPORT.md) records the user-requested stop after Phase 3. Later v1 phases remain unimplemented.

The Phase 1 [opening contract](OPENING_CONTRACT.md) specifies the provisional first playable loop, timing/decision semantics, Payroll isolation, and save ownership under D-025. Validation is recorded in ticket 02.

Phase 2 uses the provisional [Home-PC contract](HOME_PC_CONTRACT.md); ticket 03 owns its staged implementation and verification.

## Architecture summary

Build a client-only React and TypeScript application with a framework-independent deterministic simulation core. React renders coarse snapshots and issues typed commands. Game content and balance live in data modules, not component bodies.

The planned campaign is client-only. Later chapter requirements are design constraints to revisit at their first playable slice, not a request to scaffold future modules now.

## Proposed repository layout

```text
src/
  app/                  App shell, providers, routing between OS states
  game/
    engine/             Clock, commands, derived values, unlock evaluation
    models/             State and content types
    systems/            Economy, jobs, hardware, research, events, narrative
    content/            Data definitions for upgrades, jobs, announcements
    balance/            Constants and progression curves
    persistence/        Save schema, validation, migration, import/export
  ui/
    os/                  Desktop, taskbar, panel/window chrome
    apps/                Job Runner, Hardware, Research, Task Manager, etc.
    components/          Shared controls, meters, tooltips, number displays
    theme/               Era tokens, animation, typography
  audio/                 Audio service and synthesized cues
  devtools/              Time controls, trace export, balance helpers
  test/                  Test builders and fixtures
e2e/                     Playwright flows
public/                  Static assets
docs/                    Canonical product and engineering context
```

## Technology choices

- React for application composition and OS-style interface panels.
- TypeScript with strict checking.
- Vite for local development and production build.
- Vitest for engine, balance, content, and persistence tests.
- Playwright for critical progression and reload flows.
- ESLint and Prettier or an equivalent single formatter selected during scaffold.
- Plain CSS with custom properties for eras and component states; avoid a large UI kit.
- Web Audio for early synthesized feedback; add authored assets only when they materially improve the experience.

Pin exact versions when scaffolding. Do not document “latest” version numbers here.

### Implemented opening surface

The deterministic Interface is `createGame({seed?, state?})` with `dispatch`, `advance`, `getState` and `getSnapshot`; engine events carry logical time. Opening data live in `game/content/opening.ts`, numeric and ownership rules in [OPENING_CONTRACT.md](OPENING_CONTRACT.md). React uses `useSyncExternalStore` against a cached session snapshot. Application/inspection selection stays ephemeral; hardware, Jobs, input mode, automation, motion and sound preferences are saved.

`app/game-session.ts` owns foreground elapsed time, bounded catch-up, one queued Web Lock writer, BroadcastChannel transfer, periodic/command saves, import/reset and sound dispatch. A writer that cannot save refuses voluntary transfer, preserving unsaved memory. An initial read failure never authorizes overwriting an existing save on retry; explicit reset/import or export/reload resolves competing progress. Browsers without Web Locks may load a valid save into an explicitly unsaved memory session with export. The schema-1 envelope has finite/range and relationship validation; a valid backup can recover a damaged primary, preserving the rejected data.

`MachineVisual` receives installed CPU/RAM, activity and progress independently of application inspection. Component/drive/fan/terminal layers reflect real snapshots. Settings/help and Task Manager retain the same coordinate-independent window seam. Clock speed and trace controls are development-only. Engine/save tests use the pure seam; production browser tests exercise real actions, fake browser clocks, native save failures, focus/viewport/motion, and native audio creation.

### Implemented Home-PC surface

Phase 2 extends the same simulation Interface with Storage, GPU/Cooling and specialized Jobs, Home-PC transition, Memory Pressure, queue policies and one-shot Batch selection, and an optional reversible software plan. UI offers exact costs, readiness and eligible fallback explanations. Graphics use independent SVG cards/fans; the new desk/display/speakers are code-authored. Inactive utility applications never occupy a desktop grid row. Compact Shop and Archive tests verify content inside the window, not only inside the outer viewport.

Schema 6 sequentially migrates 1–5 without erasing old hardware, Jobs, policies or software. A bounded catalog-backed journal records System Messages, one-off News and cosmetic achievements. Critical messages are saved before display and use a persisted hold/queue; old saves reconstruct only tracked facts, with unknown timestamps labeled. `engine/journal.ts` owns this behavior; `content/journal.ts` owns authored entries. Settings contains the paged Question Archive. `content/software.ts` owns the optional payout/fee contract; suspension cannot incur debt or revoke auto-run. Development engine changes reload through migration instead of retaining a stale React session. Coordinate core/schema edits before refreshing the preview; a reload between partially edited modules can still expose an intermediate development error.

### Historical Phase 0 surface

The following records the earlier scaffold boundary; the opening implementation above supersedes its absence-of-gameplay statements.

The scaffold uses npm with exact direct versions in `package.json` and a repository `package-lock.json`. TypeScript stays on the supported 6.0 line because the selected typescript-eslint release does not support TypeScript 7. ESLint handles source checks; Prettier handles source/config formatting and intentionally excludes existing Markdown. Strict TypeScript covers source, unit tests, browser tests, and Vite/Playwright configuration.

Only `src/app`, `src/ui/os`, `src/ui/apps`, `src/ui/components`, `src/ui/theme`, `src/test`, `e2e`, and the used SVG/font assets in `public` exist now. Add the proposed game/audio/devtools directories with their owning behavior rather than empty modules. The shell holds temporary active-application, inspected-component, and motion-pause UI state only; no simulation, authoritative economy, persistence, clock, randomness, or audio exists in Phase 0.

`CurrentObjective` accepts an objective summary and a typed `focus-application` navigation command handler. `GlobalStatus` accepts display summaries. Both currently receive explicit preview data from `src/app/shell-content.ts`; Phase 1 supplies live snapshots. `WindowFrame` owns window chrome and a focusable title; Job Runner and Hardware Manager contents have no screen coordinates. Taskbar and objective navigation use the same handler, expose the selected application, and transfer real keyboard focus after React reveals the destination. A layout effect handles focus after commit so hidden narrow-screen windows can receive it; focus uses `preventScroll`. Repeated navigation to the already selected application still focuses its title. They do not award progress.

`MachineVisual` draws independently animated SVG layers behind `view: 'desktop' | 'cpu' | 'ram'` and an optional inspector crop. The same tower drawing serves the whole-computer and hardware views. The shell owns component inspection; application selection opens/closes the side panel and updates the terminal. CPU/RAM controls update both views without changing economy. Add future machine/job states when their simulation behavior exists, rather than speculative props. Text remains in shell content; geometry/animation remain in the renderer/theme.

Vitest smoke tests exercise the rendered shell, navigation, and component inspection. Playwright runs against a newly built production preview, owns port 4173 without reusing a stale server, and verifies keyboard focus, desktop viewports, reduced motion, reload, and absence of console/runtime errors. The viewport regression additionally covers 800x600, 640x480, 668x862, 960x540, and 1280x650, including wheel/PageDown attempts, fully visible primary controls, and application switching. A machine browser flow verifies keyboard component selection, both synchronized views, actual CSS animation pause/resume, reduced motion, unchanged placeholder status, and no main-PC bitmap requests. README documents the exact scripts and browser setup. Gameplay and save test coverage begins in Phase 1.

## Dependency direction

Imports flow inward: React UI imports the application store; the store imports the simulation; the simulation imports models and content. The simulation never imports React. Snapshot data and domain events flow outward in the reverse direction.

Persistence may serialize model state but must not import UI. Audio receives domain events but does not modify economy state. UI tests may use engine APIs; engine tests must not render React.

## Simulation model

- Use one authoritative `GameState` value.
- Mutations occur through typed intent commands such as starting a Job, attempting its active opportunity, buying hardware, configuring a policy, and responding to an Incident. The simulation determines eligibility, timing, costs, rewards, and completion; UI commands never supply authoritative accuracy or reward amounts.
- Systems return a new state or controlled mutable draft plus emitted domain events.
- Derived selectors calculate compute, bottlenecks, affordability, and unlock visibility.
- Simulation advances from elapsed time, not assumed frame count.
- Use a fixed logical tick around 100 ms for v1 economy behavior, with elapsed-time compensation.
- Render UI counters at a lower cadence when appropriate to avoid whole-tree updates.
- Pause ordinary simulation while the document is hidden; discard hidden elapsed time on resume. Offline progress is out of scope for v1 and undecided later. Foreground delayed frames advance through bounded deterministic catch-up; they must not silently change reward rates or bypass milestones.

## Determinism

- Store a seed and random-generator state in the save.
- Route all event randomness through one injectable random interface.
- Do not call `Math.random()` in gameplay systems.
- Tests should advance a fake clock and fixed seed.

## Numbers

JavaScript `number` is sufficient for v1's approximate rates and money. Centralize arithmetic and formatting behind helpers so a later arbitrary-precision representation does not require UI rewrites.

Display rules:

- Familiar values use separators and sensible decimals.
- Large values shift to engineering/scientific notation with user-facing units.
- Tooltips may show more precision than primary labels.
- Never expose `NaN`, `Infinity`, or negative currency due to arithmetic bugs.

## Persistence

Use a versioned localStorage envelope:

```ts
type SaveEnvelope = {
  schemaVersion: number;
  savedAt: string;
  gameVersion: string;
  state: PersistedGameState;
};
```

Requirements:

- Validate loaded data and recover safely from malformed saves.
- Keep sequential migration functions.
- Autosave after meaningful commands and on a modest interval.
- Provide manual export/import and full reset with confirmation.
- Preserve a backup of the last successfully loaded save before migration.
- Never use code execution or unsafe deserialization for save imports.

## Content model

Jobs, hardware, breakpoints, upgrades, Research, Benchmarks, Current Objectives, achievements, announcements, and Era Transitions have stable IDs and typed definitions. Requirements, temporary rules, rewards, and effects are composable, inspectable, and testable. Narrative content is selected by explicit triggers, not scattered `if` statements in components.

Automation policies are saved domain state. A rule retains its configured intent when inactive and exposes a structured waiting reason. Operating Profiles reference validated policy values rather than arbitrary executable code.

## OS interface

- Fixed panels use a shared `WindowFrame` shell.
- Application contents cannot depend on fixed absolute coordinates.
- A later window manager should be able to wrap the same contents.
- Fill the available viewport with a non-scrolling game dashboard. `html`, `body`, and `#root` have bounded height; the desktop uses a `100dvh` grid with `minmax(0, 1fr)` workspace tracks. Prevent outer scrolling without letting needed controls overflow or become clipped.
- Optimize for 1440x900 and support 1280x720 plus desktop browser panels down to the verified 640x480 size. At widths of 1000px or less only the active application is displayed; the dock switches it in place. Short viewports rearrange illustration/inspector content horizontally. This is a responsive desktop accommodation, not a mobile-game scope change.
- D-023 establishes the stylized CRT game treatment; D-024 makes the main computer a code-authored SVG with state-driven layers. Scanlines are static and pointer-transparent. CSS runs cosmetic fan/cursor loops and case/selection transitions; Pause animation freezes loops and disables transitions. Reduced motion disables all machine animation/transitions and pressed-button displacement. Fonts and the small SVG icon are local. `docs/art/BEIGE_PC.md` owns the rendering guidance and archived exploration; no generated main-PC bitmap ships with the game.
- Preserve legibility during late-game chaos using hierarchy, grouping, reduced-motion support, and automation summaries.
- Keep Current Objective, currently relevant spendable resources, effective Compute, active Bottleneck, and the next relevant action globally visible. Cash is visible in v1; later chapters may summarize retired procurement while keeping its balance inspectable.
- Application requirements and Help Center entries focus the relevant application through a typed navigation command.

## Audio

- Audio starts muted or gated until a user gesture satisfies browser autoplay rules.
- Separate music, ambience, and UI volume controls.
- Early cues: CRT power, hard-drive ticks, fan, confirmation tones.
- Layer intensity by era rather than abruptly replacing the soundscape.
- Never require audio to understand timing; provide visual timing cues.

## Accessibility

- All primary actions are keyboard accessible.
- Timing interactions support Space/Enter and do not require rapid input.
- Do not encode heat, power, or success solely through color.
- Provide reduced motion, mute controls, and legible contrast.
- Tooltips are available through focus as well as hover.

## Test strategy

### Unit tests

- Cost curves and affordability
- Derived compute and bottleneck modifiers
- Manual reward boundaries
- Automation progression
- Unlock and era transition conditions
- Research effects
- Seeded event selection and cooldowns
- Number formatting edge cases
- Save round trips and every migration
- Hardware breakpoint boundaries
- Automation intent, execution, and waiting reasons
- Operating Profile application and Research respec conservation
- Benchmark temporary rules, exit/retry, diagnosis, and permanent rewards

### Content validation tests

- IDs are unique and referenced IDs exist.
- Required unlocks are reachable in dependency order.
- No required progression depends on random content.
- Story-critical announcements are non-repeatable.
- Prices, rewards, and rates are finite and non-negative.
- Every Era has a reachable Benchmark and every Benchmark reward addresses its tested rule.
- Secret achievements have no economy effect.
- Every Current Objective requirement links to an existing application or action.

### Browser tests

- New game through first purchase and automation unlock
- Save/reload preserves progress
- Keyboard-only completion of the first manual task
- Research unlock and purchase
- Era transition visual state
- Final benchmark and end screen using accelerated test controls

### Manual visual QA

Verify the opening, every era transformation, late-game dense state, dialogs, reduced motion, muted audio, and 1280x720 viewport. Screenshot comparisons may be added once the visual language stabilizes.

## Simulation interface and full-game growth

Following the deep-module design vocabulary, retain one primary simulation Interface that creates/resumes state, accepts intent commands, advances logical time, and produces snapshots plus domain events. The Interface also defines rejected-command behavior, time ownership, and effect ordering. UI and deterministic progression tests cross this same Seam. Persistence validates an envelope before handing state to the simulation; the browser's clock/audio/storage are Adapters, not owners of economy rules.

An invalid command returns a structured reason and leaves economy unchanged. Processing a completion twice cannot duplicate its reward. A time advance and its resulting rewards/unlocks/story events form a deterministic ordered update. Selectors expose requirement explanations and waiting reasons from those same rules, avoiding a second progression implementation in React.

### Add when the owning slice arrives

| Slice | Capability behind the existing Interface | Observable test |
| --- | --- | --- |
| First five minutes | One-shot opportunities, baseline cycle, safe mode choice, permanent auto-run reward | Repeated attempts cannot increase reward; relaxed controls complete the same critical path |
| Research / Benchmarks | Shared allocation budget, separate permanent discoveries and reversible tuning, isolated temporary attempt state | No double allocation, reward duplication, lost unlocks, or temporary-rule leakage after retry/reload |
| V1 climax | Checkpointed presentation phase and persisted story history | Interrupt/reload at each phase restores safe controls and awards completion once |
| First regional expansion | Bounded representative sites and pending deliveries with stable IDs | Transit results remain unavailable until delivered; local work proceeds independently |
| First foundry | Construction orders and reusable capacities | Zero-spendable-resource recovery and cancellation conservation |
| First cosmic magnitude | A chosen finite large-number representation and versioned save migration | Arithmetic, cost comparison, round trip, and formatting at chapter limits |
| Federation / finale | Deterministic scheduled messages, provenance, replayable ending phases | Independent checks use the declared model; reload and replay preserve history and economy |

Do not add a generic plugin system, separate network server, physics engine, or one exposed module per speculative Era. Extend private implementation as concrete behavior grows; introduce another Seam only when actual callers/Adapters require it.

### Hosted-world and fork content

When the owning post-v1 slice arrives, represent Sandbox Worlds through a bounded set of authored experiment states, allocated host capacity, discovery IDs, and preserved narrative history. Do not run a second full game engine or an individual-agent civilization simulation. OS Forks annotate existing sites and their histories; they do not clone the player's economy. Fake memories and counterfactual forecasts live in clearly distinguished content records and cannot overwrite canonical save history.

Test conservation of the host allocation across nesting, one-time discovery rewards, preservation/reload of worlds and forks, and result transit through the existing simulation Interface. A fictional gateway cannot bypass a physical delivery's pending state. V1's two reference-bearing content slots need no world/fork architecture.

### Numerical and simulation limits

Use ordinary numbers for bounded v1 values and integer counts/flags where appropriate. Before a chapter can overflow or lose purchase-relevant precision, choose a large-number representation against its actual arithmetic needs, migrate saves, and test the maximum designed values. Do not serialize JavaScript Infinity as the quest's reward or treat a floating-point overflow as an ending trigger. Physical infinity is not an in-game balance value.

Simulate aggregates, not each core, satellite, or star. Event counts and site counts remain bounded by representative groups; elapsed-time advancement must not replay billions of ticks. A later aggregated advance must match the same logical outcomes as smaller steps for rewards, constraints, and story stop points. No offline simulation is implemented unless that separate product decision is made.

### Persistence across Chapters

Stable content IDs and owned-unlock records survive Transitions. Adding a chapter never overwrites a completed earlier save or requires a new game. Keep a pre-migration backup; unsupported newer saves offer export/recovery instead of silent reset. Treat invalid imports as recoverable errors.

Story history is distinct from notification display state. Critical events are saved before they appear and remain in the Question Archive. Checkpoint chapter presentation phases without disabling saves. Reset/new game remains a separate explicit action and is never an ending side effect.

### Verification scope

Automated checks establish determinism, conservation, reachability, migration, phase recovery, and accessibility affordances. Human playtests establish whether timing feels fair, the humor lands, the machine feels continuous, and the answer/question distinction is understood. A passing scripted playthrough is not evidence that the game is funny or well paced for first-time players.
