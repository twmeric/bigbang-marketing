"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { safeLocalStorage } from "@/lib/storage";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    const loginStatus = safeLocalStorage.getItem("bigbang_admin_logged_in");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    safeLocalStorage.removeItem("bigbang_admin_logged_in");
    setIsLoggedIn(false);
    router.push("/admin");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex admin-page">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-800 px-4">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <Image
                src="/jkdcoding-mascot.png"
                alt="JKDCoding"
                width={32}
                height={32}
                className="rounded-lg"
                priority
              />
              <span className="font-bold text-lg">Big Bang</span>
            </div>
          ) : (
            <Image
              src="/jkdcoding-mascot.png"
              alt="JKDCoding"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          <SidebarItem
            href="/admin"
            icon="fa-dashboard"
            label="儀表盤"
            isOpen={isSidebarOpen}
            isActive={activeMenu === "dashboard"}
            onClick={() => setActiveMenu("dashboard")}
          />
          <SidebarItem
            href="/admin/content"
            icon="fa-edit"
            label="內容管理"
            isOpen={isSidebarOpen}
            isActive={activeMenu === "content"}
            onClick={() => setActiveMenu("content")}
          />
          <SidebarItem
            href="/admin/inquiries"
            icon="fa-envelope"
            label="詢盤管理"
            isOpen={isSidebarOpen}
            isActive={activeMenu === "inquiries"}
            onClick={() => setActiveMenu("inquiries")}
          />
          <SidebarItem
            href="/admin/analytics"
            icon="fa-chart-line"
            label="數據分析"
            isOpen={isSidebarOpen}
            isActive={activeMenu === "analytics"}
            onClick={() => setActiveMenu("analytics")}
          />
          <SidebarItem
            href="/admin/media"
            icon="fa-images"
            label="媒體庫"
            isOpen={isSidebarOpen}
            isActive={activeMenu === "media"}
            onClick={() => setActiveMenu("media")}
          />
          <SidebarItem
            href="/admin/cases"
            icon="fa-briefcase"
            label="案例管理"
            isOpen={isSidebarOpen}
            isActive={activeMenu === "cases"}
            onClick={() => setActiveMenu("cases")}
          />
          <SidebarItem
            href="/admin/settings"
            icon="fa-cog"
            label="系統設置"
            isOpen={isSidebarOpen}
            isActive={activeMenu === "settings"}
            onClick={() => setActiveMenu("settings")}
          />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            {isSidebarOpen && <span>登出</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i className={`fas ${isSidebarOpen ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
          </button>

          <div className="flex items-center space-x-4">
            <a
              href="https://bigbang.jkdcoding.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-yellow-600 flex items-center space-x-1"
            >
              <i className="fas fa-external-link-alt"></i>
              <span>查看網站</span>
            </a>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gray-900 text-sm"></i>
              </div>
              <span className="text-sm font-medium text-gray-700">管理員</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({
  href,
  icon,
  label,
  isOpen,
  isActive,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-yellow-400 text-gray-900"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      } ${!isOpen && "justify-center"}`}
    >
      <i className={`fas ${icon} w-5 text-center`}></i>
      {isOpen && <span>{label}</span>}
    </Link>
  );
}

// Login Page Component with Logo
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin360") {
        safeLocalStorage.setItem("bigbang_admin_logged_in", "true");
        onLogin();
      } else {
        setError("用戶名或密碼錯誤");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 admin-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <Image
              src="/jkdcoding-mascot.png"
              alt="JKDCoding Logo"
              width={120}
              height={120}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-white mt-6">Big Bang</h1>
          <p className="text-gray-400 mt-2">後台管理系統</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">管理員登入</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-600">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">用戶名</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="請輸入用戶名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密碼</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  placeholder="請輸入密碼"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>登入中...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>登入</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2025 Big Bang Marketing. All rights reserved.
        </p>
      </div>
    </div>
  );
}


