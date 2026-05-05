# AGENTS.md

## Stack

<!-- One line per layer. Detected from project. -->

## Build / Test / Lint

<!-- Copy exact commands so agents don't guess. -->

## Memory Bank

This project uses a two-tier memory bank at `memory-bank/`.

### Always read on session start:

- `memory-bank/activeContext.md` — Current focus, last decision, known risks (≤20 lines, local only / gitignored)

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

## Conventions

<!-- Populated from detection or manually. Keep to ≤10 rules. -->

## Build Guardrails

This project uses agent-driven guardrails for accelerated prototype builds.

### Docs (fill at the start of each build session):

| File                        | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `docs/scope-fence.md`       | What's in scope, out of scope, and negotiable       |
| `docs/time-budget.md`       | Per-feature time allocations and deadline           |
| `docs/degradation-tiers.md` | Full / reduced / minimal versions of each feature   |
| `docs/demo-narrative.md`    | Story-beat clickthrough script for the presentation |

### Automatic self-checks (the primary coding agent does these, no manual invocation needed):

**Before starting a new screen or feature:**

1. Read `docs/scope-fence.md`. If the work isn't listed under "In Scope," flag it in one sentence and wait for confirmation. Do not silently build out-of-scope features.
2. Read `docs/time-budget.md`. Note the allocation for this feature. Mention it briefly: "Starting [feature], budget is [X] min."

**After completing a screen or feature:**

1. Commit with message format: `checkpoint: [screen/feature]: [what works now]`. Example: `checkpoint: dashboard: KPI cards and trend chart rendering with mock data`.
2. Update the Status column in `docs/time-budget.md` to "done".
3. Update `memory-bank/activeContext.md`. Evict the completed item.
4. Report time spent vs. budget in one line. If over budget on the completed item, note it without editorializing.

**When starting the last screen/feature in the budget:**

1. Mention that this is the last budgeted item. After this, it's polish time.

These checks should be brief: one or two lines woven into the natural flow of work, not separate announcements.

### Dedicated guardrail agents (available for deeper checks when needed):

| Agent                        | When to use                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `scope-guard`                | Deep scope analysis when a feature feels ambiguous                                     |
| `time-keeper`                | Detailed time breakdown when falling behind                                            |
| `demo-check`                 | Full presentation-readiness audit in the final hour                                    |
| `demo-walkthrough-generator` | After writing `docs/demo-narrative.md`. Generates a Playwright dress rehearsal script. |

### Hooks (fully automatic, silent unless thresholds are breached):

- **PreToolUse**: Scope check. Flags new routes not found in `docs/scope-fence.md`.
- **PostToolUse**: Checkpoint nudge. Reminds to commit after 8+ uncommitted changes.
- **PostToolUse**: Time monitor. Alerts at 75% and 90% of total time elapsed.
- **Stop**: Demo readiness scan. Flags placeholder text, `console.log` statements, uncommitted changes.

### Build rhythm:

1. Fill in the four docs above (15 min max).
2. Work screen by screen, not feature by feature.
3. Finish one page fully before starting the next.
4. The agent handles scope checks, time reports, and commits at each transition.
5. If over budget, drop to the next degradation tier and move on.
6. Do not go back to polish earlier screens until all screens exist.
7. The 75% time alert is your cue to assess what's left and cut if needed.
8. The 90% time alert means: finish current work, then run `@demo-check`.

### Data contract enforcement:

- All data-consuming components must import types from `src/lib/data/contracts.ts`.
- Never inline data shapes. If a new entity appears, define it in `contracts.ts` first.
- Mock data in `mock.ts` must conform exactly to the contract interfaces.
- When the backend counterpart delivers a live API endpoint, update `.env.local` and verify against the contract. Do not modify component code.
- If a contract needs to change, update `contracts.ts` and `memory-bank/dataContracts.md` together.
