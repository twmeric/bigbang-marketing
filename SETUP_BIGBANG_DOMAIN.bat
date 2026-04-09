@echo off
chcp 65001 >nul
echo ============================================
echo Big Bang Marketing - 自訂域名設定工具
echo ============================================
echo.
echo 目標域名: bigbang.jkdcoding.com
echo.
echo 這個腳本將會:
echo 1. 登入 Cloudflare
echo 2. 設定 Pages 自訂域名
echo 3. 顯示 DNS 設定指引
echo.
echo 請按任意鍵開始...
pause >nul

cd /d "C:\Users\Owner\cloudflare\bigbang\my-app"

echo.
echo [1/3] 登入 Cloudflare...
echo ----------------------------------------
npx wrangler login

echo.
echo [2/3] 設定自訂域名...
echo ----------------------------------------
echo 請在瀏覽器中完成以下步驟:
echo.
echo 1. 訪問 https://dash.cloudflare.com
echo 2. 進入 Workers and Pages ^> bigbang-marketing
echo 3. 點擊 "自定義域" 分頁
echo 4. 點擊 "設置自定義域"
echo 5. 輸入: bigbang.jkdcoding.com
echo.
echo 按任意鍵開啟設定頁面...
pause >nul

start https://dash.cloudflare.com/dfbee5c2a5706a81bc04675499c933d4/workers-and-pages

echo.
echo [3/3] DNS 設定指引
echo ----------------------------------------
echo 請在 jkdcoding.com 的 DNS 設定中添加:
echo.
echo 類型: CNAME
echo 名稱: bigbang
echo 目標: bigbang-marketing.pages.dev
echo 代理: 已代理 (橙色雲朵)
echo.
echo ============================================
echo 完成後，你的網站將可通過:
echo https://bigbang.jkdcoding.com
echo ============================================
echo.
pause
