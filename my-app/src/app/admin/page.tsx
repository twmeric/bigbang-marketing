"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCMS } from "@/context/CMSContext";
import { safeLocalStorage } from "@/lib/storage";

export default function AdminDashboard() {
  const { cmsData, exportData, deploy, isDeploying } = useCMS();
  const [stats, setStats] = useState({
    totalCases: 0,
    totalMedia: 0,
    lastUpdated: "",
  });

  useEffect(() => {
    // Load stats from CMS data and localStorage
    const savedMedia = safeLocalStorage.getItem("bigbang_media");
    const lastUpdated = safeLocalStorage.getItem("bigbang_last_updated");
    
    setStats({
      totalCases: cmsData.cases?.items?.length || 0,
      totalMedia: savedMedia ? JSON.parse(savedMedia).length : 6,
      lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleString("zh-HK") : new Date().toLocaleString("zh-HK"),
    });
  }, [cmsData]);

  const quickActions = [
    { icon: "fa-plus-circle", label: "添加案例", href: "/admin/cases", color: "bg-blue-500" },
    { icon: "fa-images", label: "內容管理", href: "/admin/content", color: "bg-green-500" },
    { icon: "fa-rocket", label: isDeploying ? "部署中..." : "一鍵部署", href: "#", color: "bg-red-500", onClick: deploy, disabled: isDeploying },
    { icon: "fa-download", label: "導出數據", href: "#", color: "bg-orange-500", onClick: handleExport },
  ];

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bigbang-cms-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-gray-900">
        <h1 className="text-3xl font-bold mb-2">歡迎回來，管理員！</h1>
        <p className="text-gray-800">這裡是 Big Bang Marketing 的後台管理中心。使用新的內容管理系統，您可以編輯網站的所有內容，包括首頁、服務、案例和聯繫信息。</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon="fa-briefcase"
          label="總案例數"
          value={stats.totalCases.toString()}
          trend="CMS 管理"
          color="bg-blue-500"
        />
        <StatCard
          icon="fa-images"
          label="媒體文件"
          value={stats.totalMedia.toString()}
          trend="圖片資源"
          color="bg-green-500"
        />
        <StatCard
          icon="fa-clock"
          label="最後更新"
          value={stats.lastUpdated.split(" ")[0]}
          trend={stats.lastUpdated}
          color="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionButton key={index} {...action} />
          ))}
        </div>
      </div>

      {/* CMS Features */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">內容管理功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="fa-home"
            title="首頁 Hero"
            description="編輯主標題、副標題、描述和背景圖片"
            href="/admin/content"
          />
          <FeatureCard
            icon="fa-info-circle"
            title="關於我們"
            description="修改公司介紹和特色列表"
            href="/admin/content"
          />
          <FeatureCard
            icon="fa-briefcase"
            title="服務項目"
            description="添加、編輯或刪除服務卡片"
            href="/admin/content"
          />
          <FeatureCard
            icon="fa-image"
            title="成功案例"
            description="管理案例展示，包括圖片和描述"
            href="/admin/content"
          />
          <FeatureCard
            icon="fa-shoe-prints"
            title="頁腳信息"
            description="更新聯繫方式、地址和版權信息"
            href="/admin/content"
          />
          <FeatureCard
            icon="fa-file-export"
            title="導入/導出"
            description="備份和恢復所有網站數據"
            href="/admin/content"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">最近活動</h2>
          <Link
            href="/admin/content"
            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
          >
            管理內容 →
          </Link>
        </div>
        
        <div className="space-y-4">
          <ActivityItem
            icon="fa-cog"
            text="CMS 系統已初始化"
            time="剛剛"
            color="bg-yellow-100 text-yellow-600"
          />
          <ActivityItem
            icon="fa-check"
            text="內容管理功能就緒"
            time="剛剛"
            color="bg-green-100 text-green-600"
          />
          <ActivityItem
            icon="fa-image"
            text="案例數據已加載"
            time="剛剛"
            color="bg-blue-100 text-blue-600"
          />
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">使用說明</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <i className="fas fa-info-circle text-yellow-500 mt-0.5"></i>
            <p>點擊「內容管理」進入編輯界面，所有更改會自動保存到瀏覽器。</p>
          </div>
          <div className="flex items-start space-x-3">
            <i className="fas fa-download text-yellow-500 mt-0.5"></i>
            <p>定期使用「導出」功能備份數據，導入功能可恢復之前的備份。</p>
          </div>
          <div className="flex items-start space-x-3">
            <i className="fas fa-image text-yellow-500 mt-0.5"></i>
            <p>圖片路徑需要是已上傳到網站的圖片 URL。</p>
          </div>
          <div className="flex items-start space-x-3">
            <i className="fas fa-globe text-yellow-500 mt-0.5"></i>
            <p>要將更改部署到網站，請導出 JSON 並交給開發人員更新。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  trend,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center space-x-4">
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-white text-xl`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{trend}</p>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-gray-50 hover:bg-yellow-50 border border-gray-100 hover:border-yellow-200 rounded-xl p-4 transition-colors cursor-pointer">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-gray-900">
            <i className={`fas ${icon}`}></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Quick Action Button Component
function QuickActionButton({
  icon,
  label,
  href,
  color,
  external,
  onClick,
  disabled,
}: {
  icon: string;
  label: string;
  href: string;
  color: string;
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const content = (
    <div className={`${color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'} text-white rounded-xl p-4 flex flex-col items-center justify-center space-y-2 transition-opacity`}>
      <i className={`fas ${icon} text-2xl ${disabled ? 'fa-spin' : ''}`}></i>
      <span className="font-medium text-sm">{label}</span>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick} disabled={disabled} className="block w-full">{content}</button>;
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return <Link href={href} className="block">{content}</Link>;
}

// Activity Item Component
function ActivityItem({
  icon,
  text,
  time,
  color,
}: {
  icon: string;
  text: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-medium">{text}</p>
        <p className="text-gray-400 text-sm">{time}</p>
      </div>
    </div>
  );
}
