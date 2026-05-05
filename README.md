# Preamp

> From workshop to working demo in a day.

Preamp is a Next.js prototype kit built for accelerated client workshops. You walk out of a workshop with a notebook full of ideas. By the end of the day, a stakeholder is clicking through a working demo. The kit handles the boring scaffolding so the time you have goes into the parts that actually matter: the screens, the story, the demo path.

What you get out of the box: a stocked component library (sidebar shell, page headers, data tables, KPI cards, charts), a pluggable data layer that runs on hardcoded mocks until you wire a real API, six route stubs ready to fill, deploy to Vercel in one command, and an opinionated set of guardrails that keeps you honest on scope, time, and demo readiness during the build.

## Quick start

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

You'll land on the dashboard route. The sidebar links to five other stub pages. Everything renders with mock data out of the box. No backend needed.

## Before your first real build

Fifteen minutes of setup before the prototype is yours:

| File                        | What to do                                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/scope-fence.md`       | List what's in scope, out of scope, and negotiable. The scope guardrail uses this.                                                           |
| `docs/time-budget.md`       | Set a deadline and per-feature minutes. The time-keeper guardrail uses this.                                                                 |
| `docs/degradation-tiers.md` | Define full / reduced / minimal versions of each feature so you can drop down when time runs out.                                            |
| `docs/demo-narrative.md`    | Write the dress rehearsal clickthrough as story beats. The demo-check agent walks this path.                                                 |
| `.env.local`                | Set `NEXT_PUBLIC_CLIENT_NAME` and (when you go live) `NEXT_PUBLIC_API_URL`. Defaults are pre-filled.                                         |
| `src/app/(app)/layout.tsx`  | Rename navigation labels and pick icons that match the domain. The defaults (Dashboard, Assets, Activity, Create, Results) are placeholders. |

Optional but worth the time: tweak the OKLCH theme variables in `src/app/globals.css` to match the client's brand. The `--primary`, `--ring`, and `--chart-*` tokens drive most of the surface. See [Theming](#theming) below.

## What's in the box

**Layout primitives** in `src/components/layout/`:

- `AppShell`: collapsible sidebar with nav, brand slot, mobile sheet
- `PageHeader`: breadcrumbs, title, description, action area
- `EmptyState`: centered placeholder for unfilled sections

**Data primitives** in `src/components/data/`:

- `DataTable<T>`: generic, sortable, searchable, with skeleton loading
- `StatCard`: KPI value with trend indicator
- `ChartShell`: Recharts wrapper with loading and empty states

**shadcn/ui** primitives in `src/components/ui/` (Button, Card, Input, Table, Tooltip, Sidebar, Skeleton, and the rest of the standard set).

**Pluggable data layer** in `src/lib/data/`:

- Typed contracts (`Entity`, `EntityDetail`, `Activity`, `Summary`)
- Mock implementation with realistic fixtures and simulated latency
- Live `fetch` implementation with quiet empty-state fallbacks
- A single env var (`NEXT_PUBLIC_DATA_SOURCE`) switches between them
- React hooks: `useEntities`, `useEntity`, `useActivities`, `useSummaries`

**Route stubs** in `src/app/(app)/`:

- Dashboard, Assets list, Asset detail, Activity feed, Create, Results
- All wrapped in the `AppShell` layout
- Each renders a `PageHeader` and `EmptyState` so the navigation works on day one

## Guardrails

The guardrail system is what separates this kit from a generic scaffold. It's a small set of agents and silent hooks that keep you honest while you build:

- **scope-guard** reads `docs/scope-fence.md` and pushes back when you start something out of scope.
- **time-keeper** reads `docs/time-budget.md` and reports where you stand against the clock.
- **demo-check** walks `docs/demo-narrative.md` end to end and flags broken paths or placeholder text.
- **demo-walkthrough-generator** turns the demo narrative into a Playwright dress rehearsal you can re-run before the live demo.

Hooks fire silently in the background and only speak when something actually needs attention: a new route that isn't in the scope fence, eight uncommitted changes piling up, the 75% time mark, the 90% time mark. Advisory, never blocking.

The full mechanics live in [`AGENTS.md`](./AGENTS.md). The agents work with Claude Code today and have parallel definitions for GitHub Copilot.

## Memory bank

Cross-session context lives in `memory-bank/`:

- `activeContext.md` (gitignored, local) holds the current focus
- `decisionLog.md`, `projectOverview.md`, `dataContracts.md`, `conventions.md`, `openQuestions.md` are committed and shared

A `memory-bank-synchronizer` agent keeps the bank lean and accurate. Triggered automatically by session-start and session-end hooks. Conventions are documented in `AGENTS.md`.

## Switching mock to live

```bash
./scripts/swap-to-live.sh https://api.example.com
vercel --prod

# or back to mock
./scripts/swap-to-mock.sh
```

Windows equivalents are at `scripts/swap-to-live.ps1` and `swap-to-mock.ps1`. The toggle is a single env var (`NEXT_PUBLIC_DATA_SOURCE`) that's only read in `src/lib/data/source.ts`. No component code changes when you flip.

## Deploy

```bash
./scripts/setup-deploy.sh
# or with a token for CI: VERCEL_TOKEN=xxx ./scripts/setup-deploy.sh
```

Run it once per engagement. It links the project to your Vercel account, sets default env vars, and ships a production build. After that, `vercel --prod` is enough.

The repo carries no Vercel project IDs, so each clone deploys to its own account. See [`vercel.json`](./vercel.json).

## Theming

Theme tokens live in `src/app/globals.css`. Two blocks: `:root` for light mode, `.dark` for dark mode. `next-themes` is wired in the root layout, so the active class on `<html>` follows the user's system preference and can be flipped manually via `useTheme()`.

To rebrand:

1. Pick a primary color and convert it to OKLCH (free converters online).
2. Replace `--primary` and `--ring` in both `:root` and `.dark`.
3. Replace `--chart-1` through `--chart-6` with a coordinated palette.
4. Optional: swap the font in `src/app/layout.tsx` (currently Inter via `next/font/google`).

The `05-theme` branch carries a worked example of an AT&T-branded palette as a reference.

## Repo map

```
preamp/
├── src/
│   ├── app/
│   │   ├── (app)/         # routes wrapped in AppShell
│   │   ├── layout.tsx     # root layout, ThemeProvider + DataProvider
│   │   └── globals.css    # OKLCH theme tokens
│   ├── components/
│   │   ├── layout/        # AppShell, PageHeader, EmptyState
│   │   ├── data/          # DataTable, StatCard, ChartShell
│   │   └── ui/            # shadcn primitives
│   └── lib/
│       └── data/          # contracts, mock, api, source, hooks
├── docs/                  # scope, time, degradation, demo (fill these)
├── memory-bank/           # cross-session context
├── scripts/
│   ├── guardrails/        # hook scripts (cross-platform)
│   ├── swap-to-{live,mock}.{sh,ps1}
│   └── setup-deploy.{sh,ps1}
├── .claude/agents/        # Claude Code agents
├── .github/
│   ├── agents/            # Copilot agents
│   ├── skills/            # Copilot skills
│   ├── hooks/             # hook configs (memory-bank, guardrails)
│   └── instructions/      # data layer style rules
├── AGENTS.md              # canonical agent instructions
├── CLAUDE.md              # @AGENTS.md import for Claude Code
└── vercel.json            # framework + build, no account IDs
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · shadcn/ui · Recharts · pnpm

---

Suggested next step: open `docs/scope-fence.md` and `docs/time-budget.md`. Everything else keys off those two files.
