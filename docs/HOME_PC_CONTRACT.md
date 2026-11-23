# Home PC contract — Phase 2

Provisional implementation values under D-025, grounded in [GAME_DESIGN.md](GAME_DESIGN.md), [BALANCE.md](BALANCE.md), [CONTENT_GUIDE.md](CONTENT_GUIDE.md) and the two Chapter I slots in [COSMIC_ABSURDITY.md](content/COSMIC_ABSURDITY.md). Phase 1 remains unchanged. Validate the complete route before declaring Phase 2 complete; tune the 8–10 minute Home-PC and 18–22 minute Research targets from traces, not time gates.

## Slice 1: the first transformation

- Completing Payroll exposes Storage. Its first purchase costs $80 and unlocks the photograph Job: 30 work, $28, 12 MB, 2 seconds of setup divided by `(1 + Storage level)`. Basic auto-run remains owned; selecting a Job preserves the current cycle and changes the next one. Ineligible selections show their exact requirement and fall back to the household Job, preserving the player's intent.
- CPU 6 / RAM 4 / Storage 1 prepare a Wide bus ($240, ×1.5 raw Compute). The Home-PC chassis then costs $650, needs the same parts and the bus, and preserves every owned part, Job, bonus, Cash remainder, automation preference and save. There is no reset or minimum-time gate.
- Home PC raises the CPU/RAM caps to 12/8 and uses ×100 raw base CPU scale. New CPU/RAM prices are the existing geometric price ×150, rounded upward. Its original spreadsheet is visibly compressed from 12 seconds initially to the engine's 0.1-second minimum cycle. Faster work retains finite output; UI forecasts include tick quantization.
- Storage caps at 1 before Home PC and 4 afterward; later Storage purchases cost `ceil(80 * 1.18^level * 20)` and reduce Job setup. All buy controls expose costs, concrete effects and the next capability.
- One-Function Wonder is an ordinary optional Home-PC Job: 2,400 work, $480, 20 MB, 3-second base setup. It closes a renewal reminder. It uses an existing Job slot, grants no extra automation, and needs no new subsystem.
- The environment changes from green CRT/beige machine to a blue desktop with a larger desk, flat display, silver tower, speakers and independent activity layers. The original household file remains in saved progress. Motion can still be paused or reduced; the dashboard does not scroll.
- Schema 2 migrates schema 1 by adding Home-PC state, selected Job and setup remainder defaults. Existing elapsed time, RNG, partial Job/Payroll and settings are preserved. Invalid legacy/future data still enters recovery. Save versions evolve only with a tested migration.

## Remaining Phase 2 slices

- Memory Pressure Test teaches larger working sets. Prepared CPU 8 / RAM 5 / Storage 2; Small pages uses 24 MB and 90,000 work, Whole file uses 36 MB and 60,000 work. An oversized attempt visibly stalls until exit/reconfiguration; no fee, bonus or lost ordinary work. Completion permanently adds queue policy once. Explicit safe strategy and exact diagnosis remain visible.
- Queue policy chooses selected Job, fastest Cash, largest payout, or the nearest unfinished Job milestone. A short Batch Queue decision offers the eligible existing Jobs with their real work/reward/setup/memory; one prioritization bonus per chosen cycle. Repeated input cannot refresh it. Configured intent survives temporary ineligibility and reload. Completion Contractor is saved explanation text about an undefined success criterion, not recursive Job spawning.
- GPU becomes useful after Home PC / Storage 2; Cooling unfolds after the first GPU. Their limits, prices and airflow effects are specified below. The spinning-logo Job rewards graphics specialization. A reversible Software offer gives a disclosed benefit and renewal fee; ordinary Jobs and permanently earned auto-run stay viable without it. No offline debt or negative Cash.
- Saved System Messages, Announcements, achievements and Question Archive preserve essential normal-play beats. Secret achievements are cosmetic. The software offer/refusal and peripheral completion establish original satire and connect to the inherited directive. A cosmetic promotional-score mode labels its altered display and never changes real Compute.

## Verification

First route: fresh game → Payroll → CPU/RAM/Storage → photograph → Wide bus → Home PC, using real commands and a fixed seed. Browser coverage must migrate a partial schema-1 save, exercise selection/fallback and purchase controls, reload across transformation, and inspect both ordinary/compact/reduced-motion layouts. Subsequent slices add policy/Benchmark/retry, software cancellation/suspension, history/achievement integrity and baseline/inefficient-order traces. Ticket 03 remains incomplete until every Phase 2 requirement passes.

## Slice 2 resolved details

Memory Pressure uses an explicit Benchmark kind, separate from Payroll, and the same paused ordinary-Job isolation. Whole file may enter below 36 MB and then reports zero delivered work with an exit/Small-pages recovery. Small pages fits RAM 5. Both preserve auto-run ownership and the player's enabled/paused intent. CPU/RAM purchases and bonuses are blocked during either attempt; a reload preserves the actual kind and work. A single completion flag awards queue policies once.

Queue policy is Selected Job, Fastest Cash (payout divided by the full quantized setup/processing forecast), Largest payout, or Unfinished Job first (then Cash rate). A blocked explicit selection falls back to the household file without deleting the preference. Batch Queue exposes the actual eligible Jobs and Cash/s. Its first choice in the current cycle reserves +50% for a highest-rate choice, otherwise baseline payout; it also reserves the selected next Job ahead of the normal policy. The current cycle's existing attempt flag prevents a second choice, timing input or a mode switch from increasing the reward. Thus active value uses the same finite per-cycle budget. Earlier Job selection becomes policy work; auto-run never needs to be earned again.

Schema 3 adds explicit Benchmark kind and queue metadata. Versions 1 and 2 migrate without changing their economy or partial work. New per-Job counts begin when tracked; migration preserves aggregate completed Jobs and never invents exact old counts. Validation covers policy values, pending batch eligibility identifiers, finite counts and Benchmark-specific prerequisites/stalled work. The inherited directive and era story history will be collected in the remaining content slice.

## Graphics/cooling quantities

GPU unlocks at Home PC / Storage 2; Cooling appears after GPU 1. GPU prices are `ceil(6000 × 1.16^level)`, cap 4; Cooling prices `ceil(1800 × 1.18^level)`, cap 3. Each GPU adds 150 base graphics Compute before Wide bus. GPU airflow efficiency is `max(0.7, 1 / (1 + 0.15 × max(0, GPU − Cooling − 1)))`; only graphics capacity receives that airflow penalty. Cooling restores the exact lost capacity. CPU capacity remains separate, and neither purchase lowers useful capacity.

The spinning-logo Job needs GPU 1 / 24 MB and uses the full delivered CPU+GPU budget: 4,000 work, $1,600, 3-second base setup. Ordinary Jobs use CPU and 15% of delivered graphics capacity; their visible duration/rate reflects that specialization. Aggregate Compute is an upper capacity, not a claim that every Job can exploit every GPU. Memory Pressure uses the aggregate budget. All computed forecasts include setup and 100 ms quantization. Research allocation will account for specialization explicitly in Phase 3; it cannot spend unused graphics capacity twice.

Schema 4 adds GPU/Cooling with zero defaults for versions 1–3. The renderer adds these parts as independent layers and retains inspection, pause and reduced motion. Full Phase 2 route will verify these values together with software and workstation preparation before the phase closes.

## Reversible software quantities

Renewal Systems offers a Job payout optimizer at Home PC: $1,000 upfront, +15% payout before whole-Cash rounding, then $600 every 60 seconds of ordinary foreground simulation. Benchmark attempts pause the renewal clock with ordinary production; hidden time incurs neither charges nor debt. An unaffordable renewal suspends only the optional benefit, preserves Cash and auto-run, and retries at the next renewal or an explicit $600 retry. No charges accrue while cancelled. A $12,000 permanent edition provides the same benefit without renewals; ownership survives cancellation and can be reactivated free. The ordinary free edition remains viable and all transitions/Benchmarks remain independent of software purchases.

The first GPU exposes the offer through a normal OS message; the Shop allows reviewing it earlier after Home PC. Cancellation takes one action and bypasses a fictional paid confirmation. Metric Orchard's optional promotional score is explicitly cosmetic, separate from actual Compute; one switch restores the useful view. Schema 5 preserves previous hardware/queue/Jobs while adding free software defaults. Renewal counters and pending suspension survive reload. Saved story history follows in the next content slice.

## Saved story and cosmetic achievements

Every authored message has a stable saved history entry before display. One-off story beats are deduplicated, held for 10 foreground seconds, and queued behind another held story beat; ordinary repeated Job completions cannot erase them. A reload preserves the pending beats and hold remainder. System status remains authoritative in its application; historical prose never gates production. Announcements are one-off, explicitly triggered, era-tagged original fiction. All Phase 2 achievements are cosmetic, including the secret case-inspection achievement.

Settings → Question Archive provides bounded pages for System history, News and Achievements, plus the inherited directive and the preserved household artifact. It requires no collection percentage, scroll, or story acknowledgement. Schema 6 reconstructs only known older milestones at their saved times; unrecorded timing is shown as unknown rather than invented. Older aggregate Job totals do not fabricate per-Job accomplishments.

## Implemented Phase 2 validation

`src/test/home-route.ts` defines two deterministic, command-only routes. Both use correct opening decisions, earn Payroll, then use ordinary auto-run with the free software edition. The reference selects photographs before Home PC, prepares Memory Pressure, then prioritizes graphics/cooling before finishing CPU/RAM/Storage. The inefficient alternative finishes CPU/RAM before buying graphics. No state injection, minimum-time gate, random event or post-Payroll bonus is used in either trace.

| Milestone | Graphics first | CPU first |
| --- | --- | --- |
| First CPU | 0m24s | 0m24s |
| Safe Mode Payroll | 3m15s | 3m15s |
| Home PC | 8m54.1s | 8m54.1s |
| Memory Pressure passed | 15m55.9s | 15m55.9s |
| All workstation parts ready | 21m46.3s | 30m09s |
| Longest individual wait | 2m24.9s | 2m47.7s |

These are repeatable simulated routes, not first-time-player pacing evidence. Research is not yet implemented; Phase 3 owns its actual unlock timing. The graphics-first route leaves very little time for a further transition fee before the 22-minute baseline target. Preserve the visible value of specialization and do not add a blind required wait to that boundary.

The Home sound set uses a softer sine cue at different pitches; opening cues retain triangle tones. Completion cues are limited to one per 1.2 seconds so compressed household Jobs cannot create rapid beeping. Sound stays opt-in. Acoustic quality still needs human listening in Phase 6. Contextual ReadMe entries now cover actual Home Job, memory, airflow and software rules and can focus the relevant application.
