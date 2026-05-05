# Copilot Project Instructions

## Memory Bank

This project maintains a two-tier memory bank at `memory-bank/` for cross-session context.

### Always read on session start:

- `memory-bank/activeContext.md` — Current focus, last decision, known risks (≤20 lines, local only)

### Read on demand:

| File                 | Read when...                                        |
| -------------------- | --------------------------------------------------- |
| `projectOverview.md` | Starting a new feature or onboarding                |
| `decisionLog.md`     | Making an architectural or scoping decision         |
| `dataContracts.md`   | Creating or modifying data-consuming components     |
| `conventions.md`     | Writing new code or reviewing patterns              |
| `openQuestions.md`   | Encountering ambiguity — check here before guessing |

### Updating the bank:

- After completing a feature or making a significant decision, update `activeContext.md` and the relevant on-demand file.
- `activeContext.md` is a queue: evict completed items to `decisionLog.md`.
- Never let `activeContext.md` exceed 20 lines.
- You can invoke the `@memory-bank-synchronizer` agent or type `/update-memory-bank` to trigger a full sync.

## Build Guardrails

During accelerated builds, follow these conventions automatically at every screen/feature transition:

**Before starting a new screen or feature:**

- Read `docs/scope-fence.md`. If not listed under "In Scope," flag it in one sentence and wait.
- Read `docs/time-budget.md`. Mention the allocation briefly.

**After completing a screen or feature:**

- Commit: `checkpoint: [screen]: [what works]`.
- Update `docs/time-budget.md` status to "done".
- Update `memory-bank/activeContext.md`. Evict the completed item.
- Report time spent vs. budget in one line.

**Ongoing:**

- If a hook surfaces a scope or time concern via `systemMessage`, acknowledge it and act on it.
- When the developer says "getting close," "almost done," or "wrapping up," run the demo-check agent automatically.
- Dedicated agents are also available on demand: `@scope-guard`, `@time-keeper`, `@demo-check`.
- Skills for quick checks: `/scope-check`, `/time-check`, `/demo-check`.
- Do not nag between transitions. These checks happen at natural breakpoints, not continuously.
