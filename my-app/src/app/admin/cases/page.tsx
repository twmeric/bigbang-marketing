"use client";

import { useEffect, useState } from "react";
import { useCMS } from "@/context/CMSContext";

interface Case {
  id: number;
  title: string;
  client: string;
  image: string;
  category: string;
  description: string;
}

export default function CasesPage() {
  const { cmsData, updateSection, isSaving } = useCMS();
  const [cases, setCases] = useState<Case[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hasChanges, setHasChanges] = useState(false);

  // 從 CMS 數據加載案例
  useEffect(() => {
    const cmsCases = cmsData.cases?.items || [];
    setCases(cmsCases);
  }, [cmsData.cases]);

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(cases.map((c) => c.category)))];

  const handleAdd = () => {
    setCurrentCase({
      id: Date.now(),
      title: "",
      client: "",
      image: "",
      category: "",
      description: ""
    });
    setIsEditing(true);
  };

  const handleEdit = (caseItem: Case) => {
    setCurrentCase({ ...caseItem });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("確定要刪除這個案例嗎？此操作無法撤銷。")) {
      const newCases = cases.filter((c) => c.id !== id);
      setCases(newCases);
      setHasChanges(true);
    }
  };

  const handleSaveCase = () => {
    if (!currentCase) return;
    
    if (!currentCase.title || !currentCase.client) {
      alert("請填寫標題和客戶名稱");
      return;
    }

    let newCases;
    if (cases.find((c) => c.id === currentCase.id)) {
      newCases = cases.map((c) => (c.id === currentCase.id ? currentCase : c));
    } else {
      newCases = [...cases, currentCase];
    }
    setCases(newCases);
    setHasChanges(true);
    setIsEditing(false);
    setCurrentCase(null);
  };

  // 保存到 CMS
  const handleSaveToCMS = async () => {
    await updateSection("cases", { 
      ...cmsData.cases,
      items: cases 
    });
    setHasChanges(false);
    alert("案例已保存到 CMS！請使用一鍵部署更新網站。");
  };

  const handleExport = () => {
    const data = JSON.stringify(cases, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cases-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setCases(data);
          setHasChanges(true);
          alert(`成功導入 ${data.length} 個案例，請點擊「保存到 CMS」按鈕。`);
        } else {
          alert("文件格式錯誤：數據應該是數組格式");
        }
      } catch (error) {
        alert("文件格式錯誤：無法解析 JSON");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">案例管理</h1>
          <p className="text-gray-500 mt-1">管理網站上顯示的成功案例（與 CMS 同步）</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <span className="text-yellow-600 flex items-center space-x-1 bg-yellow-50 px-3 py-2 rounded-lg">
              <i className="fas fa-exclamation-circle"></i>
              <span>有未保存的更改</span>
            </span>
          )}
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <i className="fas fa-upload"></i>
            <span>導入</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-download"></i>
            <span>導出</span>
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>添加案例</span>
          </button>
          <button
            onClick={handleSaveToCMS}
            disabled={!hasChanges || isSaving}
            className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center space-x-2 ${
              hasChanges && !isSaving
                ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <i className={`fas ${isSaving ? "fa-spinner fa-spin" : "fa-save"}`}></i>
            <span>{isSaving ? "保存中..." : "保存到 CMS"}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="搜索案例標題或客戶..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
        >
          <option value="all">所有類別</option>
          {categories.filter(c => c !== "all").map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Cases Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-yellow-400 transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                {caseItem.image ? (
                  <img
                    src={caseItem.image}
                    alt={caseItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <i className="fas fa-image text-4xl"></i>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    {caseItem.category}
                  </span>
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(caseItem)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                    title="編輯"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(caseItem.id)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                    title="刪除"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-yellow-600 text-sm font-medium mb-1">{caseItem.client}</p>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{caseItem.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{caseItem.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <i className="fas fa-inbox text-4xl mb-4"></i>
            <p>沒有找到匹配的案例</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && currentCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {cases.find((c) => c.id === currentCase.id) ? "編輯案例" : "添加案例"}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  案例標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentCase.title}
                  onChange={(e) => setCurrentCase({ ...currentCase, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="輸入案例標題"
                />
              </div>

              {/* Client & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    客戶名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentCase.client}
                    onChange={(e) => setCurrentCase({ ...currentCase, client: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="輸入客戶名稱"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    類別 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentCase.category}
                    onChange={(e) => setCurrentCase({ ...currentCase, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">選擇類別</option>
                    <option value="社交媒體">社交媒體</option>
                    <option value="品牌贊助">品牌贊助</option>
                    <option value="影片製作">影片製作</option>
                    <option value="網頁設計">網頁設計</option>
                    <option value="線下活動">線下活動</option>
                    <option value="KOL推廣">KOL推廣</option>
                    <option value="包裝設計">包裝設計</option>
                  </select>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  圖片路徑
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentCase.image}
                    onChange={(e) => setCurrentCase({ ...currentCase, image: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="例如：/case-image.png"
                  />
                  <button
                    type="button"
                    onClick={() => alert("媒體庫功能即將推出，請手動輸入圖片路徑")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <i className="fas fa-folder-open"></i>
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  提示：圖片需要先上傳到服務器，然後在此輸入路徑（如 /case-new.png）
                </p>
                {currentCase.image && (
                  <div className="mt-3 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={currentCase.image}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述
                </label>
                <textarea
                  value={currentCase.description}
                  onChange={(e) => setCurrentCase({ ...currentCase, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent h-24 resize-none"
                  placeholder="輸入案例描述"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveCase}
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
