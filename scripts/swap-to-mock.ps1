# Swap data layer back to mock.

$envFile = ".env.local"

if (-not (Test-Path $envFile)) {
    Copy-Item .env.example $envFile
    Write-Host "Already on mock (created .env.local from example)."
    exit 0
}

$content = Get-Content $envFile -Raw
$content = $content -replace 'NEXT_PUBLIC_DATA_SOURCE=live', 'NEXT_PUBLIC_DATA_SOURCE=mock'
Set-Content $envFile $content

Write-Host "Switched to mock data source."
Write-Host "Restart the dev server or redeploy for changes to take effect."
