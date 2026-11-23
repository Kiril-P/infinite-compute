# Build loop and resumable handoff

Use this workflow for every implementation ticket and every continuation of unfinished work. Repository AGENTS.md supplies the canonical-document routing rules. This file owns execution, verification, resource checkpoints, and handoff; [issue-tracker.md](issue-tracker.md) owns ticket metadata.

## 1. Ground and select

1. Read `docs/CONTINUITY.md`. Identify current authorization, active ticket, verified state, blocker, and exact next action. Respect a planning-only pause unless the latest user instruction resumes building.
2. Read the selected ticket in full, including comments and its latest checkpoint, its parent specification, and the matching phase in `docs/ROADMAP.md`. A dependency is satisfied only when its execution is complete with acceptance evidence; `ready-for-agent` is a triage label, not proof of completion.
3. Follow the root AGENTS.md context pointers for every affected area. Check `docs/IMPLEMENTATION_READINESS.md` for open findings owned by this slice. Read affected implementation, tests, and applicable ADRs before changing behavior. Load relevant sections, not the entire campaign by default; refresh the sources when scope changes.
4. Inspect branch, HEAD, working-tree changes, and any recorded live commands. Preserve pre-existing edits. On a continuation, verify that the recorded state still matches the files before repeating an edit or command.
5. Inspect available usage/context telemetry and warnings as described below. Select one small vertical slice with enough capacity to implement, verify, and checkpoint it.

**Exit condition:** the agent can name the authorized ticket, satisfied dependencies, affected canonical sources, acceptance checks, and next bounded change. Mark `Execution: in-progress` and record the owner/task identifier if available before implementation. Do not overwrite another active owner's claim without establishing that it is stale or the work has been handed off.

## 2. Build one demonstrable slice

Implement a complete behavior through the existing simulation Interface and its UI/persistence surfaces as needed. Resolve routine engineering choices autonomously and record durable choices in the appropriate canonical document. Resolve the opening R1–R4 contract as part of Phase 1 before the affected behavior is implemented.

Use focused tests/checks during work. At each meaningful boundary—behavior implemented, failure diagnosed, or scope changed—update the ticket checkpoint with progress and the next action. Before beginning another substantial change, reassess the remaining verification and resource budget. Split large phase tickets into bounded execution steps; leave the parent incomplete until all acceptance criteria pass.

**Exit condition:** the selected behavior is reviewable and its actual verification state is known, or a concrete blocker triggers the pause procedure. Do not broaden scope merely because other tickets are ready.

## 3. Verify against the contract

Read actual repository scripts/configuration; run the phase-required build, typecheck, lint, relevant tests, and browser checks. Phase 0 establishes these scripts and must verify every promised command. Later slices run affected checks and all additional checks their acceptance requires. Do not repeat unchanged successful checks without a new reason.

For UI changes, manually inspect the affected behavior at the target viewport, including relevant keyboard/reduced-motion states. Record what was exercised and any artifact location. A passing build does not substitute for visual inspection or a playtest. For documentation-only work, validate affected links/status relationships and whitespace; runtime checks are not applicable.

Record exact commands, outcomes, and failures. Label checks `passed`, `failed`, `not run`, or `not applicable` with a reason; never infer a pass from starting a command. If interrupted, record partial verification and leave execution incomplete.

**Exit condition:** every acceptance criterion has evidence or an explicit outstanding item. Fix failures within the authorized slice when resources allow; otherwise checkpoint and pause.

## 4. Complete and hand off

When all ticket acceptance criteria pass, reconcile affected canonical docs with behavior, set `Execution: complete`, and clear the active owner/blocker. Append a concise completion record to the ticket, then replace stale state in `docs/CONTINUITY.md` with the verified state and exact next unblocked ticket/action. Keep an implementation ticket's canonical triage `Status` separate from its execution result.

Before ending, inspect the diff/status and reread the saved checkpoint to confirm it matches the files. Report the outcome and remaining limitations to the user. Continue to another slice only within the user's authorized scope and with sufficient resource reserve; otherwise stop at the completed boundary. This workflow does not create scheduled resumptions or new tasks automatically.

## Usage and context management

- Check available resource indicators at task start, before a costly tool/test batch, and at slice boundaries. Use actual exposed usage telemetry when available. Usage windows may be account-wide; do not treat them as a precise estimate of this task's remaining tokens.
- Use visible context warnings or remaining-context information when exposed. Never invent percentages, token counts, reset times, or a context-reading capability. If unavailable, record `unavailable` and keep steps/output bounded; missing telemetry alone is not a blocker.
- Reserve capacity for recording results and writing both checkpoints. When a visible limit is near enough that the next step plus verification/handoff may not fit, stop expanding work and checkpoint early. Do not wait for a hard cutoff or spend the reserve on optional review, another large search, or unrelated cleanup.
- Reduce context pressure through targeted reads, concise output, and durable checkpoints. Normal automatic compaction is not by itself a failure: after compaction, reread continuity and the active ticket, verify actual files, and resume from the recorded point if reliable context and resources remain.
- Treat context as a blocker when essential requirements/state cannot be reliably recovered within the remaining capacity. Treat usage as a blocker when a limit/error prevents the necessary next step or leaves insufficient reserve to complete it safely. In either case, perform the pause procedure and stop substantive work.
- Do not purchase credits, redeem usage resets, switch models to evade a limit, or create a wakeup/automation without user authorization. Record any known reset time as information for resumption, not a promise to resume automatically.

## Pause procedure: usage, context, or another blocker

1. Stop starting new edits or expensive checks. Finish a small in-flight operation only if safe and within reserve. Stop only disposable local processes owned by this task when appropriate; otherwise record the running process/session and whether it may still mutate files. Do not interrupt another task's work.
2. Set the active ticket to `Execution: paused`. Record `Stop reason: usage | context | approval | external | user`, the specific evidence, and the condition needed to resume. A usage/context pause does not change `Status` to `needs-info` unless user information is actually missing.
3. Save a checkpoint in the ticket and a compact matching handoff in `docs/CONTINUITY.md`, using the fields below. Do not mark partial work complete or claim unrun checks passed. Preserve unrelated edits; avoid a destructive reset to make the tree appear clean.
4. Verify the checkpoint files were written if tools still permit. Tell the user where work stopped, what remains unverified, and exactly how the next agent can continue. Then stop; do not launch another subtask or enter an automatic retry loop.

If tools or a hard cutoff prevent saving the checkpoint, state that it was **not saved** and provide the recoverable checkpoint in the final response if possible. The resume procedure must then reconstruct and verify state from files; never assume a checkpoint write succeeded.

## Checkpoint fields

Put the latest compact checkpoint under the ticket's `## Comments`, preserving its originating request and prior conclusions. Continuity summarizes it and points to the ticket rather than duplicating the entire history.

```text
Checkpoint: <date/time with timezone>
Ticket / roadmap phase / execution step:
Execution: in-progress | paused | complete
Owner: <task identifier if available, otherwise unavailable or none>
Branch / HEAD / working-tree state:
Completed behavior and changed files:
Canonical docs read / decisions recorded:
Verification: <exact commands and outcomes; visual checks; not-run checks>
Unfinished work / known failures:
Stop reason and evidence: <none, or category plus actual message/indicator>
Usage/context observation: <available evidence or unavailable>
Running processes / artifacts: <durable paths; mark ephemeral resources>
Resume condition: <none, or concrete change needed>
Next action: <one exact command or edit, with directory and expected result>
```

Keep secrets and bulk tool output out of checkpoints. Essential reproduction instructions belong in the repository, not only in a temporary file or chat message. Once both checkpoint records are saved, another agent must be able to continue without reading the previous conversation.
