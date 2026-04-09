# Big Bang Marketing - 故障排除

## 问题: /admin/inquiries/ 页面无法加载

### 可能原因及解决方案

#### 1. DNS 缓存问题
**解决方案:**
- 清除浏览器缓存 (Ctrl+Shift+R)
- 使用无痕模式访问
- 等待 5-10 分钟让 CDN 缓存刷新

#### 2. 路径格式问题
**尝试以下 URL:**
- https://bigbang.jkdcoding.com/admin/inquiries (无末尾斜杠)
- https://bigbang.jkdcoding.com/admin/inquiries/ (有末尾斜杠)

#### 3. 临时预览地址测试
请尝试访问临时地址看是否正常：
- https://3427d03c.bigbang-marketing.pages.dev/admin/inquiries/

如果临时地址正常，说明是 custom domain 配置问题。

#### 4. Cloudflare Pages 配置检查
请检查 Cloudflare Dashboard：
1. Pages → bigbang-marketing → Custom domains
2. 确认 jkdcoding.com 域名状态为 "Active"
3. 检查 DNS 记录是否正确指向 Pages

#### 5. 如果以上都无效
请联系开发团队检查：
- Worker 是否正常运行
- Pages 部署是否完整
- 路由配置是否正确

## 联系支持

如有问题，请联系开发团队。
