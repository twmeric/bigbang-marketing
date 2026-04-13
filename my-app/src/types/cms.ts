// CMS Data Types
export interface SiteConfig {
  name: string;
  logo?: string;
  favicon?: string;
  language?: string;
}

export interface HeroSection {
  enabled: boolean;
  backgroundImage: string;
  titleLine1: string;
  titleLine2: string;
  titleLine2Color: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface AboutSection {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  mainHeading: string;
  description: string;
  features: { icon: string; text: string }[];
  ctaText: string;
  ctaLink: string;
}

export interface ServicesSection {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  items: {
    id: string;
    icon: string;
    title: string;
    description: string;
    link: string;
  }[];
}

export interface CasesSection {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  items: {
    id: string;
    client: string;
    title: string;
    description: string;
    image: string;
    category: string;
  }[];
}

export interface GrowthSection {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  strategies: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface FAQSection {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export interface PartnersSection {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  items: { name: string; logo: string }[];
}

export interface ContactSection {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  phoneLabel: string;
  phoneNumber: string;
  whatsappLabel: string;
  whatsappNumber: string;
  emailLabel: string;
  emailAddress: string;
  addressLabel: string;
  address: string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    serviceLabel: string;
    servicePlaceholder: string;
    serviceOptions: string[];
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submittingText: string;
    successTitle: string;
    successMessage: string;
    successButton: string;
    footnote: string;
    errorMessage: string;
    errorDetail: string;
  };
}

export interface FooterSection {
  enabled: boolean;
  companyName: string;
  companyDescription: string;
  services: { name: string; href: string }[];
  company: { name: string; href: string }[];
  links: { name: string; href: string }[];
  copyright: string;
  social: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
}

export interface Navigation {
  items: { name: string; href: string; children?: { name: string; href: string }[] }[];
  ctaButton: { text: string; href: string };
}

export interface ServicePageData {
  enabled: boolean;
  pageTitle: string;
  pageDescription: string;
  hero: {
    title: string;
    subtitle?: string;
    description: string;
    backgroundImage: string;
    buttonText: string;
    buttonLink: string;
  };
  stats?: {
    enabled: boolean;
    items: { value: string; label: string; description: string }[];
  };
  testimonial?: {
    enabled: boolean;
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
  features: {
    title: string;
    description?: string;
    items: { icon: string; title: string; description: string }[];
  };
  process?: {
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  faq?: {
    enabled: boolean;
    title: string;
    items: { question: string; answer: string }[];
  };
  techStack?: {
    enabled: boolean;
    title: string;
    description: string;
    items: { name: string }[];
  };
  relatedCases?: {
    enabled: boolean;
    title: string;
    items: { id: string; description?: string }[];
  };
  geo?: {
    serviceType: string;
    areaServed: string;
    provider: string;
    description: string;
    pricingModel: string;
  };
}

export interface ServicePages {
  seo: ServicePageData;
  contentMarketing: ServicePageData;
  offlinePromotion: ServicePageData;
  kolPromotion: ServicePageData;
  webDesign: ServicePageData;
  packagingDesign: ServicePageData;
}

export interface CMSData {
  site: SiteConfig;
  hero: HeroSection;
  about: AboutSection;
  services: ServicesSection;
  cases: CasesSection;
  growth: GrowthSection;
  faq: FAQSection;
  partners: PartnersSection;
  contact: ContactSection;
  footer: FooterSection;
  navigation: Navigation;
  servicePages: ServicePages;
  lastUpdated: string;
}
