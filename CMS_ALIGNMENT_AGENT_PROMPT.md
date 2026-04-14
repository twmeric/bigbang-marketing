# 智能體 SOP：網站 CMS 化零返工對齊與部署

> **適用場景**：將既有靜態/半靜態網站完整遷移至 Cloudflare Worker + KV CMS，建立可編輯 Admin 後台，並確保「用戶不是測試員」。
> 
> **案例基礎**：本 SOP 源於真實血淚教訓 —— Big Bang Marketing 官網（12+ 區塊、6 個服務子頁面）的 CMS 化過程中，因欄位名稱不對齊、Worker 保存覆蓋、Admin UI 重疊維護等問題導致多次返工。以下內容是為了**讓你不必再踩同樣的坑**。

---

## 1. 角色定義與鐵律

你是一位**全端 CMS 化架構師**。目標是：在不改變視覺與交互的前提下，將網站變成資料驅動的可編輯系統。

### 三條不可違反的鐵律

1. **「用戶不是測試員」**
   - 任何上線程式碼必須通過 `npm run build` 零 TypeScript 錯誤。
   - 構建失敗時，**禁止直接部署**，必須先修復根因。

2. **「CWMNG 五點同步」**
   - **C**omponent：前端組件實際消費的欄位與型別
   - **W**orker Defaults：後端 Worker/API 的預設資料與回退邏輯
   - **M**anagement UI：Admin 後台表單的欄位名稱與資料路徑
   - **N**ative Backup：本地 `src/data/cms.json`（靜態構建時的離線備份）
   - **G**round Truth：KV / Database 中的生產資料（唯一事實來源）
   
   **任何資料結構變更，必須同時更新以上五點，缺一不可。**

3. **「Deep Merge 永不覆蓋」**
   - Worker 的 `saveCMSData` 必須先讀取現有 KV 資料，再進行**深層合併（Deep Merge）**，最後寫回。
   - **禁止**直接 `{ ...newData }` 覆蓋寫入 KV，否則用戶保存一個 Section 就會丟失其他所有 Section。

---

## 2. 核心方法論：逆向映射（Reverse Mapping）

不要從「後台該有什麼欄位」開始設計，要從**「前端正在顯示什麼硬編碼文字」**開始。

### Step 1：組件考古（Component Archaeology）

逐個打開以下組件，建立「資料映射表」：

| 區塊 | 組件檔案 | 需提取的內容 |
|------|---------|-------------|
| Header | `Header.tsx` | Logo、導航項目（含子選單）、CTA 按鈕文字/連結 |
| Hero | `HeroSection.tsx` | 背景圖、titleLine1/2、subtitle、description、按鈕 |
| About | `AboutSection.tsx` | sectionTagline、sectionTitle、mainHeading、features 列表、CTA |
| Services | `ServicesSection.tsx` | sectionTagline、sectionTitle、sectionDescription、items（icon/title/subtitle/description/link） |
| Cases | `CasesSection.tsx` | sectionTagline、sectionTitle、clientLabel、viewDetailsText、items |
| Growth | `GrowthSection.tsx` | introParagraph1/2、strategiesTitle、strategies[] |
| FAQ | `FAQSection.tsx` | sectionTagline、sectionTitle、items（question/answer）、底部 CTA |
| Partners | `PartnersSection.tsx` | sectionTagline、sectionTitle、items（name/icon） |
| Contact | `ContactSection.tsx` | 電話/WhatsApp/Email/地址標籤與內容、表單各欄位 label/placeholder |
| Footer | `Footer.tsx` | companyName、description、services/company/links 列表、social、copyright |
| Service Pages | `ServicePageTemplate.tsx` | 每個子頁面的 hero/stats/testimonial/features/process/cta/faq |

**記錄原則**：
- 組件用了什麼變數名，CMS 資料就必須用什麼名稱。
- 如果組件遍歷 `items`，CMS 就要有 `items` 陣列。
- 如果組件檢查 `enabled !== false`，資料就要有 `enabled: boolean`。

### Step 2：型別對齊（Type Alignment）

在 `types/cms.ts` 為每個 Section 定義 Interface。型別是契約，後端、Admin、前端都必須遵守。

```typescript
export interface HeroSectionData {
  enabled: boolean;
  backgroundImage: string;
  titleLine1: string;
  titleLine2: string;
  titleLine2Color: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface NavItem {
  name: string;        // 注意：不是 label
  href: string;
  children?: NavItem[];
}
```

### Step 3：後端預設資料對齊（Worker Defaults）

將所有現有硬編碼內容，完整寫入 `cms-worker/src/data/default.ts`。

**關鍵動作**：
- `default.ts` 的欄位名稱與 `types/cms.ts` 100% 一致。
- 包含所有原始文字和圖片路徑，確保遷移後外觀不變。
- 子頁面（如 Service Pages）每個都是完整嵌套物件（hero、features、process、faq、cta）。

### Step 4：Admin 表單對齊（Management UI）

這是**返工率最高**的環節。Admin 中每個 `onChange` 更新的欄位名稱，必須精確對應 `default.ts`。

**致命錯誤對照表**（都是真實踩過的坑）：

| 錯誤示範 | 正確對應 | 後果 |
|---------|---------|------|
| `tag` | `sectionTagline` | 用戶改標籤無效 |
| `title` | `sectionTitle` | 標題不更新 |
| `heading` | `mainHeading` | About 主標題不變 |
| `label` (nav item) | `name` | **導航子選單顯示空白** |
| `buttonText` (about CTA) | `ctaText` | CTA 按鈕文字不變 |
| `href` (service item) | `link` | 服務卡片連結失效 |
| `cta.label` | `ctaButton.text` | Header CTA 不更新 |
| `item.subtitle` | `item.subtitle` | 檢查是否有寫錯成 `description` 等 |

**Admin UI 去重原則**：
- 如果某個資料已經有專屬管理頁面（如 `/admin/cases`），則在 `/admin/content` 中**只保留區域元數據編輯**，移除 item 列表的增刪改，改為「前往專屬管理頁」的快捷連結。
- **禁止**同一個資料陣列在兩個 Admin 頁面都可編輯，否則會互相覆蓋。

---

## 3. 防返工技術法則

### 法則 1：Deep Merge 永不覆蓋

Worker 的 `saveCMSData` 必須這樣寫：

```typescript
async function saveCMSData(request, env, corsHeaders) {
  const data = await request.json();
  
  // 1. 讀取現有資料
  let existing = {};
  try {
    existing = (await env.CMS_DATA.get('cms_data', 'json')) || {};
  } catch (e) {}
  
  // 2. 深層合併
  const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };
  
  const merged = deepMerge(JSON.parse(JSON.stringify(existing)), data);
  merged.lastUpdated = new Date().toISOString();
  
  // 3. 寫回 KV
  await env.CMS_DATA.put('cms_data', JSON.stringify(merged));
  return jsonResponse({ success: true });
}
```

**絕對禁止**：
```typescript
// ❌ 這會讓用戶保存一個 section 就清空全部內容
await env.CMS_DATA.put('cms_data', JSON.stringify({ ...data, lastUpdated }));
```

### 法則 2：Hydration 零閃屏

在 Next.js Static Export 模式下，HTML 是構建時生成的。如果本地 `cms.json` 與 KV 不同步，用戶會先看到舊內容（HTML），再閃一下看到新內容（React Hydration）。

**解決方案**：
1. `scripts/fetch-cms.js` 必須在 `npm run build` 之前執行，從 Worker 拉取最新 `cms_data` 覆蓋 `src/data/cms.json`。
2. 構建日誌必須檢查拉取的關鍵欄位是否正確：
   ```
   Hero title: Ignite Your Brand   ← 確認無誤
   Last updated: 2026-04-14T02:29:40.368Z
   ```
3. 如果 `fetch-cms.js` 失敗，**構建必須中斷**（至少發出警告），不能繼續用舊 `cms.json`。

### 法則 3：Fallback 安全模式

組件中的預設值寫法必須安全。以下寫法會導致 `enabled: undefined` 被當成 `false`，整個區塊消失：

```typescript
// ❌ 危險：如果 cmsData.cases = {}，cases.enabled = undefined，區塊被隱藏
const cases = cmsData?.cases || { enabled: true, ...defaults };
if (!cases.enabled) return null;
```

**正確寫法**：
```typescript
const defaultCases = { enabled: true, sectionTagline: "Our Work", items: [] };
const cases = { ...defaultCases, ...(cmsData?.cases || {}) };
if (!cases.enabled) return null;
```

### 法則 4：媒體路徑三統一

1. **統一位置**：所有圖片、圖標、字型統一放進 `public/`（或 `public/images/`）。
2. **統一路徑格式**：CMS 資料中只存 `/` 開頭的路徑，如 `/images/hero-bg.jpg`。禁止相對路徑 `images/hero-bg.jpg` 或絕對 URL。
3. **統一清理**：刪除 `src/` 下殘留的舊圖片、舊備份資料夾，避免構建時打包冗餘檔案。

---

## 4. 執行檢查清單（Pre-Deployment Checklist）

**構建前必查**：

- [ ] `npm run build` 零 TypeScript 錯誤通過。
- [ ] `src/data/cms.json` 已從 Worker 最新拉取，且包含所有 Section。
- [ ] `types/cms.ts` 定義了所有 Section 和子頁面的 Interface。
- [ ] `cms-worker/src/data/default.ts` 包含完整預設資料，欄位名與型別一致。
- [ ] Worker `saveCMSData` 使用 Deep Merge，不是直接覆蓋。
- [ ] Admin `onChange` 的欄位名稱與 `default.ts` 100% 對齊（特別注意 `label` vs `name`）。
- [ ] Admin 表單**無遺漏也無多餘欄位**：對照 `types/cms.ts` 逐條確認每個字段都有輸入框。
- [ ] 組件使用安全的 Fallback 寫法（`{ ...defaults, ...cmsData.section }`）。
- [ ] Admin UI 無重複編輯入口（如案例只在 `/admin/cases` 管理）。
- [ ] 所有圖片在 `public/` 中，CMS 路徑以 `/` 開頭。
- [ ] 導航子選單、Footer 連結等巢狀陣列已在 Admin 中正確映射。

**部署後必查**：

- [ ] KV `cms_data` 包含完整結構（確認 `Object.keys(data).length >= 10`）。
- [ ] Admin 修改一個欄位 → 保存 → 刷新 → 資料持久化且其他 Section 未被清空。
- [ ] 生產網站無閃屏現象（HTML 初始內容與 React 水合後內容一致）。
- [ ] 導航下拉選單、服務子頁面、成功案例等所有區塊正常顯示。
- [ ] 一鍵部署按鈕能正常觸發（兼容 GitHub Actions 無 `inputs` 的情況）。

---

## 5. 反模式警告（Anti-Patterns）

**這些錯誤都真實發生過，請務必避免**：

1. ❌ **Worker 直接覆蓋寫入 KV**
   - 後果：保存一個 section，其他 11 個 section 全部空白。
   - ✅ 修正：使用 Deep Merge。

2. ❌ **Admin 欄位名與組件不一致**
   - 典型案例：導航子選單用 `label`，組件讀 `name`，導致下拉選單顯示空白。
   - ✅ 修正：組件用什麼名稱，Admin 就寫什麼名稱。

3. ❌ **同一資料在兩個 Admin 頁面可編輯**
   - 典型案例：案例 items 同時在 `/admin/content` 和 `/admin/cases` 可修改。
   - ✅ 修正：保留專屬管理頁面，通用內容頁只改元數據。

4. ❌ `cms.json` 未在構建前更新
   - 後果：靜態 HTML 包含舊內容，用戶看到閃屏。
   - ✅ 修正：`npm run build` 必須先執行 `fetch-cms`。

5. ❌ **Fallback 寫法不安全**
   - 典型案例：`cmsData?.cases || defaults` 無法處理 `{}`。
   - ✅ 修正：`{ ...defaults, ...(cmsData?.cases || {}) }`。

6. ❌ **部署觸發硬依賴 GitHub Actions `inputs`**
   - 後果：`Unexpected inputs provided: ["reason"]` 導致部署失敗。
   - ✅ 修正：Worker 中先嘗試帶 inputs，若報錯則自動重試不帶 inputs。

7. ❌ **只改 Admin 或只改 Worker**
   - 後果：CWMNG 不同步，某個環節出錯時難以定位。
   - ✅ 修正：任何結構變更同時改 Component、Worker、Admin、TypeScript、KV。

8. ❌ **Admin 表單遺漏欄位**
   - 後果：用戶在 Admin 中看不到某些內容的編輯入口，誤以為 CMS 不完整。
   - 典型案例：
     - `growth` 缺少 `introParagraph1`、`introParagraph2`、`strategiesTitle`、`strategiesDescription`、`ctaText`、`ctaLink`。
     - `contact.form` 缺少 `emailLabel`、`serviceOptions`、`messagePlaceholder`、`submittingText`、`successMessage`、`errorDetail`、`footnote` 等。
     - `footer` 缺少 `companyName`、`companyDescription`。
   - ✅ 修正：建立 Admin 表單時，必須對照 `types/cms.ts` 的 **每一個字段**，逐條檢查是否有對應的輸入框。禁止憑記憶寫表單。

9. ❌ **Admin 表單存在錯誤欄位**
   - 後果：組件不消費該欄位，用戶編輯後無效。
   - 典型案例：`growth` 的 Admin 表單錯誤地放了一個 `sectionDescription`，但 `GrowthSectionData` 根本沒有這個欄位。
   - ✅ 修正：Admin 中只應出現組件和型別中**確實存在**的欄位，多一個、少一個都不行。

10. ❌ **本地修改未推送到 GitHub `main` 分支**
    - 後果：GitHub Actions 使用的是舊程式碼，導致構建錯誤與本地不一致；或 Workflow 只部署 Pages 不部署 Worker，導致前端與後端版本錯位。
    - ✅ 修正：每次修復後必須 `git commit` 並 `git push origin main`。Workflow 必須同時包含 `deploy-web`（Pages）和 `deploy-worker`（Worker）兩個 job。

---

## 6. 啟動指令（Step-by-Step Action Plan）

收到「將網站 CMS 化」任務時，嚴格按以下順序執行：

### Phase 1：偵查（15 分鐘）
1. 列出 `src/components/`、 `src/app/`、`public/`、`src/data/` 的內容。
2. 識別所有渲染區塊的組件（Hero、About、Services、Cases、Growth、FAQ、Partners、Contact、Footer、Header）。
3. 識別所有子頁面（服務頁、案例詳情等）。
4. **建立資料映射表**：每個組件 → 實際使用的變數路徑 → 對應的 CMS Interface。

### Phase 2：型別與預設資料（30 分鐘）
5. 撰寫/更新 `types/cms.ts`。
6. 根據映射表，完整重寫 `cms-worker/src/data/default.ts`。
7. 將舊 `cases.json`、舊靜態資料中的真實內容，**全部遷移**進 `default.ts` 對應位置。

### Phase 3：Admin 與組件對齊（45 分鐘）
8. 更新 Admin 表單，確保每個 `onChange` 路徑與 `default.ts` 一致。
9. 移除重複的 Admin 編輯入口。
10. 更新所有 Section 組件，使用安全的 Fallback 寫法消費 CMS 資料。
11. 特別檢查導航子選單、Footer 連結、Service Pages 的巢狀陣列欄位名稱。

### Phase 4：構建與修復（30 分鐘）
12. 運行 `npm run build`。
13. 如果 TypeScript 報錯，根據錯誤訊息修復型別或資料結構。
14. 檢查 `src/data/cms.json` 是否完整、是否與 KV 同步。
15. 重複 12-14 直到構建零錯誤。

### Phase 5：部署與驗證（20 分鐘）
16. 將完整 `default.ts` 資料寫入 KV `cms_data`。
17. **本地手動部署驗證**（在 GitHub Actions 修復前使用）：
    - 部署 Worker：`cd apps/cms-worker && npx wrangler deploy`
    - 部署 Pages：`cd my-app && npm run build && npx wrangler pages deploy dist --project-name=xxx`
18. **推送至 GitHub**：`git add -A && git commit -m "fix: ..." && git push origin main`
19. 檢查 GitHub Actions：確認 `.github/workflows/deploy.yml` 最新 run 為 **綠色 passed**，且同時執行了 `deploy-web` 與 `deploy-worker`。
20. 登入 Admin，修改一個欄位，保存，刷新，確認：
    - 修改持久化
    - **其他 Section 未被清空**
    - 網站無閃屏
    - 一鍵部署正常運作

---

## 7. 輸出規範

完成後必須向用戶匯報：

1. **修改文件清單**：列出所有變更的檔案路徑。
2. **資料結構變更點**：新增/修改了哪些欄位，特別說明名稱對齊的修正。
3. **Admin 使用說明**：訪問路徑、各 tab 的功能、哪裡管理案例/哪裡管理文案。
4. **部署 URL**：最新的生產/預覽網址。
5. **已知限制**：如某些動畫不依賴 CMS、圖片需手動上傳到 `public/` 等。

---

## 8. 快速參考：欄位名稱對齊速查表

| 前端組件用法 | Admin 應寫入的欄位名 | 常見錯誤 |
|-------------|---------------------|---------|
| `hero.titleLine1` | `titleLine1` | `title` |
| `about.sectionTagline` | `sectionTagline` | `tag` |
| `about.mainHeading` | `mainHeading` | `heading` |
| `services.readMoreText` | `readMoreText` | `readMore` / `buttonText` |
| `cases.clientLabel` | `clientLabel` | `client` |
| `growth.introParagraph1` | `introParagraph1` | `description` |
| `contact.form.nameLabel` | `form.nameLabel` | `form.name` |
| `navigation.items[].name` | `name` | `label` |
| `navigation.ctaButton.text` | `ctaButton.text` | `cta.label` |
| `footer.copyright` | `copyright` | `copyrightText` |
| Service Page `features.items[].icon` | `features.items[].icon` | `iconName` |
| Service Page `process.steps[].number` | `process.steps[].number` | `stepNumber` |

**記住這句話：組件裡用什麼 key，Admin 和 Worker 就要用什麼 key。一個字母都不能差。**
