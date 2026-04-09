"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCMS } from "@/context/CMSContext";

type ServicePageKey = 'seo' | 'contentMarketing' | 'offlinePromotion' | 'kolPromotion' | 'webDesign' | 'packagingDesign';

interface ServicePageTemplateProps {
  pageKey: ServicePageKey;
}

export default function ServicePageTemplate({ pageKey }: ServicePageTemplateProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { cmsData } = useCMS();

  // 獲取該服務頁面的 CMS 數據
  const pageData = (cmsData.servicePages as Record<string, any>)?.[pageKey];

  // 獲取所有案例
  const allCases = cmsData.cases?.items || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // 如果頁面未啟用或數據不存在
  if (!pageData || pageData.enabled === false) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">頁面暫時不可用</h1>
          <p className="text-gray-500 mt-2">請聯繫管理員</p>
        </div>
      </main>
    );
  }

  const { hero, features, process, cta, stats, testimonial, techStack, faq, relatedCases: pageRelatedCases, geo } = pageData;

  // 構建結構化數據 JSON-LD
  const structuredData = geo ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": geo.serviceType,
    "areaServed": geo.areaServed,
    "provider": {
      "@type": "Organization",
      "name": geo.provider,
      "url": "https://bigbang.jkdcoding.com"
    },
    "description": geo.description,
    "offers": {
      "@type": "Offer",
      "description": geo.pricingModel
    }
  } : null;

  return (
    <>
      {/* 結構化數據標記 - 用於 GEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-[60vh] flex items-center justify-center pt-20"
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #0d1f33 50%, #1a1a2e 100%)",
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30" 
            style={{ backgroundImage: `url('${hero?.backgroundImage || '/hero-background.jpg'}')` }}
          ></div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-item">
              {hero?.title || "服務標題"}
            </h1>
            {hero?.subtitle && (
              <p className="text-lg text-yellow-400 mb-4 animate-item">
                {hero.subtitle}
              </p>
            )}
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-item">
              {hero?.description || ""}
            </p>
            {hero?.buttonText && (
              <a
                href={hero?.buttonLink || "https://wa.me/85252768052"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 mt-8 animate-item"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                {hero.buttonText}
              </a>
            )}
          </div>
        </section>

        {/* Stats Section */}
        {stats?.enabled !== false && stats?.items && stats.items.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                {stats.items.map((stat: any, index: number) => (
                  <div key={index} className="p-6 animate-item">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">{stat.value}</div>
                    <div className="text-gray-900 font-semibold mb-1">{stat.label}</div>
                    <div className="text-gray-500 text-sm">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonial Section */}
        {testimonial?.enabled !== false && testimonial?.quote && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-white rounded-2xl p-8 md:p-12 border-l-4 border-yellow-400 shadow-lg">
                <i className="fas fa-quote-left text-4xl text-yellow-400 mb-4"></i>
                <p className="text-xl text-gray-700 italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  {testimonial.avatar && (
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.author || "客戶"}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author || "滿意客戶"}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role || ""}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Services/Features Section */}
        {features?.items && features.items.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                {features?.title || "服務項目"}
              </h2>
              <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                我們提供專業的服務，幫助您的品牌成長
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.items.map((service: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-yellow-400"
                  >
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                      <i className={`fas ${service.icon || 'fa-star'} text-gray-900 text-xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process Section */}
        {process?.steps && process.steps.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                {process?.title || "服務流程"}
              </h2>
              
              <div className={`grid gap-6 max-w-6xl mx-auto ${
                process.steps.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                {process.steps.map((item: any, index: number) => (
                  <div key={index} className="text-center p-6">
                    <div className="text-5xl font-bold text-yellow-400 mb-4">{item.number}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tech Stack Section - 僅 web-design 顯示 */}
        {techStack?.enabled !== false && techStack?.items && techStack.items.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {techStack?.title || "採用最新的技術"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                我們採用最新的前端技術和設計工具，確保您的網站具有現代感和優良性能
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {techStack.items.map((tech: any, index: number) => (
                  <span key={index} className="px-6 py-3 bg-gray-100 rounded-full text-gray-700 font-medium hover:bg-yellow-400 hover:text-gray-900 transition-colors">
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faq?.enabled !== false && faq?.items && faq.items.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                {faq?.title || "常見問題"}
              </h2>
              
              <div className="space-y-4">
                {faq.items.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Cases Section */}
        {pageRelatedCases?.enabled !== false && pageRelatedCases?.items && pageRelatedCases.items.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                {pageRelatedCases?.title || "相關案例"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pageRelatedCases.items.map((caseItem: any, index: number) => {
                  // 從全域案例中找到對應的案例詳情
                  const fullCase = allCases.find((c: any) => c.id === caseItem.id) || caseItem;
                  return (
                    <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                      <div className="aspect-video bg-gray-200 relative">
                        {fullCase.image && (
                          <Image
                            src={fullCase.image}
                            alt={fullCase.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-yellow-500 font-medium mb-2">{fullCase.client}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{fullCase.title}</h3>
                        <p className="text-gray-600 text-sm">{caseItem.description || fullCase.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {cta && (
          <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {cta?.title || "準備開始？"}
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                {cta?.description || "聯絡我們，獲取專業的諮詢服務"}
              </p>
              <a
                href={cta?.buttonLink || "https://wa.me/85252768052"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                {cta?.buttonText || "立即諮詢"}
              </a>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}
