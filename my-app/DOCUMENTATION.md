# Big Bang Marketing - 文档索引

## 📚 文档列表

| 文档 | 说明 | 目标读者 |
|------|------|----------|
| [README.md](./README.md) | 项目简介和快速开始 | 所有人 |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 项目结构和维护指南 | 开发者 |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | 后台使用指南 | 管理员 |
| [AGENTS.md](./AGENTS.md) | 开发备忘和代码规范 | AI Agent |

## 🚀 部署信息

### 生产环境
- **主站**: https://bigbang.jkdcoding.com
- **Worker API**: https://bigbang-marketing-cms.jimsbond007.workers.dev

### 后台登录
- **地址**: https://bigbang.jkdcoding.com/admin
- **账号**: admin
- **密码**: admin360

## 🏗️ 架构概览

基于 **E-Corp 架构** 构建：
- 前端: Next.js (Static Export) → Cloudflare Pages
- 后端: Cloudflare Worker
- 数据库: Cloudflare KV
- CI/CD: GitHub Actions

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 部署 (手动)
npx wrangler pages deploy dist

# Worker 部署
cd apps/cms-worker && npx wrangler deploy
```

## 📞 支持

如有问题，请参考各文档或联系开发团队。

---

**版本**: v1.0.0  
**最后更新**: 2024-04-07
