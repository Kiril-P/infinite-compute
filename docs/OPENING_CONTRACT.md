# Opening contract — Phase 1

Provisional values selected under D-025. This closes the design ambiguity in readiness R1–R4; implementation and play evidence must still verify it. [BALANCE.md](BALANCE.md) retains the pacing targets; [GAME_DESIGN.md](GAME_DESIGN.md) retains the broader rules.

## R1: the route and quantities

| Item | Opening value / behavior |
| --- | --- |
| New game | $0; installed base CPU/RAM plus zero purchased levels; no completed Jobs or Automation |
| Household spreadsheet | 12 work; $8 baseline; 4 MB required; nonzero progress without bonus |
| CPU | `ceil(20 * 1.18^level)` Cash; raw Compute `1 + 0.5 * level` work/s; opening cap 6 |
| RAM | `ceil(18 * 1.16^level)` Cash; `4 + 4 * level` MB; opening cap 6 |
| Memory efficiency | `max(0.7, 1 - 0.05 * max(0, CPU level - RAM level - 1))`; effective Compute = raw × efficiency; show cause and exact percentage |
| Breakpoints | CPU 3 and RAM 2 prepare Safe Mode Payroll; CPU 6 and RAM 4 prepare later Home-PC capacity, with its owning phase implementing the Transition |
| Safe Mode Payroll | Available with 3 CPU purchases and 2 RAM purchases; 300 work, all optional bonuses disabled; completing grants permanent basic auto-run once |
| Payroll decision | Small pages uses the available 12 MB; whole-file processing needs 16 MB (RAM 3), processes 240 work. State exact requirements and diagnose immediately; no fee or penalty for choosing the wrong configuration. |

Baseline purchase order: CPU, CPU, RAM, CPU, RAM. Costs are $20, $24, $18, $28, $21. Correct bonuses pay $12 per cycle: first purchase after two 12-second Jobs (24 seconds), preparation around 75 seconds, payroll around 120 seconds at 2.5 Compute; auto-run around 195 seconds. Ignored bonuses yield a first purchase at 36 seconds and a slower viable route to auto-run. These are independently calculated reference values, with 100 ms tick quantization and human reading time to be measured; no minimum-time gate is added.

CPU/RAM may be bought in other orders. Purchasing never lowers effective Compute; RAM removes the visible memory penalty and enables larger configurations. No required progression depends on randomness or bonus accuracy.

## R2: one opportunity and equivalent decision mode

- Each ordinary Job captures the current input mode at start and has one bonus opportunity. Changing the preferred mode affects the next Job; it cannot reset a live opportunity.
- Timing cursor repeats a 2.4-second sweep from 0 to 1. Attempt within 0.38–0.62 grants +50% Cash; 0.27–0.73 outside that band grants +25%; other attempts grant zero. The first attempt consumes the opportunity. The engine uses elapsed Job time, not a client-supplied timestamp, accuracy, or reward.
- Decision mode shows a seeded workload cue: repeated data favors **Keep in cache**, one-pass data favors **Stream once**. The first correct choice earns the same +50%; an incorrect choice earns zero. The choice has no reflex deadline other than normal Job completion; no required bonus is assumed. The UI states the matching rule explicitly.
- Mode-incompatible commands are rejected; repeat valid attempts cannot change the result. Completing a Job removes that cycle's opportunity before later input is processed. Ignored bonuses still pay $8. Starting while a Job is active does nothing.
- Seeded cues are optional flavor/decision variety. A seed/RNG state is stored, and partitioned elapsed-time advances must produce the same meaningful state.

## R3: payroll isolation and recovery

Payroll pauses and preserves the ordinary Job's work, elapsed time, captured input mode, and consumed opportunity. It owns delivered Compute exclusively during its attempt. Ordinary purchases, input-mode changes, and bonuses are unavailable during the attempt; the exit control restores ordinary work. Auto-run intent is preserved. Reload restores the exact attempt and paused Job. Success grants auto-run once and restores ordinary work; restarting an already completed Benchmark is a no-op. There is no entry fee or random Incident.

The Small pages strategy is the visible safe solution with minimum hardware; Whole file requires additional RAM and finishes faster. Exit, purchase, and retry are immediate. Auto-run starts the next basic Job and reports running, paused, or waiting for the Benchmark. It never chooses a bonus automatically. The opening does not implement queue policy yet.

## R4: versioned saves and one writer

- Schema v1 stores all meaningful engine state, partial ticks, active/paused Job, attempt consumption, RNG, hardware, cash, payroll/Automation, preferences, narrative flags, and bounded milestone history. Validate shape, finite ranges, discriminated values, and cross-field relationships before hydration. No offline elapsed time is credited.
- Persist after successful commands and at a short periodic cadence; keep a previously validated backup. Recovery prefers a valid primary, then a valid backup with a visible recovery notice. Invalid/future-version saves are never silently replaced by a fresh game. Offer export of the unreadable data and explicit reset/import.
- Use an origin-scoped Web Lock for the single active writer. Other tabs remain read-only and do not tick or save. A visible Take control action requests the previous writer to save/pause/release through BroadcastChannel, then acquires the same lock and reloads the newest validated save. Closing the owner naturally releases its lock. Never steal the lock while its owner can still write.
- A failed/unavailable storage write preserves in-memory state, marks it **Unsaved**, and offers export/retry; never label a failed write saved. If Web Locks are unavailable, use an explicit unsaved in-memory session, with no automatic competing writes.
- Reset/import require in-game confirmation and ownership. Export remains available in recovery/read-only states. New game/reset produces a fresh seeded state; gameplay never evaluates imported code.

## Clock, feedback, and verification

Engine time uses fixed 100 ms ticks with a persisted remainder; tests inject elapsed time and seeds. Browser visibility pauses the clock and discards hidden elapsed time. Foreground delays are processed in bounded chunks without losing elapsed time. Development-only speed and trace export are gated by `import.meta.env.DEV`; production has no game-mutation shortcut.

The computer's terminal, fan and drive/activity layers reflect Job/inspection state; purchased parts visibly change. Synthesized feedback is opt-in from a user gesture, with mute/volume controls; visual feedback is sufficient on its own. Pause animation and reduced-motion behavior remain supported.

Required checks: first purchase at baseline 24–36 seconds; anti-spam and ignored/wrong input recovery; correct decision parity; deterministic time partitioning; affordability/nondecreasing performance; payroll prerequisites, both strategies, pause/exit/reload/once-only reward; auto-run toggle; versioned save validation/backup/failure/multiple-tab ownership; production startup/reload; keyboard/reduced-motion/no-scroll layouts; manual opening and payroll play. Human comprehension is manual evidence, not an assertion inferred from a passing test.

Implementation reference: [Web Locks request semantics](https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request) were verified from MDN. Acquisition is queued with an abort signal so a StrictMode cleanup can release before the new session acquires. Waiting tabs stay read-only; explicit takeover asks the owner to release. `ifAvailable` and `signal` cannot be combined and are not used together. The callback holds the lock until its release promise settles; `steal` is not used.
