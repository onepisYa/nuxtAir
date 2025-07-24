# NuxtAir

一个基于 Nuxt 3 的现代化 Web 应用模板，集成了多种功能模块和最佳实践。

## 项目结构

### 主要页面
- `/` - 首页
- `/about` - 关于页面

### 测试页面
所有测试相关的页面都位于 `/test` 路径下：

- `/test/alova-demo` - Alova HTTP 客户端演示
- `/test/blog` - 博客功能测试
  - `/test/blog` - 博客列表页
  - `/test/blog/[slug]` - 博客文章详情页
- `/test/config-test` - 配置测试页面
- `/test/i18n-test` - 国际化功能测试
- `/test/og-test` - Open Graph 元数据测试
- `/test/seo-test` - SEO 功能测试
- `/test` - 测试页面索引

## 功能特性

### 国际化 (i18n)
- 支持中文和英文
- 自动路由重定向
- 动态语言切换

### SEO 优化
- 自动生成 meta 标签
- Open Graph 支持
- 结构化数据
- 动态 sitemap

### HTTP 客户端
- 集成 Alova 进行 API 请求
- 支持请求/响应拦截
- 错误处理机制

### UI 组件
- 基于 Nuxt UI
- Tailwind CSS 样式
- 响应式设计

### URL 管理系统
- 统一的 URL 生成和管理
- 动态环境配置支持
- SSR 兼容的 URL 处理
- 智能端口处理（自动忽略标准端口）
- 性能优化的配置缓存

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认端口）
pnpm dev

# 使用指定端口启动开发服务器
pnpm run dev:3000  # 端口 3000
pnpm run dev:3001  # 端口 3001
pnpm run dev:4000  # 端口 4000
pnpm run dev:8080  # 端口 8080

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 测试端口配置
pnpm run port:test

# 测试 baseUrl 生成逻辑
pnpm run test:baseurl
```

### 端口配置

项目支持灵活的端口配置和智能 URL 处理：

#### 开发环境
- 通过 `.env` 文件中的 `NUXT_DEV_PORT` 配置默认端口
- 如果配置的端口被占用，Nuxt 会自动使用下一个可用端口
- 支持通过环境变量临时覆盖端口设置

#### 生产环境
- 通过 `PORT` 环境变量控制服务器端口
- 部署平台（Vercel、Netlify 等）会自动设置此变量
- 本地测试：`PORT=8080 npm run start`

#### 智能端口处理
- 自动忽略标准端口（HTTP 80, HTTPS 443）
- 非标准端口自动添加到 URL 中
- 开发环境动态生成 baseUrl

#### 配置文件
```bash
# .env 文件示例
NUXT_DEV_PORT=4000          # 开发服务器端口
NUXT_DEV_HOST=0.0.0.0       # 开发服务器主机
NUXT_DEV_NETWORK_HOST=192.168.1.100  # 局域网访问地址（可选）
NUXT_PUBLIC_BASE_URL=https://your-domain.com  # 生产环境基础 URL
```

详细配置说明请参考：
- [端口配置指南](./docs/port-configuration.md)
- [URL 管理系统](./docs/url-management.md)

## 图标库

可以考虑使用 icones 或者 unplugin-icons

- [Heroicons](https://icones.js.org/collection/heroicons) - Nuxt UI 默认图标库
- [Lucide](https://icones.js.org/collection/lucide) - 现代图标库
- [Google Icons](https://icones.js.org/collection/ic)
- [Element Plus](https://icones.js.org/collection/ep) 已不再本模板中使用、如有需要可以考虑自己安装
- [Nuxt Icon 模块](https://github.com/nuxt/icon)

### 用法

```html
<Icon name="i-heroicons-light-bulb" />
<Icon name="i-lucide-alarm-clock" />
<Icon name="ep:apple" />
```

## 更新日志

### 2025年1月

#### URL 管理系统优化
- ✨ 实现了统一的 URL 管理系统，消除硬编码 URL
- ✨ 创建 `useBaseUrl` composable，提供 `getBaseUrl`、`getFullUrl`、`getCurrentUrl` 方法
- ✨ 优化 `nuxt.config.ts` 配置，提取并缓存 `generateBaseUrl` 函数
- ✨ 实现智能端口处理，自动忽略标准端口（80, 443）
- ✨ 添加 SSR 兼容的 URL 处理，避免服务端渲染错误
- 📝 新增 [URL 管理系统文档](./docs/url-management.md)
- 🔧 解决了 `useBaseUrl` 重复导入警告
- 🔧 修复了服务端渲染时 composable 调用的错误

#### 测试页面优化
- 🔧 修正了 SEO 测试页面中 i18n 测试按钮的链接跳转问题（从 `/i18n-test` 修正为 `/test/i18n-test`）
- 🔧 解决了测试页面索引中的图标加载错误（将 `lucide:flask` 替换为 `lucide:test-tube`）
- 🔧 优化了测试页面卡片的导航逻辑，移除了可能导致冲突的双重导航
- 🔧 修正了 OG 测试页面的语言切换路由和 OG Image URL 路径

#### 文档更新
- 📝 确保所有文档中的测试页面路径都使用正确的 `/test/` 前缀
- 📝 添加了详细的更新记录和修改说明

#### 技术改进
- ✨ 确保所有测试页面都遵循统一的路径结构
- ✨ 优化了页面间的导航体验
- ✨ 提升了图标库的兼容性和稳定性

