# First-time deploy setup for a new engagement.
# Links the project to your Vercel account and deploys.
# Usage: .\scripts\setup-deploy.ps1
# With token: $env:VERCEL_TOKEN="xxx"; .\scripts\setup-deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Preamp: Deploy Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check for Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found. Installing..."
    pnpm add -g vercel
}

# Check authentication
$tokenFlag = @()
if ($env:VERCEL_TOKEN) {
    Write-Host "Using VERCEL_TOKEN for authentication."
    $tokenFlag = @("--token", $env:VERCEL_TOKEN)
} else {
    Write-Host "No VERCEL_TOKEN found. Vercel CLI will use interactive login."
    Write-Host "To use a token instead, run: `$env:VERCEL_TOKEN='xxx'; .\scripts\setup-deploy.ps1"
    Write-Host ""
}

# Link project
Write-Host "Linking project to your Vercel account..."
vercel link @tokenFlag

# Set environment variables
Write-Host ""
Write-Host "Setting default environment variables..."
# `vercel env add` errors when the var already exists. Redirect stderr so
# re-running this script doesn't surface misleading "already exists" noise.
"mock" | vercel env add NEXT_PUBLIC_DATA_SOURCE production @tokenFlag 2>$null
"Prototype" | vercel env add NEXT_PUBLIC_CLIENT_NAME production @tokenFlag 2>$null

# Deploy
Write-Host ""
Write-Host "Deploying to production..."
vercel --prod @tokenFlag

Write-Host ""
Write-Host "=== Setup complete ===" -ForegroundColor Green
Write-Host "Your staging URL is live. Bookmark it and verify it's accessible from the venue."
Write-Host "To redeploy: vercel --prod"
