// CMS Data Types - aligned with frontend components and worker default data

export interface SiteConfig {
  name: string;
  title?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  language?: string;
}

export interface HeroSectionData {
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

export interface AboutSectionData {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  mainHeading: string;
  description: string;
  features: { icon: string; text: string }[];
  ctaText: string;
  ctaLink: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  enabled: boolean;
}

export interface ServicesSectionData {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  readMoreText: string;
  items: ServiceItem[];
}

export interface CaseItem {
  id: string | number;
  client: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface CasesSectionData {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  ctaText: string;
  ctaLink: string;
  items: CaseItem[];
}

export interface GrowthStrategy {
  icon: string;
  title: string;
  description: string;
}

export interface GrowthSectionData {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  introParagraph1: string;
  introParagraph2: string;
  strategiesTitle: string;
  strategiesDescription: string;
  strategies: GrowthStrategy[];
  ctaText: string;
  ctaLink: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionData {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  items: FAQItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export interface PartnerItem {
  name: string;
  icon?: string;
  logo?: string;
}

export interface PartnersSectionData {
  enabled: boolean;
  sectionTagline: string;
  sectionTitle: string;
  sectionDescription: string;
  items: PartnerItem[];
}

export interface ContactFormConfig {
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
}

export interface ContactSectionData {
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
  form: ContactFormConfig;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterSectionData {
  enabled: boolean;
  companyName: string;
  companyDescription: string;
  services: FooterLink[];
  company: FooterLink[];
  links: FooterLink[];
  copyright: string;
  social: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
}

export interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

export interface NavigationData {
  items: NavItem[];
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
    items: { name: string; icon?: string }[];
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

export interface ServicePagesData {
  seo: ServicePageData;
  contentMarketing: ServicePageData;
  offlinePromotion: ServicePageData;
  kolPromotion: ServicePageData;
  webDesign: ServicePageData;
  packagingDesign: ServicePageData;
}

export interface CMSData {
  site: SiteConfig;
  hero: HeroSectionData;
  about: AboutSectionData;
  services: ServicesSectionData;
  cases: CasesSectionData;
  growth: GrowthSectionData;
  faq: FAQSectionData;
  partners: PartnersSectionData;
  contact: ContactSectionData;
  footer: FooterSectionData;
  navigation: NavigationData;
  servicePages: ServicePagesData;
  lastUpdated: string;
}
