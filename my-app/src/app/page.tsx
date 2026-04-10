"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import CasesSection from "@/components/CasesSection";
import GrowthSection from "@/components/GrowthSection";
import FAQSection from "@/components/FAQSection";
import PartnersSection from "@/components/PartnersSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useCMS } from "@/context/CMSContext";

export default function Home() {
  const { cmsData } = useCMS();
  const contactData = cmsData?.contact;

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CasesSection />
      <GrowthSection />
      <FAQSection />
      <PartnersSection />
      
      {/* Contact Section - CMS Driven */}
      {contactData?.enabled !== false && (
        <section id="contact-form" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Left: Info */}
                <div>
                  <span className="inline-block bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-1 rounded-full mb-4">
                    {contactData?.sectionTagline || "聯絡我們"}
                  </span>
                  <h2 
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                    dangerouslySetInnerHTML={{ 
                      __html: contactData?.sectionTitle?.replace(
                        /\*\*(.*?)\*\*/g, 
                        '<span class="text-yellow-500">$1</span>'
                      ) || "準備好提升您的<br /><span class=\"text-yellow-500\">品牌影響力</span>了嗎？"
                    }}
                  />
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {contactData?.sectionDescription || "填寫右側表單，我們的專業團隊將通過 WhatsApp 與您聯繫，為您提供免費的營銷諮詢服務。"}
                  </p>
                  
                  <div className="space-y-4">
                    {/* Phone */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                        <i className="fas fa-phone text-gray-900"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{contactData?.phoneLabel || "服務熱線"}</p>
                        <p className="font-bold text-gray-900">{contactData?.phoneNumber || "3987 1086"}</p>
                      </div>
                    </div>
                    
                    {/* WhatsApp */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <i className="fab fa-whatsapp text-white"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{contactData?.whatsappLabel || "WhatsApp"}</p>
                        <p className="font-bold text-gray-900">{contactData?.whatsappNumber || "5276 8052"}</p>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                        <i className="fas fa-envelope text-gray-700"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{contactData?.emailLabel || "電子郵箱"}</p>
                        <p className="font-bold text-gray-900">{contactData?.emailAddress || "info@bigbangmarketing.hk"}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-gray-700"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{contactData?.addressLabel || "地址"}</p>
                        <p className="font-bold text-gray-900 text-sm">{contactData?.address || "香港新界荃灣青山公路264-298號南豐中心23樓2301 B3-B4室"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right: Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </main>
  );
}
