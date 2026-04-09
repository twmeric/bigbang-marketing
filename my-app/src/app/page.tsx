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

export default function Home() {
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
      
      {/* Contact Section */}
      <section id="contact-form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left: Info */}
              <div>
                <span className="inline-block bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-1 rounded-full mb-4">
                  聯絡我們
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  準備好提升您的<br />
                  <span className="text-yellow-500">品牌影響力</span>了嗎？
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  填寫右側表單，我們的專業團隊將通過 WhatsApp 與您聯繫，
                  為您提供免費的營銷諮詢服務。
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                      <i className="fas fa-phone text-gray-900"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">服務熱線</p>
                      <p className="font-bold text-gray-900">3987 1086</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <i className="fab fa-whatsapp text-white"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-bold text-gray-900">5276 8052</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                      <i className="fas fa-envelope text-gray-700"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">電子郵箱</p>
                      <p className="font-bold text-gray-900">info@bigbangmarketing.hk</p>
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
      
      <Footer />
    </main>
  );
}
