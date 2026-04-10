# Cloudflare 賬戶遷移完整指南

> **項目**: Big Bang Marketing CMS  
> **遷移目標**: 從舊 Cloudflare 賬戶遷移到新賬戶  
> **預估時間**: 30-45 分鐘

---

## 📋 遷移前檢查清單

### 您需要準備的：
- [ ] 新 Cloudflare 賬戶的登入憑證
- [ ] 新賬戶的 Account ID
- [ ] 新賬戶的 API Token（需有 Pages, Workers, KV 權限）
- [ ] 新的自定義域名（如不需要可跳過）
- [ ] GitHub 倉庫的管理員權限

---

## 🚀 Phase 1: 新 Cloudflare 賬戶設置 (10 分鐘)

### Step 1.1: 創建 KV Namespace

```bash
# 登入新 Cloudflare 賬戶後，創建 KV Namespace
# 方式 A: 使用 Wrangler CLI
npx wrangler kv:namespace create "CMS_DATA"

# 方式 B: 在 Cloudflare Dashboard 手動創建
# Dashboard → Workers & Pages → KV → Create a namespace
# 命名為: CMS_DATA
```

**記錄下返回的 KV ID**，稍後需要更新到 wrangler.toml

### Step 1.2: 創建 Pages 項目

```bash
# 方式 A: 使用 Wrangler CLI
npx wrangler pages project create bigbang-marketing

# 方式 B: 在 Dashboard 手動創建
# Dashboard → Workers & Pages → Create application → Pages
# 選擇 "Upload assets" → 項目名稱: bigbang-marketing
```

### Step 1.3: 綁定自定義域名（可選）

如果您要使用自定義域名：

1. 在 Cloudflare Dashboard 添加域名
2. 完成 DNS 設置（按照 Cloudflare 指示修改域名服務商 NS）
3. 在 Pages 項目設置中添加自定義域名

```
Dashboard → Workers & Pages → bigbang-marketing → Settings → Domains
→ Add custom domain → 輸入您的域名
```

---

## 🔧 Phase 2: 更新項目配置文件 (10 分鐘)

### Step 2.1: 更新 wrangler.toml

文件路徑: `my-app/apps/cms-worker/wrangler.toml`

```toml
name = "bigbang-marketing-cms"
main = "src/index.ts"
compatibility_date = "2024-03-20"

# KV Namespace - 更新為新賬戶的 KV ID
[[kv_namespaces]]
binding = "CMS_DATA"
id = "【新 KV ID】"
preview_id = "【新 KV ID】"

# Environment Variables
[vars]
ADMIN_WHATSAPP = "85252768052"
GITHUB_REPO = "【您的 GitHub 用戶名】/bigbang-marketing"
```

### Step 2.2: 更新 GitHub Secrets

在 GitHub 倉庫設置中更新以下 Secrets：

```
Settings → Secrets and variables → Actions → Repository secrets
```

需要更新的 Secrets：

| Secret Name | 值 | 說明 |
|-------------|-----|------|
| `CLOUDFLARE_ACCOUNT_ID` | 新賬戶的 Account ID | Dashboard 右下角 |
| `CLOUDFLARE_API_TOKEN` | 新賬戶的 API Token | 需有 Cloudflare Pages, Workers, KV 編輯權限 |
| `CMS_API_URL` | 新 Worker URL | 如: `https://bigbang-marketing-cms.【新賬戶】.workers.dev` |

### Step 2.3: 創建 API Token

在新 Cloudflare 賬戶中創建 API Token：

```
Dashboard → My Profile → API Tokens → Create Token

使用模板: "Edit Cloudflare Workers"
或自定義權限:
  - Account: Cloudflare Pages:Edit
  - Account: Workers Scripts:Edit  
  - Account: Workers KV Storage:Edit
  - Zone: 如需自定義域名，添加 Zone:Read, DNS:Edit

Account Resources: Include - 您的新賬戶
Zone Resources: Include - 您的域名（如適用）
```

---

## 📦 Phase 3: 部署到新賬戶 (10 分鐘)

### Step 3.1: 本地測試部署

```bash
# 進入項目目錄
cd C:\Users\Owner\cloudflare\bigbang\my-app

# 安裝依賴
npm install

# 構建項目
npm run build

# 部署 Pages（使用新賬戶的憑證）
npx wrangler pages deploy dist --project-name=bigbang-marketing
```

### Step 3.2: 部署 Worker

```bash
# 進入 Worker 目錄
cd apps/cms-worker

# 安裝依賴
npm install

# 部署 Worker
npx wrangler deploy

# 記錄返回的 Worker URL
# 例如: https://bigbang-marketing-cms.xxxxx.workers.dev
```

### Step 3.3: 設置 Worker Secrets

```bash
# 在新賬戶中設置必要的 Secrets
cd apps/cms-worker

# GitHub Token（用於 CMS 備份功能）
npx wrangler secret put GITHUB_TOKEN
# 輸入您的 GitHub Personal Access Token

# 可選: WhatsApp API Key（如需通知功能）
npx wrangler secret put CLOUDWAPI_API_KEY
npx wrangler secret put CLOUDWAPI_SENDER
```

---

## 🔄 Phase 4: 遷移 CMS 數據 (5 分鐘)

### Step 4.1: 從舊賬戶導出數據

```bash
# 使用舊賬戶的憑證導出 KV 數據
# 在舊賬戶環境中執行：
npx wrangler kv:key list --binding=CMS_DATA --namespace-id=【舊KV_ID】 > kv-keys.json

# 或使用 fetch-cms 腳本獲取數據
cd my-app
npm run fetch-cms
# 數據會保存在 src/data/cms.json
```

### Step 4.2: 導入到新賬戶

```bash
# 方式 A: 使用 Admin Dashboard
# 訪問新 Worker URL + /admin
# 例如: https://bigbang-marketing-cms.xxxxx.workers.dev/admin
# 在 Admin 頁面中導入 JSON

# 方式 B: 直接寫入 KV
cd my-app
npx wrangler kv:key put --namespace-id=【新KV_ID】 "cms_data" --path=src/data/cms.json
```

---

## ✅ Phase 5: 驗證遷移 (5 分鐘)

### Step 5.1: 驗證 Worker

```bash
# 測試 API
curl https://bigbang-marketing-cms.【新賬戶】.workers.dev/api/cms

# 應該返回 CMS 數據
```

### Step 5.2: 驗證 Pages

```bash
# 測試網站
curl https://bigbang-marketing.pages.dev

# 檢查內容是否正確
```

### Step 5.3: 驗證 Admin 面板

1. 訪問: `https://bigbang-marketing-cms.【新賬戶】.workers.dev/admin`
2. 確認可以正常登入和編輯內容
3. 測試保存功能

---

## 🔄 Phase 6: 更新 GitHub Actions (可選)

如果您要保留 GitHub Actions 自動部署，確保：

1. GitHub Secrets 已更新為新賬戶的憑證
2. 推送代碼測試自動部署：

```bash
git add -A
git commit -m "Migrate to new Cloudflare account"
git push origin main
```

3. 檢查 GitHub Actions 運行狀態：
   - 訪問: `https://github.com/【用戶名】/bigbang-marketing/actions`
   - 確認部署成功

---

## 📁 需要修改的文件總結

| 文件路徑 | 修改內容 |
|---------|---------|
| `my-app/apps/cms-worker/wrangler.toml` | 更新 KV ID |
| `.github/workflows/deploy.yml` | 確認 project-name 正確 |
| GitHub Secrets | 更新 ACCOUNT_ID, API_TOKEN, CMS_API_URL |

---

## 🐛 常見問題處理

### 問題 1: KV Namespace 找不到

```bash
# 確認 KV ID 正確
npx wrangler kv:namespace list

# 確認 wrangler.toml 中的 id 與列表匹配
```

### 問題 2: Worker 部署失敗

```bash
# 檢查錯誤信息
npx wrangler deploy --verbose

# 常見原因: 
# - Account ID 不正確
# - API Token 權限不足
# - Worker 名稱已被其他賬戶使用
```

### 問題 3: Pages 部署成功但顯示舊內容

```bash
# 清理緩存並重新部署
rm -rf .next dist
npm run build
npx wrangler pages deploy dist --project-name=bigbang-marketing
```

### 問題 4: Admin 面板無法訪問

```bash
# 確認 Worker URL 正確
# 確認已設置 GITHUB_TOKEN secret
npx wrangler secret list
```

---

## 📊 遷移後檢查清單

- [ ] KV Namespace 創建成功並記錄 ID
- [ ] Pages 項目創建成功
- [ ] Worker 部署成功並有 URL
- [ ] GitHub Secrets 更新完成
- [ ] CMS 數據已遷移
- [ ] 網站可正常訪問
- [ ] Admin 面板可正常登入
- [ ] GitHub Actions 自動部署成功

---

## 🔗 重要 URL 記錄

遷移完成後，記錄以下 URL：

```
Pages 網站:     https://bigbang-marketing.pages.dev
Worker API:     https://bigbang-marketing-cms.xxxxx.workers.dev
Admin 面板:     https://bigbang-marketing-cms.xxxxx.workers.dev/admin
自定義域名:     https://【您的域名】
```

---

**預估總時間**: 30-45 分鐘  
**風險等級**: 低（原賬戶不受影響，可隨時回滾）
