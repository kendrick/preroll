# Time monitor. Fires on PostToolUse.
# Usage: invoked by .github/hooks/guardrail-hooks.json.
#
# Speaks at two thresholds (75% and 90% elapsed) and remembers which it
# already fired. Without the state file it would nudge on every tool call
# past the threshold, which trains the user to mute the channel.
#
# Reads "Deadline" from docs/time-budget.md as a wall-clock time today.
# Session start is the timestamp of the first commit made today, which is
# a more honest signal than process start time.

$root = git rev-parse --show-toplevel 2>$null
if (-not $root) { $root = "." }
$budgetFile = Join-Path $root "docs/time-budget.md"
$stateFile = Join-Path $env:TEMP "preamp-time-monitor.txt"

if (-not (Test-Path $budgetFile)) { exit 0 }

$content = Get-Content $budgetFile -Raw
$deadlineMatch = [regex]::Match($content, '## Deadline\s*\n(.+)')
if (-not $deadlineMatch.Success) { exit 0 }
$deadlineLine = $deadlineMatch.Groups[1].Value.Trim().Trim('_')
if ($deadlineLine -match 'Not yet') { exit 0 }

$now = Get-Date
$today = $now.ToString("yyyy-MM-dd")

$firstCommit = git log --since="$today" --reverse --format="%aI" 2>$null | Select-Object -First 1
if (-not $firstCommit) { exit 0 }

try {
    $sessionStart = [DateTime]::Parse($firstCommit)
    $deadline = [DateTime]::Parse("$today $deadlineLine")
} catch { exit 0 }

$total = ($deadline - $sessionStart).TotalMinutes
if ($total -le 0) { exit 0 }
$elapsed = ($now - $sessionStart).TotalMinutes
$pct = [math]::Round(($elapsed / $total) * 100)
$remaining = [math]::Round(($deadline - $now).TotalMinutes)

$lastThreshold = 0
if (Test-Path $stateFile) { $lastThreshold = [int](Get-Content $stateFile) }

if ($pct -ge 90 -and $lastThreshold -lt 90) {
    Set-Content $stateFile "90"
    Write-Output "{`"systemMessage`":`"Time alert: $remaining minutes remaining (${pct}% elapsed). Wrap up current work and run demo-check.`"}"
} elseif ($pct -ge 75 -and $lastThreshold -lt 75) {
    Set-Content $stateFile "75"
    Write-Output "{`"systemMessage`":`"Time check: $remaining minutes remaining (${pct}% elapsed). Finish current screen, then assess remaining scope.`"}"
}
