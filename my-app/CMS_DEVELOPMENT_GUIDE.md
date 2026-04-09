# CMS 開發規範指南

## 🎯 核心原則：零硬編碼（Zero Hardcoding）

**所有用戶可見的文本內容必須來自 CMS**，不得硬編碼在組件中。

---

## ✅ 正確做法 vs ❌ 錯誤做法

### ❌ 錯誤：硬編碼文本
```tsx
export default function HeroSection() {
  return (
    <section>
      <h1>Ignite Your Brand</h1>  {/* ❌ 硬編碼 */}
      <p>市場推廣及市場策劃</p>   {/* ❌ 硬編碼 */}
    </section>
  );
}
```

### ✅ 正確：使用 CMS 數據
```tsx
"use client";
import { useCMS } from "@/context/CMSContext";

export default function HeroSection() {
  const { cmsData } = useCMS();
  
  // 提供默認值以防 CMS 數據缺失
  const hero = cmsData?.hero || {
    titleLine1: "",
    titleLine2: "Expand Your Universe",
    subtitle: "市場推廣及市場策劃"
  };
  
  return (
    <section>
      {hero.titleLine1 && <h1>{hero.titleLine1}</h1>}
      {hero.subtitle && <p>{hero.subtitle}</p>}
    </section>
  );
}
```

---

## 📝 新組件開發檢查清單

創建新組件時，必須完成以下檢查：

### 1. 組件結構
- [ ] 添加 `"use client"` 指令（如果使用 useCMS）
- [ ] 導入 `useCMS` hook
- [ ] 定義默認值（Fallback defaults）
- [ ] 條件渲染（當數據為空時不顯示）

### 2. CMS 集成
- [ ] 使用 `const { cmsData } = useCMS()`
- [ ] 從 cmsData 讀取所需數據
- [ ] 提供完整的默認值對象
- [ ] 測試 CMS 數據為空的情況

### 3. 文本處理
- [ ] 所有標題來自 CMS
- [ ] 所有描述來自 CMS
- [ ] 所有按鈕文字來自 CMS
- [ ] 所有圖片 URL 來自 CMS

---

## 🔍 審計腳本使用

運行審計腳本檢查硬編碼：

```bash
npm run audit-cms
```

### 審計規則
腳本會檢測：
- 中文文本（包含常見詞語：市場、營銷、服務、關於等）
- 英文標題（大寫開頭，5-30個字符）
- 未使用 `useCMS` 的組件
- 未導入 `cms.json` 的文件

---

## 📁 CMS 數據結構規範

### 標準 Section 結構
每個 section 應該包含：

```json
{
  "sectionName": {
    "enabled": true,
    "sectionTagline": "小標題",
    "sectionTitle": "主標題",
    "sectionDescription": "描述文字",
    "items": [
      {
        "title": "項目標題",
        "description": "項目描述",
        "image": "/path/to/image.jpg"
      }
    ],
    "ctaText": "按鈕文字",
    "ctaLink": "/contact"
  }
}
```

### 必需字段
| 字段 | 說明 |
|------|------|
| `enabled` | 是否顯示該區塊 |
| `sectionTitle` | 區塊主標題 |
| `sectionTagline` | 區塊小標題（英文） |
| `sectionDescription` | 區塊描述 |

---

## 🧪 測試 CMS 集成

### 1. 本地測試
```bash
# 1. 構建項目
npm run build

# 2. 檢查生成的 HTML
grep -r "硬編碼文本" dist/ || echo "無硬編碼文本"
```

### 2. CMS 數據更新測試
```bash
# 1. 更新本地 cms.json
# 2. 重新構建
npm run build

# 3. 驗證更新已生效
cat dist/index.html | grep -o "新標題"
```

### 3. 空數據測試
```tsx
// 測試組件在 CMS 數據為空時的行為
const testData = { hero: null };
// 應該顯示默認值，不崩潰
```

---

## 🎨 組件模板

### CMS 驅動組件模板

```tsx
"use client";

import { useCMS } from "@/context/CMSContext";

// 默認配置
const DEFAULT_CONFIG = {
  enabled: true,
  sectionTagline: "",
  sectionTitle: "",
  sectionDescription: "",
  items: [],
  ctaText: "了解更多",
  ctaLink: "#contact"
};

export default function SectionName() {
  const { cmsData } = useCMS();
  
  // 合併 CMS 數據與默認值
  const section = {
    ...DEFAULT_CONFIG,
    ...cmsData?.sectionName
  };
  
  // 如果禁用則不渲染
  if (!section.enabled) return null;
  
  return (
    <section id="section-id">
      <div className="container">
        {/* 標題區 */}
        {section.sectionTagline && (
          <p>{section.sectionTagline}</p>
        )}
        {section.sectionTitle && (
          <h2>{section.sectionTitle}</h2>
        )}
        {section.sectionDescription && (
          <p>{section.sectionDescription}</p>
        )}
        
        {/* 內容區 */}
        {section.items?.map((item, index) => (
          <div key={index}>
            {item.title && <h3>{item.title}</h3>}
            {item.description && <p>{item.description}</p>}
          </div>
        ))}
        
        {/* CTA */}
        {section.ctaText && section.ctaLink && (
          <a href={section.ctaLink}>{section.ctaText}</a>
        )}
      </div>
    </section>
  );
}
```

---

## 🚀 部署前檢查清單

在提交代碼前，必須完成：

- [ ] 運行 `npm run audit-cms` 無錯誤
- [ ] 所有新組件使用 `useCMS` hook
- [ ] 所有文本有默認值
- [ ] 更新 `cms.json` 默認數據
- [ ] 更新 Admin 表單（如需要）
- [ ] 測試構建成功
- [ ] 驗證 HTML 輸出

---

## 📚 相關文檔

- `API_SETUP_GUIDE.md` - API 設置指南
- `DOMAIN_SETUP.md` - 域名設置指南
- `SKILL.md` - 完整技能文檔

---

## 💡 最佳實踐

1. **始終提供默認值**：確保 CMS 數據為空時頁面仍能顯示
2. **條件渲染**：使用 `&&` 運算符，避免空文本佔位
3. **分離配置**：將默認配置提取為常量
4. **類型安全**：為 CMS 數據定義 TypeScript 接口
5. **定期審計**：每周運行一次 `npm run audit-cms`
