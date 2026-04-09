"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const partners = [
    { name: "Meta", icon: "fa-facebook-f" },
    { name: "Google", icon: "fa-google" },
    { name: "Instagram", icon: "fa-instagram" },
    { name: "LinkedIn", icon: "fa-linkedin-in" },
    { name: "YouTube", icon: "fa-youtube" },
    { name: "TikTok", icon: "fa-music" },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-white text-gray-900"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-item">
          <p className="text-yellow-500 font-semibold text-lg mb-3">Our Partners</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            服務合作伙伴
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            我們與業界領先的技術平台合作，為您提供最優質的營銷服務
          </p>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-item">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-yellow-400 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <i className={`fab ${partner.icon} text-gray-600 text-2xl`}></i>
              </div>
              <span className="text-gray-700 font-semibold text-sm">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
