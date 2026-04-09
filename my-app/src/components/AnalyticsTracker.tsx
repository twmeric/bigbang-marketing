"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    // Dynamic import to ensure it only runs on client
    import("@/lib/analytics").then(({ initAnalytics }) => {
      initAnalytics();
    }).catch(() => {
      // Silently fail
    });
  }, []);

  return null;
}
