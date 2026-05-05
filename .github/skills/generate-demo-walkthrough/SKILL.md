---
name: generate-demo-walkthrough
description: >
  Generate a Playwright dress-rehearsal test from docs/demo-narrative.md.
  Each story beat becomes one test plus a final chained walkthrough.
  Use after the narrative is written and Playwright is installed.
---

# Generate Demo Walkthrough

When invoked:

1. Read `docs/demo-narrative.md`. If empty or still placeholder, stop and ask the developer to fill it in.
2. Verify `@playwright/test` is in `devDependencies`. If missing, ask the developer to install it. Don't install silently.
3. Parse numbered story beats. Translate phrasing to Playwright:
   - "I land on" or "I navigate to" becomes `page.goto`.
   - "I click" becomes `getByRole(...)` or `getByText(...)` click.
   - "audience sees" or "I see" becomes `expect(...).toBeVisible()`.
   - "I point out" is the same as "see".
4. Write `scripts/demo-walkthrough.ts` with one `test()` per beat plus a final `test('full walkthrough', ...)` that runs every beat in one session.
5. Every beat asserts the page body contains no placeholder text (`/TODO|lorem ipsum|Not yet|placeholder|FIXME/i`).
6. If `playwright.config.ts` is missing, create a minimal one (`testDir: './scripts'`, `testMatch: 'demo-walkthrough.ts'`, `baseURL` from env or `http://localhost:3000`, chromium project).
7. If a beat target is ambiguous, ask the developer rather than inventing a selector.
8. Report file paths and the run command (`pnpm exec playwright test`).
