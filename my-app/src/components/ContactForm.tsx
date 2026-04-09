"use client";

import { useState } from "react";
import { submitInquiryWithWhatsAppFallback } from "@/lib/api";
import { useCMS } from "@/context/CMSContext";

export default function ContactForm() {
  const { cmsData } = useCMS();
  
  // Get form data from CMS with default values
  const form = cmsData?.contact?.form;
  
  const nameLabel = form?.nameLabel ?? "姓名 *";
  const namePlaceholder = form?.namePlaceholder ?? "請輸入您的姓名";
  const phoneLabel = form?.phoneLabel ?? "聯繫電話 *";
  const phonePlaceholder = form?.phonePlaceholder ?? "例如: 9123 4567";
  const emailLabel = form?.emailLabel ?? "電子郵箱";
  const emailPlaceholder = form?.emailPlaceholder ?? "請輸入您的電郵地址";
  const serviceLabel = form?.serviceLabel ?? "感興趣的服務";
  const servicePlaceholder = form?.servicePlaceholder ?? "請選擇服務項目";
  const serviceOptions = form?.serviceOptions ?? ["網站設計", "SEO優化", "內容營銷", "線下推廣", "KOL推廣", "包裝設計"];
  const messageLabel = form?.messageLabel ?? "留言內容";
  const messagePlaceholder = form?.messagePlaceholder ?? "請描述您的需求...";
  const submitButton = form?.submitButton ?? "通過 WhatsApp 發送查詢";
  const submittingText = form?.submittingText ?? "提交中...";
  const successTitle = form?.successTitle ?? "提交成功！";
  const successMessage = form?.successMessage ?? "我們已通過 WhatsApp 收到您的查詢，將盡快與您聯繫。";
  const successButton = form?.successButton ?? "直接 WhatsApp 我們";
  const footnote = form?.footnote ?? "點擊提交後將自動打開 WhatsApp，您的查詢信息將發送給我們的客服團隊";
  const errorMessage = form?.errorMessage ?? "提交失敗";
  const errorDetail = form?.errorDetail ?? "提交失敗，請直接通過 WhatsApp 聯繫我們: 5276 8052";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      console.error(`${errorMessage}:`, error);
      alert(errorDetail);
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
        <h3 className="text-xl font-bold text-gray-900 mb-2">{successTitle}</h3>
        <p className="text-gray-600 mb-4">
          {successMessage}
        </p>
        <a
          href="https://wa.me/85252768052"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <i className="fab fa-whatsapp"></i>
          <span>{successButton}</span>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 姓名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {nameLabel}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={namePlaceholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* 電話 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {phoneLabel}
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder={phonePlaceholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* 電郵 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {emailLabel}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={emailPlaceholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
        />
      </div>

      {/* 服務項目 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {serviceLabel}
        </label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-white"
        >
          <option value="">{servicePlaceholder}</option>
          {serviceOptions.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* 留言 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messageLabel}
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder={messagePlaceholder}
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
            <span>{submittingText}</span>
          </>
        ) : (
          <>
            <i className="fab fa-whatsapp"></i>
            <span>{submitButton}</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        {footnote}
      </p>
    </form>
  );
}
