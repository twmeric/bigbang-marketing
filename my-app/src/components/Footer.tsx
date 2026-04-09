"use client";

import Image from "next/image";
import { useCMS } from "@/context/CMSContext";

export default function Footer() {
  const { cmsData } = useCMS();

  // CMS 驅動的 Footer 數據
  const footer = cmsData.footer || {
    enabled: true,
    contact: {
      phone: "3987 1086",
      whatsapp: "5276 8052",
      email: "info@bigbangmarketing.hk",
      address: "Room 2301 B3-B4, 23/F, Nan Fung Centre, Tsuen Wan, Hong Kong",
      addressCn: "香港新界荃灣青山公路264-298號南豐中心23樓2301 B3-B4室"
    },
    copyright: "© 2024 Big Bang Marketing. All rights reserved.",
    social: {
      facebook: "https://facebook.com/bigbangmarketing",
      instagram: "https://instagram.com/bigbangmarketing"
    }
  };

  // CMS 驅動的服務列表
  const services = footer.services || [
    { name: "SEO優化", href: "/seo" },
    { name: "內容行銷", href: "/content-marketing" },
    { name: "網頁設計", href: "/web-design" },
    { name: "KOL推廣", href: "/kol-promotion" },
    { name: "線下推廣", href: "/offline-promotion" },
  ];

  // CMS 驅動的公司連結
  const company = footer.company || [
    { name: "關於我們", href: "#about" },
    { name: "成功案例", href: "#cases" },
    { name: "成長營銷", href: "#growth" },
    { name: "常見問題", href: "#faq" },
  ];

  // CMS 驅動的底部連結
  const footerLinks = footer.links || [
    { name: "隱私政策", href: "/privacy" },
    { name: "服務條款", href: "/terms" },
  ];

  // CMS 驅動的社交連結
  const socialLinks = footer.social ? [
    { icon: "fab fa-facebook-f", href: footer.social.facebook, label: "Facebook" },
    { icon: "fab fa-instagram", href: footer.social.instagram, label: "Instagram" },
    { icon: "fab fa-whatsapp", href: `https://wa.me/${footer.contact?.whatsapp?.replace(/\s/g, '') || '85252768052'}`, label: "WhatsApp" },
  ] : [
    { icon: "fab fa-facebook-f", href: "https://www.facebook.com/bigbangmarketing", label: "Facebook" },
    { icon: "fab fa-instagram", href: "https://www.instagram.com/bigbangmarketing.hk", label: "Instagram" },
    { icon: "fab fa-whatsapp", href: "https://wa.me/85252768052", label: "WhatsApp" },
  ];

  if (!footer.enabled) return null;

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src={cmsData.site?.logo || "/logo.png"}
                alt={cmsData.site?.name || "Big Bang Marketing"}
                width={150}
                height={50}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {cmsData.site?.description || "新創的全方位行銷公司，雲集來自不同領域的行銷專家，致力為客戶提供量身訂製的行銷解決方案。"}
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
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
              {services.map((service: {name: string, href: string}, index: number) => (
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
              {company.map((item: {name: string, href: string}, index: number) => (
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
                  href={`tel:+852${footer.contact?.phone?.replace(/\s/g, '')}`}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {footer.contact?.phone || "3987 1086"}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fab fa-whatsapp text-yellow-400 mr-3 w-5"></i>
                <a
                  href={`https://wa.me/${footer.contact?.whatsapp?.replace(/\s/g, '') || '85252768052'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {footer.contact?.whatsapp || "5276 8052"}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-yellow-400 mr-3 w-5"></i>
                <a
                  href={`mailto:${footer.contact?.email}`}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {footer.contact?.email || "info@bigbangmarketing.hk"}
                </a>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-yellow-400 mt-1 mr-3 w-5"></i>
                <span className="text-gray-400 text-sm">
                  {footer.contact?.address?.split(',').map((part: string, i: number) => (
                    <span key={i}>{part.trim()}<br /></span>
                  ))}
                  <span className="mt-1 block">
                    {footer.contact?.addressCn || "香港新界荃灣青山公路264-298號南豐中心23樓2301 B3-B4室"}
                  </span>
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
              {footerLinks.map((link: any, index: number) => (
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
