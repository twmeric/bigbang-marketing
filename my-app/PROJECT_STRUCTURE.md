# Big Bang Marketing - 项目结构文档

## 🎉 部署状态

| 组件 | 地址 | 状态 |
|------|------|------|
| **前端网站** | https://bigbang.jkdcoding.com | ✅ 已部署 |
| **临时预览** | https://29058b65.bigbang-marketing.pages.dev | ✅ 已部署 |
| **Worker API** | https://bigbang-cms-worker.jimsbond007.workers.dev | ✅ 已部署 |

---

## 📁 项目结构

```
my-app/
├── apps/
│   └── cms-worker/              # Cloudflare Worker 后端
│       ├── src/
│       │   ├── index.ts         # Worker 主入口 (完整 API)
│       │   └── data/
│       │       └── default.ts   # 默认 CMS 数据
│       ├── wrangler.toml        # Worker 配置
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # 首页
│   │   ├── layout.tsx           # 根布局
│   │   ├── globals.css          # 全局样式
│   │   ├── admin/               # Admin 后台
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── layout.tsx       # Admin 布局
│   │   │   ├── content/         # 内容管理
│   │   │   ├── inquiries/       # 询盘管理
│   │   │   ├── analytics/       # 数据分析
│   │   │   ├── cases/           # 案例管理
│   │   │   ├── media/           # 媒体库
│   │   │   └── settings/        # 设置
│   │   └── [services]/          # 服务子页面
│   │       ├── seo/
│   │       ├── content-marketing/
│   │       ├── offline-promotion/
│   │       ├── kol-promotion/
│   │       ├── web-design/
│   │       └── packaging-design/
│   │
│   ├── components/              # React 组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── CasesSection.tsx
│   │   ├── GrowthSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── PartnersSection.tsx
│   │   └── AnalyticsTracker.tsx
│   │
│   ├── context/
│   │   └── CMSContext.tsx       # CMS 状态管理 (API 驱动)
│   │
│   ├── lib/
│   │   ├── api.ts               # API 客户端
│   │   ├── analytics.ts         # 追踪库
│   │   └── storage.ts           # 安全存储工具
│   │
│   └── data/
│       └── cms.json             # 默认 CMS 数据
│
├── public/                      # 静态资源
│   ├── bigbanglogo.png
│   ├── hero-bg.jpg
│   ├── case-*.png
│   └── ...
│
├── dist/                        # 构建输出
├── next.config.ts               # Next.js 配置
├── tsconfig.json                # TypeScript 配置
├── package.json                 # 项目依赖
├── .env.local                   # 环境变量
└── [文档文件]
```

---

## 🔧 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端** | Next.js 16 + React + TypeScript | 静态导出 |
| **样式** | Tailwind CSS | 原子化 CSS |
| **后端** | Cloudflare Worker | Edge 计算 |
| **数据库** | Cloudflare KV | 键值存储 |
| **部署** | Cloudflare Pages | 静态托管 |
| **CI/CD** | GitHub Actions | 自动部署 |

---

## 🚀 API 端点

### CMS 管理
| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/cms/data` | 获取 CMS 数据 |
| POST | `/api/cms/data` | 保存 CMS 数据 |
| POST | `/api/cms/deploy` | 触发部署 |
| POST | `/api/cms/reset` | 重置默认数据 |

### 询盘管理
| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/contact` | 提交表单 + WhatsApp 通知 |
| POST | `/api/inquiries` | 保存询盘 |
| GET | `/api/inquiries` | 获取所有询盘 |
| PUT | `/api/inquiries` | 更新询盘状态 |

### 数据分析
| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/api/analytics/pageview` | 记录页面访问 |
| POST | `/api/analytics/track` | 追踪访问 |
| GET | `/api/analytics/dashboard` | 仪表盘数据 |
| GET | `/api/analytics/realtime` | 实时在线用户 |

---

## 🔐 环境变量

### 前端 (.env.local)
```env
NEXT_PUBLIC_CMS_API_URL=https://bigbang-marketing-cms.jimsbond007.workers.dev
```

### Worker (wrangler.toml)
```toml
[vars]
ADMIN_WHATSAPP = "85252768052"
GITHUB_REPO = "owner/bigbang-marketing"
```

### Secrets (wrangler secret put)
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `CLOUDWAPI_API_KEY` - WhatsApp API Key (可选)
- `CLOUDWAPI_SENDER` - WhatsApp 发送方 (可选)

---

## 📊 功能特性

### ✅ 已实现
- [x] 完整的 CMS 内容管理
- [x] 询盘管理 + WhatsApp 通知
- [x] 实时数据分析
- [x] 多设备同步 (云端存储)
- [x] GitHub Actions 自动部署
- [x] 服务子页面 (6个)
- [x] 响应式设计

---

## 📝 维护指南

### 更新内容
1. 访问 `https://bigbang.jkdcoding.com/admin`
2. 修改内容 (自动保存到云端)
3. 点击"部署网站"触发更新

### 查看询盘
1. Admin → 询盘管理
2. 查看客户询盘
3. 点击 WhatsApp 按钮回复

### 本地开发
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建
npx wrangler pages deploy dist  # 手动部署
```

---

## 🆘 故障排除

| 问题 | 解决方案 |
|------|----------|
| Worker 部署失败 | 检查 `wrangler.toml` 配置 |
| API 连接失败 | 检查 `.env.local` 中的 API URL |
| GitHub Actions 失败 | 检查 Secrets 配置 |

---

## 📞 联系方式

如需技术支持，请联系开发团队。

---

**最后更新**: 2024-04-07  
**版本**: v1.0.0
