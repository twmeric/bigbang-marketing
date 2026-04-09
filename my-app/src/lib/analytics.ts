"use client";

import { trackVisit } from "./api";

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("bigbang_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("bigbang_session_id", sessionId);
  }
  return sessionId;
}

// Track page view
export function trackPageView(path?: string) {
  if (typeof window === "undefined") return;
  
  const sessionId = getSessionId();
  const currentPath = path || window.location.pathname;
  
  // Track via API
  trackVisit({
    sessionId,
    path: currentPath,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
  });
}

// Initialize analytics
export function initAnalytics() {
  if (typeof window === "undefined") return;
  
  // Track initial page view
  trackPageView();
  
  // Track on route change (for SPA navigation)
  let lastPath = window.location.pathname;
  
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackPageView(currentPath);
    }
  });
  
  observer.observe(document, { subtree: true, childList: true });
  
  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    observer.disconnect();
  });
}

// Get session stats
export function getSessionStats() {
  if (typeof window === "undefined") return null;
  
  return {
    sessionId: getSessionId(),
    startTime: sessionStorage.getItem("bigbang_session_start") || new Date().toISOString(),
  };
}
