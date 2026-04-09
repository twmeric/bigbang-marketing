// Default CMS data for Big Bang Marketing
export const defaultCMSData = {
  site: {
    name: "Big Bang Marketing",
    title: "Big Bang Marketing | Ignite Your Brand. Expand Your Universe",
    description: "Big Bang Marketing 是一間新創的全方位行銷公司，致力為客戶提供量身訂製的行銷解決方案。",
    logo: "/bigbanglogo.png",
    favicon: "/favicon.ico"
  },
  hero: {
    enabled: true,
    backgroundImage: "/hero-bg.jpg",
    titleLine1: "Ignite Your Brand.",
    titleLine2: "Expand Your Universe",
    titleLine2Color: "#facc15",
    subtitle: "市場推廣及市場策劃",
    description: "從策略到內容，一站式AI行銷及線下推廣服務，讓品牌脫穎而出。",
    buttonText: "Contact Us",
    buttonLink: "mailto:info@bigbangmarketing.hk"
  },
  about: {
    enabled: true,
    tag: "【關於我們】",
    title: "ABOUT US",
    heading: "為您的業務成長賦能",
    description: "Big Bang Marketing 是一間新創的全方位行銷公司，致力為客戶提供量身訂製的行銷解決方案，利用廣泛的合作夥伴網絡，創造具影響力且效果導向的策略。",
    buttonText: "了解更多",
    features: [
      { icon: "fa-chart-line", text: "策略導向的營銷方案" },
      { icon: "fa-users", text: "專業團隊支持" },
      { icon: "fa-award", text: "豐富行業經驗" }
    ]
  },
  services: {
    enabled: true,
    tag: "【服務項目】",
    title: "OUR SERVICES",
    description: "我們提供全方位的數字營銷服務，從搜索引擎優化到社交媒體運營，從內容創作到線下推廣，助力您的品牌在競爭中脫穎而出。",
    items: [
      {
        icon: "fa-search",
        title: "SEO優化服務",
        subtitle: "搜尋引擎優化",
        description: "透過專業的SEO策略，提升您的網站在搜尋引擎中的排名，增加自然流量和品牌曝光度。",
        href: "/seo"
      },
      {
        icon: "fa-pen-nib",
        title: "內容營銷服務",
        subtitle: "Content Marketing",
        description: "創建引人入勝的內容策略，通過優質內容吸引並留住目標受眾，建立品牌權威性。",
        href: "/content-marketing"
      },
      {
        icon: "fa-calendar-alt",
        title: "線下推廣活動",
        subtitle: "Offline Promotion",
        description: "策劃和執行各類線下活動，從展覽到路演，幫助品牌與消費者建立真實的連結。",
        href: "/offline-promotion"
      },
      {
        icon: "fa-users",
        title: "KOL網紅推廣",
        subtitle: "KOL Promotion",
        description: "連接優質網紅資源，制定精準的KOL營銷策略，擴大品牌影響力和受眾觸及率。",
        href: "/kol-promotion"
      },
      {
        icon: "fa-laptop-code",
        title: "網站設計開發",
        subtitle: "Web Design",
        description: "設計和開發現代化、響應式的網站，提供卓越的用戶體驗和品牌形象展示。",
        href: "/web-design"
      },
      {
        icon: "fa-paint-brush",
        title: "包裝設計服務",
        subtitle: "Packaging Design",
        description: "打造獨特的產品包裝設計，讓您的產品在貨架上脫穎而出，吸引消費者目光。",
        href: "/packaging-design"
      }
    ]
  },
  cases: {
    enabled: true,
    tag: "【最新案例】",
    title: "OUR WORKS",
    description: "我們與各行各業的客戶合作，創造了許多成功的營銷案例。以下是部分精選作品。",
    items: [
      {
        id: 1,
        title: "Social feeds (Easy Earn)",
        client: "CVS",
        image: "/case-cvs.png",
        category: "社交媒體",
        description: "為 CVS 打造創意社交媒體內容，提升品牌曝光和用戶互動。"
      },
      {
        id: 2,
        title: "2023 ViuTV drama 殺手廢J - Title-Sponsorship SOW",
        client: "ViuTV",
        image: "/case-viutv.png",
        category: "品牌贊助",
        description: "為 ViuTV 人氣劇集提供冠名贊助整合營銷方案。"
      },
      {
        id: 3,
        title: "HSBC One - 2021 投資A0變世一 Social video (EP1-3)",
        client: "HSBC",
        image: "/case-hsbc.png",
        category: "影片製作",
        description: "為滙豐銀行製作投資教育系列社交影片，共3集。"
      }
    ]
  },
  growth: {
    enabled: true,
    tag: "【成長營銷】",
    title: "GROWTH MARKETING",
    description: "通過數據驅動的策略，實現業務的持續增長。",
    metrics: [
      { label: "客戶增長", value: "+150%", description: "過去一年客戶數量增長" },
      { label: "品牌曝光", value: "2M+", description: "月度品牌觸及人數" },
      { label: "營銷ROI", value: "3.5x", description: "平均投資回報率" },
      { label: "滿意度", value: "98%", description: "客戶滿意度評分" }
    ]
  },
  faq: {
    enabled: true,
    tag: "【常見問題】",
    title: "FAQ",
    items: [
      {
        question: "你們提供什麼服務？",
        answer: "我們提供全方位的數字營銷服務，包括SEO優化、內容營銷、社交媒體管理、KOL推廣、網站設計開發等。"
      },
      {
        question: "如何開始合作？",
        answer: "您可以通過電郵或電話與我們聯繫，我們會安排免費諮詢，了解您的需求並提供定制方案。"
      },
      {
        question: "服務收費如何計算？",
        answer: "我們根據項目範圍和複雜度提供客製化報價。歡迎聯繫我們獲取詳細報價。"
      }
    ]
  },
  partners: {
    enabled: true,
    tag: "【合作夥伴】",
    title: "OUR PARTNERS",
    logos: ["/partner1.png", "/partner2.png", "/partner3.png", "/partner4.png"]
  },
  footer: {
    enabled: true,
    contact: {
      phone: "3987 1086",
      whatsapp: "5276 8052",
      email: "info@bigbangmarketing.hk",
      address: "Room 2301 B3-B4, 23/F, Nan Fung Centre, 264-298 Castle Peak Road, Tsuen Wan, N.T., Hong Kong",
      addressCn: "香港新界荃灣青山公路264-298號南豐中心23樓2301 B3-B4室"
    },
    copyright: "© 2024 Big Bang Marketing. All rights reserved.",
    social: {
      facebook: "https://facebook.com/bigbangmarketing",
      instagram: "https://instagram.com/bigbangmarketing"
    }
  }
};

export default defaultCMSData;
