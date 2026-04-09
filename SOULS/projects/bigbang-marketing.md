# Big Bang Marketing CMS 項目檔案

## 項目概述
- **名稱**：Big Bang Marketing
- **類型**：CMS 驅動的企業官網
- **技術棧**：Next.js 16 + TypeScript + Tailwind CSS + Cloudflare Pages/Workers/KV
- **啟動日期**：2026-04-09

## 架構特點
- E-Corp Pattern：Cloudflare Pages + Worker + KV
- CWMNG 規範：四點同步（Worker 默認值 → Admin 表單 → index.html 備份 → 組件渲染）
- 完全 CMS 驅動：所有內容可通過 Admin 後台編輯

## 已實現功能
1. ✅ 通用服務頁面模板（6個服務頁面共用）
2. ✅ 完整 CMS 數據結構（Hero, Stats, Testimonial, Process, FAQ, RelatedCases, GEO）
3. ✅ 動態 Header（當前頁面高亮 + 子選單動畫）
4. ✅ CMS 驅動的 Footer
5. ✅ Admin 後台完整表單支持

## 關鍵技術決策
- 使用 Unicode 轉義避免編碼問題
- 靜態導出 (output: 'export') 配合 Cloudflare Pages
- ServicePageTemplate 組件化設計

## 項目狀態
🟢 生產環境運行中
- 域名：bigbang.jkdcoding.com
- Pages 項目：bigbang-marketing
- Worker：bigbang-marketing-cms
