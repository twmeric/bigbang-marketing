# 教訓：CMS 數據同步與表單預填充

## 日期
2026-04-09

## 項目
Big Bang Marketing CMS - Cloudflare Pages + Workers + KV

## 問題描述
Admin 後台的服務頁面表單顯示為空白，即使 CMS JSON 數據文件中已有完整的內容。

## 根本原因
1. **API 數據優先級錯誤**：`useCMS()` 從 API 獲取的數據可能過時，未包含新添加的 `servicePages` 結構
2. **缺乏深度合併**：表單初始化時直接使用 API 數據，沒有與默認數據合併作為後備
3. **無自我驗證**：沒有檢查表單字段是否正確顯現有數據

## 用戶反饋（核心痛點）
> "智能體自己可以做測試，如果發現結果不如預期，不是應該繼續迭代的嘛？為什麼老是我再提出，然後來回幾次還是沒有結果。這是很差的體驗"

**關鍵教訓**：
- 用戶不應該成為測試員
- 每次修改後應該主動驗證結果
- 發現問題應該立即自我修正，不是等用戶指出

## 解決方案
```typescript
// 正確做法：深度合併默認數據與 API 數據
const merged = JSON.parse(JSON.stringify(defaultCMSData));
const deepMerge = (target: any, source: any) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};
deepMerge(merged, cmsData);
setFormData(merged);
```

## 自我測試清單（必須執行）
每次修改 Admin 表單後：
- [ ] 檢查所有輸入框是否正確顯示現有數據
- [ ] 測試修改一個字段後保存，刷新後是否仍然顯示
- [ ] 檢查新添加的表單區域是否能正確讀取數據
- [ ] 驗證 nested object（如 servicePages.seo.hero）是否能正確綁定

## 通用原則
1. **數據優先級**：默認數據 (default) < API 數據 (api) < 用戶輸入 (user)
2. **表單初始化**：始終使用深度合併確保所有字段有值
3. **防禦性編程**：假設 API 可能返回不完整數據
4. **主動驗證**：不要等用戶發現問題，每次修改後自我測試

## 相關文件
- `src/app/admin/content/page.tsx`
- `src/context/CMSContext.tsx`
- `src/data/cms.json`
