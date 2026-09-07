# Technical design

## Architecture summary

Build a client-only React and TypeScript application with a framework-independent deterministic simulation core. React renders coarse snapshots and issues typed commands. Game content and balance live in data modules, not component bodies.

No backend is needed in v1.

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

## Dependency direction

Dependencies flow one way:

`models/content -> engine/systems -> application store -> React UI`

Persistence may serialize model state but must not import UI. Audio receives domain events but does not modify economy state. UI tests may use engine APIs; engine tests must not render React.

## Simulation model

- Use one authoritative `GameState` value.
- Mutations occur through typed commands such as `completeManualJob`, `buyHardware`, `buyUpgrade`, and `acknowledgeIncident`.
- Systems return a new state or controlled mutable draft plus emitted domain events.
- Derived selectors calculate compute, bottlenecks, affordability, and unlock visibility.
- Simulation advances from elapsed time, not assumed frame count.
- Use a fixed logical tick around 100 ms for v1 economy behavior, with elapsed-time compensation.
- Render UI counters at a lower cadence when appropriate to avoid whole-tree updates.
- Pause ordinary simulation while the document is hidden; offline progress is explicitly out of scope.

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
- Support a target viewport of at least 1280x720; optimize primarily for 1440x900 and larger.
- Preserve legibility during late-game chaos using hierarchy, grouping, reduced-motion support, and automation summaries.
- Keep Current Objective, Cash, effective Compute, active Bottleneck, and the next relevant action globally visible.
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
