# 一鍵部署設置指南

## 問題原因
GitHub 倉庫 `jimsbond/bigbang-marketing` 不存在，導致一鍵部署失敗。

## 解決方案（二選一）

### 方案 A：創建 GitHub 倉庫（推薦）

1. **創建倉庫**
   - 訪問 https://github.com/new
   - 倉庫名稱：`bigbang-marketing`
   - 選擇 Public 或 Private
   - 創建倉庫

2. **推送代碼到 GitHub**
   ```bash
   cd C:\Users\Owner\cloudflare\bigbang
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/jimsbond/bigbang-marketing.git
   git push -u origin main
   ```

3. **設置 GitHub Token**
   - 訪問 https://github.com/settings/tokens
   - 生成 Classic Token
   - 權限：✅ `repo`, ✅ `workflow`
   - 複製 token

4. **更新 Worker Secret**
   ```bash
   cd my-app/apps/cms-worker
   npx wrangler secret put GITHUB_TOKEN
   # 粘貼真實的 GitHub Token
   ```

### 方案 B：使用 Wrangler CLI 直接部署（無需 GitHub）

如果不想使用 GitHub，可以直接用 Wrangler 部署：

```bash
cd my-app
npm run build
npx wrangler pages deploy dist --project-name=bigbang-marketing
```

這樣就不需要一鍵部署功能，改為本地命令行部署。

## 推薦方案

使用 **方案 A**，因為：
- 有版本控制
- 可以使用 GitHub Actions 自動化
- 符合 E-Corp 架構設計

## 當前狀態

Worker 已配置：
- ✅ GITHUB_TOKEN secret 已設置（但為佔位符）
- ✅ GITHUB_REPO 設置為 `jimsbond/bigbang-marketing`
- ❌ GitHub 倉庫不存在

需要完成上述步驟後，一鍵部署才能正常工作。
