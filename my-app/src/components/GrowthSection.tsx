"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GrowthSection() {
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
            stagger: 0.12,
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

  const strategies = [
    {
      icon: "fa-search",
      title: "SEO & 內容行銷",
      description: "提升品牌搜尋能見度，讓你的內容在正確的時間出現在正確的人面前。",
    },
    {
      icon: "fa-hashtag",
      title: "社交媒體行銷",
      description: "結合創意與分析，放大品牌聲量，吸引高互動的潛在客戶。",
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
            <p className="text-yellow-500 font-semibold text-lg mb-3">Growth Marketing</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              什麼是成長營銷？
            </h2>
            <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          {/* Intro Content */}
          <div className="max-w-4xl mx-auto text-center mb-16 animate-item">
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
              在 Big Bang Marketing，我們相信行銷不只是曝光與點擊，更是一場關於「增長」的實驗。
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Growth Marketing 成長營銷有別於傳統行銷模式 —— 我們不單追求短期的廣告成效，而是以
              <span className="font-semibold text-yellow-500">企業的整體增長</span>
              為核心，從潛在客戶開發到轉換與留存，構建出可持續的增長引擎。
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mb-20 animate-item">
            <a
              href="https://wa.me/85251164453"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              成為行業第一
              <i className="fas fa-trophy ml-2"></i>
            </a>
          </div>

          {/* Strategies Section */}
          <div className="animate-item">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              我們怎樣推動增長？
            </h3>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              每個品牌都擁有獨特的DNA，Big Bang 會根據企業階段與市場環境，制定專屬的成長策略，並透過實驗與數據驗證持續優化：
            </p>

            {/* Strategies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  className="flex items-start bg-gray-50 rounded-xl p-6 border border-gray-100"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mr-5">
                    <i className={`fas ${strategy.icon} text-gray-900 text-xl`}></i>
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
