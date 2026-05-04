#!/bin/bash
# Swap data layer from mock to live.
# Usage: ./scripts/swap-to-live.sh [API_URL]
# If API_URL is provided, updates NEXT_PUBLIC_API_URL too.

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
  cp .env.example "$ENV_FILE"
fi

# BSD sed on macOS requires `-i ''` (empty backup-suffix arg).
# GNU sed on Linux rejects that form. Two branches, not one.
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' 's/NEXT_PUBLIC_DATA_SOURCE=mock/NEXT_PUBLIC_DATA_SOURCE=live/' "$ENV_FILE"
  [ -n "$1" ] && sed -i '' "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$1|" "$ENV_FILE"
else
  sed -i 's/NEXT_PUBLIC_DATA_SOURCE=mock/NEXT_PUBLIC_DATA_SOURCE=live/' "$ENV_FILE"
  [ -n "$1" ] && sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$1|" "$ENV_FILE"
fi

echo "Switched to live data source."
[ -n "$1" ] && echo "API URL: $1"
echo "Restart the dev server or redeploy for changes to take effect."
