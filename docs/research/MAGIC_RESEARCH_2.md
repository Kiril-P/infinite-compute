# Magic Research 2: design research

Research date: 2026-09-07

## Research question

What does *Magic Research 2* do unusually well as an incremental game, why do players praise it, and which of its ideas should inform the computer incremental described in this repository?

## Sources and limits

The mechanical analysis prioritizes first-party material: the official store page, developer announcements and patch notes, the playable official web demo, the developer-published English translation file, and the official modding SDK. The translation file is particularly useful because it contains the game's own help text and system explanations. Community reviews are used only for reception claims.

This is a systems analysis, not a complete content walkthrough. The official store describes a 60-hour-plus game with more than 120 spells, 250 items, 40 bosses, and 120 Storylines; reproducing its volume would be inappropriate for our 55–75 minute v1. [Official Steam page](https://store.steampowered.com/app/2864890/Magic_Research_2/)

## Executive finding

*Magic Research 2* works because it combines three progress tracks:

1. **Numerical growth:** resources, element levels, production, equipment, and combat power rise.
2. **Knowledge growth:** the player learns how spells, equipment, automation, and enemy rules interact.
3. **Structural growth:** Storylines unlock permanent bonuses, automation, new screens, new elements, and rule changes.

The third track is the distinctive one. A discovery is often not merely a reward; it changes the game the player is operating. Retirement then compresses mastered content so the player can reach a new problem faster. The result feels like a journey through systems instead of one exponential curve.

The most transferable lesson for this project is: **use milestones to change the available verbs, make each new verb solve a visible problem, and automate the old verb as soon as it is understood.**

## What the game is

The developer calls it an incremental, text-based, auto-battler RPG. The player studies elemental magic, casts spells, creates resources, builds a home, transmutes and equips items, hires Wizards to automate spells, and defeats increasingly difficult bosses while searching for the Philosopher's Stone. The official site emphasizes semi-automated combat, long-lived spell and equipment synergies, feature-changing side stories, and a concrete ending. [Official site](https://mcolotto.github.io/magic-research-demo/website-mr2/) · [Developer launch description](https://www.reddit.com/r/incremental_games/comments/1cxevna/magic_research_2_is_out_now/)

The free demo was described by the developer as the first four to six hours and allows its save to transfer to the full game. That matters when comparing its disclosure rate with our much shorter v1. [Developer demo announcement](https://www.reddit.com/r/MagicResearch/comments/1c0g058/announcing_magic_research_2_the_next_game_in_the/)

## Exact progression structure

The game's macro progression is a repeated sequence of production, preparation, combat gates, discoveries, and resets:

| Stage | What the player does | What changes |
| --- | --- | --- |
| Opening | Manually gather Mana, channel it into four elemental Essences, and follow a visible Current Goal. | Study and the first spells are introduced through an event rather than exposed upfront. This was confirmed directly in the official demo. |
| Study | Assign researchers among Elements; experience raises Element levels. | Levels unlock spells, transmutations, and other bonuses. The primary Element studies faster. [Official help text](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L3820-L3825) |
| Production | Cast Channeling spells, build resource-producing or capacity-increasing Furniture, and manage Mana and Essence caps. | The same foundational spells scale with maximum Mana, keeping early systems relevant later. [Official Channeling help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L347-L349) |
| Craft and configure | Transmute materials and equipment, choose a loadout, buy run-long Enhancements and reallocatable Boosts. | The player's build changes resource flow and combat performance. New recipes arrive through Element levels. [Official Transmute and Enhancement help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L2573-L2579) |
| Automate | Assign Wizards to spells and transmutations; later create rules, saved strategies, and Perma-Cast configurations. | Repeated casting becomes a programmable capacity-allocation problem. [Official Wizards help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L3826-L3833) |
| Explore | Select an area, automatically encounter enemies, and intervene with spells or strategy changes. | Defeating enough ordinary enemies exposes the area's boss; bosses are the main progression gates. [Official Exploration help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L5575-L5579) |
| Discover | Meet Storyline requirements through exploration, builds, quantities, or unusual behavior. | Rewards persist through retirement and may unlock systems, rules, or content rather than only multipliers. [Official Steam page](https://store.steampowered.com/app/2864890/Magic_Research_2/) |
| Retire | Reset the current run, choose a new primary Element, and replay. | Maximum Primary Levels, global study/production multipliers, Time Pieces, and Storyline rewards speed the next run. [Official Retirement help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L658-L665) |
| Postgame | Complete restricted Challenge runs, find alternate story outcomes, then unlock Worlds. | Worlds reset nearly everything, award reallocatable Boon Points, and allow higher difficulty. [Official Worlds help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L2612-L2615) |

This is not a straight content ladder. A run can simultaneously pursue a boss, a higher Element level, a Storyline condition, a better automation setup, and preparation for a stronger retirement.

## Core, active, and idle loops

### Core loop

At the center is:

> generate resources → unlock and cast better spells → craft/configure a stronger build → defeat a boss → unlock a new area, resource, or system → repeat

Combat is the forcing function. Production has a purpose because bosses demand new answers; bosses are not only bigger health bars, because their attacks and immunities can make a different spell, resource state, or equipment configuration preferable. The official help explicitly defines ever-harder bosses as the main way forward. [Official Exploration help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L5575-L5579)

### Active loop

Active play is configuration plus intervention, not sustained click speed:

- Allocate researchers and Wizards.
- Decide which resources and equipment to create.
- Change equipment, spells, and automation rules for a bottleneck or boss.
- Cast high-value spells manually when timing matters.
- Search Storyline hints and deliberately satisfy their conditions.

The character and enemy attack automatically; the player is free to intervene with spells or delegate casting to Wizards. [Official site](https://mcolotto.github.io/magic-research-demo/website-mr2/)

### Idle and automation loop

Wizards generate Wizard Power toward a spell rule and cast it automatically when the rule fills. They can automate normal spells and Transmutation. Later Perma-Cast lets eligible buffs, debuffs, and cooldown spells renew themselves; Wizards pool capacity, prioritize sustaining Mana when constrained, then prefer cheaper effects. Saved Wizard Strategies act as loadouts. [Official Wizards and Perma-Cast help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L3916-L3926)

Offline time becomes Time Pieces after ten minutes away. The game says they can accelerate game speed, warp all systems forward, accelerate Study, or trigger an event, converting absence into a flexible resource instead of prescribing one offline reward. [Official Time Pieces help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L2499-L2501)

## How systems unfold

The [official web demo](https://mcolotto.github.io/magic-research-demo/magic-research-2/) opens with one manual action, one resource, four initially empty Element tracks, and a Current Goal. After only a small amount of Mana collection, an event explains Channeling and adds the new controls. This is classic progressive disclosure: the full game is complex, but the first screen is not a dashboard of every future system.

Later systems arrive as answers to existing friction:

- Study turns waiting for spells into an allocation decision.
- Wizards automate casting after repeated spell use is understood.
- Enhancements turn combat drops into run-long improvements.
- Storyline hints turn secrets from blind guessing into directed discovery. Most hint thresholds persist across retirements, while genuinely hidden content remains possible. [Official Storyline-hint text](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L3898-L3903)
- Spellcraft modifies familiar spells instead of adding only replacements. It adds powerful tradeoffs: stronger or cheaper effects can become harder for Wizards to automate. [Official Spellcraft help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L3810-L3819)
- Synchro turns unlocked Elements into a spatial build puzzle whose adjacent pairs grant multiplicative, sometimes negative, bonuses; saved grids support quick switching. [Official Synchro help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L2603-L2608)
- Familiars can join combat or independently repeat cleared exploration, turning old areas into passive resource sources. [Official Familiar help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L2583-L2590)

The developer's patch notes show deliberate friction removal: direct navigation from material costs to crafting, queuable Enhancement purchases, saved scroll position, idle-system badges, better auto-combining, fallback backup saves, and earlier unlocks that skip repeated opening progression. [Official v1.6.3 notes](https://steamcommunity.com/app/2864890/allnews/) · [Official v1.5.4 notes](https://store.steampowered.com/news/app/2864890/view/4228398800938626129)

## Narrative delivery

Narrative is coupled to mechanics in four ways:

1. **Current Goal** supplies a short next action.
2. **Events** appear as pop-ups and remain available from a notification history.
3. **Storylines** combine a condition, a short scene, and a mechanical reward.
4. **Boss victories** advance the physical journey and reveal the central mystery.

Storylines are especially effective because their reward can embody what happened in the scene: learned knowledge persists, a character becomes automation capacity, or an object becomes a permanent rule modifier. This prevents story and progression from feeling like separate modes. The game still promises and reaches a clear ending rather than using lore to excuse an endless wall. [Official site](https://mcolotto.github.io/magic-research-demo/website-mr2/) · [Official Steam page](https://store.steampowered.com/app/2864890/Magic_Research_2/)

## Build choices

Its build depth comes from overlapping, reversible decisions:

- The primary Element makes its spells cheaper and its experience faster, shapes playstyle, and can be changed on retirement. [Official primary-Element help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L4639-L4641)
- Run-specific Classes emphasize combat, spell throughput, or building capacity. [Official class introduction](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L1011-L1014)
- In Modern mode, limited Land makes Furniture composition a genuine capacity choice; Furniture can be disposed to reallocate space. Classic mode retains a more relaxed cost-scaling version and is the recommended mode. [Official game-mode help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L2564-L2572)
- Boosts share an escalating cost, encouraging specialization while remaining freely resettable. [Official Boosts help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L2573-L2577)
- Equipment, Spellcraft, automation capacity, Synchro layouts, familiars, and combat spells interact, yielding multiple ways through a wall.

The important property is not permanent exclusivity. A build is a temporary hypothesis: configure it, test it on a boss, inspect why it failed, and revise it.

## Prestige and new-game systems

### Retirement: frequent strategic reset

Retirement resets the run but records the current primary Element's Maximum Primary Level. Maximum and total MPL values produce global Study and production multipliers; Storyline benefits and Time Pieces persist. The game explicitly recommends retiring when progress slows, the next Goal appears impossible, multipliers will rise substantially, or a Storyline's deferred benefit is ready. [Official Retirement help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L658-L665)

This gives a reset several simultaneous purposes: raw acceleration, broadening mastery by selecting a new primary Element, activating discoveries, choosing a different class/build, and approaching a previously impossible boss.

### Challenges: constraint as mastery test

Postgame Challenges remove or constrain capabilities—such as pouch items or non-primary Elements—and award permanent advantages related to the skill demonstrated. These are not required to teach the base loop; they remix a known game after mastery. [Official Challenge reward examples](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L4746-L4757)

### Worlds: deep replay layer

World travel is a much deeper reset: unlocked Elements, Storylines, MPL, and global multipliers generally do not carry over. The Worlds screen persists; clearing another world at higher difficulty grants more Boon Points, which accumulate and can be reallocated among broad advantages. [Official World-transition text](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L5245-L5247) · [Official Boon text](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L5569-L5570)

The official modding SDK confirms that the implementation has separate temporary, run, world, and global state lifetimes. That hierarchy is a useful architectural model even though our v1 has no prestige. [Official modding concepts](https://github.com/mcolotto/magic-research-2-modding-example/blob/main/docs/concepts.md#gamestate)

## Failure and friction

Failure is usually delay, not destruction. Losing combat only costs the time needed to heal; the game explicitly states there is no additional penalty. [Official Exploration help](https://github.com/mcolotto/magic-research-2-translations/blob/main/base-translations.json#L5575-L5579)

Its productive friction includes:

- Mana and storage caps that prevent unattended production from solving everything.
- Limited automation capacity, which forces prioritization.
- Land limits or cost scaling, which make production composition matter.
- Boss mechanics that invalidate a comfortable build and prompt reconfiguration.
- Storyline conditions that reward experimentation and attention.

Its less productive friction is visible in player criticism: retirement can require recreating equipment, reloading automation repeatedly as capacity returns, and revisiting many screens; crafting rules cannot always express desired stock targets. The distinction is important: solving a configuration puzzle once is gameplay, but manually reconstructing the already-solved answer is clerical work. [Community: most-helpful Steam reviews](https://steamcommunity.com/app/2864890/reviews/?browsefilter=toprated) · [Community: App Store reviews](https://apps.apple.com/us/app/magic-research-2/id6478566840?platform=iphone&see-all=reviews)

## Why players praise it

These are reception claims, not first-party facts.

The game currently has 92% positive Steam reviews (609 reviews), a 4.8/5 US App Store score (116 ratings), and a 4.8 Google Play listing with more than 50,000 downloads. Counts change over time. [Steam](https://store.steampowered.com/app/2864890/Magic_Research_2/) · [App Store](https://apps.apple.com/us/app/magic-research-2/id6478566840?platform=iphone&see-all=reviews) · [Google Play](https://play.google.com/store/apps/details?id=com.mcolotto.magicresearchtwo)

Repeated praise in prominent reviews is specific:

- **Interconnected systems:** upgrades, spells, equipment, and automation create synergies instead of isolated multipliers.
- **Active strategy:** players keep adjusting builds and tactics, so progress rarely reduces to waiting for one number.
- **Purposeful prestiges:** a new run reaches old content faster and usually begins with a concrete new advantage or target.
- **Discovery cadence:** Storylines, hints, mechanics, and areas keep presenting reasons to continue.
- **A finite narrative arc:** the clear ending makes accumulated power serve a story goal.
- **Respect for absence:** offline time is banked flexibly, and ordinary combat failure is non-destructive.

The same reviews reveal the tension behind the praise: complexity is satisfying while the player is learning or choosing, but exhausting when the interface demands repeated setup. Some players also report early cognitive overload and difficulty locating information across many screens. [Community: Steam reviews](https://steamcommunity.com/app/2864890/reviews/?browsefilter=toprated) · [Community: App Store reviews](https://apps.apple.com/us/app/magic-research-2/id6478566840?platform=iphone&see-all=reviews)

## Recommendations for our computer incremental

### Implement in v1

1. **Turn milestone jobs into mechanical Storylines.** Each major job should have a visible requirement, a short OS event, and a rule-changing reward. Example: completing the first overnight render unlocks the Task Manager's automation rule, not merely Cash. This lets mechanics carry the story as already required by `docs/PRODUCT.md`.

2. **Keep a pinned Current Objective in the OS shell.** Show one primary target and at most two optional discoveries. Requirements should be exact: “Install 4 MB RAM and sustain 80% compute for 20 seconds.” Clicking a missing requirement should open the relevant application.

3. **Use five benchmark gates as MR2-style bosses.** Each era should end with one job that tests the era's new concept:
   - Beige PC: timing and basic throughput.
   - Home PC: RAM or storage preparation.
   - Workstation: GPU specialization plus cooling.
   - Server rack: power and bandwidth balance.
   - Data center: an integrated benchmark using every system.

   Failure should expose the bottleneck and cost only a short recovery, matching the project's existing non-destructive incident rule.

4. **Prefer rule-changing Research to flat bonuses.** Good Research unlocks batching, allows jobs to continue through a thermal warning, makes spare CPU generate Research, or lets automation react to a condition. Flat `+20%` upgrades should support these breakthroughs, not dominate them.

5. **Make automation a readable capacity-allocation system.** Task Manager rules should say what they do, what resource limits them, and why a rule is idle. Useful conditions include “keep at least X Cash,” “run until queue has Y jobs,” and “activate cooling above Z°.” This preserves MR2's pleasure of programming a system.

6. **Remember automation intent before capacity exists.** A saved rule should remain configured and activate automatically as CPUs, power, or workers become available. Do not require the player to reload the same profile after every unlock. Architect this now even though v1 has no reset.

7. **Create reversible operating profiles.** A small set of saved profiles—Balanced, Throughput, Research, and Manual Burst—can reconfigure job priority, power budget, and cooling policy. Profiles provide meaningful optimization without permanent mutually exclusive choices.

8. **Let early systems remain useful through scaling and reinterpretation.** The opening timing action can later become “manual interrupt optimization”: rarer, higher-value windows generated by the same clock-cycle metaphor. Early CPU, cooling, and software should participate in later formulas rather than becoming dead inventory.

9. **Unify narrative and reward.** An OS notification should explain why a feature exists in-world and immediately demonstrate it. If “IncrediSoft Background Productivity Service” unlocks automation, the notification, joke, visible process, and mechanical reward should be one event.

10. **Maintain an inspectable cause-and-effect breakdown.** Every benchmark, stalled automation rule, heat penalty, and power cap needs a concise explanation plus a deeper tooltip. This enables optimization without guide dependence.

### Defer beyond v1

- A flexible offline-time currency similar to Time Pieces is worth revisiting when offline progress is in scope.
- Prestige should eventually preserve discoveries, profiles, and quality-of-life while resetting resources. Its primary reward should be reaching a new problem faster, not replaying the same hour.
- Challenge runs could later impose historically themed constraints—single-core only, no GPU, dial-up bandwidth—and reward automation or infrastructure improvements related to the constraint.
- A deep-reset layer can use explicit run/era/world/global state lifetimes, but only after the finite v1 is satisfying without resets.

### Avoid

- **Do not copy MR2's feature count into one hour.** Our v1 needs a few deep, interacting systems, not dozens of currencies and applications.
- **Do not make secret or random events required.** Optional discoveries may be surprising; required progression must remain deterministic, as `docs/GAME_DESIGN.md` already specifies.
- **Do not rebuild solved configurations.** Prestige, when added, must restore saved intent and automate mastered setup.
- **Do not fragment essential information across applications.** The OS metaphor invites window sprawl. Keep Cash, compute, current objective, active penalty, and next affordable action visible globally; add cross-links between requirement and source.
- **Do not turn capacity constraints into hard stops.** Heat, power, and bandwidth should lower efficiency, announce the exact loss, and make the remedy obvious.
- **Do not add crafting chains merely because MR2 has them.** For this game, hardware purchases and named breakthroughs already express preparation; extra intermediary currencies should exist only when they create a new decision.

## Decision-ready conclusion

The clearest adaptation is a **milestone-driven benchmark journey**: each era teaches one system, concludes with a diagnostic benchmark that tests it, delivers a story event through the OS, and unlocks an automation or rule change that retires the old chore. This captures what players value in *Magic Research 2*—interconnected systems, discovery, build experimentation, meaningful acceleration, and a real ending—without importing its 60-hour density, reset micromanagement, or interface burden.
