# SEO 快速开始指南（5分钟配置）

## 🎯 目标

在5分钟内为你的 Nuxt.js 项目配置基础的 SEO 功能，包括：
- 基础元标签配置
- 多语言支持
- 社交媒体分享优化
- 搜索引擎索引配置

## 📋 前提条件

确保你的项目已安装必要的依赖：

```json
// package.json
{
  "devDependencies": {
    "@nuxtjs/seo": "^3.1.0",
    "@nuxtjs/i18n": "^10.0.1",
    "nuxt-schema-org": "^5.0.6"
  }
}
```

## ⚡ 快速配置步骤

### 步骤 1: 基础模块配置（2分钟）

在 `nuxt.config.ts` 中添加基础配置：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-schema-org'
  ],

  // 站点基础信息
  site: {
    url: process.env.NUXT_PUBLIC_BASE_URL || 'https://your-domain.com',
    name: 'Your Site Name',
    description: 'Your site description for SEO',
    defaultLocale: 'en-US'
  },

  // 国际化基础配置
  i18n: {
    locales: [
      { code: 'en-US', iso: 'en-US', name: 'English' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文' }
    ],
    defaultLocale: 'en-US',
    strategy: 'prefix_except_default'
  },

  // SEO 自动化配置
  seo: {
    automaticDefaults: true
  }
})
```

> **参考来源**: [权威指南第2章 - 模块设置和初始配置](../reference/nuxt-seo-i18n-guide.md#模块设置和初始配置)

### 步骤 2: 全局 SEO 配置（2分钟）

在 `app.vue` 中配置全局 SEO：

```vue
<!-- app.vue -->
<script setup>
const { t, locale } = useI18n()

// 全局 SEO 元数据
useSeoMeta({
  titleTemplate: '%s | Your Site Name',
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('seo.title'),
  ogDescription: () => t('seo.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// 国际化头部信息
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

// 合并头部信息
useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
    dir: i18nHead.value.htmlAttrs?.dir
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

> **参考来源**: [权威指南第4章 - 页面级 SEO 实施](../reference/nuxt-seo-i18n-guide.md#页面级-seo-和-i18n-实施)

### 步骤 3: 语言文件配置（1分钟）

创建基础的多语言 SEO 内容：

```json
// i18n/locales/en-US.json
{
  "seo": {
    "title": "Your Site Title",
    "description": "Your site description for search engines and social media"
  }
}
```

```json
// i18n/locales/zh-CN.json
{
  "seo": {
    "title": "您的网站标题",
    "description": "您的网站描述，用于搜索引擎和社交媒体"
  }
}
```

## ✅ 验证配置

配置完成后，启动开发服务器验证：

```bash
npm run dev
```

### 检查项目：

1. **页面标题**: 浏览器标签页显示正确的标题
2. **语言切换**: URL 路径包含语言前缀（如 `/zh-CN/`）
3. **元标签**: 查看页面源码，确认 meta 标签存在
4. **社交分享**: 使用 [Facebook Debugger](https://developers.facebook.com/tools/debug/) 测试

## 🎉 完成！

恭喜！你已经完成了基础的 SEO 配置。你的网站现在具备了：

- ✅ 基础的搜索引擎优化
- ✅ 多语言支持
- ✅ 社交媒体分享优化
- ✅ 自动生成的站点地图和 robots.txt

## 🚀 下一步

如果你需要更高级的功能，可以继续阅读：

- **[完整配置指南](./complete-setup.md)** - 详细的高级配置
- **[OG Image 组件](../examples/og-image-components.md)** - 自定义社交分享图片
- **[Schema.org 配置](./schema-org.md)** - 结构化数据优化
- **[页面级 SEO 示例](../examples/page-level-seo.md)** - 不同页面类型的优化

## 🔧 常见问题

### Q: 为什么我的页面标题没有显示？
A: 确保在页面组件中使用了 `useSeoMeta` 或在语言文件中定义了相应的翻译。

### Q: 多语言路由不工作怎么办？
A: 检查 `i18n.strategy` 配置，确保设置为 `prefix_except_default`。

### Q: 如何自定义 OG 图片？
A: 参考 [OG Image 组件示例](../examples/og-image-components.md) 创建自定义组件。

---

> 💡 **提示**: 这只是基础配置。要了解完整的 SEO 优化策略和最佳实践，请阅读我们的 [权威参考指南](../reference/nuxt-seo-i18n-guide.md)。