"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCMS } from "@/context/CMSContext";

gsap.registerPlugin(ScrollTrigger);

// Icon mapping from CMS names to FontAwesome classes
const iconMap: Record<string, string> = {
  search: "fa-search",
  hashtag: "fa-hashtag",
  "chart-pie": "fa-chart-pie",
  robot: "fa-robot",
};

const defaultStrategies = [
  {
    icon: "fa-search",
    title: "SEO & 內容行銷",
    description:
      "提升品牌搜尋能見度，讓你的內容在正確的時間出現在正確的人面前。",
  },
  {
    icon: "fa-hashtag",
    title: "社交媒體行銷",
    description:
      "結合創意與分析，放大品牌聲量，吸引高互動的潛在客戶。",
  },
  {
    icon: "fa-chart-pie",
    title: "轉換率優化（CRO）",
    description: "以數據為導向，持續測試與改良，將流量轉化為真實收益。",
  },
  {
    icon: "fa-robot",
    title: "行銷自動化與AI應用",
    description: "以智慧工具自動化流程，讓行銷更快、更準、更有效。",
  },
];

const defaultGrowth = {
  enabled: true,
  sectionTagline: "Growth Marketing",
  sectionTitle: "什麼是成長營銷？",
  introParagraph1:
    "在 Big Bang Marketing，我們相信營銷不只是推廣產品，而是一場讓品牌「持續成長」的科學實驗。",
  introParagraph2:
    "Growth Marketing 成長營銷有別於傳統營銷 —— 我們不追求單次曝光或短期銷售，而是透過數據分析、A/B 測試與自動化行銷，從獲客、激活、留存到推薦，優化每個環節，創造可持續的增長飛輪。",
  ctaText: "成為行業第一",
  ctaLink: "mailto:info@bigbangmarketing.hk",
  strategiesTitle: "我們怎樣推動增長？",
  strategiesDescription:
    "每個品牌都擁有獨特的DNA，Big Bang 會根據您的業務目標與市場定位，制定最合適的增長策略，並通過數據與測試持續優化：",
  strategies: defaultStrategies,
};

export default function GrowthSection() {
  const { cmsData } = useCMS();
  const growth = cmsData?.growth || defaultGrowth;

  const sectionRef = useRef<HTMLDivElement>(null);

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
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Return null if section is disabled
  if (!growth?.enabled) return null;

  const strategies =
    growth.strategies?.map(
      (s: { icon: string; title: string; description: string }) => ({
        icon: iconMap[s.icon] || s.icon,
        title: s.title,
        description: s.description,
      })
    ) || defaultStrategies;

  return (
    <section
      id="growth"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white text-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-item">
            <p className="text-yellow-500 font-semibold text-lg mb-3">
              {growth.sectionTagline || defaultGrowth.sectionTagline}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {growth.sectionTitle || defaultGrowth.sectionTitle}
            </h2>
            <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-item">
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
              {growth.introParagraph1 || defaultGrowth.introParagraph1}
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              {(() => {
                const text =
                  growth.introParagraph2 || defaultGrowth.introParagraph2;
                const parts = text.split("持續成長");
                if (parts.length === 2) {
                  return (
                    <>
                      {parts[0]}
                      <span className="font-semibold text-yellow-500">
                        持續成長
                      </span>
                      {parts[1]}
                    </>
                  );
                }
                return text;
              })()}
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-20 animate-item">
            <a
              href={growth.ctaLink || defaultGrowth.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {growth.ctaText || defaultGrowth.ctaText}
              <i className="fas fa-trophy ml-2"></i>
            </a>
          </div>

          {/* Strategies */}
          <div className="animate-item">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              {growth.strategiesTitle || defaultGrowth.strategiesTitle}
            </h3>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {growth.strategiesDescription ||
                defaultGrowth.strategiesDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategies.map((strategy: {icon: string, title: string, description: string}, index: number) => (
                <div
                  key={index}
                  className="flex items-start bg-gray-50 rounded-xl p-6 border border-gray-100"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mr-5">
                    <i
                      className={`fas ${strategy.icon} text-gray-900 text-xl`}
                    ></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">
                      {strategy.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {strategy.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
