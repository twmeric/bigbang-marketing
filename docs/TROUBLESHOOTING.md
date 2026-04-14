# 🔧 Big Bang CMS 故障排除指南

## 問題：Admin 頁面無法加載數據

### 症狀
- `bigbangmarketing.hk/admin/inquiries/` 顯示 "This page couldn't load"
- Admin 頁面空白或無法顯示內容
- API 請求失敗

### 根本原因

這個問題通常由以下原因導致：

1. **GitHub Secret 未設置** - `CMS_API_URL` 環境變量未配置
2. **Worker CORS 配置問題** - 自定義域名未被允許
3. **API 連接超時** - 網絡問題或 Worker 故障

---

## ✅ 解決方案

### Step 1: 檢查 GitHub Secrets

確保以下 Secrets 已在 GitHub 倉庫中設置：

```
Settings → Secrets and variables → Actions → Repository secrets
```

**必須設置的 Secrets：**

| Secret Name | Value | 說明 |
|------------|-------|------|
| `CMS_API_URL` | `https://bigbang-marketing-cms.jimsbond007.workers.dev` | Worker API 地址 |
| `CLOUDFLARE_ACCOUNT_ID` | `dfbee5c2a5706a81bc04675499c933d4` | Cloudflare 賬戶 ID |
| `CLOUDFLARE_API_TOKEN` | [你的 API Token] | Cloudflare API Token |

**如何檢查：**

```bash
# 在 GitHub 倉庫頁面
# Settings → Secrets and variables → Actions
```

### Step 2: 驗證 Worker 部署

確保 Worker 已正確部署：

```bash
cd my-app/apps/cms-worker
npx wrangler deploy
```

驗證 Worker 運行正常：

```bash
curl https://bigbang-marketing-cms.jimsbond007.workers.dev/api/cms/data
```

預期輸出：JSON 格式的 CMS 數據

### Step 3: 驗證 CORS 配置

Worker 已更新為支持多域名。確保以下域名在允許列表中：

- `https://bigbang.jkdcoding.com`
- `https://bigbangmarketing.hk`
- `https://www.bigbangmarketing.hk`
- `https://*.bigbang-marketing.pages.dev` (所有 Pages 預覽域名)

### Step 4: 重新構建和部署

1. **觸發新的構建：**
   ```bash
   git add -A
   git commit -m "Fix: Update CORS config and error handling"
   git push origin main
   ```

2. **檢查 GitHub Actions 日誌：**
   - 訪問 `https://github.com/[username]/bigbang-marketing/actions`
   - 確認 "Check Environment Variables" 步驟顯示 ✅
   - 確認構建成功

3. **驗證部署：**
   - 訪問 `https://bigbangmarketing.hk/admin/`
   - 登入後檢查是否能正常加載數據

---

## 🔍 診斷命令

### 1. 測試 Worker API

```bash
# 測試基本連接
curl -v https://bigbang-marketing-cms.jimsbond007.workers.dev/

# 測試 CMS 數據 API
curl -v https://bigbang-marketing-cms.jimsbond007.workers.dev/api/cms/data

# 測試 CORS (從不同域名)
curl -H "Origin: https://bigbangmarketing.hk" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     -v https://bigbang-marketing-cms.jimsbond007.workers.dev/api/cms/data
```

### 2. 檢查 Pages 部署

```bash
# 檢查 _routes.json
curl https://bigbangmarketing.hk/_routes.json

# 檢查 admin 頁面是否存在
curl -I https://bigbangmarketing.hk/admin/inquiries/
```

### 3. 檢查環境變量

在本地測試構建：

```bash
cd my-app
export NEXT_PUBLIC_CMS_API_URL=https://bigbang-marketing-cms.jimsbond007.workers.dev
npm run check-env
npm run build
```

---

## 🚨 常見錯誤及修復

### 錯誤 1: "CMS_API_URL secret is not set!"

**原因：** GitHub Secret 未配置

**修復：**
1. 前往 GitHub 倉庫 Settings
2. Secrets and variables → Actions
3. New repository secret
4. Name: `CMS_API_URL`
5. Value: `https://bigbang-marketing-cms.jimsbond007.workers.dev`

### 錯誤 2: "Failed to load CMS data"

**原因：** API 請求失敗

**修復：**
1. 檢查 Worker 是否正常運行
2. 檢查 CORS 配置
3. 檢查網絡連接

### 錯誤 3: Admin 頁面顯示 "This page couldn't load"

**原因：** Next.js 靜態導出問題

**修復：**
1. 確認 `trailingSlash: true` 在 `next.config.ts` 中
2. 確認 `_routes.json` 存在於 `public/` 目錄
3. 重新構建並部署

---

## 📝 快速檢查清單

- [ ] GitHub Secret `CMS_API_URL` 已設置
- [ ] Worker 已成功部署
- [ ] Cloudflare Pages 部署成功
- [ ] `_routes.json` 存在於 `dist/` 目錄
- [ ] Admin 頁面可以正常訪問
- [ ] API 數據能正確加載

---

## 🆘 緊急恢復

如果問題無法解決，可以重置為默認數據：

```bash
# 重置 CMS 數據
curl -X POST https://bigbang-marketing-cms.jimsbond007.workers.dev/api/cms/reset

# 或使用 Admin 頁面的重置功能
# https://bigbangmarketing.hk/admin/content/
```

---

**需要幫助？**

檢查 GitHub Actions 日誌獲取詳細錯誤信息：
`https://github.com/[username]/bigbang-marketing/actions`
