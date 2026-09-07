# Research notes

Research was performed on 2026-09-07. Re-verify details that may change before relying on them in public-facing text.

## Genre findings

### Cookie Clicker

Cookie Clicker combines an immediately understood manual action with exponentially priced producers, upgrades, temporary active opportunities, achievements, minigames, and later prestige. The relevant lesson is not to copy the large clickable object; it is to let automation provide baseline production while attention creates occasional high-value bursts.

Source: [Cookie Clicker overview](https://en.wikipedia.org/wiki/Cookie_Clicker)

### Universal Paperclips

Universal Paperclips begins with a single manual production action, then changes scale and mechanics through commerce, computation, planetary production, and cosmic expansion. Its activity log and projects turn mechanics into narrative. This is the closest structural reference for the intended “cozy object becomes existential machine” journey.

Source: [Universal Paperclips overview](https://en.wikipedia.org/wiki/Universal_Paperclips)

### Roblox incrementals

Roblox's current `Computer Incremental` emphasizes cases, rare computers, trading, mutations, leveling, and plot upgrades. Those collection and monetization-shaped loops are outside this project's goals, though visibly upgrading a physical space is useful inspiration.

Source: [Computer Incremental on Roblox](https://www.roblox.com/games/88728410943211/Computer-Incremental)

Community discussion of well-regarded Roblox incrementals consistently praises large-number growth, automation arriving at the right time, interacting layers, fresh mechanics, and automating a system when it becomes tedious. Criticism focuses on repetitive reskins, guide-dependent complexity, and automation that arrives too late.

Source: [Community survey of Roblox incrementals](https://www.reddit.com/r/incremental_games/comments/1ifccmn/a_relatively_exhaustive_list_of_roblox/)

### Automation research

Academic analysis of incremental games notes that active clicking becomes cumbersome and examines automation as a way to remove repetition while later systems replace it. The design implication is that manual play must evolve rather than simply demand more actions.

Source: [Aalto University thesis](https://aaltodoc.aalto.fi/server/api/core/bitstreams/33559dbd-e676-4b50-a10d-9f7fee44872d/content)

## Applied conclusions

- Use progressive disclosure; the opening should contain only a job, Cash, and a few upgrades.
- Reveal new currencies only when they create new decisions.
- Automate expired chores before adding another system.
- Keep layers interacting through comprehensible bottlenecks.
- Use physical and interface transformation as frequently as numerical escalation.
- Make active play valuable through timing and choice, not action frequency.
- Let mechanics, applications, and notifications deliver most of the story.
- Do not use loot boxes, trading, or rarity collection in v1.

## Magic Research 2 and Antimatter Dimensions

Two detailed follow-up studies refine the design:

- [Magic Research 2 report](research/MAGIC_RESEARCH_2.md)
- [Antimatter Dimensions report](research/ANTIMATTER_DIMENSIONS.md)

### What Magic Research 2 does especially well

- Interconnected production, equipment, automation, exploration, and story systems give numerical growth a purpose.
- Storylines join a discoverable condition, a short narrative event, and a permanent or rule-changing reward.
- Reversible configurations let the player form a build hypothesis, test it against a boss, understand failure, and try again.
- Retirement compresses mastered content so a new run returns to unsolved problems faster.
- A visible Current Goal makes a very large game navigable.

Its major warning is clerical repetition: rebuilding known equipment and automation after resets turns solved configuration into work. The applicable rule is to preserve player intent and automate mastered repetition.

### What Antimatter Dimensions does especially well

- New systems reuse a small learned vocabulary—produce, buy, reset, restrict, automate, accelerate—while combining it in surprising ways.
- Automation matures from repeating an action, to configurable thresholds, to coordinating whole systems, and finally removing obsolete controls.
- Challenges teach relationships by temporarily subtracting or changing one known rule, then rewarding permanent relief.
- Visible breakpoints turn smooth exponential growth into frequent short-term targets.
- Later progress makes old layers visibly trivial, providing tactile evidence of power.
- The finale changes and consumes the interface itself, allowing mechanics to deliver narrative.

Its warnings are equally important: the opening can be too passive, long plateaus create guide dependence, and nested prestige plus random loadout systems would overwhelm a one-hour v1.

### Combined design rule

Each Era should follow this control-compression arc:

> Perform → understand → automate → configure → compress → face a new decision.

Each Era ends with a deterministic Benchmark that changes one familiar rule, exposes the current Bottleneck, and awards an automation or policy improvement related to what the player demonstrated. This captures the strongest shared lesson without copying the games' scale, content, or reset structures.

## Agentic repository guidance

OpenAI documents that Codex reads repository `AGENTS.md` before work and combines instructions from the Git root toward the current directory. This repository therefore keeps stable, concise rules in the root file and detailed source-of-truth context under `docs/`.

Source: [Official OpenAI documentation for AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
