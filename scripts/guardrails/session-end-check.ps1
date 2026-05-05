# Session-end demo readiness scan. Fires on Stop event.
# Usage: invoked by .github/hooks/guardrail-hooks.json.
#
# Patterns scanned (TODO, lorem ipsum, "Not yet", placeholder, FIXME) are
# the things that will visibly embarrass the developer on a projector. We
# don't try to be exhaustive; the goal is a last-glance reminder, not a
# QA pass. The full audit lives in the demo-check agent.
#
# Scoped to src/ to avoid false positives from the guardrail docs themselves
# (scope-fence.md and friends carry "Not yet defined" placeholder text by
# design).

$root = git rev-parse --show-toplevel 2>$null
if (-not $root) { $root = "." }
$issues = 0
$messages = ""

$appDir = Join-Path $root "src/app"
if (Test-Path $appDir) {
    $placeholders = (Get-ChildItem $appDir -Recurse -Include *.tsx,*.ts | Select-String -Pattern "TODO|lorem ipsum|Not yet|placeholder|FIXME" -List).Count
    if ($placeholders -gt 0) {
        $messages += " $placeholders files with placeholder text."
        $issues += $placeholders
    }
}

$srcDir = Join-Path $root "src"
if (Test-Path $srcDir) {
    $consoleLogs = (Get-ChildItem $srcDir -Recurse -Include *.tsx,*.ts | Select-String -Pattern "console\.log" -List).Count
    if ($consoleLogs -gt 0) {
        $messages += " $consoleLogs files with console.log."
        $issues += $consoleLogs
    }
}

$uncommitted = (git diff --name-only 2>$null | Measure-Object -Line).Lines
if ($uncommitted -gt 0) {
    $messages += " $uncommitted uncommitted changes."
    $issues += $uncommitted
}

if ($issues -gt 0) {
    Write-Output "{`"systemMessage`":`"Session ending. Quick scan found:${messages} Run @demo-check or /demo-check for a full walkthrough before presenting.`"}"
}
