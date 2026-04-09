"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import defaultCMSData from "../data/cms.json";
import { 
  getCMSData, 
  updateCMSData as apiUpdateCMSData, 
  resetCMSData as apiResetCMSData,
  deployWebsite
} from "@/lib/api";

interface CMSContextType {
  cmsData: typeof defaultCMSData;
  isLoading: boolean;
  isSaving: boolean;
  isDeploying: boolean;
  error: string | null;
  updateCMSData: (newData: Partial<typeof defaultCMSData>) => Promise<void>;
  updateSection: (section: string, data: any) => Promise<void>;
  resetToDefault: () => Promise<void>;
  deploy: () => Promise<void>;
  exportData: () => string;
  importData: (jsonString: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [cmsData, setCmsData] = useState(defaultCMSData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCMSData();
      if (data) {
        setCmsData(data);
      }
    } catch (e) {
      console.error("Failed to load CMS data:", e);
      setError("无法连接到服务器，使用默认数据");
      setCmsData(defaultCMSData);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const updateCMSData = async (newData: Partial<typeof defaultCMSData>) => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Update local state immediately for responsive UI
      const updatedData = { ...cmsData, ...newData };
      setCmsData(updatedData);
      
      // Sync to API
      await apiUpdateCMSData(newData);
    } catch (e) {
      console.error("Failed to update CMS data:", e);
      setError("保存到服务器失败");
      // Revert to server data
      await loadData();
    } finally {
      setIsSaving(false);
    }
  };

  const updateSection = async (section: string, data: any) => {
    const currentSection = cmsData[section as keyof typeof cmsData];
    const updatedSection = { ...currentSection, ...data };
    
    await updateCMSData({ [section]: updatedSection } as any);
  };

  const resetToDefault = async () => {
    if (!confirm("确定要重置所有内容为默认值吗？此操作无法撤销。")) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      await apiResetCMSData();
      setCmsData(defaultCMSData);
    } catch (e) {
      console.error("Failed to reset CMS data:", e);
      setError("重置失败");
    } finally {
      setIsSaving(false);
    }
  };

  const deploy = async () => {
    if (!confirm("确定要部署网站吗？这将触发 GitHub Actions 构建。")) {
      return;
    }
    
    setIsDeploying(true);
    
    try {
      const result = await deployWebsite("CMS update from admin");
      if (result.success) {
        alert("部署已触发！请等待几分钟后查看网站更新。");
      } else {
        let errorMsg = result.error || "部署失败";
        if (result.help) {
          errorMsg += "\n\n" + result.help;
        }
        if (result.setupGuide) {
          errorMsg += "\n\n" + result.setupGuide;
        }
        alert(errorMsg);
      }
    } catch (e: any) {
      console.error("Failed to deploy:", e);
      alert("部署触发失败：" + (e.message || "未知错误"));
    } finally {
      setIsDeploying(false);
    }
  };

  const exportData = () => {
    return JSON.stringify(cmsData, null, 2);
  };

  const importData = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      const mergedData = { ...defaultCMSData, ...parsed };
      setCmsData(mergedData);
      await apiUpdateCMSData(mergedData);
      return true;
    } catch (e) {
      console.error("Failed to import CMS data:", e);
      return false;
    }
  };

  return (
    <CMSContext.Provider
      value={{
        cmsData,
        isLoading,
        isSaving,
        isDeploying,
        error,
        updateCMSData,
        updateSection,
        resetToDefault,
        deploy,
        exportData,
        importData,
        refreshData,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}
