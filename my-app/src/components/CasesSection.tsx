"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useCMS } from "@/context/CMSContext";
import casesData from "../../data/cases.json";

gsap.registerPlugin(ScrollTrigger);

export default function CasesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { cmsData } = useCMS();

  // Get cases section config from CMS with defaults
  const defaultCases = {
    enabled: true,
    sectionTagline: "Our Work",
    sectionTitle: "成功案例",
    sectionDescription: "我們為各大品牌提供專業的營銷服務，創造卓越的市場成果",
    ctaText: "查看更多案例",
    ctaLink: "https://wa.me/85252768052",
    items: [],
  };
  const cases = { ...defaultCases, ...(cmsData?.cases || {}) };

  // Hide section if disabled
  if (!cases.enabled) return null;

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

  // CMS-driven cases items (fallback to local cases.json if not in CMS)
  const caseItems = cases.items?.length > 0 ? cases.items : casesData.cases;

  return (
    <section
      id="cases"
      ref={sectionRef}
      className="py-20 md:py-28 bg-gray-900 text-white"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-item">
          <p className="text-yellow-400 font-semibold text-lg mb-3">{cases.sectionTagline}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{cases.sectionTitle}</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {cases.sectionDescription}
          </p>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseItems.map((caseItem: {id: number, title: string, client: string, category: string, description: string, image: string}) => (
            <div
              key={caseItem.id}
              className="animate-item group bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-yellow-400"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={caseItem.image}
                  alt={caseItem.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {caseItem.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-yellow-400 text-sm font-semibold mb-2">
                  客戶：{caseItem.client}
                </p>
                <h3 className="text-xl font-bold mb-3 line-clamp-2">
                  {caseItem.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {caseItem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12 animate-item">
          <a
            href={cases.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105"
          >
            {cases.ctaText}
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
