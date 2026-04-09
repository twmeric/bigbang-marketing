"use client";

import { useState } from "react";
import { submitInquiryWithWhatsAppFallback } from "@/lib/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    { value: "", label: "請選擇服務項目" },
    { value: "網站設計", label: "網站設計與開發" },
    { value: "SEO優化", label: "SEO 搜尋引擎優化" },
    { value: "內容營銷", label: "內容營銷策略" },
    { value: "線下推廣", label: "線下推廣活動" },
    { value: "KOL推廣", label: "KOL / 網紅推廣" },
    { value: "包裝設計", label: "包裝設計" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 使用 WhatsApp Deep Link 方式發送
      submitInquiryWithWhatsAppFallback({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        service: formData.service || undefined,
        message: formData.message || undefined,
        adminPhone: "85252768052",
      });

      setIsSubmitted(true);
      setFormData({ name: "", phone: "", email: "", service: "", message: "" });
    } catch (error) {
      console.error("提交失敗:", error);
      alert("提交失敗，請直接通過 WhatsApp 聯繫我們: 5276 8052");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-white text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">提交成功！</h3>
        <p className="text-gray-600 mb-4">
          我們已通過 WhatsApp 收到您的查詢，將盡快與您聯繫。
        </p>
        <a
          href="https://wa.me/85252768052"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <i className="fab fa-whatsapp"></i>
          <span>直接 WhatsApp 我們</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 姓名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="請輸入您的姓名"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* 電話 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          聯繫電話 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="例如: 9123 4567"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* 電郵 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          電子郵箱
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="請輸入您的電郵地址"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* 服務項目 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          感興趣的服務
        </label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-white"
        >
          {services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* 留言 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          留言內容
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="請描述您的需求..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors resize-none"
        />
      </div>

      {/* 提交按鈕 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            <span>提交中...</span>
          </>
        ) : (
          <>
            <i className="fab fa-whatsapp"></i>
            <span>通過 WhatsApp 發送查詢</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        點擊提交後將自動打開 WhatsApp，您的查詢信息將發送給我們的客服團隊
      </p>
    </form>
  );
}
