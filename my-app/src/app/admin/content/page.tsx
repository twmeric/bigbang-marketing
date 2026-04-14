"use client";

import { useState, useEffect } from "react";
import { useCMS } from "@/context/CMSContext";
import defaultCMSData from "@/data/cms.json";

// Service page section update helper
function updateServicePageSection(
  pageKey: string, 
  pageData: any, 
  section: string, 
  value: any, 
  formData: any, 
  updateFormSection: (s: string, v: any) => void
) {
  const newServicePages = { ...formData.servicePages };
  newServicePages[pageKey] = { ...pageData, [section]: value };
  updateFormSection("servicePages", newServicePages);
}

export default function ContentPage() {
  const { cmsData, updateSection, exportData, importData, resetToDefault } = useCMS();
  const [activeTab, setActiveTab] = useState("site");
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Merge cmsData with defaultCMSData to ensure all fields have default values
  const mergedData = { ...defaultCMSData, ...cmsData };
  const [formData, setFormData] = useState<any>(mergedData);

  useEffect(() => {
    // Deep merge cmsData with defaultCMSData
    const merged = JSON.parse(JSON.stringify(defaultCMSData));
    
    // Recursively merge cmsData into default data
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
    setIsLoaded(true);
  }, [cmsData]);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cms-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const success = await importData(event.target?.result as string);
      if (success) {
        alert("CMS 數據導入成功！");
        window.location.reload();
      } else {
        alert("導入失敗");
      }
    };
    reader.readAsText(file);
  };

  const updateFormSection = (section: string, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const saveSection = (section: string) => {
    updateSection(section, formData[section]);
    setSaveMessage(`已保存`);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // 分頁標籤 - 按 CWMNG 規範提供分段式表單
  const tabs = [
    { id: "site", label: "網站信息", icon: "fa-globe" },
    { id: "navigation", label: "導航列", icon: "fa-bars" },
    { id: "hero", label: "首頁 Hero", icon: "fa-home" },
    { id: "about", label: "關於我們", icon: "fa-info-circle" },
    { id: "services", label: "服務總覽", icon: "fa-list" },
    { id: "servicePages", label: "服務頁面", icon: "fa-file-alt" },
    { id: "cases", label: "成功案例", icon: "fa-image" },
    { id: "growth", label: "成長營銷", icon: "fa-chart-line" },
    { id: "faq", label: "常見問題", icon: "fa-question-circle" },
    { id: "partners", label: "合作夥伴", icon: "fa-handshake" },
    { id: "contact", label: "聯絡我們", icon: "fa-envelope" },
    { id: "footer", label: "頁腳", icon: "fa-shoe-prints" },
  ];

  // 服務頁面子標籤
  const servicePageTypes = [
    { key: "seo", label: "SEO 頁面" },
    { key: "contentMarketing", label: "內容營銷頁面" },
    { key: "offlinePromotion", label: "線下推廣頁面" },
    { key: "kolPromotion", label: "KOL 推廣頁面" },
    { key: "webDesign", label: "網頁設計頁面" },
    { key: "packagingDesign", label: "包裝設計頁面" },
  ];

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">內容管理</h1>
          <p className="text-gray-500 mt-1">管理網站所有內容（分段式表單）</p>
        </div>
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {saveMessage && (
            <span className="text-green-600 flex items-center space-x-1 bg-green-50 px-3 py-2 rounded-lg">
              <i className="fas fa-check-circle"></i>
              <span>{saveMessage}</span>
            </span>
          )}
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <i className="fas fa-upload"></i>
            <span>導入 JSON</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-download"></i>
            <span>導出備份</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-yellow-400 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <i className={`fas ${tab.icon} w-5`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (confirm("確定重置？")) resetToDefault();
            }}
            className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-medium transition-colors"
          >
            <i className="fas fa-undo mr-2"></i>
            重置為默認值
          </button>
        </div>

        {/* Content Editor */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Site Info */}
            {activeTab === "site" && (
              <SectionEditor title="網站信息" onSave={() => saveSection("site")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="網站名稱" value={formData.site?.name || ""} onChange={(v: string) => updateFormSection("site", { name: v })} />
                  <FormInput label="網站標題" value={formData.site?.title || ""} onChange={(v: string) => updateFormSection("site", { title: v })} />
                  <FormInput label="Logo 路徑" value={formData.site?.logo || ""} onChange={(v: string) => updateFormSection("site", { logo: v })} />
                  <FormInput label="Favicon 路徑" value={formData.site?.favicon || ""} onChange={(v: string) => updateFormSection("site", { favicon: v })} />
                  <FormTextarea label="網站描述（SEO）" value={formData.site?.description || ""} onChange={(v: string) => updateFormSection("site", { description: v })} className="md:col-span-2" />
                </div>
              </SectionEditor>
            )}

            {/* Navigation */}
            {activeTab === "navigation" && (
              <SectionEditor title="導航列 (Navigation)" onSave={() => saveSection("navigation")}>
                <div className="space-y-6">
                  {/* 導航項目 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">導航項目</label>
                    <div className="space-y-3">
                      {(formData.navigation?.items || []).map((item: any, index: number) => (
                        <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <FormInput 
                              label={`項目 ${index + 1} 名稱`} 
                              value={item.name || ""} 
                              onChange={(v: string) => {
                                const newItems = [...(formData.navigation?.items || [])];
                                newItems[index] = { ...item, name: v };
                                updateFormSection("navigation", { items: newItems });
                              }} 
                            />
                            <FormInput 
                              label="連結" 
                              value={item.href || ""} 
                              onChange={(v: string) => {
                                const newItems = [...(formData.navigation?.items || [])];
                                newItems[index] = { ...item, href: v };
                                updateFormSection("navigation", { items: newItems });
                              }} 
                              className="mt-2"
                            />
                            {/* 子選單管理 */}
                            <div className="mt-2 pl-4 border-l-2 border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500">子選單</p>
                                <button
                                  onClick={() => {
                                    const newItems = [...(formData.navigation?.items || [])];
                                    if (!newItems[index].children) newItems[index].children = [];
                                    newItems[index].children.push({ name: "新子項目", href: "#" });
                                    updateFormSection("navigation", { items: newItems });
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  <i className="fas fa-plus mr-1"></i>添加子項目
                                </button>
                              </div>
                              {(item.children || []).map((child: any, childIndex: number) => (
                                <div key={childIndex} className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    value={child.name || child.label || ""}
                                    onChange={(e) => {
                                      const newItems = [...(formData.navigation?.items || [])];
                                      newItems[index].children[childIndex].name = e.target.value;
                                      delete newItems[index].children[childIndex].label;
                                      updateFormSection("navigation", { items: newItems });
                                    }}
                                    className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded"
                                    placeholder="子選單名稱"
                                  />
                                  <input
                                    type="text"
                                    value={child.href || ""}
                                    onChange={(e) => {
                                      const newItems = [...(formData.navigation?.items || [])];
                                      newItems[index].children[childIndex].href = e.target.value;
                                      updateFormSection("navigation", { items: newItems });
                                    }}
                                    className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded"
                                    placeholder="連結"
                                  />
                                  <button
                                    onClick={() => {
                                      const newItems = [...(formData.navigation?.items || [])];
                                      newItems[index].children = newItems[index].children.filter((_: any, i: number) => i !== childIndex);
                                      updateFormSection("navigation", { items: newItems });
                                    }}
                                    className="text-red-500 hover:text-red-700 px-2"
                                  >
                                    <i className="fas fa-times text-xs"></i>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const newItems = (formData.navigation?.items || []).filter((_: any, i: number) => i !== index);
                              updateFormSection("navigation", { items: newItems });
                            }}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const newItems = [...(formData.navigation?.items || []), { name: "新項目", href: "#" }];
                        updateFormSection("navigation", { items: newItems });
                      }}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <i className="fas fa-plus mr-1"></i> 添加導航項目
                    </button>
                  </div>

                  {/* CTA 按鈕 */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-3">CTA 按鈕</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput 
                        label="按鈕文字" 
                        value={formData.navigation?.ctaButton?.text || ""} 
                        onChange={(v: string) => updateFormSection("navigation", { ctaButton: { ...formData.navigation?.ctaButton, text: v } })} 
                      />
                      <FormInput 
                        label="按鈕連結" 
                        value={formData.navigation?.ctaButton?.href || ""} 
                        onChange={(v: string) => updateFormSection("navigation", { ctaButton: { ...formData.navigation?.ctaButton, href: v } })} 
                      />
                    </div>
                  </div>
                </div>
              </SectionEditor>
            )}

            {/* Hero */}
            {activeTab === "hero" && (
              <SectionEditor title="首頁 Hero" onSave={() => saveSection("hero")}>
                <FormCheckbox label="顯示 Hero" checked={formData.hero?.enabled ?? true} onChange={(v: boolean) => updateFormSection("hero", { enabled: v })} />
                {formData.hero?.enabled !== false && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormInput label="背景圖片" value={formData.hero?.backgroundImage || ""} onChange={(v: string) => updateFormSection("hero", { backgroundImage: v })} />
                    <FormInput label="標題第一行" value={formData.hero?.titleLine1 || ""} onChange={(v: string) => updateFormSection("hero", { titleLine1: v })} />
                    <FormInput label="標題第二行" value={formData.hero?.titleLine2 || ""} onChange={(v: string) => updateFormSection("hero", { titleLine2: v })} />
                    <FormInput label="標題顏色" value={formData.hero?.titleLine2Color || ""} onChange={(v: string) => updateFormSection("hero", { titleLine2Color: v })} />
                    <FormInput label="副標題" value={formData.hero?.subtitle || ""} onChange={(v: string) => updateFormSection("hero", { subtitle: v })} />
                    <FormInput label="按鈕文字" value={formData.hero?.buttonText || ""} onChange={(v: string) => updateFormSection("hero", { buttonText: v })} />
                    <FormInput label="按鈕連結" value={formData.hero?.buttonLink || ""} onChange={(v: string) => updateFormSection("hero", { buttonLink: v })} />
                    <FormTextarea label="描述" value={formData.hero?.description || ""} onChange={(v: string) => updateFormSection("hero", { description: v })} className="md:col-span-2" />
                  </div>
                )}
              </SectionEditor>
            )}

            {/* About */}
            {activeTab === "about" && (
              <SectionEditor title="關於我們" onSave={() => saveSection("about")}>
                <FormCheckbox label="顯示此區域" checked={formData.about?.enabled ?? true} onChange={(v: boolean) => updateFormSection("about", { enabled: v })} />
                {formData.about?.enabled !== false && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormInput label="區域標籤" value={formData.about?.sectionTagline || ""} onChange={(v: string) => updateFormSection("about", { sectionTagline: v })} />
                    <FormInput label="區域標題" value={formData.about?.sectionTitle || ""} onChange={(v: string) => updateFormSection("about", { sectionTitle: v })} />
                    <FormInput label="主標題" value={formData.about?.mainHeading || ""} onChange={(v: string) => updateFormSection("about", { mainHeading: v })} />
                    <FormInput label="CTA 文字" value={formData.about?.ctaText || ""} onChange={(v: string) => updateFormSection("about", { ctaText: v })} />
                    <FormInput label="CTA 連結" value={formData.about?.ctaLink || ""} onChange={(v: string) => updateFormSection("about", { ctaLink: v })} />
                    <FormTextarea label="描述" value={formData.about?.description || ""} onChange={(v: string) => updateFormSection("about", { description: v })} className="md:col-span-2" />

                    {/* About Features */}
                    <div className="md:col-span-2 border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">特色列表</label>
                      <div className="space-y-3">
                        {(formData.about?.features || []).map((feature: any, index: number) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={feature.icon || ""}
                              onChange={(e) => {
                                const newFeatures = [...(formData.about?.features || [])];
                                newFeatures[index] = { ...feature, icon: e.target.value };
                                updateFormSection("about", { features: newFeatures });
                              }}
                              className="w-32 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="圖標"
                            />
                            <input
                              type="text"
                              value={feature.text || ""}
                              onChange={(e) => {
                                const newFeatures = [...(formData.about?.features || [])];
                                newFeatures[index] = { ...feature, text: e.target.value };
                                updateFormSection("about", { features: newFeatures });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="文字"
                            />
                            <button
                              onClick={() => {
                                const newFeatures = (formData.about?.features || []).filter((_: any, i: number) => i !== index);
                                updateFormSection("about", { features: newFeatures });
                              }}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newFeatures = [...(formData.about?.features || []), { icon: "star", text: "新特色" }];
                          updateFormSection("about", { features: newFeatures });
                        }}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <i className="fas fa-plus mr-1"></i> 添加特色
                      </button>
                    </div>
                  </div>
                )}
              </SectionEditor>
            )}

            {/* Services Overview */}
            {activeTab === "services" && (
              <SectionEditor title="服務總覽" onSave={() => saveSection("services")}>
                <FormCheckbox label="顯示服務區域" checked={formData.services?.enabled ?? true} onChange={(v: boolean) => updateFormSection("services", { enabled: v })} />
                {formData.services?.enabled !== false && (
                  <div className="space-y-6 mt-6">
                    <FormInput label="區域標籤" value={formData.services?.sectionTagline || ""} onChange={(v: string) => updateFormSection("services", { sectionTagline: v })} />
                    <FormInput label="區域標題" value={formData.services?.sectionTitle || ""} onChange={(v: string) => updateFormSection("services", { sectionTitle: v })} />
                    <FormTextarea label="區域描述" value={formData.services?.sectionDescription || ""} onChange={(v: string) => updateFormSection("services", { sectionDescription: v })} />
                    <FormInput label="了解更多文字" value={formData.services?.readMoreText || ""} onChange={(v: string) => updateFormSection("services", { readMoreText: v })} />
                    
                    {/* 服務項目列表 */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">服務項目</label>
                      <div className="space-y-4">
                        {(formData.services?.items || []).map((item: any, index: number) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-3">
                              <FormInput label="圖標" value={item.icon || ""} onChange={(v: string) => {
                                const newItems = [...(formData.services?.items || [])];
                                newItems[index] = { ...item, icon: v };
                                updateFormSection("services", { items: newItems });
                              }} />
                              <FormInput label="標題" value={item.title || ""} onChange={(v: string) => {
                                const newItems = [...(formData.services?.items || [])];
                                newItems[index] = { ...item, title: v };
                                updateFormSection("services", { items: newItems });
                              }} />
                              <FormInput label="副標題" value={item.subtitle || ""} onChange={(v: string) => {
                                const newItems = [...(formData.services?.items || [])];
                                newItems[index] = { ...item, subtitle: v };
                                updateFormSection("services", { items: newItems });
                              }} />
                              <FormInput label="連結" value={item.link || ""} onChange={(v: string) => {
                                const newItems = [...(formData.services?.items || [])];
                                newItems[index] = { ...item, link: v };
                                updateFormSection("services", { items: newItems });
                              }} />
                            </div>
                            <FormTextarea label="描述" value={item.description || ""} onChange={(v: string) => {
                              const newItems = [...(formData.services?.items || [])];
                              newItems[index] = { ...item, description: v };
                              updateFormSection("services", { items: newItems });
                            }} className="mt-2" />
                            <div className="mt-2">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.enabled !== false}
                                  onChange={(e) => {
                                    const newItems = [...(formData.services?.items || [])];
                                    newItems[index] = { ...item, enabled: e.target.checked };
                                    updateFormSection("services", { items: newItems });
                                  }}
                                  className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                                />
                                <span className="text-sm text-gray-700">啟用此服務</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </SectionEditor>
            )}

            {/* Service Pages */}
            {activeTab === "servicePages" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">服務頁面內容</h2>
                <div className="space-y-8">
                  {servicePageTypes.map((pageType) => {
                    const pageData = formData.servicePages?.[pageType.key] || {};
                    return (
                      <div key={pageType.key} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                          <i className="fas fa-file-alt mr-2 text-yellow-500"></i>
                          {pageType.label}
                        </h3>
                        
                        <FormCheckbox 
                          label="啟用頁面" 
                          checked={pageData.enabled ?? true} 
                          onChange={(v: boolean) => {
                            const newServicePages = { ...formData.servicePages };
                            newServicePages[pageType.key] = { ...pageData, enabled: v };
                            updateFormSection("servicePages", newServicePages);
                          }} 
                        />
                        
                        {pageData.enabled !== false && (
                          <div className="space-y-6 mt-4">
                            {/* Hero 區域 */}
                            <div className="bg-white p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">Hero 區域</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput 
                                  label="頁面標題" 
                                  value={pageData.hero?.title || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "hero", { ...pageData.hero, title: v }, formData, updateFormSection)} 
                                />
                                <FormInput 
                                  label="英文副標題" 
                                  value={pageData.hero?.subtitle || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "hero", { ...pageData.hero, subtitle: v }, formData, updateFormSection)} 
                                />
                                <FormInput 
                                  label="背景圖片" 
                                  value={pageData.hero?.backgroundImage || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "hero", { ...pageData.hero, backgroundImage: v }, formData, updateFormSection)} 
                                />
                                <FormInput 
                                  label="按鈕文字" 
                                  value={pageData.hero?.buttonText || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "hero", { ...pageData.hero, buttonText: v }, formData, updateFormSection)} 
                                />
                                <FormInput 
                                  label="按鈕連結" 
                                  value={pageData.hero?.buttonLink || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "hero", { ...pageData.hero, buttonLink: v }, formData, updateFormSection)} 
                                  className="md:col-span-2"
                                />
                                <FormTextarea 
                                  label="頁面描述" 
                                  value={pageData.hero?.description || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "hero", { ...pageData.hero, description: v }, formData, updateFormSection)} 
                                  className="md:col-span-2"
                                />
                              </div>
                            </div>

                            {/* Features 區域 */}
                            <div className="bg-white p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">服務特色</h4>
                              <FormInput 
                                label="特色區域標題" 
                                value={pageData.features?.title || ""} 
                                onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "features", { ...pageData.features, title: v }, formData, updateFormSection)} 
                              />
                              <FormTextarea 
                                label="特色區域描述" 
                                value={pageData.features?.description || ""} 
                                onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "features", { ...pageData.features, description: v }, formData, updateFormSection)} 
                                className="mt-2"
                              />
                              <div className="mt-4 space-y-3">
                                {(pageData.features?.items || []).map((feature: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-gray-50 rounded flex gap-3 items-start">
                                    <FormInput label="圖標" value={feature.icon || ""} onChange={(v: string) => updateFeatureItem(pageType.key, pageData, idx, "icon", v, formData, updateFormSection)} className="w-32" />
                                    <div className="flex-1 space-y-2">
                                      <FormInput label="標題" value={feature.title || ""} onChange={(v: string) => updateFeatureItem(pageType.key, pageData, idx, "title", v, formData, updateFormSection)} />
                                      <FormTextarea label="描述" value={feature.description || ""} onChange={(v: string) => updateFeatureItem(pageType.key, pageData, idx, "description", v, formData, updateFormSection)} />
                                    </div>
                                    <button onClick={() => removeFeatureItem(pageType.key, pageData, idx, formData, updateFormSection)} className="text-red-500 hover:text-red-700 mt-6"><i className="fas fa-trash"></i></button>
                                  </div>
                                ))}
                                <button onClick={() => addFeatureItem(pageType.key, pageData, formData, updateFormSection)} className="text-sm text-blue-600 hover:text-blue-800 font-medium"><i className="fas fa-plus mr-1"></i> 添加特色項目</button>
                              </div>
                            </div>

                            {/* Stats 區域 */}
                            <div className="bg-white p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">數據統計</h4>
                              <FormCheckbox 
                                label="顯示數據統計" 
                                checked={pageData.stats?.enabled ?? true} 
                                onChange={(v: boolean) => updateServicePageSection(pageType.key, pageData, "stats", { ...pageData.stats, enabled: v }, formData, updateFormSection)} 
                              />
                              {pageData.stats?.enabled !== false && (
                                <div className="mt-4 space-y-3">
                                  {(pageData.stats?.items || []).map((stat: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded flex gap-3 items-center">
                                      <FormInput label="數值" value={stat.value || ""} onChange={(v: string) => updateStatItem(pageType.key, pageData, idx, "value", v, formData, updateFormSection)} className="flex-1" />
                                      <FormInput label="標籤" value={stat.label || ""} onChange={(v: string) => updateStatItem(pageType.key, pageData, idx, "label", v, formData, updateFormSection)} className="flex-1" />
                                      <FormInput label="描述" value={stat.description || ""} onChange={(v: string) => updateStatItem(pageType.key, pageData, idx, "description", v, formData, updateFormSection)} className="flex-1" />
                                      <button onClick={() => removeStatItem(pageType.key, pageData, idx, formData, updateFormSection)} className="text-red-500 hover:text-red-700 mt-6"><i className="fas fa-trash"></i></button>
                                    </div>
                                  ))}
                                  <button onClick={() => addStatItem(pageType.key, pageData, formData, updateFormSection)} className="text-sm text-blue-600 hover:text-blue-800 font-medium"><i className="fas fa-plus mr-1"></i> 添加統計項</button>
                                </div>
                              )}
                            </div>

                            {/* Testimonial 區域 */}
                            <div className="bg-white p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">客戶評價</h4>
                              <FormCheckbox 
                                label="顯示客戶評價" 
                                checked={pageData.testimonial?.enabled ?? true} 
                                onChange={(v: boolean) => updateServicePageSection(pageType.key, pageData, "testimonial", { ...pageData.testimonial, enabled: v }, formData, updateFormSection)} 
                              />
                              {pageData.testimonial?.enabled !== false && (
                                <div className="mt-4 space-y-4">
                                  <FormTextarea label="評價內容" value={pageData.testimonial?.quote || ""} onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "testimonial", { ...pageData.testimonial, quote: v }, formData, updateFormSection)} />
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormInput label="作者名稱" value={pageData.testimonial?.author || ""} onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "testimonial", { ...pageData.testimonial, author: v }, formData, updateFormSection)} />
                                    <FormInput label="職位/公司" value={pageData.testimonial?.role || ""} onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "testimonial", { ...pageData.testimonial, role: v }, formData, updateFormSection)} />
                                    <FormInput label="頭像圖片" value={pageData.testimonial?.avatar || ""} onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "testimonial", { ...pageData.testimonial, avatar: v }, formData, updateFormSection)} />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Process 區域 */}
                            <div className="bg-white p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">服務流程</h4>
                              <FormInput 
                                label="流程區域標題" 
                                value={pageData.process?.title || ""} 
                                onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "process", { ...pageData.process, title: v }, formData, updateFormSection)} 
                              />
                              <div className="mt-4 space-y-3">
                                {(pageData.process?.steps || []).map((step: any, idx: number) => (
                                  <div key={idx} className="p-3 bg-gray-50 rounded flex gap-3 items-start">
                                    <FormInput label="步驟編號" value={step.number || ""} onChange={(v: string) => updateProcessStep(pageType.key, pageData, idx, "number", v, formData, updateFormSection)} className="w-24" />
                                    <div className="flex-1 space-y-2">
                                      <FormInput label="標題" value={step.title || ""} onChange={(v: string) => updateProcessStep(pageType.key, pageData, idx, "title", v, formData, updateFormSection)} />
                                      <FormTextarea label="描述" value={step.description || ""} onChange={(v: string) => updateProcessStep(pageType.key, pageData, idx, "description", v, formData, updateFormSection)} />
                                    </div>
                                    <button onClick={() => removeProcessStep(pageType.key, pageData, idx, formData, updateFormSection)} className="text-red-500 hover:text-red-700 mt-6"><i className="fas fa-trash"></i></button>
                                  </div>
                                ))}
                                <button onClick={() => addProcessStep(pageType.key, pageData, formData, updateFormSection)} className="text-sm text-blue-600 hover:text-blue-800 font-medium"><i className="fas fa-plus mr-1"></i> 添加流程步驟</button>
                              </div>
                            </div>

                            {/* Tech Stack 區域 - 僅 webDesign */}
                            {pageType.key === "webDesign" && (
                              <div className="bg-white p-4 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-3">技術棧</h4>
                                <FormCheckbox 
                                  label="顯示技術棧" 
                                  checked={pageData.techStack?.enabled ?? true} 
                                  onChange={(v: boolean) => updateServicePageSection(pageType.key, pageData, "techStack", { ...pageData.techStack, enabled: v }, formData, updateFormSection)} 
                                />
                                <FormInput 
                                  label="區域標題" 
                                  value={pageData.techStack?.title || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "techStack", { ...pageData.techStack, title: v }, formData, updateFormSection)} 
                                  className="mt-2"
                                />
                                {pageData.techStack?.enabled !== false && (
                                  <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">技術列表</label>
                                    <div className="flex flex-wrap gap-2">
                                      {(pageData.techStack?.items || []).map((tech: any, idx: number) => (
                                        <div key={idx} className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                                          <span className="text-sm">{tech.name}</span>
                                          <button onClick={() => removeTechItem(pageType.key, pageData, idx, formData, updateFormSection)} className="ml-2 text-yellow-700 hover:text-yellow-900"><i className="fas fa-times text-xs"></i></button>
                                        </div>
                                      ))}
                                    </div>
                                    <AddItemInput onAdd={(name) => addTechItem(pageType.key, pageData, name, formData, updateFormSection)} placeholder="輸入技術名稱後按 Enter" />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* FAQ 區域 */}
                            <div className="bg-white p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">常見問題</h4>
                              <FormCheckbox 
                                label="顯示 FAQ" 
                                checked={pageData.faq?.enabled ?? true} 
                                onChange={(v: boolean) => updateServicePageSection(pageType.key, pageData, "faq", { ...pageData.faq, enabled: v }, formData, updateFormSection)} 
                              />
                              {pageData.faq?.enabled !== false && (
                                <div className="mt-4 space-y-3">
                                  <FormInput 
                                    label="FAQ 區域標題" 
                                    value={pageData.faq?.title || ""} 
                                    onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "faq", { ...pageData.faq, title: v }, formData, updateFormSection)} 
                                  />
                                  {(pageData.faq?.items || []).map((faqItem: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded flex gap-3 items-start">
                                      <div className="flex-1 space-y-2">
                                        <FormInput label="問題" value={faqItem.question || ""} onChange={(v: string) => updateFAQItem(pageType.key, pageData, idx, "question", v, formData, updateFormSection)} />
                                        <FormTextarea label="回答" value={faqItem.answer || ""} onChange={(v: string) => updateFAQItem(pageType.key, pageData, idx, "answer", v, formData, updateFormSection)} />
                                      </div>
                                      <button onClick={() => removeFAQItem(pageType.key, pageData, idx, formData, updateFormSection)} className="text-red-500 hover:text-red-700 mt-6"><i className="fas fa-trash"></i></button>
                                    </div>
                                  ))}
                                  <button onClick={() => addFAQItem(pageType.key, pageData, formData, updateFormSection)} className="text-sm text-blue-600 hover:text-blue-800 font-medium"><i className="fas fa-plus mr-1"></i> 添加 FAQ</button>
                                </div>
                              )}
                            </div>

                            {/* CTA 區域 */}
                            <div className="bg-white p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">CTA 區域</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput 
                                  label="CTA 標題" 
                                  value={pageData.cta?.title || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "cta", { ...pageData.cta, title: v }, formData, updateFormSection)} 
                                />
                                <FormInput 
                                  label="CTA 按鈕文字" 
                                  value={pageData.cta?.buttonText || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "cta", { ...pageData.cta, buttonText: v }, formData, updateFormSection)} 
                                />
                                <FormTextarea 
                                  label="CTA 描述" 
                                  value={pageData.cta?.description || ""} 
                                  onChange={(v: string) => updateServicePageSection(pageType.key, pageData, "cta", { ...pageData.cta, description: v }, formData, updateFormSection)} 
                                  className="md:col-span-2"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => saveSection("servicePages")}
                  className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition-colors"
                >
                  <i className="fas fa-save mr-2"></i>
                  保存所有服務頁面
                </button>
              </div>
            )}

            {/* Cases */}
            {activeTab === "cases" && (
              <SectionEditor title="成功案例" onSave={() => saveSection("cases")}>
                <FormCheckbox label="顯示案例" checked={formData.cases?.enabled ?? true} onChange={(v: boolean) => updateFormSection("cases", { enabled: v })} />
                {formData.cases?.enabled !== false && (
                  <div className="space-y-4 mt-6">
                    <FormInput label="區域標籤" value={formData.cases?.sectionTagline || ""} onChange={(v: string) => updateFormSection("cases", { sectionTagline: v })} />
                    <FormInput label="區域標題" value={formData.cases?.sectionTitle || ""} onChange={(v: string) => updateFormSection("cases", { sectionTitle: v })} />
                    <FormTextarea label="區域描述" value={formData.cases?.sectionDescription || ""} onChange={(v: string) => updateFormSection("cases", { sectionDescription: v })} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormInput label="客戶標籤" value={formData.cases?.clientLabel || ""} onChange={(v: string) => updateFormSection("cases", { clientLabel: v })} />
                      <FormInput label="查看詳情文字" value={formData.cases?.viewDetailsText || ""} onChange={(v: string) => updateFormSection("cases", { viewDetailsText: v })} />
                      <FormInput label="查看更多文字" value={formData.cases?.viewMoreText || ""} onChange={(v: string) => updateFormSection("cases", { viewMoreText: v })} />
                    </div>

                    {/* 案例管理入口 */}
                    <div className="border-t pt-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">案例內容管理</p>
                          <p className="text-sm text-gray-500">添加、編輯、刪除案例圖片與描述，請前往專門的案例管理頁面</p>
                        </div>
                        <a
                          href="/admin/cases/"
                          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <i className="fas fa-external-link-alt mr-2"></i>
                          前往案例管理
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </SectionEditor>
            )}

            {/* Growth */}
            {activeTab === "growth" && (
              <SectionEditor title="成長營銷" onSave={() => saveSection("growth")}>
                <FormCheckbox label="顯示此區域" checked={formData.growth?.enabled ?? true} onChange={(v: boolean) => updateFormSection("growth", { enabled: v })} />
                {formData.growth?.enabled !== false && (
                  <div className="space-y-6 mt-6">
                    <FormInput label="標籤" value={formData.growth?.sectionTagline || ""} onChange={(v: string) => updateFormSection("growth", { sectionTagline: v })} />
                    <FormInput label="標題" value={formData.growth?.sectionTitle || ""} onChange={(v: string) => updateFormSection("growth", { sectionTitle: v })} />
                    <FormTextarea label="引言段落 1" value={formData.growth?.introParagraph1 || ""} onChange={(v: string) => updateFormSection("growth", { introParagraph1: v })} />
                    <FormTextarea label="引言段落 2" value={formData.growth?.introParagraph2 || ""} onChange={(v: string) => updateFormSection("growth", { introParagraph2: v })} />
                    <FormInput label="策略區域標題" value={formData.growth?.strategiesTitle || ""} onChange={(v: string) => updateFormSection("growth", { strategiesTitle: v })} />
                    <FormTextarea label="策略區域描述" value={formData.growth?.strategiesDescription || ""} onChange={(v: string) => updateFormSection("growth", { strategiesDescription: v })} />
                    
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">策略項目</label>
                      <div className="space-y-3">
                        {(formData.growth?.strategies || []).map((strategy: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <FormInput label="圖標" value={strategy.icon || ""} onChange={(v: string) => {
                                const newStrategies = [...(formData.growth?.strategies || [])];
                                newStrategies[index] = { ...strategy, icon: v };
                                updateFormSection("growth", { strategies: newStrategies });
                              }} />
                              <FormInput label="標題" value={strategy.title || ""} onChange={(v: string) => {
                                const newStrategies = [...(formData.growth?.strategies || [])];
                                newStrategies[index] = { ...strategy, title: v };
                                updateFormSection("growth", { strategies: newStrategies });
                              }} />
                            </div>
                            <FormTextarea label="描述" value={strategy.description || ""} onChange={(v: string) => {
                              const newStrategies = [...(formData.growth?.strategies || [])];
                              newStrategies[index] = { ...strategy, description: v };
                              updateFormSection("growth", { strategies: newStrategies });
                            }} className="mt-2" />
                            <button
                              onClick={() => {
                                const newStrategies = (formData.growth?.strategies || []).filter((_: any, i: number) => i !== index);
                                updateFormSection("growth", { strategies: newStrategies });
                              }}
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              <i className="fas fa-trash mr-1"></i>刪除策略
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newStrategies = [...(formData.growth?.strategies || []), { icon: "star", title: "新策略", description: "描述文字" }];
                            updateFormSection("growth", { strategies: newStrategies });
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <i className="fas fa-plus mr-1"></i> 添加策略
                        </button>
                      </div>
                    </div>

                    <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">底部 CTA</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="CTA 文字" value={formData.growth?.ctaText || ""} onChange={(v: string) => updateFormSection("growth", { ctaText: v })} />
                        <FormInput label="CTA 連結" value={formData.growth?.ctaLink || ""} onChange={(v: string) => updateFormSection("growth", { ctaLink: v })} />
                      </div>
                    </div>
                  </div>
                )}
              </SectionEditor>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
              <SectionEditor title="常見問題" onSave={() => saveSection("faq")}>
                <FormCheckbox label="顯示此區域" checked={formData.faq?.enabled ?? true} onChange={(v: boolean) => updateFormSection("faq", { enabled: v })} />
                {formData.faq?.enabled !== false && (
                  <div className="space-y-6 mt-6">
                    <FormInput label="區域標籤" value={formData.faq?.sectionTagline || ""} onChange={(v: string) => updateFormSection("faq", { sectionTagline: v })} />
                    <FormInput label="區域標題" value={formData.faq?.sectionTitle || ""} onChange={(v: string) => updateFormSection("faq", { sectionTitle: v })} />
                    <FormTextarea label="區域描述" value={formData.faq?.sectionDescription || ""} onChange={(v: string) => updateFormSection("faq", { sectionDescription: v })} />

                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">FAQ 項目</label>
                      <div className="space-y-3">
                        {(formData.faq?.items || []).map((item: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <FormInput label="問題" value={item.question || ""} onChange={(v: string) => {
                              const newItems = [...(formData.faq?.items || [])];
                              newItems[index] = { ...item, question: v };
                              updateFormSection("faq", { items: newItems });
                            }} />
                            <FormTextarea label="回答" value={item.answer || ""} onChange={(v: string) => {
                              const newItems = [...(formData.faq?.items || [])];
                              newItems[index] = { ...item, answer: v };
                              updateFormSection("faq", { items: newItems });
                            }} className="mt-2" />
                            <button
                              onClick={() => {
                                const newItems = (formData.faq?.items || []).filter((_: any, i: number) => i !== index);
                                updateFormSection("faq", { items: newItems });
                              }}
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              <i className="fas fa-trash mr-1"></i>刪除 FAQ
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newItems = [...(formData.faq?.items || []), { question: "新問題", answer: "回答內容" }];
                          updateFormSection("faq", { items: newItems });
                        }}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <i className="fas fa-plus mr-1"></i> 添加 FAQ
                      </button>
                    </div>

                    <div className="border-t pt-4 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">底部 CTA</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="CTA 標題" value={formData.faq?.ctaTitle || ""} onChange={(v: string) => updateFormSection("faq", { ctaTitle: v })} />
                        <FormInput label="CTA 按鈕文字" value={formData.faq?.ctaButtonText || ""} onChange={(v: string) => updateFormSection("faq", { ctaButtonText: v })} />
                      </div>
                      <FormTextarea label="CTA 描述" value={formData.faq?.ctaDescription || ""} onChange={(v: string) => updateFormSection("faq", { ctaDescription: v })} className="mt-2" />
                    </div>
                  </div>
                )}
              </SectionEditor>
            )}

            {/* Partners */}
            {activeTab === "partners" && (
              <SectionEditor title="合作夥伴" onSave={() => saveSection("partners")}>
                <FormCheckbox label="顯示此區域" checked={formData.partners?.enabled ?? true} onChange={(v: boolean) => updateFormSection("partners", { enabled: v })} />
                {formData.partners?.enabled !== false && (
                  <div className="space-y-6 mt-6">
                    <FormInput label="區域標籤" value={formData.partners?.sectionTagline || ""} onChange={(v: string) => updateFormSection("partners", { sectionTagline: v })} />
                    <FormInput label="區域標題" value={formData.partners?.sectionTitle || ""} onChange={(v: string) => updateFormSection("partners", { sectionTitle: v })} />
                    <FormTextarea label="區域描述" value={formData.partners?.sectionDescription || ""} onChange={(v: string) => updateFormSection("partners", { sectionDescription: v })} />

                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">合作伙伴</label>
                      <div className="space-y-3">
                        {(formData.partners?.items || []).map((item: any, index: number) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={item.name || ""}
                              onChange={(e) => {
                                const newItems = [...(formData.partners?.items || [])];
                                newItems[index] = { ...item, name: e.target.value };
                                updateFormSection("partners", { items: newItems });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="名稱"
                            />
                            <input
                              type="text"
                              value={item.icon || ""}
                              onChange={(e) => {
                                const newItems = [...(formData.partners?.items || [])];
                                newItems[index] = { ...item, icon: e.target.value };
                                updateFormSection("partners", { items: newItems });
                              }}
                              className="w-40 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="FontAwesome 圖標"
                            />
                            <button
                              onClick={() => {
                                const newItems = (formData.partners?.items || []).filter((_: any, i: number) => i !== index);
                                updateFormSection("partners", { items: newItems });
                              }}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newItems = [...(formData.partners?.items || []), { name: "新夥伴", icon: "fa-star" }];
                          updateFormSection("partners", { items: newItems });
                        }}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <i className="fas fa-plus mr-1"></i> 添加夥伴
                      </button>
                    </div>
                  </div>
                )}
              </SectionEditor>
            )}

            {/* Contact */}
            {activeTab === "contact" && (
              <SectionEditor title="聯絡我們" onSave={() => saveSection("contact")}>
                <FormCheckbox label="顯示此區域" checked={formData.contact?.enabled ?? true} onChange={(v: boolean) => updateFormSection("contact", { enabled: v })} />
                {formData.contact?.enabled !== false && (
                  <div className="space-y-6 mt-6">
                    <FormInput label="標籤" value={formData.contact?.sectionTagline || ""} onChange={(v: string) => updateFormSection("contact", { sectionTagline: v })} />
                    <FormInput label="標題" value={formData.contact?.sectionTitle || ""} onChange={(v: string) => updateFormSection("contact", { sectionTitle: v })} />
                    <FormTextarea label="描述" value={formData.contact?.sectionDescription || ""} onChange={(v: string) => updateFormSection("contact", { sectionDescription: v })} />
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-3">聯絡信息</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="電話標籤" value={formData.contact?.phoneLabel || ""} onChange={(v: string) => updateFormSection("contact", { phoneLabel: v })} />
                        <FormInput label="電話號碼" value={formData.contact?.phoneNumber || ""} onChange={(v: string) => updateFormSection("contact", { phoneNumber: v })} />
                        <FormInput label="WhatsApp 標籤" value={formData.contact?.whatsappLabel || ""} onChange={(v: string) => updateFormSection("contact", { whatsappLabel: v })} />
                        <FormInput label="WhatsApp 號碼" value={formData.contact?.whatsappNumber || ""} onChange={(v: string) => updateFormSection("contact", { whatsappNumber: v })} />
                        <FormInput label="Email 標籤" value={formData.contact?.emailLabel || ""} onChange={(v: string) => updateFormSection("contact", { emailLabel: v })} />
                        <FormInput label="Email 地址" value={formData.contact?.emailAddress || ""} onChange={(v: string) => updateFormSection("contact", { emailAddress: v })} />
                        <FormInput label="地址標籤" value={formData.contact?.addressLabel || ""} onChange={(v: string) => updateFormSection("contact", { addressLabel: v })} />
                        <FormInput label="地址" value={formData.contact?.address || ""} onChange={(v: string) => updateFormSection("contact", { address: v })} />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-3">表單設置</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="姓名標籤" value={formData.contact?.form?.nameLabel || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, nameLabel: v } })} />
                        <FormInput label="姓名提示" value={formData.contact?.form?.namePlaceholder || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, namePlaceholder: v } })} />
                        <FormInput label="電話標籤" value={formData.contact?.form?.phoneLabel || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, phoneLabel: v } })} />
                        <FormInput label="電話提示" value={formData.contact?.form?.phonePlaceholder || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, phonePlaceholder: v } })} />
                        <FormInput label="Email 標籤" value={formData.contact?.form?.emailLabel || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, emailLabel: v } })} />
                        <FormInput label="Email 提示" value={formData.contact?.form?.emailPlaceholder || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, emailPlaceholder: v } })} />
                        <FormInput label="服務標籤" value={formData.contact?.form?.serviceLabel || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, serviceLabel: v } })} />
                        <FormInput label="服務提示" value={formData.contact?.form?.servicePlaceholder || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, servicePlaceholder: v } })} />
                        <FormInput label="留言標籤" value={formData.contact?.form?.messageLabel || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, messageLabel: v } })} />
                        <FormInput label="留言提示" value={formData.contact?.form?.messagePlaceholder || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, messagePlaceholder: v } })} />
                        <FormInput label="提交按鈕" value={formData.contact?.form?.submitButton || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, submitButton: v } })} />
                        <FormInput label="提交中文字" value={formData.contact?.form?.submittingText || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, submittingText: v } })} />
                        <FormInput label="成功標題" value={formData.contact?.form?.successTitle || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, successTitle: v } })} />
                        <FormInput label="成功訊息" value={formData.contact?.form?.successMessage || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, successMessage: v } })} />
                        <FormInput label="成功按鈕" value={formData.contact?.form?.successButton || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, successButton: v } })} />
                        <FormInput label="錯誤標題" value={formData.contact?.form?.errorMessage || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, errorMessage: v } })} />
                        <FormInput label="錯誤詳情" value={formData.contact?.form?.errorDetail || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, errorDetail: v } })} />
                        <FormInput label="表單腳註" value={formData.contact?.form?.footnote || ""} onChange={(v: string) => updateFormSection("contact", { form: { ...formData.contact?.form, footnote: v } })} />
                      </div>
                    </div>
                  </div>
                )}
              </SectionEditor>
            )}

            {/* Footer */}
            {activeTab === "footer" && (
              <SectionEditor title="頁腳 (Footer)" onSave={() => saveSection("footer")}>
                <FormCheckbox label="顯示頁腳" checked={formData.footer?.enabled ?? true} onChange={(v: boolean) => updateFormSection("footer", { enabled: v })} />
                {formData.footer?.enabled !== false && (
                  <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput label="公司名稱" value={formData.footer?.companyName || ""} onChange={(v: string) => updateFormSection("footer", { companyName: v })} />
                      <FormInput label="版權信息" value={formData.footer?.copyright || ""} onChange={(v: string) => updateFormSection("footer", { copyright: v })} />
                    </div>
                    <FormTextarea label="公司描述" value={formData.footer?.companyDescription || ""} onChange={(v: string) => updateFormSection("footer", { companyDescription: v })} />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">社交媒體</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput label="Facebook" value={formData.footer?.social?.facebook || ""} onChange={(v: string) => updateFormSection("footer", { social: { ...formData.footer?.social, facebook: v } })} />
                        <FormInput label="Instagram" value={formData.footer?.social?.instagram || ""} onChange={(v: string) => updateFormSection("footer", { social: { ...formData.footer?.social, instagram: v } })} />
                        <FormInput label="WhatsApp" value={formData.footer?.social?.whatsapp || ""} onChange={(v: string) => updateFormSection("footer", { social: { ...formData.footer?.social, whatsapp: v } })} />
                      </div>
                    </div>

                    {/* Footer 服務列表 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">服務列表</h4>
                        <button
                          onClick={() => {
                            const newServices = [...(formData.footer?.services || []), { name: "新服務", href: "#" }];
                            updateFormSection("footer", { services: newServices });
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          <i className="fas fa-plus mr-1"></i>添加
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(formData.footer?.services || []).map((service: any, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={service.name || ""}
                              onChange={(e) => {
                                const newServices = [...(formData.footer?.services || [])];
                                newServices[idx] = { ...service, name: e.target.value };
                                updateFormSection("footer", { services: newServices });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="服務名稱"
                            />
                            <input
                              type="text"
                              value={service.href || ""}
                              onChange={(e) => {
                                const newServices = [...(formData.footer?.services || [])];
                                newServices[idx] = { ...service, href: e.target.value };
                                updateFormSection("footer", { services: newServices });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="連結"
                            />
                            <button
                              onClick={() => {
                                const newServices = (formData.footer?.services || []).filter((_: any, i: number) => i !== idx);
                                updateFormSection("footer", { services: newServices });
                              }}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer 公司連結 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">公司連結</h4>
                        <button
                          onClick={() => {
                            const newCompany = [...(formData.footer?.company || []), { name: "新連結", href: "#" }];
                            updateFormSection("footer", { company: newCompany });
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          <i className="fas fa-plus mr-1"></i>添加
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(formData.footer?.company || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={item.name || ""}
                              onChange={(e) => {
                                const newCompany = [...(formData.footer?.company || [])];
                                newCompany[idx] = { ...item, name: e.target.value };
                                updateFormSection("footer", { company: newCompany });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="連結名稱"
                            />
                            <input
                              type="text"
                              value={item.href || ""}
                              onChange={(e) => {
                                const newCompany = [...(formData.footer?.company || [])];
                                newCompany[idx] = { ...item, href: e.target.value };
                                updateFormSection("footer", { company: newCompany });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="連結"
                            />
                            <button
                              onClick={() => {
                                const newCompany = (formData.footer?.company || []).filter((_: any, i: number) => i !== idx);
                                updateFormSection("footer", { company: newCompany });
                              }}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer 底部連結 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">底部連結</h4>
                        <button
                          onClick={() => {
                            const newLinks = [...(formData.footer?.links || []), { name: "新連結", href: "#" }];
                            updateFormSection("footer", { links: newLinks });
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          <i className="fas fa-plus mr-1"></i>添加
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(formData.footer?.links || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={item.name || ""}
                              onChange={(e) => {
                                const newLinks = [...(formData.footer?.links || [])];
                                newLinks[idx] = { ...item, name: e.target.value };
                                updateFormSection("footer", { links: newLinks });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="連結名稱"
                            />
                            <input
                              type="text"
                              value={item.href || ""}
                              onChange={(e) => {
                                const newLinks = [...(formData.footer?.links || [])];
                                newLinks[idx] = { ...item, href: e.target.value };
                                updateFormSection("footer", { links: newLinks });
                              }}
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded"
                              placeholder="連結"
                            />
                            <button
                              onClick={() => {
                                const newLinks = (formData.footer?.links || []).filter((_: any, i: number) => i !== idx);
                                updateFormSection("footer", { links: newLinks });
                              }}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <FormInput label="版權信息" value={formData.footer?.copyright || ""} onChange={(v: string) => updateFormSection("footer", { copyright: v })} />
                  </div>
                )}
              </SectionEditor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Features 項目管理
function updateFeatureItem(pageKey: string, pageData: any, idx: number, field: string, value: string, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = [...(pageData.features?.items || [])];
  newItems[idx] = { ...newItems[idx], [field]: value };
  updateServicePageSection(pageKey, pageData, "features", { ...pageData.features, items: newItems }, formData, updateFormSection);
}

function addFeatureItem(pageKey: string, pageData: any, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = [...(pageData.features?.items || []), { icon: "fa-star", title: "新特色", description: "描述文字" }];
  updateServicePageSection(pageKey, pageData, "features", { ...pageData.features, items: newItems }, formData, updateFormSection);
}

function removeFeatureItem(pageKey: string, pageData: any, idx: number, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = (pageData.features?.items || []).filter((_: any, i: number) => i !== idx);
  updateServicePageSection(pageKey, pageData, "features", { ...pageData.features, items: newItems }, formData, updateFormSection);
}

// Process 步驟管理
function updateProcessStep(pageKey: string, pageData: any, idx: number, field: string, value: string, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newSteps = [...(pageData.process?.steps || [])];
  newSteps[idx] = { ...newSteps[idx], [field]: value };
  updateServicePageSection(pageKey, pageData, "process", { ...pageData.process, steps: newSteps }, formData, updateFormSection);
}

function addProcessStep(pageKey: string, pageData: any, formData: any, updateFormSection: (s: string, v: any) => void) {
  const nextNum = (pageData.process?.steps || []).length + 1;
  const newSteps = [...(pageData.process?.steps || []), { number: String(nextNum), title: `步驟 ${nextNum}`, description: "描述文字" }];
  updateServicePageSection(pageKey, pageData, "process", { ...pageData.process, steps: newSteps }, formData, updateFormSection);
}

function removeProcessStep(pageKey: string, pageData: any, idx: number, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newSteps = (pageData.process?.steps || []).filter((_: any, i: number) => i !== idx);
  updateServicePageSection(pageKey, pageData, "process", { ...pageData.process, steps: newSteps }, formData, updateFormSection);
}

// FAQ 項目管理
function updateFAQItem(pageKey: string, pageData: any, idx: number, field: string, value: string, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = [...(pageData.faq?.items || [])];
  newItems[idx] = { ...newItems[idx], [field]: value };
  updateServicePageSection(pageKey, pageData, "faq", { ...pageData.faq, items: newItems }, formData, updateFormSection);
}

function addFAQItem(pageKey: string, pageData: any, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = [...(pageData.faq?.items || []), { question: "新問題", answer: "回答內容" }];
  updateServicePageSection(pageKey, pageData, "faq", { ...pageData.faq, items: newItems }, formData, updateFormSection);
}

function removeFAQItem(pageKey: string, pageData: any, idx: number, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = (pageData.faq?.items || []).filter((_: any, i: number) => i !== idx);
  updateServicePageSection(pageKey, pageData, "faq", { ...pageData.faq, items: newItems }, formData, updateFormSection);
}

// Stats 項目管理
function updateStatItem(
  pageKey: string, 
  pageData: any, 
  idx: number, 
  field: string, 
  value: string, 
  formData: any, 
  updateFormSection: (s: string, v: any) => void
) {
  const newItems = [...(pageData.stats?.items || [])];
  newItems[idx] = { ...newItems[idx], [field]: value };
  updateServicePageSection(pageKey, pageData, "stats", { ...pageData.stats, items: newItems }, formData, updateFormSection);
}

function addStatItem(pageKey: string, pageData: any, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = [...(pageData.stats?.items || []), { value: "100%", label: "新標籤", description: "描述文字" }];
  updateServicePageSection(pageKey, pageData, "stats", { ...pageData.stats, items: newItems }, formData, updateFormSection);
}

function removeStatItem(pageKey: string, pageData: any, idx: number, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = (pageData.stats?.items || []).filter((_: any, i: number) => i !== idx);
  updateServicePageSection(pageKey, pageData, "stats", { ...pageData.stats, items: newItems }, formData, updateFormSection);
}

// Tech Stack 項目管理
function addTechItem(pageKey: string, pageData: any, name: string, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = [...(pageData.techStack?.items || []), { name, icon: "fa-code" }];
  updateServicePageSection(pageKey, pageData, "techStack", { ...pageData.techStack, items: newItems }, formData, updateFormSection);
}

function removeTechItem(pageKey: string, pageData: any, idx: number, formData: any, updateFormSection: (s: string, v: any) => void) {
  const newItems = (pageData.techStack?.items || []).filter((_: any, i: number) => i !== idx);
  updateServicePageSection(pageKey, pageData, "techStack", { ...pageData.techStack, items: newItems }, formData, updateFormSection);
}

// 添加項目輸入組件
function AddItemInput({ onAdd, placeholder }: { onAdd: (v: string) => void; placeholder: string }) {
  const [value, setValue] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };
  return (
    <div className="mt-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
      />
    </div>
  );
}

function SectionEditor({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onSave}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-save"></i>
          <span>保存</span>
        </button>
      </div>
      {children}
    </div>
  );
}

function FormInput({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors resize-none"
      />
    </div>
  );
}

function FormCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}
