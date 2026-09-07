# Domain docs

This is a single-context repository.

## Before domain work

- Read `CONTEXT.md` before naming gameplay concepts, tests, tickets, or modules.
- Read ADRs under `docs/adr/` that touch the area being changed.
- Use the glossary's preferred terms and avoid its rejected synonyms.
- Surface an ADR conflict explicitly before proposing a contradictory implementation.

Missing domain material is not itself an error. Add a glossary term only when project-specific language has been resolved. Add an ADR only for a hard-to-reverse, surprising tradeoff whose reason would otherwise be lost.

## Layout

```text
CONTEXT.md
docs/
  adr/
    0001-*.md
```
