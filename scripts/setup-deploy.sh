#!/bin/bash
# First-time deploy setup for a new engagement.
# Links the project to your Vercel account and deploys.
# Usage: ./scripts/setup-deploy.sh
# With token: VERCEL_TOKEN=xxx ./scripts/setup-deploy.sh

set -e

echo "=== Preroll: Deploy Setup ==="
echo ""

# Check for Vercel CLI
if ! command -v vercel &>/dev/null; then
  echo "Vercel CLI not found. Installing..."
  pnpm add -g vercel
fi

# Check authentication
if [ -n "$VERCEL_TOKEN" ]; then
  echo "Using VERCEL_TOKEN for authentication."
  TOKEN_FLAG="--token $VERCEL_TOKEN"
else
  echo "No VERCEL_TOKEN found. Vercel CLI will use interactive login."
  echo "To use a token instead, run: VERCEL_TOKEN=xxx ./scripts/setup-deploy.sh"
  echo ""
  TOKEN_FLAG=""
fi

# Link project (creates .vercel/project.json locally)
echo "Linking project to your Vercel account..."
vercel link $TOKEN_FLAG

# Set environment variables on Vercel
echo ""
echo "Setting default environment variables..."
# `vercel env add` errors when the var already exists. Swallow that so
# re-running this script doesn't abort midway through setup.
vercel env add NEXT_PUBLIC_DATA_SOURCE production <<< "mock" $TOKEN_FLAG 2>/dev/null || true
vercel env add NEXT_PUBLIC_CLIENT_NAME production <<< "Prototype" $TOKEN_FLAG 2>/dev/null || true

# Deploy
echo ""
echo "Deploying to production..."
vercel --prod $TOKEN_FLAG

echo ""
echo "=== Setup complete ==="
echo "Your staging URL is live. Bookmark it and verify it's accessible from the venue."
echo "To redeploy: vercel --prod"
