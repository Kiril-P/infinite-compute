# Issue tracker: Local Markdown

Issues and specs for this repository live as Markdown files in `.scratch/` and are committed with the work they describe.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- Feature specification: `.scratch/<feature-slug>/spec.md`
- Implementation ticket: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`
- Number tickets from `01`; keep one ticket per file.
- Put a `Status:` line near the top of each ticket using `triage-labels.md`.
- Put blocking ticket numbers in a `Blocked by:` line.
- Append discussion under `## Comments` rather than rewriting the originating request.

## Implementation execution state

`Status` retains the five canonical triage roles from [triage-labels.md](triage-labels.md). Use a separate `Execution` field on implementation tickets:

| Execution | Meaning |
| --- | --- |
| `not-started` | No implementation has begun; this is the default for older tickets missing the field. |
| `in-progress` | An agent owns the active slice; record its task identifier when available. |
| `paused` | Work is incomplete and checkpointed with a stop reason, resume condition, and exact next action. |
| `complete` | All ticket acceptance criteria and required verification passed, and canonical docs/continuity match. |

A dependency is complete only when its `Execution` and evidence establish completion. Select a `ready-for-agent` ticket whose dependencies are complete and whose execution is not complete; resume paused work only after its recorded resume condition holds. Read a ticket's latest checkpoint before claiming it. A resource pause is not a request for missing product information.

Follow [build-loop.md](build-loop.md) for claiming, verification, completion, usage/context checks, and checkpoint fields. Preserve originating ticket text; update mutable execution metadata and append progress under `## Comments`. Keep the latest checkpoint compact and readily identifiable.

The Wayfinding decision statuses below apply only to those research/prototype/decision children. They do not replace implementation `Status` or `Execution`.

## Skill operations

When a skill says to publish a specification or ticket, create the corresponding file under `.scratch/<feature-slug>/`. When a skill asks for an issue, read the referenced file rather than inferring its contents from the roadmap.

## Wayfinding

- Map: `.scratch/<effort>/map.md`
- Child decision: `.scratch/<effort>/issues/<NN>-<slug>.md`
- Child metadata: `Type: research|prototype|grilling|task`, `Status: open|claimed|resolved`, and `Blocked by: <numbers or none>`
- Claim: change `Status` to `claimed` before work.
- Resolve: append `## Answer`, change `Status` to `resolved`, and add a short linked conclusion to the map.

If a GitHub remote is added and GitHub Issues becomes the real tracker, update this file before publishing work there.
