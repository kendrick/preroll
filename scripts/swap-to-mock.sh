#!/bin/bash
# Swap data layer back to mock.

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
  cp .env.example "$ENV_FILE"
  echo "Already on mock (created .env.local from example)."
  exit 0
fi

# BSD sed on macOS requires `-i ''` (empty backup-suffix arg).
# GNU sed on Linux rejects that form. Two branches, not one.
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' 's/NEXT_PUBLIC_DATA_SOURCE=live/NEXT_PUBLIC_DATA_SOURCE=mock/' "$ENV_FILE"
else
  sed -i 's/NEXT_PUBLIC_DATA_SOURCE=live/NEXT_PUBLIC_DATA_SOURCE=mock/' "$ENV_FILE"
fi

echo "Switched to mock data source."
echo "Restart the dev server or redeploy for changes to take effect."
