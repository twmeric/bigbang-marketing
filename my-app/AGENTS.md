# Big Bang Marketing - CMS 開發備忘錄

## 項目架構

### 技術棧
- Next.js 16.2.1 + TypeScript + Tailwind CSS
- GSAP 動畫庫
- Cloudflare Pages 部署

### 目錄結構
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # 後台管理
│   │   ├── content/       # CMS 內容管理頁面
│   │   ├── cases/         # 舊案例管理
│   │   ├── media/         # 媒體庫
│   │   └── settings/      # 設置頁面
│   ├── page.tsx           # 首頁
│   └── layout.tsx         # 根佈局
├── components/            # 組件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CasesSection.tsx
│   ├── ServicesSection.tsx
│   ├── AboutSection.tsx
│   ├── GrowthSection.tsx
│   ├── FAQSection.tsx
│   ├── PartnersSection.tsx
│   └── HeroSection.tsx
├── context/               # React Context
│   └── CMSContext.tsx     # CMS 全局狀態管理
├── data/                  # 靜態數據
│   └── cms.json           # 默認 CMS 數據
└── styles/                # 樣式
```

## CMS 內容管理系統

### 功能概述
CMS 允許管理員編輯網站的所有內容，無需修改代碼。

### 訪問方式
- 後台地址：`https://bigbang.jkdcoding.com/admin`
- 用戶名：`admin`
- 密碼：`admin360`

### 可編輯內容
1. **網站信息** - 名稱、標題、描述、logo、favicon
2. **首頁 Hero** - 標題、副標題、描述、按鈕、背景圖
3. **關於我們** - 介紹文字、特色列表
4. **服務項目** - 添加/編輯/刪除服務卡片
5. **成功案例** - 添加/編輯/刪除案例
6. **頁腳** - 電話、WhatsApp、郵箱、地址、版權

### 數據持久化
- 數據存儲在 `localStorage` 中（key: `bigbang_cms_data`）
- 支持導出 JSON 備份
- 支持導入 JSON 恢復數據

### 部署流程
1. 在 CMS 中編輯內容
2. 點擊「導出」下載 JSON 文件
3. 更新 `src/data/cms.json` 文件
4. 重新構建並部署

## 組件使用 CMS 數據

### 使用方式
```tsx
import { useCMS } from "@/context/CMSContext";

export default function MyComponent() {
  const { cmsData } = useCMS();
  
  return (
    <div>
      <h1>{cmsData.hero.titleLine1}</h1>
      <p>{cmsData.hero.description}</p>
    </div>
  );
}
```

## 開發命令

```bash
# 開發模式
npm run dev

# 生產構建
npm run build

# 本地預覽
npx serve dist

# 部署到 Cloudflare
npx wrangler pages deploy dist
```

## 注意事項

1. 圖片路徑需要是已上傳到 `public/` 的文件
2. CMS 中的更改僅保存在瀏覽器中，部署需更新 cms.json
3. 定期導出備份以防數據丟失
4. 服務子頁面內容需手動編輯對應的 page.tsx 文件
