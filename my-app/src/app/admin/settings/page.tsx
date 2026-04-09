"use client";

import { useState, useEffect } from "react";
import { safeLocalStorage } from "@/lib/storage";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteTitle: "Big Bang Marketing",
    siteDescription: "專業的市場推廣及市場策劃公司",
    contactEmail: "info@bigbangmarketing.hk",
    contactPhone: "3987 1086",
    contactWhatsApp: "5276 8052",
    contactAddress: "Room 2301 B3-B4, 23/F, Nan Fung Centre, 264-298 Castle Peak Road, Tsuen Wan, N.T., Hong Kong",
    facebookUrl: "https://www.facebook.com/bigbangmarketing",
    instagramUrl: "https://www.instagram.com/bigbangmarketing.hk",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const savedSettings = safeLocalStorage.getItem("bigbang_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      safeLocalStorage.setItem("bigbang_settings", JSON.stringify(settings));
      setIsSaving(false);
      setSaveMessage("設置已保存");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 500);
  };

  const handleExportAll = () => {
    const allData = {
      cases: JSON.parse(safeLocalStorage.getItem("bigbang_cases") || "[]"),
      media: JSON.parse(safeLocalStorage.getItem("bigbang_media") || "[]"),
      settings: JSON.parse(safeLocalStorage.getItem("bigbang_settings") || "{}"),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bigbang-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm("警告：此操作將清除所有本地數據，包括案例、媒體和設置。確定要繼續嗎？")) {
      safeLocalStorage.removeItem("bigbang_cases");
      safeLocalStorage.removeItem("bigbang_media");
      safeLocalStorage.removeItem("bigbang_settings");
      safeLocalStorage.removeItem("bigbang_last_updated");
      alert("所有數據已清除，頁面將刷新");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系統設置</h1>
        <p className="text-gray-500 mt-1">管理網站的基本信息和系統設置</p>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-200">網站信息</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              網站標題
            </label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              網站描述
            </label>
            <input
              type="text"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-200 mt-8">聯繫信息</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電郵地址
            </label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電話號碼
            </label>
            <div className="relative">
              <i className="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp 號碼
            </label>
            <div className="relative">
              <i className="fab fa-whatsapp absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              地址
            </label>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-4 top-4 text-gray-400"></i>
              <textarea
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                rows={3}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-200 mt-8">社交媒體</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook 鏈接
            </label>
            <div className="relative">
              <i className="fab fa-facebook absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram 鏈接
            </label>
            <div className="relative">
              <i className="fab fa-instagram absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
          <div>
            {saveMessage && (
              <span className="text-green-600 flex items-center space-x-1">
                <i className="fas fa-check-circle"></i>
                <span>{saveMessage}</span>
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>保存中...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>保存設置</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-200">數據管理</h2>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">導出所有數據</h3>
              <p className="text-sm text-gray-500">將所有案例、媒體和設置導出為 JSON 文件</p>
            </div>
            <button
              onClick={handleExportAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <i className="fas fa-download"></i>
              <span>導出備份</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
            <div>
              <h3 className="font-medium text-red-900">清除所有數據</h3>
              <p className="text-sm text-red-500">此操作將刪除所有本地存儲的數據，無法撤銷</p>
            </div>
            <button
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <i className="fas fa-trash"></i>
              <span>清除數據</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">系統信息</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">系統版本</p>
            <p className="font-medium text-gray-900">v1.0.0</p>
          </div>
          <div>
            <p className="text-gray-500">存儲類型</p>
            <p className="font-medium text-gray-900">LocalStorage</p>
          </div>
          <div>
            <p className="text-gray-500">案例數量</p>
            <p className="font-medium text-gray-900">
              {JSON.parse(safeLocalStorage.getItem("bigbang_cases") || "[]").length} 個
            </p>
          </div>
          <div>
            <p className="text-gray-500">媒體文件</p>
            <p className="font-medium text-gray-900">
              {JSON.parse(safeLocalStorage.getItem("bigbang_media") || "[]").length} 個
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
