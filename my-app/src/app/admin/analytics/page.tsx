"use client";

import { useState, useEffect } from "react";
import { getAnalyticsDashboard, getRealtimeVisitors } from "@/lib/api";

interface DashboardStats {
  today: {
    visitors: number;
    pageViews: number;
  };
  yesterday: {
    visitors: number;
    pageViews: number;
  };
  trends: {
    visitorsChange: number;
    pageViewsChange: number;
  };
  devices: Record<string, number>;
  browsers: Record<string, number>;
  topPages: Array<{ path: string; count: number }>;
}



interface RealtimeData {
  count: number;
  visitors: Array<{
    sessionId: string;
    device: string;
    browser: string;
    currentPage: string;
    lastActivity: string;
  }>;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
    // Refresh realtime data every 30 seconds
    const interval = setInterval(() => {
      loadRealtimeData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashboardData, realtimeData] = await Promise.all([
        getAnalyticsDashboard(),
        getRealtimeVisitors(),
      ]);
      setStats(dashboardData);
      setRealtime(realtimeData);
    } catch (e) {
      console.error("Failed to load analytics:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const data = await getRealtimeVisitors();
      setRealtime(data);
    } catch (e) {
      console.error("Failed to load realtime data:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">數據分析</h1>
          <p className="text-gray-500 mt-1">實時監控網站訪問情況</p>
        </div>
        <button
          onClick={loadData}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-sync-alt"></i>
          <span>刷新數據</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b">
          {[
            { id: "overview", label: "總覽", icon: "fa-chart-pie" },
            { id: "realtime", label: "實時", icon: "fa-bolt" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-yellow-600 border-b-2 border-yellow-400"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  title="今日訪客"
                  value={stats.today.visitors}
                  change={stats.trends.visitorsChange}
                  icon="fa-users"
                  color="bg-blue-500"
                />
                <MetricCard
                  title="今日瀏覽"
                  value={stats.today.pageViews}
                  change={stats.trends.pageViewsChange}
                  icon="fa-eye"
                  color="bg-green-500"
                />
                <MetricCard
                  title="昨日訪客"
                  value={stats.yesterday.visitors}
                  icon="fa-calendar-day"
                  color="bg-purple-500"
                />
                <MetricCard
                  title="昨日瀏覽"
                  value={stats.yesterday.pageViews}
                  icon="fa-chart-line"
                  color="bg-orange-500"
                />
              </div>

              {/* Device & Browser Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Device Distribution */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-mobile-alt mr-2 text-blue-500"></i>
                    設備分佈
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.devices || {}).map(([device, count]) => (
                      <div key={device} className="flex items-center">
                        <span className="w-20 text-sm text-gray-600 capitalize">{device}</span>
                        <div className="flex-1 mx-3">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${(count / Object.values(stats.devices).reduce((a, b) => a + b, 0)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browser Distribution */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-globe mr-2 text-green-500"></i>
                    瀏覽器分佈
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.browsers || {}).map(([browser, count]) => (
                      <div key={browser} className="flex items-center">
                        <span className="w-20 text-sm text-gray-600">{browser}</span>
                        <div className="flex-1 mx-3">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${(count / Object.values(stats.browsers).reduce((a, b) => a + b, 0)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-fire mr-2 text-orange-500"></i>
                  熱門頁面
                </h3>
                <div className="space-y-2">
                  {stats.topPages?.map((page, index) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-900 font-medium">{page.path}</span>
                      </div>
                      <span className="text-gray-500">{page.count} 次瀏覽</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Realtime Tab */}
          {activeTab === "realtime" && realtime && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">當前在線用戶</p>
                    <p className="text-4xl font-bold">{realtime.count}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="fas fa-bolt text-3xl"></i>
                  </div>
                </div>
                <p className="text-green-100 text-sm mt-2">
                  <i className="fas fa-sync-alt mr-1"></i>
                  每 30 秒自動更新
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">活動訪客</h3>
                {realtime.visitors?.length > 0 ? (
                  <div className="space-y-3">
                    {realtime.visitors.map((visitor) => (
                      <div
                        key={visitor.sessionId}
                        className="flex items-center justify-between p-4 bg-white rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i
                              className={`fas ${
                                visitor.device === "mobile"
                                  ? "fa-mobile-alt"
                                  : visitor.device === "tablet"
                                  ? "fa-tablet-alt"
                                  : "fa-desktop"
                              } text-blue-500`}
                            ></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{visitor.browser}</p>
                            <p className="text-sm text-gray-500">{visitor.device}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{visitor.currentPage}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(visitor.lastActivity).toLocaleTimeString("zh-HK")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <i className="fas fa-user-slash text-4xl mb-3"></i>
                    <p>當前無活動訪客</p>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: number;
  change?: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        {change !== undefined && (
          <span
            className={`text-sm font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <i className={`fas fa-arrow-${change >= 0 ? "up" : "down"} mr-1`}></i>
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}


