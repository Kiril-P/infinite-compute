# Antimatter Dimensions research

Research date: 2026-09-07
Primary source snapshot: official web source at commit [`5409e320`](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca) (2026-07-17)
Question: What does *Antimatter Dimensions* do especially well, and what should the computer incremental adopt or avoid?

## Executive answer

*Antimatter Dimensions* is good because it repeatedly changes the player's level of control. It begins with one self-running producer, expands into a cascade of eight producers, makes the player learn a family of resets, then converts those repeated actions into configurable automation. Later layers add reversible builds, restricted-rule challenges, loadouts, scripting, and narrative encounters. Old content does not merely become faster: it becomes compressed, automated, and eventually almost invisible, leaving attention free for a new decision layer.

Its strongest transferable principles are:

1. **Unfold systems only after the current loop is understood.** Tabs, help pages, and resources appear conditionally rather than arriving as a complete dashboard.
2. **Make automation a progression reward and a strategy surface.** Automation first repeats actions, then gains thresholds and modes, then becomes a scriptable system, and finally makes old controls obsolete.
3. **Use challenges to remix known rules.** A temporary restriction can turn an understood economy into a puzzle without requiring a new minigame or resource.
4. **Let progress remove old friction.** Permanent upgrades preserve starts, bypass old requirements, and combine previously exclusive paths.
5. **Make the ending happen to the interface.** The finale progressively corrupts and removes the game UI instead of presenting only a final text box.

For this project, the best additions are a small family of deterministic diagnostic/benchmark challenges, configurable automation policies, visible hardware breakpoints, contextual help and bottleneck explanations, and an end sequence in which the fictional OS itself changes state. We should **not** copy the game's multi-month pacing, random Glyph inventory, guide-dependent optimization, or stack of nested prestige currencies. V1 remains a 55–75 minute, no-prestige game.

## Source quality and limits

- Mechanics were verified primarily against the official open-source game, especially its in-game How to Play database, challenge definitions, upgrade definitions, tab unlock conditions, and ending controller.
- The [official Steam page](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/) is used for the developers' description and aggregate reception.
- Steam user reviews are community evidence. They support claims about what players praise or dislike, but cannot prove why the design works.
- The exact real-time duration of each progression stage varies drastically with activity, build choices, offline time, and guide use. The official source defines an order of milestones, not a canonical hour-by-hour schedule. Community completion times therefore illustrate scale rather than a target baseline.
- This report describes the current desktop/web design. Mobile balance and interface details may differ.

## What the game is

The initial production model is unusually pure. The player starts with 10 antimatter and buys a first Antimatter Dimension; that Dimension produces antimatter, while each of the seven higher tiers produces the tier below it. Every ten purchased Dimensions gives that tier a multiplier. Tickspeed is a separate production-frequency upgrade. There is no manual resource-click button after the initial purchase: the machine runs, and the player's input is purchasing, resetting, configuring, and choosing strategies. The official store explicitly markets it as an unfolding idle incremental with layers of unlocks, prestige, challenges, achievements, and extensive automation, including a custom scripting language. ([official How to Play source](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L256-L337), [official Steam page](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/))

The core mathematical pleasure comes from a producer cascade rather than a flat list of generators. Buying a high tier indirectly accelerates every tier below it, so the player sees not only a bigger rate but accelerating growth at several levels. Purchase breakpoints every ten units give frequent, legible goals inside the continuous exponential curve. The built-in Max All action and hotkeys then reduce the mechanical burden of maintaining the cascade. ([official How to Play source](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L263-L311))

## Exact progression structure

The official save-progress classifier provides the clearest canonical order: Antimatter Production → Infinity → Broken Infinity → Replicanti → Eternity → Eternity Challenges → Time Dilation → Late Eternity → Reality → Teresa → Effarig → The Nameless Ones → V → Ra → Imaginary Machines → Lai'tela → Pelle. ([official progress-stage source](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/progress-checker.js#L1-L164))

| Stage | What changes | What the player is deciding |
| --- | --- | --- |
| Antimatter Production | Eight cascading Dimensions, Tickspeed, Dimension Boosts, Antimatter Galaxies, and Dimensional Sacrifice appear. | Which purchase or small reset reaches the next multiplicative breakpoint fastest. |
| Infinity | Reaching roughly JavaScript's original numeric ceiling forces a Big Crunch, resets the base economy, and awards Infinity Points for persistent upgrades. Normal Challenges become available. | When to Crunch and which permanent acceleration or automation reward to pursue. |
| Broken Infinity | The numeric ceiling is removed; deeper runs award more than one Infinity Point. Infinity Dimensions, Infinity Challenges, and later Replicanti add parallel production. | Short reset versus longer push, plus challenge ordering and autobuyer thresholds. |
| Eternity | A second main prestige layer resets the Infinity layer for Eternity Points. Time Dimensions, Eternity Milestones, and the Time Study tree appear. | Reversible build path, pace style, and when to trade a run for more EP. |
| Eternity Challenges and Dilation | Repeated challenges remove key systems; Time Dilation applies a severe exponent penalty and awards Tachyon Particles/Dilated Time. | Build and preparation for a restriction, then when a weakened run has earned a useful permanent gain. |
| Reality | The third main prestige layer resets almost all earlier progress and awards Reality Machines, one Glyph, and one Perk Point. Reality Upgrades, Perks, Black Holes, and the Automator progressively open. | Long-run reward target, deterministic perks, requirement-based upgrades, Glyph loadout, and increasingly sophisticated automation. |
| Celestials | Seven themed encounters each reinterpret earlier mechanics. Later systems include time storage, achievements as progression, memories, Glyph Alchemy, Imaginary Machines, Dark Matter, Singularities, and finally a stripped-down Doomed Reality. | Solve bespoke system puzzles, rebuild configurations, and master the whole accumulated ruleset. |
| Finale | Production itself drives a staged ending; the interface corrupts, hides tabs, disables input and saving, fades, and rolls credits before offering post-completion options. | Observe the consequence of the final escalation rather than buy one more ordinary upgrade. |

The three named **main** prestige layers are Infinity, Eternity, and Reality. Several smaller resets live inside them. A Dimension Boost resets antimatter and Dimensions to unlock/strengthen Dimensions; an Antimatter Galaxy resets further in exchange for stronger Tickspeed; Dimensional Sacrifice clears lower Dimensions to strengthen the eighth. Infinity resets the base layer for IP, Eternity resets the Infinity layer for EP, and Reality resets almost all preceding systems for RM, a Glyph, and a Perk Point. ([base reset descriptions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L343-L409), [Infinity through Reality descriptions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L433-L936))

## Core, active, and idle loops

### Core loop

The recurring loop is production → breakpoint purchase → faster production → reset for a persistent advantage → repeat the old journey faster. Crucially, each outer reset unlocks more than a multiplier:

- Infinity adds a new currency, an upgrade track, challenges, and automation rewards.
- Eternity adds Time Dimensions, milestone-based quality of life, a respec-able study tree, repeatable challenges, and Dilation.
- Reality adds loadout items, a QoL perk network, feat-gated upgrades, time acceleration, scripting, and the narrative endgame.

This is why the resets feel like progression rather than save deletion. The official How to Play entries define these new decision spaces directly. ([Infinity](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L433-L460), [Eternity and Time Studies](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L668-L821), [Reality](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L886-L1017))

### Active loop

Active play is not click frequency. It consists of:

- buying at useful ten-unit breakpoints and using Max All;
- deciding when a reset's projected reward is worth the rebuild;
- setting autobuyer intervals, bulk sizes, resource thresholds, and prestige conditions;
- entering a challenge with an appropriate setup;
- selecting and respecing Time Studies;
- selecting, equipping, filtering, and presetting Glyph loadouts;
- authoring or adjusting an Automator script.

The Time Study tree explicitly supports different Dimension specializations and active/passive/idle pace paths. Respec is free but applies on Eternity, and presets reduce re-entry effort. This creates meaningful builds without permanent account damage. ([official Time Study help](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L756-L821), [official Time Study definitions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/eternity/time-studies/normal-time-studies.js#L34-L390))

### Idle loop

Dimensions compound without input, autobuyers can purchase and prestige, and offline progress simulates game ticks. Later, Black Holes periodically accelerate nearly the entire game, and milestones/perks add passive gains or start each reset with old upgrades/resources already handled. At an extreme late-game point, Continuum replaces discrete Dimension and Tickspeed purchasing with smooth fractional purchases and hides the now-obsolete autobuyer settings. ([offline simulation](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L126-L181), [Black Holes](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1112-L1198), [Continuum](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1693-L1719))

The design lesson is that idle progress establishes the baseline while active effort edits the machine which produces that progress. This is directly compatible with the computer incremental's requirement that manual play reward timing and decisions rather than mouse abuse.

## Why the unfolding works

### 1. New layers attach to an understood verb

Most new mechanics reuse one of a few verbs: produce, buy, reset, restrict, automate, or accelerate. Infinity Dimensions and Time Dimensions reuse the production-chain grammar; later resets reuse the prestige grammar; Celestial Realities reuse the challenge grammar. The player learns a small vocabulary and then sees increasingly surprising combinations of it.

The interface enforces this progression. Automation is hidden until a total-antimatter threshold; Infinity, Eternity, Reality, and Celestial tabs appear only after their corresponding progress; individual subtabs have their own conditions. The in-game help database similarly reveals explanations as mechanics are encountered. ([official tab conditions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/tabs.js#L1-L480), [official How to Play source](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L20-L39))

### 2. Automation has a mastery ladder

Automation does not arrive as one global multiplier:

1. Individual autobuyers repeat Dimensions, upgrades, boosts, galaxies, sacrifices, and prestiges.
2. Their interval, bulk, mode, caps, and trigger thresholds are configurable.
3. Normal Challenges commonly award or improve the autobuyer for the action whose absence made the challenge meaningful.
4. Eternity Milestones start future runs with lost upgrades, add new autobuyers, and provide reduced passive gains.
5. Perks bypass old unlock requirements, auto-complete old challenges, or start runs with large amounts of earlier currencies.
6. The Automator uses a custom language to coordinate studies, challenges, Dilation, and prestige; it provides both block and text editors and can translate between them.
7. Continuum finally eliminates a mature purchase loop rather than asking the player to configure it forever.

This escalation turns automation itself into a feeling of ownership. The player first earns relief, then expresses strategy through rules, then watches a personally configured system run. ([autobuyer behavior](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L484-L549), [Eternity Milestones](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L693-L716), [Perk definitions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/perks.js#L32-L335), [Automator overview](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1018-L1111))

### 3. Challenges make the economy legible by removing a rule

Normal Challenges alter one familiar rule and chiefly reward automation. Examples include temporarily halting production after purchases, erasing lower tiers when a higher one is bought, removing Galaxy purchases, changing which tier produces which, or introducing a rising hostile resource. ([official Normal Challenge definitions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/challenges/normal-challenges.js#L8-L137))

Infinity Challenges become stronger remixes and grant persistent production interactions. Eternity Challenges go further: key Dimension families may be disabled, purchase counts capped, or time/Infinity counts constrained. Each Eternity Challenge can be completed five times; both goal and permanent reward increase, so the same puzzle returns at meaningful power thresholds. ([official Infinity Challenge definitions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/challenges/infinity-challenges.js#L3-L145), [official Eternity Challenge definitions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/challenges/eternity-challenges.js#L7-L210), [Eternity Challenge help](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L822-L851))

The important technique is **subtractive teaching**. Disabling a system reveals what that system contributed and forces the player to use a neglected one. A challenge earns its place when it teaches a relationship or changes a strategy, not merely when it raises the target number.

### 4. The game repeatedly converts restrictions into freedom

Time Studies initially enforce exclusive paths. Reality Upgrades ask the player to demonstrate mastery through explicit feats, such as completing a run while avoiding a familiar mechanic. Upgrade locks can prevent the player from accidentally invalidating an attempted requirement. Later, V's Space Theorems let the player purchase combinations that were previously forbidden, eventually allowing the entire Time Study tree at once. The result is a strong arc: understand the constraint, solve within it, then earn the right to transcend it. ([Reality Upgrade requirements](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/reality-upgrades.js#L28-L358), [V and Space Theorems](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1446-L1500))

### 5. Quality of life is treated as power

Perks often preserve old progress, remove reset friction, auto-unlock old systems, or auto-complete old challenges. These upgrades may not multiply the headline currency directly, but they make each new run start farther along. That makes progress tactile: a sequence which once took hours eventually happens immediately. ([official Perk definitions](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/perks.js#L32-L335))

### 6. Explanations scale with complexity

The UI supplies Max All, keyboard shortcuts, configurable tabs, detailed How to Play entries, and—after Infinity—a multiplier breakdown. Later official patches added clearer reward icons, autobuyer next-trigger text, challenge completion overlays, upgrade-condition locks, and more detailed catch-up information, showing that readability required sustained development as the systems deepened. ([official tab configuration](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/tabs.js#L1-L480), [official changelog](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/changelog.js#L139-L201))

### 7. Late narrative is expressed through mechanics

The Celestials are not only dialogue checkpoints. Each has a mechanic matching its identity: Reality Machines, Glyphs, stored time, achievements, memories, Dimensions, and finally Antimatter. Ra's progression reconstructs earlier Celestials through memories; Pelle's Doomed Reality disables many accumulated rewards and replaces the normal unlock routes, making the player experience the antagonist's power as a rules change. ([Celestial overview and individual mechanics](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1199-L1798), [Pelle help](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1755-L1819))

The final sequence is similarly mechanical. Its controller defines thresholds for UI corruption, hiding tabs, disabling interactivity and saves, changing number display, fading away, rolling credits, and revealing New Game/spectate controls. The ending therefore consumes the interface the player spent the game building mastery over. ([official ending controller](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/pelle/game-end.js#L1-L51))

## What players praise—and what that evidence really says

The game's current Steam aggregate is Very Positive: 91% of more than 3,300 English reviews are positive. The official description foregrounds unfolding systems, challenges, achievements, perks, and unusually extensive automation, suggesting that these are the intended product identity rather than incidental features. ([official Steam page](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/))

Community reviews repeatedly praise three experiences:

- **Long-term depth and continual discovery.** Reviewers describe the game as a benchmark for other idle games and emphasize how a simple opening keeps revealing deeper systems.
- **Satisfaction from tending a mathematical system.** One highly rated review compares the experience to maintaining a garden made of math: steady observation, adjustment, and compounding rather than reflex play.
- **A real finish line.** Multiple reviewers report hundreds or thousands of recorded hours and specifically celebrate completing the game, showing that an authored endpoint gives the long grind meaning.

These are community claims, not controlled evidence, but their consistency matches the observed design: progressive disclosure, configuration-heavy mastery, and a conclusive finale. ([top-rated Steam user reviews](https://steamcommunity.com/app/1399720/reviews/?browsefilter=toprated&l=english), [recent Steam user reviews](https://steamcommunity.com/app/1399720/reviews/))

Negative reviews expose the corresponding costs:

- Some players find the pre-Infinity opening too passive or slow.
- Long plateaus can feel like leaving a process running rather than making decisions.
- Several players report needing external guides for automation, challenge order, or build optimization.
- A positive completion review still criticizes the final section for prolonged waiting with little to do.

These complaints are especially relevant to a one-hour game: a three-minute wall is proportionally worse for us than a several-hour wall is for a months-long idle game. ([top-rated negative Steam user reviews](https://steamcommunity.com/app/1399720/negativereviews/?browsefilter=toprated&l=english), [top-rated Steam user reviews](https://steamcommunity.com/app/1399720/reviews/?browsefilter=toprated&l=english))

## Concrete implementation recommendations for the computer incremental

These recommendations preserve the approved product boundaries: one-hour V1, no prestige, no offline progress, active-without-spam play, progressive applications, light constraints, and no permanent exclusive builds.

### Priority 1 — Add visible component breakpoints

Repeatable hardware should have authored breakpoints in addition to smooth gains. For example, CPU levels 5/10/20 could unlock dual-issue processing, multicore scheduling, and vector instructions; RAM or storage breakpoints could increase batch/queue capacity. Each breakpoint should change the computer visual or application behavior, not only its multiplier.

Why: Antimatter Dimensions' every-ten purchase multiplier turns an exponential curve into short, readable goals. Our real-hardware framing can make those breakpoints more meaningful and historically grounded.

V1 rule: show `Next breakthrough: 2 CPU upgrades` beside the ordinary buy button. Do not require the player to discover hidden level thresholds.

### Priority 2 — Turn automation into configurable policies

Task Manager should grow through three levels:

1. **Auto-run:** starts the next eligible job.
2. **Queue policy:** prioritize fastest, highest Cash value, or closest milestone; allow a small Cash reserve.
3. **Operations policy:** define safe temperature and power thresholds for boost/overclock behavior.

The player should see automation execute: queue entries move, processes launch, fans respond, and a one-line log explains each decision. A global pause switch and a visible `next action` status are required.

Why: Antimatter Dimensions makes automation valuable because its modes encode strategy. The user is no longer performing the old verb; they are designing the system which performs it.

V1 limit: use toggles and small dropdowns, not a scripting language. A block/text Automator is an excellent post-V1 idea only if the economy eventually has enough repeatable decisions to justify it.

### Priority 3 — Add five short diagnostic benchmarks

Use temporary, deterministic rule changes to teach component relationships. Recommended V1 set:

| Era | Benchmark | Temporary rule | Permanent reward |
| --- | --- | --- | --- |
| Beige PC | Safe Mode Payroll | GPU/software bonuses disabled | Auto-run the next basic job |
| Home PC | Memory Pressure Test | Large jobs stall unless RAM keeps the CPU fed | Batch Queue policy |
| Workstation | Heat Soak Certification | Compute rises, then throttles unless the Thermal Window is handled | Automatic fan curve |
| Server Rack | Brownout Drill | Fixed power capacity; choose which workload stays boosted | Power-priority policy |
| Data Center | Packet Loss Audit | One route is congested and clearly signposted | Automatic route fallback |

Each benchmark should state its changed rule, exact goal, current effect, reward, and an exit/retry option. Required progression must not depend on random incidents. Failure costs only a few seconds.

Why: this borrows the best part of Antimatter Dimensions challenges—subtractive teaching and permanent relief—without importing a separate hundred-hour challenge track.

### Priority 4 — Add a reversible Research configuration

When Research unlocks, offer a small tree with two kinds of temporary emphasis:

- **Architecture:** general CPU, parallel GPU, or data/network emphasis.
- **Operations:** active timing bonus, balanced throughput, or idle/automation emphasis.

All nodes remain eventually purchasable. Before that point, a free respec may occur when an era benchmark finishes or through a clearly labeled `Recompile Kernel` action with a short cooldown. Provide 2–3 named presets once the rack era begins.

Why: the Time Study tree creates purchase-order and build decisions without permanent loss, while later Space Theorems deliver the fantasy of eventually combining paths. This matches the user's preference for no mutually exclusive permanent choices.

V1 limit: no more than two branch points and roughly 8–12 total Research nodes. Research must continue unlocking behavior rather than becoming a second Cash shop.

### Priority 5 — Show exactly why production is slow

Task Manager should expose a compact calculation:

`Raw compute × memory × thermal × power × software = effective compute`

The limiting factor should be highlighted with one plain-language sentence and a direct navigation link, such as `CPU waiting on memory — Hardware Manager > RAM`. Before a penalty begins, show the approaching threshold. During automation, show the next trigger and why it has or has not fired.

Why: Antimatter Dimensions eventually needed a dedicated multiplier breakdown and more explicit autobuyer state. Our existing heat/power/bandwidth invariants make this inspectability mandatory from the first constrained era, not a late patch.

### Priority 6 — Compress mastered eras visibly

When a new era begins:

- old jobs should complete in accelerated batches rather than simply disappear;
- their application may minimize into a live status tile;
- old manual interactions should become optional bonus opportunities;
- the UI should summarize the compression, for example `Household spreadsheet: 4m 12s then → 0.08s now`;
- automation that has become unconditional should lose obsolete configuration controls.

Why: the most satisfying proof of power in Antimatter Dimensions is replaying an old layer at extreme speed, while Continuum demonstrates that truly obsolete controls can be retired.

### Priority 7 — Make achievements bifurcate into useful and secret

Visible achievements may grant small, explicit global bonuses or unlock cosmetic OS details. Secret achievements should be fun only and provide no production benefit, so players are not economically required to search a guide. Antimatter Dimensions uses this exact distinction: ordinary achievements can reward power, while secret achievements are non-mechanical. ([official achievement help](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L415-L431))

For this project, hidden interactions such as clicking the clock or exploring fake folders should remain secret/cosmetic. Hardware and job achievements may carry the small global multiplier already proposed in `docs/GAME_DESIGN.md`.

### Priority 8 — Add contextual help as an OS application

Create `Help Center` or `ReadMe.txt` entries which appear only when their related application/system unlocks. Every entry should have:

- a one-sentence purpose;
- what the player can do now;
- the exact formula or effect behind an expandable `Technical details` section;
- a link that focuses the relevant application;
- an automatically selected `Why am I slow?` entry based on the current bottleneck.

Why: Antimatter Dimensions can sustain extreme complexity partly because its help pages unlock contextually. Our surface-level-jokes/optional-technical-detail pillar maps naturally onto a friendly OS help system.

### Priority 9 — Deliver story through system behavior

The OS narrator should not merely comment on an era transition; its capabilities and interface should change with the plot. Examples:

- Its first automation upgrade changes messages from passive status text to first-person suggestions.
- Research unlock lets it name experiments and remember prior results.
- Questionable telemetry makes announcements more informed but slightly increases incidents/trust penalties.
- The final benchmark temporarily consumes all visible compute, quiets notifications, and makes applications report `Waiting for kernel`.
- The V1 ending removes ordinary purchase affordances, focuses one calculation, then restores control after the effectively-zero answer-progress estimate.

Why: Antimatter Dimensions' Celestials and finale bind dialogue to rule changes and UI state. Our OS-protagonist premise allows this technique to work from minute one instead of only in the late game.

### Priority 10 — Use a milestone navigator, not a guide dependency

Add a small `System Upgrade Readiness` checklist for the next era. It should show 2–4 concrete requirements and live progress, while optional recommendations explain likely bottlenecks. No hidden purchase order may be required for the 60-minute critical path.

Why: Antimatter Dimensions' Celestial Navigation progressively reveals its map and indicates progress, but its broader complexity still drives many players to long external guides. We should retain destination visibility while reducing solution opacity. ([Celestial Navigation description](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1199-L1221))

## Recommended V1 cadence using these lessons

This does not replace `docs/BALANCE.md`; it refines what the existing cadence should deliver.

| Time | New decision layer | What becomes automated/compressed | Antimatter Dimensions lesson applied |
| --- | --- | --- | --- |
| 0–3 min | Clock Cycle timing and first CPU/RAM breakpoints | Nothing yet | Simple producer grammar and visible breakpoints |
| 3–8 min | Auto-run plus one queue setting | Repeating the first basic job | Automation arrives as relief before irritation |
| 8–18 min | First diagnostic benchmark and Batch Queue | Routine timing jobs | Challenge teaches a relationship and rewards automation |
| 18–30 min | Small reversible Research tree and Thermal Window | Old job selection and early purchasing | Builds change strategy but cannot damage the save |
| 30–45 min | Power/network policies and two infrastructure drills | Home-PC jobs collapse into batches/status tiles | Old layers become visibly trivial |
| 45–60+ min | Incident decisions and final benchmark readiness | Most ordinary operations | Attention moves from action execution to system oversight |
| Ending | Single maximum calculation and OS reaction | Ordinary UI temporarily yields to the event | Finale is an interface state, not only text |

## What not to copy

### Do not copy the full prestige stack into V1

Antimatter Dimensions earns three main prestige layers over a very long game. Introducing even one reset inside a one-hour vertical slice would consume tutorial time and weaken the physical PC-to-data-center journey already approved. Keep prestige as post-V1 architecture and foreshadow it only if needed.

When prestige is eventually added, require every new layer to provide all three:

1. a new persistent currency or capability;
2. dramatic compression/automation of the prior journey;
3. a qualitatively new decision space.

A reset which only provides `×2 compute` is not sufficient.

### Do not copy random Glyph loot

Glyphs combine type, level, rarity, effects, inventory, loadouts, sacrifice, filtering, and later alchemy. The official game eventually adds extensive filters and presets to control that complexity. ([official Glyph help](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L937-L997), [advanced Glyph filtering](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/h2p.js#L1294-L1364))

This conflicts with V1's no-loot-box/no-rarity direction and would pull attention away from recognizable hardware. Use deterministic named components and authored breakthroughs instead. If loadouts arrive later, let the player save deterministic rack/software configurations.

### Do not make scripting required

The Automator is powerful, but community discussions show a real learning barrier and widespread sharing/copying of scripts. A scripting application would be thematically perfect for a computer game, but it should remain optional advanced expression, never the only practical way through the story. Provide safe visual policies first. ([Steam Automator discussion](https://steamcommunity.com/app/1399720/discussions/0/3819657908519370248/), [negative Steam reviews mentioning automation/guide dependence](https://steamcommunity.com/app/1399720/negativereviews/?browsefilter=toprated&l=english))

### Do not equate duration with depth

Community reviews celebrate the game's enormous length, but negative reviews identify long waiting stretches and late-game plateaus. Our product promise is a complete arc in about an hour. Maintain the existing rule that a wall longer than three minutes needs an active opportunity or a visible near-term goal.

### Do not duplicate its abstract presentation

Antimatter Dimensions proves that tables and numbers can carry a deep incremental, but our distinguishing promise is a computer and environment which physically transform. Every major numerical unlock must therefore have a corresponding case, desk, room, rack, facility, application, animation, or sound change.

## Suggested acceptance criteria for later tickets

- A new player sees only Cash, one job, and the minimum hardware needed to understand the first loop.
- Each application/help entry is absent until its mechanic can be acted on.
- Every repeatable hardware category has at least two visible named breakpoints during V1.
- First automation appears in 3–5 minutes and visibly performs the retired action.
- Every automation rule states its next action or why it is waiting.
- Each benchmark changes one primary rule, can be exited, and awards a permanent capability related to that rule.
- Research can be respeced without permanently losing currency or progress.
- The Task Manager calculation accounts for every active production factor and highlights the current bottleneck.
- After an era transition, at least one formerly slow job visibly completes orders of magnitude faster.
- Secret achievements carry no required progression power.
- The final benchmark changes the OS interface and sound state; it is not delivered only as a modal.
- No critical-path purchase order or benchmark solution requires an external guide.

## Bottom line

The feature to copy is **progressive control compression**:

> Perform a task → understand it → automate it → configure its automation → watch it become infrastructure → face a new kind of decision.

For the computer incremental, that arc should happen once per era across jobs, cooling, power, and networking. The timing/rhythm interaction gives our opening more tactile warmth than Antimatter Dimensions, while its automation, reversible builds, challenge design, contextual help, and interface-driven finale can give the journey comparable depth without comparable bloat.
