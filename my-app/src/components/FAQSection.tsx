"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCMS } from "@/context/CMSContext";

gsap.registerPlugin(ScrollTrigger);

const defaultFaqs = [
  {
    question: "什麼是成長營銷 (Growth Marketing)？",
    answer:
      "成長營銷是一種以數據驅動的營銷方法，專注於企業的持續增長。與傳統營銷不同，成長營銷強調通過測試、優化和迭代來實現可持續的業務擴張。",
  },
  {
    question: "成長營銷與傳統營銷有什麼區別？",
    answer:
      "傳統營銷通常關注品牌知名度和一次性銷售，而成長營銷更注重長期價值、客戶留存和可持續增長。它使用數據分析來優化每個營銷渠道，並不斷測試新策略。",
  },
  {
    question: "Big Bang Marketing 如何幫助企業成長？",
    answer:
      "我們提供全方位的成長營銷服務，包括市場策劃、SEO優化、社交媒體營銷、內容營銷等。我們會根據您的業務特點制定個性化的成長策略，並持續監控和優化效果。",
  },
  {
    question: "成長營銷需要多長時間才能看到效果？",
    answer:
      "成長營銷的效果因行業和策略而異。一般來說，SEO優化可能需要3-6個月才能看到顯著效果，而社交媒體營銷和內容營銷可能會更快見效。我們會定期向您報告進展。",
  },
  {
    question: "我的企業適合成長營銷嗎？",
    answer:
      "幾乎所有企業都可以從成長營銷中受益，特別是那些希望實現可持續增長的企業。無論您是初創公司還是成熟企業，我們都能根據您的具體情況制定合適的策略。",
  },
  {
    question: "成長營銷的投資回報率如何？",
    answer:
      "根據我們的經驗，成長營銷的平均投資回報率可以達到3-7倍。通過精確的目標定位和持續優化，我們能夠最大化您的營銷投資效益。",
  },
  {
    question: "如何開始實施成長營銷策略？",
    answer:
      "首先需要進行市場分析和目標設定，然後制定詳細的營銷計劃。我們建議從一個核心渠道開始，逐步擴展到多渠道整合營銷。",
  },
];

const defaultFaq = {
  enabled: true,
  sectionTagline: "FAQ",
  sectionTitle: "成長營銷常見問題",
  sectionDescription: "解答您對成長營銷最常見的疑問，讓您更了解如何運用數據驅動的營銷策略實現業務增長。",
  items: defaultFaqs,
  ctaTitle: "還有其他問題嗎？",
  ctaDescription: "我們的成長營銷專家隨時準備解答您的疑問，幫您制定最適合的營銷策略。",
  ctaButtonText: "聯絡我們",
};

export default function FAQSection() {
  const { cmsData } = useCMS();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faq = cmsData?.faq || defaultFaq;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll(".animate-item");
      if (elements) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
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

  if (!faq.enabled) return null;

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-20 md:py-28 bg-gray-50 text-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-item">
            <p className="text-yellow-500 font-semibold text-lg mb-3">{faq.sectionTagline}</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {faq.sectionTitle}
            </h2>
            <p className="text-gray-600 text-lg">
              {faq.sectionDescription}
            </p>
            <div className="w-20 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faq.items.map((item: {question: string, answer: string}, index: number) => (
              <div
                key={index}
                className="animate-item bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center pr-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-gray-900 rounded-lg flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-gray-900 text-lg">
                      {item.question}
                    </span>
                  </div>
                  <i
                    className={`fas fa-chevron-down text-yellow-500 transition-transform duration-300 flex-shrink-0 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                  ></i>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 pl-16 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-gray-900 rounded-2xl p-8 md:p-12 animate-item">
            <h3 className="text-2xl font-bold text-white mb-4">
              {faq.ctaTitle}
            </h3>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              {faq.ctaDescription}
            </p>
            <a
              href="https://wa.me/85252768052"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <i className="fab fa-whatsapp mr-2 text-xl"></i>
              {faq.ctaButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
