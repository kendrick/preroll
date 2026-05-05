#!/bin/bash
# Scope-creep detector. Fires on PreToolUse for every tool call.
# Usage: invoked by .github/hooks/guardrail-hooks.json. Not for direct use.
#
# Advisory only. Never blocks (never exits non-zero). The hook runtime
# treats a non-zero exit as a blocked tool call, which would derail the
# user mid-flow. We only ever inject a systemMessage.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName // empty')

# Narrow to file-creation tools. Read/grep/list calls are noise here and
# would dilute the signal from a genuine new-route creation.
case "$TOOL_NAME" in
  create_file|write_to_file|create|write)
    ;;
  *)
    exit 0
    ;;
esac

FILE_PATH=$(echo "$INPUT" | jq -r '.toolArgs.path // .toolArgs.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0

# Only flag new routes. Components and utils don't represent scope changes
# the way a new page does, so flagging them would just train the user to
# ignore the channel.
case "$FILE_PATH" in
  *app/*/page.tsx|*app/*/page.ts|*pages/*.tsx|*pages/*.ts|*routes/*.tsx)
    ;;
  *)
    exit 0
    ;;
esac

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
SCOPE_FILE="$ROOT/docs/scope-fence.md"

[ ! -f "$SCOPE_FILE" ] && exit 0

# Loose substring match on the route segment. Strict-name matching would
# miss "users" vs "User Management"; we'd rather over-allow than over-flag.
ROUTE_NAME=$(basename "$(dirname "$FILE_PATH")")
if ! grep -qi "$ROUTE_NAME" "$SCOPE_FILE"; then
  echo "{\"systemMessage\":\"Scope check: creating route '$ROUTE_NAME', which doesn't appear in docs/scope-fence.md. Is this in scope?\"}"
fi
