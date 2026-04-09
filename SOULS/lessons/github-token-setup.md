# 教訓：GitHub Token 設置與一鍵部署

## 日期
2026-04-09

## 問題
用戶點擊「一鍵部署」按鈕後出現錯誤：「部署觸發失敗，請檢查配置。」

## 根本原因
1. `GITHUB_REPO` 設置為佔位符 `owner/bigbang-marketing`
2. `GITHUB_TOKEN` secret 未在 Worker 中設置
3. GitHub API 使用舊的 `token` 認證方式（應使用 `Bearer`）

## 修復步驟

### 1. 修復 GitHub Repo 名稱
```toml
# wrangler.toml
[vars]
GITHUB_REPO = "jimsbond/bigbang-marketing"  # 修正為實際倉庫
```

### 2. 設置 GITHUB_TOKEN Secret
```bash
cd my-app/apps/cms-worker
npx wrangler secret put GITHUB_TOKEN
# 然後輸入 GitHub Personal Access Token
```

Token 需要權限：
- `repo` - 訪問代碼庫
- `workflow` - 觸發 workflow

### 3. 修復 GitHub API 認證
```typescript
// 舊的（已棄用）
'Authorization': `token ${githubToken}`

// 新的
'Authorization': `Bearer ${githubToken}`
'X-GitHub-Api-Version': '2022-11-28',
```

## 如何創建 GitHub Token

1. 訪問 https://github.com/settings/tokens
2. 點擊 "Generate new token (classic)"
3. 選擇權限：
   - ✅ repo (Full control of private repositories)
   - ✅ workflow (Update GitHub Action workflows)
4. 生成並複製 token
5. 使用 `wrangler secret put GITHUB_TOKEN` 設置

## 驗證部署

設置完成後，在 Admin 後台點擊「一鍵部署」，應該看到：
- 成功消息：「部署觸發成功」
- 或在 GitHub Actions 頁面看到新的 workflow run

## 錯誤處理改進

修復後的代碼提供更好的錯誤信息：
- 如果 token 未設置 → 「GitHub token not configured...」
- 如果 API 調用失敗 → 返回 GitHub 的錯誤消息和文檔鏈接
- 包含時間戳和倉庫名稱便於調試
