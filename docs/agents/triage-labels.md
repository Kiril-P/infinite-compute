# Triage labels

| Canonical role | Local status | Meaning |
| --- | --- | --- |
| `needs-triage` | `needs-triage` | A maintainer must classify or clarify the ticket. |
| `needs-info` | `needs-info` | Progress requires information from the user or reporter. |
| `ready-for-agent` | `ready-for-agent` | The ticket has sufficient context and acceptance criteria for an agent. |
| `ready-for-human` | `ready-for-human` | Human judgment or access is required for implementation. |
| `wontfix` | `wontfix` | The ticket will not be actioned. |

Use the local status exactly as written so triage and implementation skills share one vocabulary.

These roles describe triage readiness, not implementation progress. Implementation tickets use the separate `Execution` field defined in [issue-tracker.md](issue-tracker.md); usage/context interruptions set execution to `paused` and preserve a resumable checkpoint.
