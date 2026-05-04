# Swap data layer from mock to live.
# Usage: .\scripts\swap-to-live.ps1 [-ApiUrl "http://..."]

param([string]$ApiUrl)

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Copy-Item .env.example $envFile
}

$content = Get-Content $envFile -Raw
$content = $content -replace 'NEXT_PUBLIC_DATA_SOURCE=mock', 'NEXT_PUBLIC_DATA_SOURCE=live'

if ($ApiUrl) {
    $content = $content -replace 'NEXT_PUBLIC_API_URL=.*', "NEXT_PUBLIC_API_URL=$ApiUrl"
}

Set-Content $envFile $content

Write-Host "Switched to live data source."
if ($ApiUrl) { Write-Host "API URL: $ApiUrl" }
Write-Host "Restart the dev server or redeploy for changes to take effect."
