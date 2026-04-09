"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCMS } from "@/context/CMSContext";

gsap.registerPlugin(ScrollTrigger);

// Default values for about section
const defaultAbout = {
  enabled: true,
  sectionTagline: "最適合您的市場推廣公司",
  sectionTitle: "關於我們",
  mainHeading: "Big Bang Marketing 是一間新創的全方位行銷公司",
  description: "雲集來自不同領域的行銷專家，致力為客戶提供量身訂製的行銷解決方案。我們的服務涵蓋多個行業，包括美容、眼鏡、僱傭中介、教育、零售等，無論線上還是線下，我們都能協助企業拓展市場，提升品牌曝光，增加業績，並與世界接軌。",
  features: [
    { icon: "chart-line", text: "最全面的成長營銷策略" },
    { icon: "users", text: "嵌入式營銷團隊，最理解您企業業務的營銷公司" },
    { icon: "award", text: "由多名具豐富營銷經驗的 Marketing專家主理" },
    { icon: "gem", text: "最全面、最有效、性價比最高的營銷方案" },
  ],
  ctaText: "成為行業第一",
  ctaLink: "mailto:info@bigbangmarketing.hk",
};

// Icon mapping from CMS icon names to FontAwesome classes
const iconMap: Record<string, string> = {
  "chart-line": "fa-chart-line",
  "users": "fa-users",
  "award": "fa-award",
  "gem": "fa-gem",
};

export default function AboutSection() {
  const { cmsData } = useCMS();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Get about data with defaults
  const about = cmsData?.about || defaultAbout;

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
  if (!about.enabled) return null;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white text-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-item">
            <p className="text-yellow-500 font-semibold text-lg mb-3">{about.sectionTagline}</p>
            <h2 className="text-4xl md:text-5xl font-bold">{about.sectionTitle}</h2>
            <div className="w-20 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-item">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                {about.mainHeading}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {about.description}
              </p>

              {/* CTA Button */}
              <a
                href={about.ctaLink}
                className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold transition-all duration-300"
              >
                {about.ctaText}
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>

            {/* Right - Features */}
            <div className="space-y-4 animate-item">
              {about.features?.map((feature: {icon: string, text: string}, index: number) => (
                <div
                  key={index}
                  className="flex items-start p-5 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                    <i className={`fas ${iconMap[feature.icon] || "fa-check"} text-gray-900 text-xl`}></i>
                  </div>
                  <p className="text-gray-800 font-medium text-lg pt-2">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
