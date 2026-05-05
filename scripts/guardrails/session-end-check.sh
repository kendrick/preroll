#!/bin/bash
# Session-end demo readiness scan. Fires on Stop event.
# Usage: invoked by .github/hooks/guardrail-hooks.json.
#
# Patterns scanned (TODO, lorem ipsum, "Not yet", placeholder, FIXME) are
# the things that will visibly embarrass the developer on a projector. We
# don't try to be exhaustive; the goal is a last-glance reminder, not a
# QA pass. The full audit lives in the demo-check agent.
#
# Scoped to src/ to avoid false positives from these guardrail docs
# (scope-fence.md and friends carry "Not yet defined" placeholder text by
# design).

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
ISSUES=0
MESSAGES=""

PLACEHOLDERS=$(grep -rl "TODO\|lorem ipsum\|Not yet\|placeholder\|FIXME" "$ROOT/src/app" 2>/dev/null | wc -l | tr -d ' ')
if [ "$PLACEHOLDERS" -gt 0 ]; then
  MESSAGES="$MESSAGES $PLACEHOLDERS files with placeholder text."
  ISSUES=$((ISSUES + PLACEHOLDERS))
fi

CONSOLE_LOGS=$(grep -rl "console\.log" "$ROOT/src" 2>/dev/null | wc -l | tr -d ' ')
if [ "$CONSOLE_LOGS" -gt 0 ]; then
  MESSAGES="$MESSAGES $CONSOLE_LOGS files with console.log."
  ISSUES=$((ISSUES + CONSOLE_LOGS))
fi

UNCOMMITTED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNCOMMITTED" -gt 0 ]; then
  MESSAGES="$MESSAGES $UNCOMMITTED uncommitted changes."
  ISSUES=$((ISSUES + UNCOMMITTED))
fi

if [ "$ISSUES" -gt 0 ]; then
  echo "{\"systemMessage\":\"Session ending. Quick scan found:${MESSAGES} Run @demo-check or /demo-check for a full walkthrough before presenting.\"}"
fi
