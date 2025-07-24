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

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

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

