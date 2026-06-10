<#
.SYNOPSIS
    分析指定 Java 进程中内存占用最多的类（对象类型）。
.DESCRIPTION
    使用 jmap -histo 获取对象直方图，并展示实例数最多的 TOP N 类。
    同时提供初步的异常对象建议（实例数 > 10,000）。
.PARAMETER PID
    目标 Java 进程的进程 ID（必需）。
.PARAMETER TopN
    显示前 N 个内存大户，默认为 20。
.EXAMPLE
    .\Find-MemoryHog.ps1 -PID 5700
.EXAMPLE
    .\Find-MemoryHog.ps1 -PID 5700 -TopN 10
#>

param(
    [Parameter(Mandatory = $true)]
    [int]$PID,

    [int]$TopN = 20
)

# 检查 jmap 是否可用
if (-not (Get-Command jmap -ErrorAction SilentlyContinue)) {
    Write-Error "未找到 'jmap' 命令。请确保 JDK 已安装且已加入 PATH。"
    exit 1
}

# 检查目标进程是否存在
if (-not (Get-Process -Id $PID -ErrorAction SilentlyContinue)) {
    Write-Error "进程 ID $PID 不存在。"
    exit 1
}

Write-Host "=== 内存占用 TOP $TopN (进程: $PID) ===" -ForegroundColor Cyan
Write-Host ""

# 执行 jmap -histo 并捕获输出
try {
    $histoOutput = & jmap -histo $PID 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "jmap 执行失败：$($histoOutput | Out-String)"
        exit 1
    }
} catch {
    Write-Error "执行 jmap 时发生异常：$($_.Exception.Message)"
    exit 1
}

# 将输出转为字符串数组（按行）
$lines = $histoOutput -split "`r?`n"

# 跳过头部（通常前 7 行是非数据行），提取真实数据行
$dataLines = $lines | Where-Object {
    $_ -match '^\s*\d+:' -and $_ -notmatch '^Total'
}

# 取前 TopN 行
$topClasses = $dataLines | Select-Object -First $TopN

# 输出结果
if ($topClasses) {
    $topClasses | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "未获取到有效的对象直方图数据。"
}

Write-Host ""
Write-Host "--- 分析建议 ---" -ForegroundColor Yellow

# 检查前 10 个类中是否有实例数 > 10,000 的
$suspiciousClasses = @()
$first10 = $dataLines | Select-Object -First 10

foreach ($line in $first10) {
    # 使用正则提取字段（更健壮）
    if ($line -match '^\s*\d+:\s+(\d+)\s+\d+\s+(.+)$') {
        $instanceCount = [int]$matches[1]
        $className = $matches[2].Trim()
        if ($instanceCount -gt 10000) {
            $suspiciousClasses += $className
        }
    }
}

if ($suspiciousClasses.Count -gt 0) {
    Write-Host "以下对象数量较多（>10,000），建议检查:" -ForegroundColor Red
    $suspiciousClasses | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "未发现明显异常的高频对象。"
}