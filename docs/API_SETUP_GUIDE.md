# Big Bang Marketing - API Token 設定指南

## 方法一：使用 API Token（推薦）

### 步驟 1：創建 API Token

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 點擊右上角頭像 → **「我的個人資料」**
3. 選擇 **「API 令牌」** 分頁
4. 點擊 **「建立令牌」**
5. 使用模板：**「編輯區域 DNS」**
6. 設定權限：
   - 區域：DNS - 編輯
   - 包含：特定區域 - `jkdcoding.com`
7. 點擊 **「繼續以顯示摘要」** → **「建立令牌」**
8. 複製 Token（只顯示一次！）

### 步驟 2：設定環境變量

在 PowerShell 中執行：

```powershell
$env:CLOUDFLARE_API_TOKEN = "你的 API Token"
```

### 步驟 3：運行自動設定腳本

```powershell
cd C:\Users\Owner\cloudflare\bigbang\my-app
npx wrangler pages domain add bigbang-marketing bigbang.jkdcoding.com
```

或者使用 curl 直接調用 API：

```powershell
# 1. 查找 Zone ID
$headers = @{
    "Authorization" = "Bearer $env:CLOUDFLARE_API_TOKEN"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?name=jkdcoding.com" -Headers $headers
$zoneId = $response.result[0].id

# 2. 添加 DNS 記錄
$body = @{
    type = "CNAME"
    name = "bigbang"
    content = "bigbang-marketing.pages.dev"
    ttl = 1  # 自動
    proxied = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$zoneId/dns_records" -Headers $headers -Method POST -Body $body
```

---

## 方法二：手動設定（最簡單）

### 步驟 1：設定 Pages 自訂域名

1. 訪問：https://dash.cloudflare.com
2. 進入 **Workers & Pages** → **bigbang-marketing**
3. 點擊 **「自定義域」** 分頁
4. 點擊 **「設置自定義域」**
5. 輸入：`bigbang.jkdcoding.com`
6. 點擊 **「繼續」**

### 步驟 2：添加 DNS 記錄

在 `jkdcoding.com` 的 DNS 設定中：

| 類型 | 名稱 | 目標 | 代理狀態 |
|------|------|------|----------|
| CNAME | `bigbang` | `bigbang-marketing.pages.dev` | 已代理 🟠 |

---

## 驗證設定

```bash
# 檢查 DNS
nslookup bigbang.jkdcoding.com

# 檢查 HTTPS
curl -I https://bigbang.jkdcoding.com
```

---

## 完成後

網站將可通過以下網址訪問：
- **https://bigbang.jkdcoding.com** ✅
