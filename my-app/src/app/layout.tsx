import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { CMSProvider } from "@/context/CMSContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import cmsData from "@/data/cms.json";

// 從 CMS 數據生成標題
const hero = cmsData?.hero || {
  titleLine1: "",
  titleLine2: "Expand Your Universe"
};

const pageTitle = hero.titleLine1 
  ? `Big Bang Marketing | ${hero.titleLine1}${hero.titleLine2 ? `. ${hero.titleLine2}` : ''}`
  : `Big Bang Marketing | ${hero.titleLine2 || 'Expand Your Universe'}`;

export const metadata: Metadata = {
  title: pageTitle,
  description: "Big Bang Marketing 是一間新創的全方位行銷公司，致力為客戶提供量身訂製的行銷解決方案。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <CMSProvider>
          <AnalyticsTracker />
          {children}
        </CMSProvider>
      </body>
    </html>
  );
}
