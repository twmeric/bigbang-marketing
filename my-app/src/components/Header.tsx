"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCMS } from "@/context/CMSContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const pathname = usePathname();
  const { cmsData } = useCMS();

  // Default navigation items
  const defaultNavItems = [
    { name: "主頁", href: "/" },
    { name: "關於我們", href: "#about" },
    {
      name: "服務",
      href: "#services",
      children: [
        { name: "SEO優化", href: "/seo" },
        { name: "內容營銷", href: "/content-marketing" },
        { name: "線下推廣", href: "/offline-promotion" },
        { name: "KOL推廣", href: "/kol-promotion" },
        { name: "網頁設計", href: "/web-design" },
        { name: "包裝設計", href: "/packaging-design" },
      ],
    },
    { name: "成功案例", href: "#cases" },
    { name: "聯絡我們", href: "#contact" },
  ];

  const defaultCtaButton = {
    text: "成為行業第一",
    href: "mailto:info@bigbangmarketing.hk",
  };

  // CMS-driven navigation data
  const navigation = cmsData?.navigation;
  const navItems = navigation?.items || defaultNavItems;
  const ctaButton = navigation?.ctaButton || defaultCtaButton;

  // Social media links (can use footer.social or remain hardcoded)
  const socialLinks = cmsData?.footer?.social
    ? [
        {
          icon: "fab fa-facebook-f",
          href: cmsData.footer.social.facebook,
          label: "Facebook",
        },
        {
          icon: "fab fa-instagram",
          href: cmsData.footer.social.instagram,
          label: "Instagram",
        },
        {
          icon: "fab fa-whatsapp",
          href: `https://wa.me/${
            (cmsData.contact?.whatsappNumber || "5276 8052").replace(/\s/g, "")
          }`,
          label: "WhatsApp",
        },
      ]
    : [
        {
          icon: "fab fa-facebook-f",
          href: "https://www.facebook.com/bigbangmarketing",
          label: "Facebook",
        },
        {
          icon: "fab fa-instagram",
          href: "https://www.instagram.com/bigbangmarketing.hk",
          label: "Instagram",
        },
        {
          icon: "fab fa-whatsapp",
          href: "https://wa.me/85252768052",
          label: "WhatsApp",
        },
      ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if link is current page
  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/") && href.length > 1) {
      return pathname === href || pathname.startsWith(href);
    }
    return false;
  };

  // Check if in service subpage
  const isInServicePage = (): boolean => {
    const servicePages = [
      "/seo",
      "/content-marketing",
      "/offline-promotion",
      "/kol-promotion",
      "/web-design",
      "/packaging-design",
    ];
    return servicePages.some((path) => pathname === path);
  };

  // Check if navigation item has dropdown
  const hasDropdown = (item: any) => item.children && item.children.length > 0;

  // Check if item is the "服務" (Services) item
  const isServicesItem = (item: any) => hasDropdown(item) && item.name === "服務";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-gray-800/50 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <Image
              src={cmsData?.site?.logo || "/logo.png"}
              alt={cmsData?.site?.name || "Big Bang Marketing"}
              width={150}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((link: {name: string, href: string, children?: {name: string, href: string}[]}) => (
              <div key={link.name} className="relative group">
                <a
                  href={link.href}
                  className={`font-medium transition-colors text-sm flex items-center py-2 relative ${
                    isActive(link.href) || (isServicesItem(link) && isInServicePage())
                      ? "text-yellow-400"
                      : "text-white/90 hover:text-white"
                  }`}
                  onMouseEnter={() => hasDropdown(link) && setDesktopServicesOpen(true)}
                >
                  {link.name}
                  {hasDropdown(link) && (
                    <i className="fas fa-chevron-down ml-1 text-xs"></i>
                  )}
                  {/* Current page indicator */}
                  {(isActive(link.href) || (isServicesItem(link) && isInServicePage())) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></span>
                  )}
                </a>
                {/* Dropdown Menu */}
                {hasDropdown(link) && (
                  <div
                    className={`absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl py-2 transition-all duration-200 origin-top ${
                      desktopServicesOpen
                        ? "opacity-100 visible scale-100"
                        : "opacity-0 invisible scale-95"
                    }`}
                    onMouseEnter={() => setDesktopServicesOpen(true)}
                    onMouseLeave={() => setDesktopServicesOpen(false)}
                  >
                    {link.children?.map((subItem: {name?: string, label?: string, href: string}) => (
                      <a
                        key={subItem.name || subItem.label || subItem.href}
                        href={subItem.href}
                        className={`flex items-center px-4 py-3 transition-colors text-sm ${
                          isActive(subItem.href)
                            ? "bg-yellow-400 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-yellow-400 hover:text-gray-900"
                        }`}
                      >
                        {isActive(subItem.href) && (
                          <i className="fas fa-check mr-2 text-xs"></i>
                        )}
                        <span className={isActive(subItem.href) ? "" : "ml-4"}>
                          {subItem.name || subItem.label}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Social Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {socialLinks.map((link: {icon: string, href: string, label: string}) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label={link.label}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>

            {/* CTA Button - CMS driven */}
            <a
              href={ctaButton.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              <i className="fas fa-bolt mr-2"></i>
              {ctaButton.text}
            </a>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i
                className={`fas ${
                  isMobileMenuOpen ? "fa-times" : "fa-bars"
                } text-xl`}
              ></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-900 border-t border-white/10">
            {/* Social Icons - Mobile Top */}
            <div className="flex items-center justify-center space-x-4 py-4 border-b border-white/10">
              {socialLinks.map((link: {icon: string, href: string, label: string}) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-yellow-400 hover:text-gray-900 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label={link.label}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>

            <nav className="py-2">
              {navItems.map((link: {name: string, href: string, children?: {name: string, href: string}[]}) => (
                <div key={link.name}>
                  {hasDropdown(link) ? (
                    <div>
                      <button
                        className={`w-full flex items-center justify-between px-4 py-3 font-medium transition-colors ${
                          isInServicePage() ? "text-yellow-400" : "text-white"
                        }`}
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      >
                        <span className="flex items-center">
                          {link.name}
                          {isInServicePage() && (
                            <span className="ml-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                          )}
                        </span>
                        <i
                          className={`fas fa-chevron-down transition-transform duration-300 ${
                            mobileServicesOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>
                      {/* Mobile Submenu with animation */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          mobileServicesOpen
                            ? "max-h-[300px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="bg-gray-800 py-2">
                          {link.children?.map((subItem: {name: string, href: string}) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className={`flex items-center px-8 py-3 transition-colors text-sm ${
                                isActive(subItem.href)
                                  ? "text-yellow-400 font-medium"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {isActive(subItem.href) && (
                                <i className="fas fa-arrow-right mr-2 text-xs"></i>
                              )}
                              <span className={isActive(subItem.href) ? "" : "ml-4"}>
                                {subItem.name}
                              </span>
                              {isActive(subItem.href) && (
                                <span className="ml-auto text-xs">目前</span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      className={`flex items-center justify-between px-4 py-3 font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-yellow-400"
                          : "text-white hover:text-yellow-400"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{link.name}</span>
                      {isActive(link.href) && <span className="text-xs">目前</span>}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Button - Mobile */}
            <div className="px-4 pb-4">
              <a
                href={ctaButton.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-3 rounded-lg font-bold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-bolt mr-2"></i>
                {ctaButton.text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
