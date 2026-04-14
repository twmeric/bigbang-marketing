# Big Bang Marketing - 自訂域名設定指南

## 目標域名
`bigbang.jkdcoding.com`

---

## 方法一：透過 Cloudflare Dashboard（推薦）

### 步驟 1：進入 Pages 專案設定
1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 進入 **Workers & Pages**
3. 點擊 **bigbang-marketing** 專案
4. 點擊 **自定義域 (Custom Domains)** 分頁

### 步驟 2：添加自訂域名
1. 點擊 **設置自定義域 (Set up a custom domain)**
2. 輸入域名：`bigbang.jkdcoding.com`
3. 點擊 **繼續**
4. Cloudflare 會驗證域名權限

### 步驟 3：DNS 設定
Cloudflare 會自動提供 DNS 記錄，你需要在 `jkdcoding.com` 的 DNS 設定中添加：

```
類型：CNAME
名稱：bigbang
目標：bigbang-marketing.pages.dev
TTL：自動
代理狀態：已代理 (橙色雲朵)
```

---

## 方法二：使用 Wrangler CLI

```bash
# 添加自訂域名
npx wrangler pages project put bigbang-marketing --custom-domain bigbang.jkdcoding.com

# 或者更新專案設定
npx wrangler pages project create bigbang-marketing --custom-domain bigbang.jkdcoding.com
```

---

## DNS 設定詳情

### 如果 jkdcoding.com 使用 Cloudflare DNS：

| 類型 | 名稱 | 目標 | 代理狀態 |
|------|------|------|----------|
| CNAME | bigbang | bigbang-marketing.pages.dev | 已代理 🟠 |

### 如果 jkdcoding.com 使用其他 DNS 提供商：

| 類型 | 主機 | 指向 | TTL |
|------|------|------|-----|
| CNAME | bigbang | bigbang-marketing.pages.dev | 3600 |

---

## 驗證設定

設定完成後，可以用以下指令驗證：

```bash
# 檢查 DNS 解析
nslookup bigbang.jkdcoding.com

# 檢查 HTTPS
curl -I https://bigbang.jkdcoding.com
```

---

## SSL/TLS 設定

Cloudflare Pages 會自動提供 SSL 憑證，確保：
1. **SSL/TLS 模式**：完整 (Full) 或 完整 (嚴格)
2. **Always Use HTTPS**：開啟
3. **Automatic HTTPS Rewrites**：開啟

---

## 常見問題

### Q: 域名驗證失敗？
- 確認你擁有 `jkdcoding.com` 的 DNS 管理權限
- 檢查 CNAME 記錄是否正確添加
- 等待 DNS 傳播（最多 24 小時）

### Q: 想要使用根域名？
如果需要 `jkdcoding.com`（而非子域名）：
```
類型：A
名稱：@
目標：192.0.2.1  (Cloudflare Pages 會處理重定向)
```

---

## 完成後

設定完成後，網站將可透過以下網址訪問：
- 🌐 https://bigbang.jkdcoding.com
- 🔄 https://bigbang-marketing.pages.dev (原始網址，會自動重定向)

---

## 技術支援

如需協助，請聯繫：
- WhatsApp: +852 5116 4453
