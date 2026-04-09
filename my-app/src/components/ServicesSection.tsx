"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCMS } from "@/context/CMSContext";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { cmsData } = useCMS();

  // Default services data
  const defaultServices = {
    enabled: true,
    sectionTagline: "我們的專業服務",
    sectionTitle: "服務項目",
    sectionDescription: "提供全方位的數碼營銷解決方案，協助您的品牌在競爭激烈的市場中脫穎而出",
    items: [
      {
        id: "seo",
        title: "SEO",
        subtitle: "搜尋引擎優化",
        description: "專業的SEO服務，助您的網站在Google搜尋結果中脫穎而出，提升自然流量。",
        icon: "search",
        link: "/seo",
        enabled: true,
      },
      {
        id: "content-marketing",
        title: "內容營銷",
        subtitle: "Content Marketing",
        description: "創作有價值的內容，吸引並留住您的目標受眾，建立品牌權威性。",
        icon: "pen-nib",
        link: "/content-marketing",
        enabled: true,
      },
      {
        id: "offline-promotion",
        title: "線下推廣",
        subtitle: "Offline Promotion",
        description: "創造難忘的線下體驗，讓品牌與客戶建立真實連結，提升品牌認知。",
        icon: "calendar-alt",
        link: "/offline-promotion",
        enabled: true,
      },
      {
        id: "kol-promotion",
        title: "KOL推廣",
        subtitle: "KOL Promotion",
        description: "連結合適的意見領袖，讓品牌聲音傳遍每個角落，擴大影響力。",
        icon: "users",
        link: "/kol-promotion",
        enabled: true,
      },
      {
        id: "web-design",
        title: "網頁設計",
        subtitle: "Web Design",
        description: "專業的網站設計與開發服務，打造具有吸引力且功能完善的網站。",
        icon: "laptop-code",
        link: "/web-design",
        enabled: true,
      },
      {
        id: "packaging-design",
        title: "包裝 / poster設計",
        subtitle: "Packaging Design",
        description: "讓產品在貨架上脫穎而出，創造難忘的開箱體驗，提升品牌價值。",
        icon: "paint-brush",
        link: "/packaging-design",
        enabled: true,
      },
    ],
    readMoreText: "了解更多",
  };

  // Get services data from CMS or use defaults
  const services = cmsData?.services || defaultServices;

  // Filter enabled items
  const enabledItems = services.items?.filter((item: {enabled: boolean}) => item.enabled) || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll(".animate-item");
      if (elements) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Don't render if section is disabled
  if (!services.enabled) return null;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 md:py-28 bg-gray-50 text-gray-900"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-item">
          <p className="text-yellow-500 font-semibold text-lg mb-3">
            {services.sectionTagline}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {services.sectionTitle}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {services.sectionDescription}
          </p>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enabledItems.map((service: {id: string, title: string, subtitle: string, description: string, icon: string, link: string}, index: number) => (
            <a
              key={service.id || index}
              href={service.link}
              className="animate-item group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-400 h-full block"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className={`fas fa-${service.icon} text-gray-900 text-2xl`}></i>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-1">{service.title}</h3>
              <p className="text-yellow-500 text-sm font-medium mb-4">
                {service.subtitle}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>

              {/* Arrow indicator */}
              <div className="mt-6 flex items-center text-yellow-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-sm">{services.readMoreText}</span>
                <i className="fas fa-arrow-right ml-2 text-sm group-hover:translate-x-1 transition-transform"></i>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
