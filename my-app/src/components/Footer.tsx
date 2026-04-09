"use client";

import Image from "next/image";
import { useCMS } from "@/context/CMSContext";

export default function Footer() {
  const { cmsData } = useCMS();

  // CMS 驅動的 Footer 數據
  const footer = cmsData?.footer || {
    enabled: true,
    companyName: "Big Bang Marketing",
    companyDescription: "新創的全方位行銷公司，雲集來自不同領域的行銷專家，致力為客戶提供量身訂製的行銷解決方案。",
    services: [
      { name: "SEO優化", href: "/seo" },
      { name: "內容營銷", href: "/content-marketing" },
      { name: "網頁設計", href: "/web-design" },
      { name: "KOL推廣", href: "/kol-promotion" },
      { name: "線下推廣", href: "/offline-promotion" }
    ],
    company: [
      { name: "關於我們", href: "#about" },
      { name: "成功案例", href: "#cases" },
      { name: "成長營銷", href: "#growth" },
      { name: "常見問題", href: "#faq" }
    ],
    links: [
      { name: "隱私政策", href: "/privacy" },
      { name: "服務條款", href: "/terms" }
    ],
    copyright: "© 2024 Big Bang Marketing. All rights reserved.",
    social: {
      facebook: "https://facebook.com/bigbangmarketing",
      instagram: "https://instagram.com/bigbangmarketing",
      whatsapp: "https://wa.me/52768052"
    }
  };

  // CMS 驅動的聯絡數據
  const contact = cmsData?.contact || {
    phoneNumber: "3987 1086",
    whatsappNumber: "5276 8052",
    emailAddress: "info@bigbangmarketing.hk",
    address: "香港新界荃灣青山公路264-298號南豐中心23樓2301 B3-B4室"
  };

  if (!footer.enabled) return null;

  // 社交連結
  const socialLinks = [
    { icon: "fab fa-facebook-f", href: footer.social?.facebook || "https://facebook.com/bigbangmarketing", label: "Facebook" },
    { icon: "fab fa-instagram", href: footer.social?.instagram || "https://instagram.com/bigbangmarketing", label: "Instagram" },
    { icon: "fab fa-whatsapp", href: footer.social?.whatsapp || `https://wa.me/${contact.whatsappNumber?.replace(/\s/g, '') || '52768052'}`, label: "WhatsApp" },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt={footer.companyName || "Big Bang Marketing"}
                width={150}
                height={50}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {footer.companyDescription || "新創的全方位行銷公司，雲集來自不同領域的行銷專家，致力為客戶提供量身訂製的行銷解決方案。"}
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((link: {icon: string, href: string, label: string}, index: number) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-colors duration-300"
                  aria-label={link.label}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-lg font-bold mb-6">服務</h4>
            <ul className="space-y-3">
              {(footer.services || []).map((service: {name: string, href: string}, index: number) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-lg font-bold mb-6">公司</h4>
            <ul className="space-y-3">
              {(footer.company || []).map((item: {name: string, href: string}, index: number) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column - CMS 驅動 */}
          <div>
            <h4 className="text-lg font-bold mb-6">聯絡我們</h4>
            <ul className="space-y-4">
              <li className="flex items-center">
                <i className="fas fa-phone text-yellow-400 mr-3 w-5"></i>
                <a
                  href={`tel:+852${contact.phoneNumber?.replace(/\s/g, '') || '39871086'}`}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {contact.phoneNumber || "3987 1086"}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fab fa-whatsapp text-yellow-400 mr-3 w-5"></i>
                <a
                  href={`https://wa.me/${contact.whatsappNumber?.replace(/\s/g, '') || '52768052'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {contact.whatsappNumber || "5276 8052"}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-yellow-400 mr-3 w-5"></i>
                <a
                  href={`mailto:${contact.emailAddress || "info@bigbangmarketing.hk"}`}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {contact.emailAddress || "info@bigbangmarketing.hk"}
                </a>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-yellow-400 mt-1 mr-3 w-5"></i>
                <span className="text-gray-400 text-sm">
                  {contact.address || "香港新界荃灣青山公路264-298號南豐中心23樓2301 B3-B4室"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              {footer.copyright || "© 2024 Big Bang Marketing. All rights reserved."}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {(footer.links || []).map((link: {name: string, href: string}, index: number) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="text-gray-500 hover:text-yellow-400 text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
