# Big Bang Marketing - 自動化設置腳本
# 使用方法: .\automated-setup.ps1 -ProjectName "bigbang-marketing" -RepoOwner "twmeric"

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectName = "bigbang-marketing",
    
    [Parameter(Mandatory=$false)]
    [string]$RepoOwner = "twmeric",
    
    [Parameter(Mandatory=$false)]
    [string]$CloudflareAccountId = $env:CLOUDFLARE_ACCOUNT_ID,
    
    [Parameter(Mandatory=$false)]
    [string]$CloudflareApiToken = $env:CLOUDFLARE_API_TOKEN
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Big Bang Marketing 自動化設置 " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查依賴
Write-Host "檢查依賴..." -ForegroundColor Yellow

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) 未安裝。請運行: winget install GitHub.cli"
    exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git 未安裝。請運行: winget install Git.Git"
    exit 1
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js 未安裝。請運行: winget install OpenJS.NodeJS"
    exit 1
}

# 檢查憑證
if (-not $CloudflareAccountId) {
    Write-Error "未設置 CLOUDFLARE_ACCOUNT_ID。請設置環境變量或使用 -CloudflareAccountId 參數"
    exit 1
}

if (-not $CloudflareApiToken) {
    Write-Error "未設置 CLOUDFLARE_API_TOKEN。請設置環境變量或使用 -CloudflareApiToken 參數"
    exit 1
}

# 檢查 GitHub 登錄狀態
$ghUser = gh api user -q .login 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "請先登錄 GitHub CLI:" -ForegroundColor Yellow
    gh auth login
}

Write-Host "✅ 所有依賴檢查通過" -ForegroundColor Green
Write-Host ""

# 1. 創建 GitHub 倉庫
Write-Host "步驟 1/4: 創建 GitHub 倉庫..." -ForegroundColor Yellow

try {
    $repoExists = gh repo view "$RepoOwner/$ProjectName" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  倉庫已存在，跳過創建" -ForegroundColor Gray
    } else {
        Write-Host "  創建新倉庫 $RepoOwner/$ProjectName..." -ForegroundColor Gray
        gh repo create "$RepoOwner/$ProjectName" --public --source=. --remote=origin --push
        Write-Host "  ✅ 倉庫創建成功" -ForegroundColor Green
    }
} catch {
    Write-Error "創建倉庫失敗: $_"
    exit 1
}

# 2. 設置 GitHub Secrets
Write-Host ""
Write-Host "步驟 2/4: 設置 GitHub Secrets..." -ForegroundColor Yellow

$secrets = @{
    CLOUDFLARE_ACCOUNT_ID = $CloudflareAccountId
    CLOUDFLARE_API_TOKEN = $CloudflareApiToken
    CMS_API_URL = "https://$ProjectName-cms.$RepoOwner.workers.dev"
}

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "  設置 $($secret.Key)..." -ForegroundColor Gray
    $secret.Value | gh secret set $secret.Key --repo="$RepoOwner/$ProjectName"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ $($secret.Key) 設置成功" -ForegroundColor Green
    } else {
        Write-Warning "  ⚠️ $($secret.Key) 設置失敗"
    }
}

# 3. 推送代碼
Write-Host ""
Write-Host "步驟 3/4: 推送代碼到 GitHub..." -ForegroundColor Yellow

try {
    git add -A
    git commit -m "Initial setup from automated script" --quiet
    git push -u origin main --quiet
    Write-Host "  ✅ 代碼推送成功" -ForegroundColor Green
} catch {
    Write-Warning "  ⚠️ 推送可能已是最新，或出現錯誤: $_"
}

# 4. 部署 Worker
Write-Host ""
Write-Host "步驟 4/4: 部署 Cloudflare Worker..." -ForegroundColor Yellow

$workerDir = "my-app/apps/cms-worker"
if (Test-Path $workerDir) {
    Push-Location $workerDir
    try {
        npx wrangler deploy 2>&1 | ForEach-Object {
            if ($_ -match "success|uploaded|deployed") {
                Write-Host "  $_" -ForegroundColor Green
            } else {
                Write-Host "  $_" -ForegroundColor Gray
            }
        }
        Write-Host "  ✅ Worker 部署成功" -ForegroundColor Green
    } catch {
        Write-Warning "  ⚠️ Worker 部署可能已是最新，或出現錯誤: $_"
    } finally {
        Pop-Location
    }
} else {
    Write-Warning "  ⚠️ Worker 目錄不存在: $workerDir"
}

# 完成
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " 設置完成！ " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "項目信息:" -ForegroundColor White
Write-Host "  倉庫: https://github.com/$RepoOwner/$ProjectName" -ForegroundColor Cyan
Write-Host "  網站: https://$ProjectName.pages.dev" -ForegroundColor Cyan
Write-Host "  Worker: https://$ProjectName-cms.$RepoOwner.workers.dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "後續使用:" -ForegroundColor White
Write-Host "  在 Admin 後台點擊「一鍵部署」即可自動部署！" -ForegroundColor Yellow
Write-Host ""
