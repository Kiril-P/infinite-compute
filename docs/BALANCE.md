# Balance model and pacing targets

All numbers here are provisional until instrumented playtesting. They define shape and acceptance targets, not final constants.

## Baseline run

Target: a first-time attentive player reaches the v1 ending in 55-75 minutes. An experienced player should be faster, but purchase-order optimization must not cut the run below roughly 40 minutes.

| Time | Era | Expected experience | Major unlock |
| --- | --- | --- | --- |
| 0-3 min | Beige PC | Learn timing action and buy first part | First CPU/RAM upgrades |
| 3-8 min | Beige PC | Automation begins | Task Manager |
| 8-18 min | Home PC | More jobs and visible case upgrades | GPU, basic cooling |
| 18-30 min | Workstation | Optimization expands | Research Lab, Research |
| 30-45 min | Server rack | Power and network become meaningful | Rack and remote jobs |
| 45-60+ min | Data center | Controlled multi-system chaos | Final facility and benchmark |

## Cadence targets

- Initial action understood: under 20 seconds.
- First purchase: 20-40 seconds.
- First automated income: 3-5 minutes.
- New unlock, meaningful purchase, story beat, or strong visual change: every 45-120 seconds.
- A save should survive reload from the first minute onward.
- A wall longer than three minutes requires either an active opportunity or visible near-term goal.

## Economy shape

### Repeatable purchase cost

Start with geometric scaling:

`cost(level) = baseCost * growth^level`

Initial growth should generally fall between 1.12 and 1.18 depending on category. Faster-growing specialized hardware may offer stronger breakpoints.

### Production

Use additive production within a hardware category, multiplicative one-time upgrades between categories, and explicit bottleneck modifiers:

`effectiveCompute = rawCompute * memoryFactor * thermalFactor * powerFactor * softwareFactor`

Avoid long stacks of invisible multipliers. The breakdown must be inspectable in Task Manager.

### Bottleneck factor

Bottlenecks should usually reduce output into a 50-100% range. Early v1 should not reduce production below 70%. Warnings begin before penalties.

### Manual value

Target active play at approximately:

- 2-4x automated income during the opening minutes.
- 25-75% additional effective income after basic automation.
- 10-30% additional income in the late game through short opportunities.

Active value should come from accuracy, selection, and temporary boosts, not actions per second.

## Research pacing

- Unlock Research after the player understands Cash, hardware, and automation.
- First Research purchase should occur within two minutes of the unlock.
- Early research choices may be bought in different orders but none are permanently exclusive.
- Every required era transition must have a clear checklist and progress indicator.

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

