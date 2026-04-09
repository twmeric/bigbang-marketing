# Big Bang Marketing 🚀

专业的市场推广及市场策划公司官网，基于 E-Corp 架构构建。

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://bigbang.jkdcoding.com)
[![Architecture](https://img.shields.io/badge/architecture-E--Corp-blue)](https://github.com/twmeric/e-corp)

## 🌐 在线访问

- **主站**: https://bigbang.jkdcoding.com
- **预览**: https://29058b65.bigbang-marketing.pages.dev
- **API**: https://bigbang-marketing-cms.jimsbond007.workers.dev

## ✨ 功能特性

- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🎨 **星空主题** - 独特的视觉风格
- 📝 **CMS 内容管理** - 完整的后台管理系统
- 📊 **数据分析** - 实时访客统计
- 💬 **询盘管理** - WhatsApp 即时通知
- 🚀 **自动部署** - GitHub Actions CI/CD

## 🏗️ 架构

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Cloudflare     │      │  Cloudflare     │      │  Cloudflare     │
│  Pages          │◄────►│  Worker         │◄────►│  KV             │
│  (Next.js)      │      │  (API)          │      │  (Database)     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建
npm run build

# 部署
npx wrangler pages deploy dist
```

## 📁 项目结构

详见 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🔧 技术栈

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Worker
- **Database**: Cloudflare KV
- **Deploy**: Cloudflare Pages, GitHub Actions

## 📄 文档

- [项目结构](./PROJECT_STRUCTURE.md)
- [文档索引](./DOCUMENTATION.md)

## 📝 许可证

私有项目 - 保留所有权利

---

Built with ❤️ by Big Bang Marketing Team
