# Balance model and pacing targets

Phase 3 is implemented and verified under the [Workstation contract](WORKSTATION_CONTRACT.md): transition, shared Jobs/Research capacity, eight discoveries/tuning nodes, refundable tuning, saved profiles, protein work units, power/heat, Thermal Window, Heat Soak and schema 8. Ticket 04 records acceptance evidence; the [implementation report](IMPLEMENTATION_REPORT.md) records the user-requested stop after Phase 3. Later v1 phases remain unimplemented.

The Phase 1 [opening contract](OPENING_CONTRACT.md) specifies the provisional first playable loop, timing/decision semantics, Payroll isolation, and save ownership under D-025. Validation is recorded in ticket 02.

Phase 2 uses the provisional [Home-PC contract](HOME_PC_CONTRACT.md); ticket 03 owns its staged implementation and verification.

All numbers here are provisional until instrumented playtesting. They define shape and acceptance targets, not final constants.

## Baseline run

Target: a first-time attentive player reaches the v1 ending in 55-75 minutes. Experienced or unusually efficient players may finish faster. Treat a sub-40-minute run as a pacing diagnostic, not a reason to add mandatory waits or punish optimization.

| Time | Era | Expected experience | Major unlock |
| --- | --- | --- | --- |
| 0-3 min | Beige PC | Learn timing action and buy first part | First CPU/RAM upgrades |
| 3-8 min | Beige PC | Safe Mode Payroll grants auto-run at 3–5 min; prepare the home upgrade | Task Manager |
| 8-18 min | Home PC | More jobs and visible case upgrades | GPU, basic cooling |
| 18-30 min | Workstation | Optimization expands | Research Lab, Research |
| 30-45 min | Server rack | Power and network become meaningful | Rack and remote jobs |
| 45-60+ min | Data center | Controlled multi-system chaos | Final facility and benchmark |

Each Era introduces one decision layer and compresses one mastered layer:

| Time | New control | Retired or compressed control |
| --- | --- | --- |
| 0-3 min | Clock Cycle and component breakpoints | None |
| 3-8 min | Safe Mode Payroll and auto-run | Repeating the first Job |
| 8-18 min | Memory Pressure Test and Batch Queue | Routine timing Jobs |
| 18-30 min | Reversible Research and Thermal Window | Early Job selection |
| 30-45 min | Power/network policies | Home-PC Jobs become batches/status tiles |
| 45-60+ min | Incident oversight and final readiness | Most ordinary operations |

## Cadence targets

- Initial action understood: under 20 seconds.
- First purchase: 20-40 seconds.
- First automated income: 3-5 minutes.
- New unlock, meaningful purchase, story beat, or strong visual change: every 45-120 seconds.
- A save should survive reload from the first minute onward.
- A required wait longer than three minutes must be shortened or provide a useful configuration/action that materially improves it. A distant progress bar alone does not make a stall acceptable. After auto-run, a configuration-only route may be slower than attentive play but remains steadily viable.
- Every repeatable Hardware Category exposes its next authored breakpoint.
- Every Era Benchmark attempt lasts seconds to a few minutes and immediately explains failure.

## Economy shape

### Repeatable purchase cost

Start with geometric scaling:

`cost(level) = baseCost * growth^level`

Initial growth should generally fall between 1.12 and 1.18 depending on category. Faster-growing specialized hardware may offer stronger breakpoints.

### Production

Use additive production within a hardware category, multiplicative one-time upgrades between categories, and explicit bottleneck modifiers:

`effectiveCompute = rawCompute * memoryFactor * thermalFactor * powerFactor * softwareFactor`

This is delivered processing capacity before allocation to Jobs and Research. For a Job, processing time depends on allocated Compute and required work. Remote Job completion also accounts for data transfer and, after v1, propagation/synchronization delay. Show a processing/transfer/wait breakdown; bandwidth must constrain remote throughput without slowing unrelated local Jobs. Do not apply two penalties for the same exhausted capacity.

Job progress and Research generation share a finite allocation budget. Research tuning effects cannot refund permanent unlocks. See [GAME_DESIGN.md](GAME_DESIGN.md) for allocation and respec invariants.

Avoid long stacks of invisible multipliers. The breakdown must be inspectable in Task Manager.

### Bottleneck factor

Ordinary v1 efficiency Bottlenecks should usually leave 50–100% output; early v1 should leave at least 70%. Warnings begin before penalties. Hard Job eligibility requirements and isolated Benchmark constraints are separate, labeled states: an oversized Job may wait, but an eligible fallback Job must preserve recovery. Later communication delays use completion forecasts rather than multiplying every output by an opaque penalty.

### Manual value

Compare the same hardware and Job selection, excluding unlocks and purchases, when measuring active value:

- Before auto-run, timing/decision bonuses target 25–75% more output per committed cycle than ignoring the bonus. Starting more Jobs is not itself a bonus mechanic; job duration limits start frequency.
- After basic auto-run, attentive timing/selection targets 25–75% more income than the same automated policy.
- Late v1 and later chapters target 10–30% additional useful throughput from short opportunities.

Relaxed decision mode uses the same reward budget as timing mode. No required milestone assumes perfect timing. Reserve per-cycle opportunities so repeated input cannot turn these targets into unlimited gain.

Active value should come from accuracy, selection, and temporary boosts, not actions per second.

## Research pacing

- Unlock Research after the player understands Cash, hardware, and automation.
- First Research purchase should occur within two minutes of the unlock.
- Early research choices may be bought in different orders but none are permanently exclusive.
- Every required era transition must have a clear checklist and progress indicator.
- Keep v1 Research to approximately 8-12 nodes and no more than two branch points.
- Recompiling reversible tuning is free and conserves paid Research; permanent discoveries remain owned and nonrefundable. Refunds and profile changes cannot duplicate rewards, erase earned unlocks, or grant unowned effects.

## Catch-up and anti-stall rules

- Required progress cannot depend on random events.
- Event rewards may accelerate but not gate the main path.
- If a player buys inefficiently, automated income must eventually recover the run.
- Selling hardware is unnecessary in v1; avoid creating trap purchases.
- Named upgrades should state whether their effect is additive or multiplicative.

## Instrumentation required

Development builds should record locally:

- Timestamp of each unlock and era transition
- Purchase sequence
- Manual interaction accuracy and participation
- Time spent throttled by heat, power, or bandwidth
- Time between meaningful affordances
- Ending time

Provide a development-only way to export the session trace as JSON. Do not collect or transmit analytics.

## Full-game balance budgets

[FULL_GAME.md](FULL_GAME.md) owns chapter pacing ranges and resource introduction. The provisional total is 8–12 attentive hours over several sittings. A chapter may ship shorter if it delivers its decisions and narrative; extending waits to hit duration is unacceptable.

- Introduce one primary new decision per Era. Compress one mastered operation before demanding another.
- Keep Cash and Research in v1. Introduce Fabrication once in Chapter III; keep later energy, cooling, and transport as Capacities.
- Use region/site aggregation to keep operation count independent of fictional machine count. Cap the main operational view at six representative locations and roughly three simultaneous decisions until testing justifies more.
- After the planetary chapter, bulk provisioning replaces repeated hardware buying. Expose upcoming capabilities and construction forecasts rather than thousands of equivalent purchases.
- Provide at least two viable configurations per later Benchmark. Diagnose a poor configuration immediately, preserve essential production, and allow retry in seconds. A full attempt should generally take under three minutes.
- Reserve 45–105 minutes for Chapter V's playable preparation, final configuration comparison, and chosen useful Job. Keep the answer/reframing sequence itself around 3–6 minutes with pause/replay; the narrative budget is not a passive countdown.
- The cosmic-absurdity threads occupy existing chapter content slots. Prototype with at most three representative Sandbox Worlds and two visible nesting levels inside one host Research allocation. OS Forks reuse the existing six-site budget. No new currency, extra Era, or wait is justified solely by adding a reference.
- Keep new, meaningfully distinct affordances within a few minutes during later attentive play. Large fictional construction spans are represented by short planning cycles with other useful work.
- Verify a path with no random rewards, no dubious contracts, no optional timing bonuses after auto-run, and no offline progress. It may exceed the attentive duration target but must have measured recovery times and no deadlock.

## Required balance experiments before treating numbers as final

1. Opening: compare ignored timing, competent timing, repeated invalid input, and relaxed decision mode at equal hardware. Confirm opportunity limits and first-purchase/auto-run targets.
2. V1: compare balanced, CPU-heavy, memory-heavy, and Research-emphasis purchase sequences. Track first purchase, auto-run, Research, each Transition, wait time, and completion. Randomize only optional content with recorded seeds.
3. Later chapters: compare naive expansion with suitable placement/allocation. Each new constraint must create an explainable useful choice rather than simply punish growth.
4. Recovery: exhaust spendable Cash/Fabrication, refund tuning, cancel construction, exit a Benchmark, and interrupt a chapter sequence. The next useful action and a viable income/construction source must remain available.
5. Story pacing: observe playtesters without directing them to the archive. Record whether they recognize the quest, the satire, and the final distinction between output and purpose. Treat these as qualitative playtests, not claims an automated test can prove.
