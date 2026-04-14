# Big Bang Marketing - 自訂域名設定腳本
# 目標：bigbang.jkdcoding.com

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Big Bang Marketing - 自訂域名設定" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "步驟 1: 開啟 Cloudflare Dashboard" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Gray
Write-Host "請訪問: https://dash.cloudflare.com" -ForegroundColor White
Write-Host ""

Write-Host "步驟 2: 導航至 Pages 專案" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Gray
Write-Host "1. 點擊左側選單的 'Workers & Pages'" -ForegroundColor White
Write-Host "2. 點擊 'bigbang-marketing' 專案" -ForegroundColor White
Write-Host "3. 點擊頂部的 '自定義域' (Custom Domains) 分頁" -ForegroundColor White
Write-Host ""

Write-Host "步驟 3: 添加自訂域名" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Gray
Write-Host "1. 點擊 '設置自定義域' 按鈕" -ForegroundColor White
Write-Host "2. 輸入域名: bigbang.jkdcoding.com" -ForegroundColor Green
Write-Host "3. 點擊 '繼續' 並完成驗證" -ForegroundColor White
Write-Host ""

Write-Host "步驟 4: DNS 設定 (在 jkdcoding.com 的 DNS 設定中)" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Gray
Write-Host "添加以下 CNAME 記錄:" -ForegroundColor White
Write-Host ""
Write-Host "  類型:  CNAME" -ForegroundColor Cyan
Write-Host "  名稱:  bigbang" -ForegroundColor Cyan
Write-Host "  目標:  bigbang-marketing.pages.dev" -ForegroundColor Cyan
Write-Host "  TTL:   自動" -ForegroundColor Cyan
Write-Host "  代理:  已代理 (橙色雲朵)" -ForegroundColor Cyan
Write-Host ""

Write-Host "步驟 5: 等待生效" -ForegroundColor Yellow
Write-Host "--------------------------------------" -ForegroundColor Gray
Write-Host "- DNS 傳播通常需要 5-30 分鐘" -ForegroundColor White
Write-Host "- SSL 憑證會自動頒發" -ForegroundColor White
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "完成後，你的網站將可通過:" -ForegroundColor Green
Write-Host "https://bigbang.jkdcoding.com" -ForegroundColor Green -BackgroundColor Black
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "按任意鍵退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
