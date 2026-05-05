#!/bin/bash
# Time monitor. Fires on PostToolUse.
# Usage: invoked by .github/hooks/guardrail-hooks.json.
#
# Speaks at two thresholds (75% and 90% elapsed) and remembers which it
# already fired. Without the state file it would nudge on every tool call
# past the threshold, which trains the user to mute the channel.
#
# Reads "Deadline" from docs/time-budget.md as a wall-clock time today
# (e.g., "6:00 PM"). Session start is the timestamp of the first commit
# made today, which is a more honest signal than process start time.

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
BUDGET_FILE="$ROOT/docs/time-budget.md"
STATE_FILE="/tmp/preamp-time-monitor-$$"

[ ! -f "$BUDGET_FILE" ] && exit 0

DEADLINE_LINE=$(grep -A1 "## Deadline" "$BUDGET_FILE" | tail -1 | tr -d '_')
[ -z "$DEADLINE_LINE" ] || [[ "$DEADLINE_LINE" == *"Not yet"* ]] && exit 0

if command -v date &>/dev/null; then
  NOW=$(date +%s)
  TODAY=$(date +%Y-%m-%d)
  SESSION_START=$(git log --since="$TODAY" --reverse --format="%at" 2>/dev/null | head -1)
  [ -z "$SESSION_START" ] && exit 0

  # Try 12-hour format first (more common in user-written docs), fall back
  # to 24-hour. macOS ships BSD date and Linux ships GNU date, so we try
  # both invocation styles.
  if echo "$DEADLINE_LINE" | grep -qE '[0-9]{1,2}:[0-9]{2}\s*(PM|AM|pm|am)'; then
    DEADLINE_TS=$(date -d "$TODAY $DEADLINE_LINE" +%s 2>/dev/null || date -j -f "%Y-%m-%d %I:%M %p" "$TODAY $DEADLINE_LINE" +%s 2>/dev/null)
  else
    DEADLINE_TS=$(date -d "$TODAY $DEADLINE_LINE" +%s 2>/dev/null || date -j -f "%Y-%m-%d %H:%M" "$TODAY $DEADLINE_LINE" +%s 2>/dev/null)
  fi
  [ -z "$DEADLINE_TS" ] && exit 0

  TOTAL=$((DEADLINE_TS - SESSION_START))
  [ "$TOTAL" -le 0 ] && exit 0
  ELAPSED=$((NOW - SESSION_START))
  PCT=$((ELAPSED * 100 / TOTAL))
  REMAINING=$(( (DEADLINE_TS - NOW) / 60 ))

  LAST_THRESHOLD=$(cat "$STATE_FILE" 2>/dev/null || echo "0")

  if [ "$PCT" -ge 90 ] && [ "$LAST_THRESHOLD" -lt 90 ]; then
    echo "90" > "$STATE_FILE"
    echo "{\"systemMessage\":\"Time alert: ${REMAINING} minutes remaining (${PCT}% elapsed). Wrap up current work and run demo-check.\"}"
  elif [ "$PCT" -ge 75 ] && [ "$LAST_THRESHOLD" -lt 75 ]; then
    echo "75" > "$STATE_FILE"
    echo "{\"systemMessage\":\"Time check: ${REMAINING} minutes remaining (${PCT}% elapsed). Finish current screen, then assess remaining scope.\"}"
  fi
fi
