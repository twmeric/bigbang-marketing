# 教訓：E-Corp CMS 工作流完整性

## 日期
2026-04-09

## 問題發現
用戶回饋多個 CMS 工作流程不完整：
1. **缺少一鍵部署** - Admin 後台沒有觸發部署的按鈕
2. **案例管理不同步** - Cases 使用 localStorage，違反 CWMNG 四點同步
3. **按鈕連結錯誤** - "添加案例" 連到錯誤頁面
4. **冗餘功能** - "查看網站" 佔用空間，應換成一鍵部署

## CWMNG 四點同步原則
**Worker 默認值 → Admin 表單 → index.html 備份 → 組件渲染**

所有 CMS 數據必須遵循這個流程，不能獨立存儲在 localStorage。

## 修復方案

### 1. 一鍵部署按鈕
```typescript
// Admin Layout Header
<DeployButton />

// Dashboard Quick Actions
{ icon: "fa-rocket", label: isDeploying ? "部署中..." : "一鍵部署", 
  onClick: deploy, disabled: isDeploying }
```

### 2. 案例管理頁面重構
- 從 `useCMS()` 獲取 cases 數據
- 使用 `updateSection("cases", {...})` 保存
- 添加「保存到 CMS」按鈕
- 顯示未保存更改提示

### 3. 按鈕連結修復
- "添加案例" → `/admin/cases`（原來是 `/admin/content`）

## 代碼模式

### 正確的 CMS 組件模式
```typescript
const { cmsData, updateSection, isSaving } = useCMS();
const [items, setItems] = useState([]);
const [hasChanges, setHasChanges] = useState(false);

// 加載
useEffect(() => {
  setItems(cmsData.cases?.items || []);
}, [cmsData]);

// 本地編輯
const handleEdit = (item) => {
  setItems(items.map(i => i.id === item.id ? item : i));
  setHasChanges(true);
};

// 保存到 CMS
const handleSave = async () => {
  await updateSection("cases", { ...cmsData.cases, items });
  setHasChanges(false);
};
```

## 用戶反饋
> "為什麼老是我再提出，然後來回幾次還是沒有結果"

**反思**：
- E-Corp 模式不只是技術架構，也是工作流程
- 一鍵部署是核心功能，不能缺失
- 所有 CMS 編輯必須實際同步到數據源

## 檢查清單
Admin 後台必須有：
- [ ] 一鍵部署按鈕（顯眼位置）
- [ ] 所有 CMS 數據可編輯
- [ ] 編輯後保存到 CMS（不是 localStorage）
- [ ] 未保存更改提示
- [ ] 保存/部署狀態反饋
