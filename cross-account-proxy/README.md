# Cross-Account Pages Proxy

## 這是給第三者的部署包

因為域名 `bigbangmarketing.hk` 在您的 Cloudflare 賬戶（賬戶B），而網站托管在另一個 Cloudflare 賬戶（賬戶A）的 Pages 上，直接 CNAME 指向會觸發 **Error 1014**。

解決方案：在您的賬戶中部署一個輕量級 Worker 作為反向代理。

---

## 部署步驟（只需 3 步）

### Step 1: 安裝 Wrangler
```bash
npm install -g wrangler
```

### Step 2: 登入 Cloudflare
```bash
npx wrangler login
```
這會打開瀏覽器讓您授權。請確保登入的是持有 `bigbangmarketing.hk` 的賬戶。

### Step 3: 部署 Worker
```bash
cd cross-account-proxy
npx wrangler deploy
```

部署成功後，您會看到類似：
```
Deployed bigbang-pages-proxy version 1 to https://bigbang-pages-proxy.YOUR_ACCOUNT.workers.dev
```

---

## DNS 配置

部署完成後，在您的 Cloudflare DNS 設置中：

### 方案 A：代理根域名
```
類型: CNAME
名稱: @
目標: bigbang-pages-proxy.YOUR_ACCOUNT.workers.dev
代理狀態: 已代理 (橙色雲朵)
```

### 方案 B：代理 www 子域名
```
類型: CNAME
名稱: www
目標: bigbang-pages-proxy.YOUR_ACCOUNT.workers.dev
代理狀態: 已代理 (橙色雲朵)
```

> 請將 `YOUR_ACCOUNT` 替換為實際的 Worker 子域名。

---

## 驗證

等待 1-2 分鐘後，訪問：
```
https://bigbangmarketing.hk
```

應該能正常顯示網站內容，不再出現 Error 1014。

---

## 緩存清除

當對方更新網站後，如果需要立即看到新內容，可以：

1. 在 Cloudflare Dashboard → Caching → Configuration → Purge Everything
2. 或運行：
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```
