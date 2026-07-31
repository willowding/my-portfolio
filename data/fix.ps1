$content = Get-Content 'c:\cursor\willowding-portfolio\data\profile.yaml' -Raw -Encoding UTF8
$content = $content -replace 'team-level SOP; \*\*cut', 'reusable team-level SOP - cutting'
$content = $content -replace 'Contributed to leveled English picture-book writing', 'Contributed to copy writing'
$content = $content -replace 'built out the full cast bible', 'built out the full character bible'
$content = $content -replace 'NotebookLM,', ''
$content = $content -replace ' Claude,', 'Claude Code,'
$content | Set-Content 'c:\cursor\willowding-portfolio\data\profile.yaml' -Encoding UTF8 -NoNewline
Write-Host 'Done'
