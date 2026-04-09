# CMS 實施檢查清單

## 📋 項目狀態：Big Bang Marketing

**最後更新：** 2026-04-09

---

## ✅ 已完成

### 基礎架構
- [x] Worker API 設置
- [x] KV 存儲
- [x] GitHub Actions 部署
- [x] Admin 後台
- [x] Hero Section CMS 化

### 已 CMS 化的組件
| 組件 | 狀態 | 說明 |
|------|------|------|
| HeroSection | ✅ | 標題、副標題、按鈕都可編輯 |
| Footer | ⚠️ | 有默認值，可部分編輯 |
| Header | ⚠️ | 導航結構硬編碼，標題可編輯 |
| ServicePageTemplate | ⚠️ | 有默認值，可編輯服務內容 |

---

## ❌ 待 CMS 化（按優先級）

### 🔴 高優先級（主要內容區塊）

#### 1. AboutSection
**當前狀態：** 完全硬編碼
**硬編碼內容：**
- 區塊標題：「最適合您的市場推廣公司」「關於我們」
- 主標題：「Big Bang Marketing 是一間新創的全方位行銷公司」
- 描述段落（2段）
- 4個特色點
- CTA 按鈕：「成為行業第一」

**需要添加的 CMS 結構：**
```json
{
  "about": {
    "enabled": true,
    "sectionTagline": "最適合您的市場推廣公司",
    "sectionTitle": "關於我們",
    "mainHeading": "Big Bang Marketing 是一間新創的全方位行銷公司",
    "description": "雲集來自不同領域的行銷專家...",
    "features": [
      { "icon": "chart-line", "text": "最全面的成長營銷策略" }
    ],
    "ctaText": "成為行業第一",
    "ctaLink": "#contact"
  }
}
```

#### 2. ServicesSection
**當前狀態：** 完全硬編碼
**硬編碼內容：**
- 6個服務卡片（標題、副標題、描述、圖標）
- 區塊標題：「我們的專業服務」「服務項目」
- 描述段落
- CTA：「了解更多」

**需要添加的 CMS 結構：**
```json
{
  "services": {
    "enabled": true,
    "sectionTagline": "我們的專業服務",
    "sectionTitle": "服務項目",
    "sectionDescription": "提供全方位的數碼營銷解決方案...",
    "items": [
      {
        "id": "seo",
        "title": "SEO",
        "subtitle": "搜尋引擎優化",
        "description": "專業的SEO服務...",
        "icon": "search",
        "link": "/seo"
      }
    ],
    "readMoreText": "了解更多"
  }
}
```

#### 3. CasesSection
**當前狀態：** 從 cases.json 讀取案例，但區塊標題硬編碼
**硬編碼內容：**
- 區塊標題：「Our Work」「成功案例」
- 描述段落
- 按鈕文字：「查看詳情」「查看更多案例」

#### 4. FAQSection
**當前狀態：** 完全硬編碼
**硬編碼內容：**
- 7個 QA 對
- 區塊標題
- CTA 區塊

#### 5. GrowthSection
**當前狀態：** 完全硬編碼
**硬編碼內容：**
- 成長營銷介紹
- 4個策略卡片
- CTA

#### 6. ContactForm & Contact Section
**當前狀態：** 完全硬編碼
**硬編碼內容：**
- 表單標籤和佔位符
- 聯繫信息（電話、WhatsApp、郵箱）
- 服務選項

### 🟡 中優先級

#### 7. PartnersSection
**硬編碼內容：**
- 6個合作夥伴圖標和名稱

#### 8. layout.tsx Meta 信息
**硬編碼內容：**
- 頁面描述 meta description

---

## 🧪 測試計劃

### 階段 1：開發測試
- [ ] 更新組件使用 useCMS
- [ ] 添加默認值
- [ ] 運行 `npm run audit-cms` 通過
- [ ] 本地構建測試

### 階段 2：集成測試
- [ ] 更新 cms.json 默認數據
- [ ] 更新 Worker 數據結構
- [ ] 更新 Admin 表單
- [ ] 測試數據保存和讀取

### 階段 3：部署測試
- [ ] GitHub Actions 成功
- [ ] 驗證網站顯示正確
- [ ] 修改 CMS 數據並重新部署
- [ ] 驗證更新生效

---

## 📝 實施步驟

對於每個組件：

1. **分析** - 列出所有硬編碼文本
2. **設計** - 設計 CMS 數據結構
3. **更新組件** - 添加 useCMS，替換硬編碼
4. **更新數據** - 添加默認值到 cms.json
5. **更新 Admin** - 添加表單字段（如需要）
6. **測試** - 運行 audit-cms 和構建
7. **部署** - 提交並驗證

---

## 💡 經驗教訓

### 從這次事件中學到：

1. **不要假設組件已 CMS 化**
   - 每個組件都必須檢查 useCMS 導入
   - 硬編碼和 CMS 化組件可能同時存在

2. **建立審計機制**
   - `npm run audit-cms` 應該是提交前的必須步驟
   - CI/CD 中應該集成此檢查

3. **文檔化所有內容**
   - 這個檢查清單應該持續更新
   - 新組件開發時參考檢查清單

4. **測試真實場景**
   - 不僅測試「有數據」的情況
   - 也要測試「修改數據」的流程
   - 驗證「一鍵部署」是否真正生效

---

## 📊 進度追踪

| Section | 硬編碼文本數 | CMS 化狀態 | 預計工時 |
|---------|-------------|-----------|---------|
| About | 10 | ❌ | 1h |
| Services | 15 | ❌ | 1.5h |
| Cases | 6 | ❌ | 0.5h |
| FAQ | 13 | ❌ | 1h |
| Growth | 12 | ❌ | 1h |
| Partners | 6 | ❌ | 0.5h |
| Contact | 20 | ❌ | 1.5h |
| **總計** | **82** | - | **7h** |

**注意：** 工時估算不包括 Admin 界面更新。
