// Big Bang CMS API Client
// 基于 E-Corp 架构 - 完全云端，无 localStorage

const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "";

// Helper: Make API request
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// ===== CMS API =====

export async function getCMSData() {
  return apiRequest("/api/cms/data");
}

export async function updateCMSData(data: any) {
  return apiRequest("/api/cms/data", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resetCMSData() {
  return apiRequest("/api/cms/reset", { method: "POST" });
}

export async function deployWebsite(reason?: string) {
  const url = `${API_BASE_URL}/api/cms/deploy`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
  
  // Handle 204 No Content (success)
  if (response.status === 204) {
    return { success: true, message: "Deployment triggered" };
  }
  
  // Handle error responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { success: false, error: error.error || `API Error: ${response.status}` };
  }
  
  // Handle JSON responses
  return response.json();
}

// ===== Inquiry API =====

export async function getInquiries() {
  return apiRequest("/api/inquiries");
}

export async function createInquiry(inquiry: {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
}) {
  return apiRequest("/api/contact", {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}

export async function saveInquiry(inquiry: {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
}) {
  return apiRequest("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}

export async function updateInquiry(id: string, updates: any) {
  return apiRequest("/api/inquiries", {
    method: "PUT",
    body: JSON.stringify({ id, ...updates }),
  });
}

// ===== Analytics API =====

export async function trackPageView(data: {
  page: string;
  referrer?: string;
  userAgent?: string;
  sessionId: string;
}) {
  // Fire and forget
  fetch(`${API_BASE_URL}/api/analytics/pageview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {});
}

export async function trackVisit(data: {
  sessionId: string;
  path: string;
  referrer?: string;
  userAgent?: string;
}) {
  fetch(`${API_BASE_URL}/api/analytics/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {});
}

export async function getAnalyticsDashboard() {
  return apiRequest("/api/analytics/dashboard");
}

export async function getRealtimeVisitors() {
  return apiRequest("/api/analytics/realtime");
}

// ===== WhatsApp Integration =====

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function openWhatsApp(phone: string, message: string) {
  if (typeof window === "undefined") return;
  const link = generateWhatsAppLink(phone, message);
  window.open(link, "_blank");
}

// Submit inquiry and open WhatsApp (备用方案，当 API 不可用时)
export function submitInquiryWithWhatsAppFallback(inquiry: {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  adminPhone?: string;
}) {
  // 生成 WhatsApp 消息
  const whatsappMessage = [
    "【Big Bang Marketing】新询盘通知",
    "",
    "*客户姓名:* " + inquiry.name,
    "*联系电话:* " + inquiry.phone,
    inquiry.email ? "*电子邮箱:* " + inquiry.email : "",
    inquiry.service ? "*咨询项目:* " + inquiry.service : "",
    "",
    "*留言内容:*",
    inquiry.message || "无留言",
    "",
    "---",
    "👉 查看详情: bigbang.jkdcoding.com/admin/inquiries",
  ].filter(Boolean).join("\n");
  
  // 打开 WhatsApp
  if (inquiry.adminPhone) {
    openWhatsApp(inquiry.adminPhone, whatsappMessage);
  }
  
  return { success: true, whatsappLink: generateWhatsAppLink(inquiry.adminPhone || "", whatsappMessage) };
}
