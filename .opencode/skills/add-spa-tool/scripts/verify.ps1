<#
.SYNOPSIS
  my-spa-tools 專案一致性驗證：回入口按鈕、相對連結、編碼與換行。

.DESCRIPTION
  驗證項目：
    1. 每個工具頁面（根目錄下兩層的 HTML）都含有 id="hf-home-entry"，且 ../../index.html 可解析。
    2. 入口大廳 index.html 不得含有 hf-home-entry。
    3. README.md 與 index.html 中的所有相對連結（./...）都指向存在的檔案。
    4. 所有 HTML 為 UTF-8（無 BOM）且使用 LF 換行。
  全部通過時結束碼為 0，否則為 1。

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .opencode/skills/add-spa-tool/scripts/verify.ps1
#>
[CmdletBinding()]
param(
    [string]$Root = ""
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Get-Location).Path
    try {
        $gitRoot = (& git rev-parse --show-toplevel 2>$null)
        if ($LASTEXITCODE -eq 0 -and $gitRoot) { $Root = $gitRoot.Trim() }
    } catch { }
}
$Root = (Resolve-Path $Root).Path

$script:fail = 0
function Fail([string]$msg) { Write-Host ("FAIL  " + $msg) -ForegroundColor Red; $script:fail++ }
function Ok([string]$msg)   { Write-Host ("ok    " + $msg) }

Write-Host ("Repo root: " + $Root)

$htmlFiles = Get-ChildItem -Path $Root -Recurse -File -Filter *.html |
    Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' }

Write-Host ""
Write-Host "== 1) home button / relative path =="
foreach ($f in $htmlFiles) {
    $rel = $f.FullName.Substring($Root.Length + 1).Replace('\', '/')
    $text = [System.IO.File]::ReadAllText($f.FullName)
    $has = $text -match 'id="hf-home-entry"'
    if ($rel -eq 'index.html') {
        if ($has) { Fail ("entry page must NOT contain hf-home-entry: " + $rel) }
        else { Ok ($rel + " (entry, no button)") }
        continue
    }
    $target = Join-Path (Split-Path $f.FullName -Parent) '..\..\index.html'
    $resolves = Test-Path $target
    if ($has -and $resolves) { Ok $rel }
    elseif (-not $has)       { Fail ('missing id="hf-home-entry": ' + $rel) }
    else                     { Fail ("..\..\index.html does not resolve from: " + $rel) }
}

Write-Host ""
Write-Host "== 2) relative links in README.md and index.html =="
function Test-Links([string]$fileRel, [string]$pattern) {
    $path = Join-Path $Root $fileRel
    if (-not (Test-Path $path)) { Fail ("missing " + $fileRel); return }
    $content = [System.IO.File]::ReadAllText($path)
    foreach ($m in [regex]::Matches($content, $pattern)) {
        $link = $m.Groups[1].Value
        if ($link -match '^#' -or $link -match '^[a-zA-Z]+:') { continue }
        $target = Join-Path $Root ($link -replace '/', '\')
        if (Test-Path $target) { Ok ($fileRel + " -> " + $link) }
        else { Fail ($fileRel + " -> " + $link + " (missing)") }
    }
}
Test-Links 'README.md' '\]\((\./[^)\s]+)\)'
Test-Links 'index.html' 'href="(\./[^"]+)"'

Write-Host ""
Write-Host "== 3) encoding (UTF-8 no BOM) & LF =="
foreach ($f in $htmlFiles) {
    $rel = $f.FullName.Substring($Root.Length + 1).Replace('\', '/')
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
    $crlf = ([regex]::Matches([System.IO.File]::ReadAllText($f.FullName), "`r`n")).Count
    if ($hasBom) { Fail ("BOM present: " + $rel) }
    if ($crlf -gt 0) { Fail ("CRLF present (" + $crlf + "): " + $rel) }
    if (-not $hasBom -and $crlf -eq 0) { Ok $rel }
}

Write-Host ""
if ($script:fail -eq 0) {
    Write-Host "ALL CHECKS PASSED" -ForegroundColor Green
    exit 0
} else {
    Write-Host ("" + $script:fail + " CHECK(S) FAILED") -ForegroundColor Red
    exit 1
}
