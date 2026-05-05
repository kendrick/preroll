# Scope-creep detector. Fires on PreToolUse.
# Usage: invoked by .github/hooks/guardrail-hooks.json. Not for direct use.
#
# Advisory only. Never blocks (always exits 0). The hook runtime treats
# a non-zero exit as a blocked tool call, which would derail the user
# mid-flow. We only ever inject a systemMessage.

$rawInput = $Input | Out-String | ConvertFrom-Json
$toolName = $rawInput.toolName

# Narrow to file-creation tools. Read/grep/list calls are noise here.
if ($toolName -notin @('create_file', 'write_to_file', 'create', 'write')) { exit 0 }

$filePath = if ($rawInput.toolArgs.path) { $rawInput.toolArgs.path } elseif ($rawInput.toolArgs.file_path) { $rawInput.toolArgs.file_path } else { exit 0 }

# Only flag new routes. Components and utils don't represent scope changes
# the way a new page does.
if ($filePath -notmatch '(app[\\/].+[\\/]page\.tsx?|pages[\\/].+\.tsx?|routes[\\/].+\.tsx?)$') { exit 0 }

$root = git rev-parse --show-toplevel 2>$null
if (-not $root) { $root = "." }
$scopeFile = Join-Path $root "docs/scope-fence.md"

if (-not (Test-Path $scopeFile)) { exit 0 }

$routeName = Split-Path (Split-Path $filePath) -Leaf
$scopeContent = Get-Content $scopeFile -Raw

# Loose substring match. Strict-name matching would miss "users" vs
# "User Management"; we'd rather over-allow than over-flag.
if ($scopeContent -notmatch [regex]::Escape($routeName)) {
    Write-Output "{`"systemMessage`":`"Scope check: creating route '$routeName', which doesn't appear in docs/scope-fence.md. Is this in scope?`"}"
}
