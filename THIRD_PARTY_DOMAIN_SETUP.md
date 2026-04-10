# 第三者 Cloudflare 賬戶域名對接指南

> **架構**: 雙賬戶模式（參考 E-Corp 項目）  
> **適用場景**: 域名在第三者 Cloudflare 賬戶，網站託管在您的賬戶

---

## 🏗️ 架構說明

```
┌─────────────────────────────────────────────────────────────────────┐
│                        用戶訪問流程                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   用戶 → bigbangmarketing.hk (賬戶B - 第三者域名)                      │
│                    ↓                                                │
│            CNAME 指向 → bigbang-marketing.pages.dev (賬戶A)           │
│                    ↓                                                │
│            靜態網站托管在 您的 Cloudflare 賬戶A                       │
│                    ↓                                                │
│            API 調用 → Worker (賬戶A - 您的賬戶)                       │
│                    ↓                                                │
│            KV 數據存儲 (賬戶A - 您的賬戶)                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        賬戶分工                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   賬戶A (您的賬戶)              賬戶B (第三者 - 域名所有者)            │
│   ────────────────              ─────────────────────────            │
│   • Cloudflare Pages            • 域名 DNS 管理                       │
│   • Worker + KV                 • 提供 CNAME 記錄                     │
│   • CMS 後台                    • 緩存清除權限                        │
│   • 構建部署                                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✅ 前置條件

### 您需要從第三者獲取：

| 項目 | 說明 | 用途 |
|------|------|------|
| **域名** | 如 `bigbangmarketing.hk` | 用戶訪問入口 |
| **Zone ID** | 域名在 Cloudflare 的 Zone ID | API 調用識別 |
| **API Token** | 僅限 DNS/緩存權限 | 部署後清除緩存 |

### API Token 所需權限：
```
Zone:Read, Zone Settings:Read, Cache Purge:Edit
Zone Resources: Include - 特定域名 (如 bigbangmarketing.hk)
```

---

## 🔧 配置步驟

### Step 1: 在第三者賬戶中添加 DNS 記錄

第三者需要在 Cloudflare DNS 設置中添加：

```
類型: CNAME
名稱: @ (或 www)
目標: bigbang-marketing.pages.dev
代理狀態: 已代理 (橙色雲朵)
TTL: 自動
```

或如果使用子域名：
```
類型: CNAME
名稱: www
目標: bigbang-marketing.pages.dev
代理狀態: 已代理
```

### Step 2: 在您的賬戶中創建 Pages 項目

```bash
# 登入您的 Cloudflare 賬戶
cd my-app

# 創建 Pages 項目（如果還沒有）
npx wrangler pages project create bigbang-marketing

# 部署
npm run build
npx wrangler pages deploy dist --project-name=bigbang-marketing
```

### Step 3: 更新 GitHub Actions 配置

修改 `.github/workflows/deploy.yml`，添加緩存清除步驟：

```yaml
name: Deploy to Cloudflare

on:
  workflow_dispatch:
    inputs:
      reason:
        description: 'Deployment reason'
        default: 'Manual deployment'
  push:
    branches: [main]

env:
  NODE_VERSION: '22'

jobs:
  deploy-web:
    name: Deploy Web to Pages
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: my-app
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_CMS_API_URL: ${{ secrets.CMS_API_URL }}

      # 部署到您的賬戶A
      - name: Deploy to Cloudflare Pages
        run: npx wrangler pages deploy dist --project-name=bigbang-marketing --branch=main
        env:
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

      # 清除第三者賬戶B的緩存
      - name: Purge Cloudflare Cache (第三者賬戶)
        run: |
          curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.DOMAIN_OWNER_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.DOMAIN_OWNER_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
        env:
          DOMAIN_OWNER_ZONE_ID: ${{ secrets.DOMAIN_OWNER_ZONE_ID }}
          DOMAIN_OWNER_API_TOKEN: ${{ secrets.DOMAIN_OWNER_API_TOKEN }}

  deploy-worker:
    name: Deploy Worker
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: my-app/apps/cms-worker
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm install

      - name: Deploy Worker
        uses: cloudflare/wrangler-action@v3
        with:
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: my-app/apps/cms-worker
```

### Step 4: 更新 GitHub Secrets

在 GitHub 倉庫中添加以下 Secrets：

```
Settings → Secrets and variables → Actions → New repository secret
```

| Secret Name | 值 | 說明 |
|-------------|-----|------|
| `CLOUDFLARE_ACCOUNT_ID` | 您的賬戶A ID | 您的 Cloudflare Account ID |
| `CLOUDFLARE_API_TOKEN` | 您的賬戶A Token | 需有 Pages, Workers, KV 權限 |
| `CMS_API_URL` | Worker URL | 如 `https://bigbang-marketing-cms.xxx.workers.dev` |
| `DOMAIN_OWNER_ZONE_ID` | 第三者 Zone ID | 域名在第三者賬戶的 Zone ID |
| `DOMAIN_OWNER_API_TOKEN` | 第三者 Token | 僅需 Zone:Read + Cache Purge 權限 |

### Step 5: 更新 wrangler.toml

確保 `my-app/apps/cms-worker/wrangler.toml` 配置正確：

```toml
name = "bigbang-marketing-cms"
main = "src/index.ts"
account_id = "【您的賬戶A ID】"
compatibility_date = "2024-03-20"

# KV Namespace (在您的賬戶A中)
[[kv_namespaces]]
binding = "CMS_DATA"
id = "【您的 KV ID】"
preview_id = "【您的 KV ID】"

# Environment Variables
[vars]
ENVIRONMENT = "production"
CF_ACCOUNT_ID = "【您的賬戶A ID】"
CF_PROJECT_NAME = "bigbang-marketing"
GITHUB_REPO = "【您的GitHub用戶名】/bigbang-marketing"
ADMIN_WHATSAPP = "85252768052"

# Secrets
# GITHUB_TOKEN - 通過 wrangler secret put 設置
```

---

## 🔐 安全權限配置

### 第三者創建 API Token 的步驟

1. 登入 Cloudflare Dashboard
2. 選擇域名（如 bigbangmarketing.hk）
3. 進入該域名的 Overview 頁面
4. 右下角獲取 **Zone ID**
5. 點擊右上角的頭像 → **My Profile** → **API Tokens** → **Create Token**
6. 使用模板：**Zone:Read, Zone Settings:Read, Cache Purge:Edit**
7. 或自定義權限：
   ```
   Zone:Read
   Zone Settings:Read  
   Cache Purge:Edit
   ```
8. Zone Resources: **Include** → **Specific zone** → 選擇域名
9. 創建後複製 Token 給您

### 權限對比

| 權限 | 您的 Token | 第三者 Token |
|------|-----------|-------------|
| Cloudflare Pages | ✅ 編輯 | ❌ 不需要 |
| Workers Scripts | ✅ 編輯 | ❌ 不需要 |
| KV Storage | ✅ 編輯 | ❌ 不需要 |
| Zone:Read | ❌ 不需要 | ✅ 需要 |
| Cache Purge | ❌ 不需要 | ✅ 需要 |

---

## 🚀 部署流程

```bash
# 1. 推送代碼觸發部署
git add -A
git commit -m "Update content"
git push origin main

# 2. GitHub Actions 自動執行：
#    a. 構建項目
#    b. 部署到您的賬戶A Pages
#    c. 清除第三者賬戶B的緩存

# 3. 用戶訪問 bigbangmarketing.hk → 看到最新內容
```

---

## 🧪 驗證步驟

### 1. 驗證 DNS 解析
```bash
# 檢查 CNAME 是否正確
nslookup bigbangmarketing.hk
# 應該返回: bigbang-marketing.pages.dev 的 CNAME
```

### 2. 驗證 Pages 部署
```bash
# 直接訪問 Pages 域名
curl https://bigbang-marketing.pages.dev
# 應該返回 HTML
```

### 3. 驗證自定義域名
```bash
# 訪問自定義域名
curl https://bigbangmarketing.hk
# 應該與上面相同
```

### 4. 驗證緩存清除
```bash
# 部署後檢查響應頭
curl -I https://bigbangmarketing.hk
# 應該看到 CF-Cache-Status: HIT 或 MISS
```

---

## 🐛 常見問題

### Q1: 域名顯示 "Error 1001" 或 "DNS points to prohibited IP"

**原因**: 第三者賬戶的 DNS 記錄目標不正確

**解決**:
```
確認 CNAME 目標是 xxx.pages.dev（不是直接 IP）
確認 Cloudflare 代理已開啟（橙色雲朵）
```

### Q2: 部署成功但網站顯示舊內容

**原因**: 第三者賬戶的緩存未清除

**解決**:
```bash
# 手動清除緩存
curl -X POST "https://api.cloudflare.com/client/v4/zones/[ZONE_ID]/purge_cache" \
  -H "Authorization: Bearer [DOMAIN_OWNER_API_TOKEN]" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### Q3: SSL 證書錯誤

**原因**: Cloudflare 自動 SSL 需要時間頒發

**解決**: 等待 24 小時，或在 Pages 設置中檢查自定義域名狀態

### Q4: Worker API 訪問失敗

**原因**: Worker 未正確部署或 CORS 配置問題

**解決**:
```bash
# 檢查 Worker 狀態
curl https://bigbang-marketing-cms.xxx.workers.dev/api/cms

# 檢查 CORS 配置是否允許自定義域名
```

---

## 📋 檢查清單

### 第三者需要提供：
- [ ] 域名 DNS 管理權限
- [ ] Zone ID
- [ ] API Token（Zone:Read + Cache Purge）
- [ ] 添加 CNAME 記錄指向您的 Pages

### 您需要配置：
- [ ] 創建 Pages 項目
- [ ] 部署 Worker + KV
- [ ] 更新 GitHub Secrets（5 個）
- [ ] 更新 deploy.yml 添加緩存清除
- [ ] 測試部署流程

---

## 🔄 與單一賬戶模式的區別

| 項目 | 單一賬戶 | 雙賬戶（第三者域名） |
|------|---------|-------------------|
| Secrets 數量 | 3 個 | 5 個 |
| 部署步驟 | Pages 部署 | Pages 部署 + 清除緩存 |
| 域名管理 | 您的賬戶 | 第三者賬戶 |
| SSL 證書 | 自動 | 自動 |
| 緩存控制 | 完全控制 | 需調用第三者 API |

---

## 📞 給第三者的說明模板

```
您好，我們需要將 bigbangmarketing.hk 對接到 Cloudflare Pages 托管服務。

請協助提供以下資訊：
1. 該域名在 Cloudflare 的 Zone ID
2. 創建一個 API Token，權限如下：
   - Zone:Read
   - Zone Settings:Read
   - Cache Purge:Edit
   
   Zone Resources: 僅限 bigbangmarketing.hk

3. 在 DNS 設置中添加記錄：
   類型: CNAME
   名稱: @
   目標: bigbang-marketing.pages.dev
   代理: 已啟用 (橙色雲朵)

這些權限只允許我們在部署後清除緩存，不會影響您的其他設置。
```
