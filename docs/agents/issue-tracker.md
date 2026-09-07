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

## Skill operations

When a skill says to publish a specification or ticket, create the corresponding file under `.scratch/<feature-slug>/`. When a skill asks for an issue, read the referenced file rather than inferring its contents from the roadmap.

## Wayfinding

- Map: `.scratch/<effort>/map.md`
- Child decision: `.scratch/<effort>/issues/<NN>-<slug>.md`
- Child metadata: `Type: research|prototype|grilling|task`, `Status: open|claimed|resolved`, and `Blocked by: <numbers or none>`
- Claim: change `Status` to `claimed` before work.
- Resolve: append `## Answer`, change `Status` to `resolved`, and add a short linked conclusion to the map.

If a GitHub remote is added and GitHub Issues becomes the real tracker, update this file before publishing work there.
