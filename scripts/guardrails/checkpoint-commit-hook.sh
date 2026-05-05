#!/bin/bash
# Checkpoint commit nudge. Fires on PostToolUse.
# Usage: invoked by .github/hooks/guardrail-hooks.json.
#
# Threshold of 8 is empirical: under that, commits feel disruptive during
# active build flow. Above it, the working tree gets large enough that a
# bisect or revert becomes painful and the demo narrative gets fuzzy.
# Never auto-commits. The user picks the commit message and timing.

CHANGED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
TOTAL=$((CHANGED + STAGED))

if [ "$TOTAL" -ge 8 ]; then
  echo "{\"systemMessage\":\"Checkpoint: $TOTAL uncommitted changes. Consider committing with a narrative message describing what's now demo-able.\"}"
fi
