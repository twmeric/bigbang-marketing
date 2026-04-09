"use client";

import { useState, useEffect } from "react";
import { getInquiries, updateInquiry, openWhatsApp } from "@/lib/api";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
  updatedAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied" | "archived">("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await getInquiries();
      // Handle both array response and { success, data } response
      const data = Array.isArray(response) ? response : (response?.data || []);
      setInquiries(data);
    } catch (e) {
      console.error("Failed to load inquiries:", e);
      setInquiries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Inquiry["status"]) => {
    try {
      await updateInquiry(id, { status });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status, updatedAt: new Date().toISOString() } : inq))
      );
    } catch (e) {
      console.error("Failed to update inquiry:", e);
    }
  };

  const handleWhatsAppClick = (inquiry: Inquiry) => {
    const message = [
      "【Big Bang Marketing】新詢盤通知",
      "",
      "*客戶姓名:* " + inquiry.name,
      "*聯繫電話:* " + inquiry.phone,
      inquiry.email ? "*電子郵箱:* " + inquiry.email : "",
      inquiry.service ? "*諮詢項目:* " + inquiry.service : "",
      "",
      "*留言內容:*",
      inquiry.message || "無留言",
      "",
      "---",
      "👉 查看詳情: bigbang.jkdcoding.com/admin/inquiries",
    ]
      .filter(Boolean)
      .join("\n");

    openWhatsApp("85252768052", message);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === "all") return true;
    return inq.status === filter;
  });

  const stats = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    read: inquiries.filter((i) => i.status === "read").length,
    replied: inquiries.filter((i) => i.status === "replied").length,
    archived: inquiries.filter((i) => i.status === "archived").length,
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">詢盤管理</h1>
          <p className="text-gray-500 mt-1">管理客戶諮詢和聯繫</p>
        </div>
        <button
          onClick={loadInquiries}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <i className="fas fa-sync-alt"></i>
          <span>刷新</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: "all", label: "全部", count: stats.all, color: "bg-gray-500" },
          { key: "new", label: "未讀", count: stats.new, color: "bg-red-500" },
          { key: "read", label: "已讀", count: stats.read, color: "bg-blue-500" },
          { key: "replied", label: "已回覆", count: stats.replied, color: "bg-green-500" },
          { key: "archived", label: "已歸檔", count: stats.archived, color: "bg-gray-400" },
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setFilter(stat.key as any)}
            className={`p-4 rounded-xl text-left transition-colors ${
              filter === stat.key ? "ring-2 ring-yellow-400 bg-white" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className={`w-3 h-3 ${stat.color} rounded-full mb-2`}></div>
            <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredInquiries.length > 0 ? (
          <div className="divide-y">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  inquiry.status === "new" ? "bg-red-50/50" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {inquiry.status === "new" && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                          未讀
                        </span>
                      )}
                      <h3 className="font-bold text-lg text-gray-900">{inquiry.name}</h3>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600">{inquiry.service || "未指定服務"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <i className="fas fa-phone text-gray-400"></i>
                        {inquiry.phone}
                      </span>
                      {inquiry.email && (
                        <span className="flex items-center gap-1">
                          <i className="fas fa-envelope text-gray-400"></i>
                          {inquiry.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <i className="fas fa-clock text-gray-400"></i>
                        {new Date(inquiry.createdAt).toLocaleString("zh-HK")}
                      </span>
                    </div>
                    {inquiry.message && (
                      <p className="mt-3 text-gray-700 bg-gray-100 p-3 rounded-lg">{inquiry.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* WhatsApp Button */}
                    <button
                      onClick={() => handleWhatsAppClick(inquiry)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <i className="fab fa-whatsapp"></i>
                      <span className="hidden md:inline">WhatsApp</span>
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value as Inquiry["status"])}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="new">未讀</option>
                      <option value="read">已讀</option>
                      <option value="replied">已回覆</option>
                      <option value="archived">已歸檔</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <i className="fas fa-inbox text-5xl mb-4"></i>
            <p className="text-lg">暫無詢盤</p>
            <p className="text-sm">當前篩選條件下沒有詢盤記錄</p>
          </div>
        )}
      </div>
    </div>
  );
}
