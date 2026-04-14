# 🚀 快速開始 - 以後新項目只需 3 步

## 第一步：保存環境變量（只需一次）

在 PowerShell 運行：
```powershell
[Environment]::SetEnvironmentVariable("CLOUDFLARE_ACCOUNT_ID", "你的賬戶ID", "User")
[Environment]::SetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "你的API令牌", "User")
```

## 第二步：運行自動化腳本

```powershell
.\automated-setup.ps1 -ProjectName "新項目名稱" -RepoOwner "你的GitHub用戶名"
```

## 第三步：使用一鍵部署

訪問 Admin 後台 → 點擊「一鍵部署」🎉

---

## 當前項目狀態

✅ **已完成設置**

| 組件 | 狀態 | 地址 |
|-----|------|------|
| GitHub 倉庫 | ✅ 已創建 | https://github.com/twmeric/bigbang-marketing |
| Secrets | ✅ 已設置 | 3 個 Secrets |
| Cloudflare Pages | ✅ 運行中 | https://bigbang.jkdcoding.com |
| Cloudflare Worker | ✅ 運行中 | https://bigbang-marketing-cms.jimsbond007.workers.dev |
| 一鍵部署 | ✅ 可用 | Admin 後台 |

---

## 常用命令

### 本地開發
```bash
cd my-app
npm run dev        # 開發模式
npm run build      # 構建
```

### 手動部署
```bash
cd my-app
npx wrangler pages deploy dist --project-name=bigbang-marketing
```

### Worker 部署
```bash
cd my-app/apps/cms-worker
npx wrangler deploy
```

---

## 問題排查

### 一鍵部署失敗
1. 檢查 GitHub Secrets 是否存在：https://github.com/twmeric/bigbang-marketing/settings/secrets/actions
2. 檢查 GitHub Actions 日誌：https://github.com/twmeric/bigbang-marketing/actions

### Worker 問題
```bash
cd my-app/apps/cms-worker
npx wrangler tail    # 查看實時日誌
```
