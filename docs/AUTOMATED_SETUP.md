# 完全自動化部署設置指南

## 目標
以後新項目只需運行一個命令，自動完成：
1. ✅ 創建 GitHub 倉庫
2. ✅ 設置所有 Secrets
3. ✅ 推送代碼
4. ✅ 部署 Worker
5. ✅ 一鍵部署功能立即可用

## 方案：使用 GitHub CLI + PowerShell 腳本

### 前置條件
1. 安裝 GitHub CLI: `winget install GitHub.cli`
2. 登錄 GitHub CLI: `gh auth login`

### 自動化腳本

創建 `automated-setup.ps1`:

```powershell
# automated-setup.ps1
param(
    [string]$ProjectName = "bigbang-marketing",
    [string]$RepoOwner = "twmeric",
    [string]$CloudflareAccountId = "",
    [string]$CloudflareApiToken = "",
    [string]$GithubToken = ""
)

# 1. 創建 GitHub 倉庫
Write-Host "Creating GitHub repository..." -ForegroundColor Yellow
$repo = gh repo create "$RepoOwner/$ProjectName" --public --source=. --remote=origin --push

# 2. 設置 Secrets
Write-Host "Setting GitHub Secrets..." -ForegroundColor Yellow

# 從環境變量或參數獲取
$cfAccount = if ($CloudflareAccountId) { $CloudflareAccountId } else { $env:CLOUDFLARE_ACCOUNT_ID }
$cfToken = if ($CloudflareApiToken) { $CloudflareApiToken } else { $env:CLOUDFLARE_API_TOKEN }
$workerUrl = "https://$ProjectName-cms.$RepoOwner.workers.dev"

gh secret set CLOUDFLARE_ACCOUNT_ID --repo="$RepoOwner/$ProjectName" --body="$cfAccount"
gh secret set CLOUDFLARE_API_TOKEN --repo="$RepoOwner/$ProjectName" --body="$cfToken"
gh secret set CMS_API_URL --repo="$RepoOwner/$ProjectName" --body="$workerUrl"

# 3. 推送代碼（如果還沒推送）
Write-Host "Pushing code..." -ForegroundColor Yellow
git push -u origin main

# 4. 部署 Worker
Write-Host "Deploying Worker..." -ForegroundColor Yellow
cd apps/cms-worker
npx wrangler deploy

Write-Host "Setup complete! One-click deployment is now ready." -ForegroundColor Green
```

## 使用方法

### 方法一：環境變量（推薦）

```powershell
# 設置環境變量（只需一次）
[Environment]::SetEnvironmentVariable("CLOUDFLARE_ACCOUNT_ID", "your-account-id", "User")
[Environment]::SetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "your-api-token", "User")
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "your-github-token", "User")

# 運行自動化設置
.\automated-setup.ps1 -ProjectName "bigbang-marketing" -RepoOwner "twmeric"
```

### 方法二：命令行參數

```powershell
.\automated-setup.ps1 `
    -ProjectName "bigbang-marketing" `
    -RepoOwner "twmeric" `
    -CloudflareAccountId "dfbee5c2a5706a81bc04675499c933d4" `
    -CloudflareApiToken "your-cf-token" `
    -GithubToken "your-github-token"
```

## 改進 Worker：支持直接 Pages 部署

如果 GitHub Actions 有問題，可以讓 Worker 直接調用 Cloudflare API 部署 Pages：

```typescript
// 在 Worker 中添加直接部署功能
async function deployDirectly(env: Env): Promise<Response> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/pages/projects/${env.CF_PROJECT_NAME}/deployments`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        branch: 'main',
      }),
    }
  );
  
  return response;
}
```

## 最佳實踐總結

1. **使用 GitHub CLI** - 比 API 調用更簡單
2. **環境變量存儲憑證** - 避免硬編碼
3. **一鍵腳本** - 整合所有步驟
4. **Worker 直接部署** - 不依賴 GitHub Actions

## 當前狀態

您的項目現在已經：
- ✅ GitHub 倉庫創建完成
- ✅ Secrets 設置完成
- ✅ 一鍵部署功能可用

下次更新只需在 Admin 後台點擊「一鍵部署」即可！
