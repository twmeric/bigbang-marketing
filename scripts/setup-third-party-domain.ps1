# 第三者域名對接配置助手
# 使用方法: 在 PowerShell 中運行 ./scripts/setup-third-party-domain.ps1

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "  第三者域名對接配置助手" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# 步驟 1
Write-Host "步驟 1: 確認您的賬戶A信息" -ForegroundColor Yellow
Write-Host "-----------------------------------"
Write-Host "請確保您已創建："
Write-Host "  ✓ Cloudflare Pages 項目: bigbang-marketing"
Write-Host "  ✓ Worker: bigbang-marketing-cms"
Write-Host "  ✓ KV Namespace: CMS_DATA"
Write-Host ""
Read-Host "按 Enter 繼續..."
Write-Host ""

# 步驟 2
Write-Host "步驟 2: 收集第三者賬戶B信息" -ForegroundColor Yellow
Write-Host "-----------------------------------"
Write-Host "請向域名所有者索取以下信息："
Write-Host ""
Write-Host "1. Zone ID" -ForegroundColor Green
Write-Host "   位置: Cloudflare Dashboard → 域名 → Overview → 右下角"
Write-Host "   格式: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
Write-Host ""
Write-Host "2. API Token" -ForegroundColor Green
Write-Host "   權限: Zone:Read, Zone Settings:Read, Cache Purge:Edit"
Write-Host "   Zone Resources: Include - 特定域名"
Write-Host ""
Write-Host "3. DNS CNAME 記錄" -ForegroundColor Green
Write-Host "   類型: CNAME"
Write-Host "   名稱: @ (或 www)"
Write-Host "   目標: bigbang-marketing.pages.dev"
Write-Host "   代理: 已啟用 (橙色雲朵)"
Write-Host ""
Read-Host "按 Enter 繼續..."
Write-Host ""

# 步驟 3
Write-Host "步驟 3: 更新 GitHub Secrets" -ForegroundColor Yellow
Write-Host "-----------------------------------"
Write-Host "請在 GitHub 倉庫中添加以下 Secrets："
Write-Host ""
Write-Host "路徑: Settings → Secrets and variables → Actions" -ForegroundColor Gray
Write-Host ""
Write-Host "必需 Secrets:"
Write-Host "  1. CLOUDFLARE_ACCOUNT_ID        (您的賬戶A ID)"
Write-Host "  2. CLOUDFLARE_API_TOKEN         (您的賬戶A Token)"
Write-Host "  3. CMS_API_URL                  (Worker URL)"
Write-Host "  4. DOMAIN_OWNER_ZONE_ID         (第三者 Zone ID)"
Write-Host "  5. DOMAIN_OWNER_API_TOKEN       (第三者 Token)"
Write-Host ""
Read-Host "按 Enter 繼續..."
Write-Host ""

# 步驟 4
Write-Host "步驟 4: 替換 workflow 文件" -ForegroundColor Yellow
Write-Host "-----------------------------------"

$sourceFile = ".github/workflows/deploy-with-third-party.yml"
$targetFile = ".github/workflows/deploy.yml"

if (Test-Path $sourceFile) {
    $response = Read-Host "是否將新的 workflow 文件複製到 deploy.yml? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Copy-Item $sourceFile $targetFile -Force
        Write-Host "✅ Workflow 文件已更新" -ForegroundColor Green
    } else {
        Write-Host "⚠️ 請手動複製: cp $sourceFile $targetFile" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ 找不到文件: $sourceFile" -ForegroundColor Red
}
Write-Host ""

# 步驟 5
Write-Host "步驟 5: 驗證配置" -ForegroundColor Yellow
Write-Host "-----------------------------------"
Write-Host "運行以下命令驗證："
Write-Host ""
Write-Host "# 1. 檢查 Secrets 是否設置正確"
Write-Host "gh secret list" -ForegroundColor Gray
Write-Host ""
Write-Host "# 2. 測試部署"
Write-Host "git add -A" -ForegroundColor Gray
Write-Host "git commit -m 'Setup third party domain'" -ForegroundColor Gray
Write-Host "git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "# 3. 檢查 GitHub Actions 運行狀態"
Write-Host "gh run watch" -ForegroundColor Gray
Write-Host ""

Write-Host "===================================" -ForegroundColor Green
Write-Host "  配置完成！" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""
Write-Host "重要 URL:"
Write-Host "  Pages 網站: https://bigbang-marketing.pages.dev"
Write-Host "  自定義域名: https://[您的域名]"
Write-Host "  Admin 面板: https://[Worker URL]/admin"
Write-Host ""
Write-Host "如需幫助，請參考: THIRD_PARTY_DOMAIN_SETUP.md"
Write-Host ""
