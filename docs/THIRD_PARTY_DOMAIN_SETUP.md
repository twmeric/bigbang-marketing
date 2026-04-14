# 第三者 Cloudflare 賬戶域名對接指南

> **架構**: 雙賬戶模式（Worker Proxy）  
> **適用場景**: 域名在第三者 Cloudflare 賬戶，網站託管在您的賬戶  
> **核心問題**: 跨賬戶直接 CNAME 指向 Pages 會觸發 **Error 1014: CNAME Cross-User Banned**

---

## 🏗️ 架構說明

```
┌─────────────────────────────────────────────────────────────────────┐
│                        用戶訪問流程                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   用戶 → bigbangmarketing.hk (賬戶B - 第三者域名)                      │
│                    ↓                                                │
│   CNAME 指向 → bigbang-pages-proxy.賬戶B.workers.dev                  │
│                    ↓                                                │
│   Worker Proxy (賬戶B - 同賬戶，合法)                                 │
│                    ↓                                                │
│   轉發到 → bigbang-marketing.pages.dev (賬戶A - 您的網站)             │
│                    ↓                                                │
│   返回網站內容                                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**為什麼用 Worker Proxy？**  
因為 Cloudflare 的安全機制禁止一個賬戶的域名直接 CNAME 指向另一個賬戶的 `*.pages.dev`。而 CNAME 指向**同賬戶的 Worker** 是完全合法的，Worker 再向您的 Pages 網站取內容即可。

---

## ✅ 前置條件

### 從第三者獲取：
| 項目 | 說明 |
|------|------|
| **Cloudflare 賬戶登入權限** | 部署 Worker 和修改 DNS |
| **或願意執行部署步驟** | 您可以提供現成的部署包 |

> 💡 **好消息**: 這個方案不需要第三者提供 API Token！只需要他們執行一次 Worker 部署和修改 DNS。

---

## 🔧 配置步驟（總覽）

| 步驟 | 動作 | 在哪個賬戶 |
|------|------|-----------|
| 1 | 創建/確認 Pages 項目 | 賬戶A (您) |
| 2 | 部署 Worker Proxy | 賬戶B (第三者) |
| 3 | 修改 DNS (CNAME 指向 Worker) | 賬戶B (第三者) |
| 4 | 上傳網站內容到 Pages | 賬戶A (您) |
| 5 | 測試訪問 | - |

---

## Step 1: 在您的賬戶A中確認 Pages 項目

確保您的 Cloudflare Pages 項目已存在：
- 項目名稱: `bigbang-marketing`
- 默認域名: `bigbang-marketing.pages.dev`

如果還沒有：
```bash
cd my-app
npm run build
npx wrangler pages project create bigbang-marketing
npx wrangler pages deploy dist --project-name=bigbang-marketing
```

---

## Step 2: 在第三者賬戶B中部署 Worker Proxy

### 方法 A：讓第三者自行部署（推薦）

把 `cross-account-proxy/` 文件夾發給第三者，內含：
- `proxy-worker.js` - Worker 代碼
- `wrangler.toml` - 部署配置
- `README.md` - 部署說明

第三者執行：
```bash
cd cross-account-proxy
npm install -g wrangler
npx wrangler login
npx wrangler deploy
```

部署成功後會顯示 Worker 網址，例如：
```
https://bigbang-pages-proxy.thirdparty.workers.dev
```

### 方法 B：您親自部署（如果第三者願意提供登入權限）

在您的電腦上切換到第三者的 wrangler 賬戶：
```bash
npx wrangler logout
npx wrangler login
# 登入時選擇持有 bigbangmarketing.hk 的賬戶
cd cross-account-proxy
npx wrangler deploy
```

---

## Step 3: 在第三者賬戶B中修改 DNS

Worker 部署成功後，在第三者賬戶的 DNS 設置中添加：

### 根域名訪問
```
類型: CNAME
名稱: @
目標: bigbang-pages-proxy.thirdparty.workers.dev
代理狀態: 已代理 (橙色雲朵)
TTL: 自動
```

### www 子域名（可選）
```
類型: CNAME
名稱: www
目標: bigbang-pages-proxy.thirdparty.workers.dev
代理狀態: 已代理 (橙色雲朵)
```

> 請將 `bigbang-pages-proxy.thirdparty.workers.dev` 替換為實際部署後的 Worker 網址。

---

## Step 4: 上傳網站內容

您可以直接從 Pages Dashboard 手動上傳 `dist` 文件夾，或通過 wrangler CLI 部署：

```bash
cd my-app
npm run build
npx wrangler pages deploy dist --project-name=bigbang-marketing
```

---

## Step 5: 驗證

### 檢查 DNS 解析
```bash
nslookup bigbangmarketing.hk
# 應該返回 Cloudflare 的 IP（因為 CNAME 已代理）
```

### 檢查 Pages 直接訪問
```bash
curl https://bigbang-marketing.pages.dev
# 應該返回您的網站 HTML
```

### 檢查自定義域名
```bash
curl https://bigbangmarketing.hk
# 應該與上面相同，且 HTTP 狀態為 200
```

---

## 🔄 關於自動部署

### 為什麼 GitHub Actions 自動部署到 Pages 可能失敗？

因為 `CLOUDFLARE_API_TOKEN` 必須具備 **Cloudflare Pages:Edit** 權限。請檢查：
- GitHub Secrets → `CLOUDFLARE_API_TOKEN`
- 該 Token 的權限必須包含：`Account: Cloudflare Pages: Edit`

如果暫時不想調試 Token 權限，可以手動上傳 dist 文件夾到 Pages Dashboard。

---

## 🐛 常見問題

### Q1: Error 1014 - CNAME Cross-User Banned

**原因**: 直接讓第三者賬戶的域名 CNAME 指向了您賬戶A的 `bigbang-marketing.pages.dev`。

**解決**: 嚴格按照本文的 Worker Proxy 方案執行：
1. 在賬戶B部署 Worker Proxy
2. DNS CNAME 指向該 Worker（同賬戶）
3. Worker 內部轉發到您的 Pages

### Q2: 部署成功但網站顯示舊內容

**原因**: 緩存未清除。

**解決**: 
- 第三者登入 Dashboard → Caching → Purge Everything
- 或在您的 GitHub Actions 中添加緩存清除步驟（需要第三者提供 API Token）

### Q3: SSL 證書錯誤

**原因**: 新 DNS 記錄生效需要時間。

**解決**: 等待 5-15 分鐘。因為 CNAME 指向的是同賬戶的 Worker，SSL 會自動生效。

### Q4: Worker Proxy 有額外費用嗎？

Cloudflare Worker 免費版每天有 **100,000 次請求**的額度，對於一般企業網站足夠使用。如果流量較大，可以升級到付費方案。

---

## 📋 檢查清單

### 您（賬戶A）需要完成：
- [ ] Pages 項目 `bigbang-marketing` 已創建
- [ ] 網站內容已部署到 Pages
- [ ] `bigbang-marketing.pages.dev` 可正常訪問

### 第三者（賬戶B）需要完成：
- [ ] 收到 `cross-account-proxy` 部署包
- [ ] 成功部署 Worker Proxy
- [ ] 在 DNS 中添加 CNAME 指向 Worker
- [ ] 確認代理狀態為「已代理」(橙色雲朵)

### 聯合驗證：
- [ ] `https://bigbang-marketing.pages.dev` 正常
- [ ] `https://bigbangmarketing.hk` 正常
- [ ] 不再出現 Error 1014
