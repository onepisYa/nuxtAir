# Nuxt SEO 完整优化指南

## 概述

本指南基于 Nuxt SEO v7+ 和 `@nuxtjs/i18n` 提供完整的 SEO 优化方案，专注于国际化官网的基础 SEO 需求和社交媒体分享体验。

## 核心模块配置

### 1. 必选模块（基础 SEO + 国际化）

#### Nuxt I18n
- **作用**: 多语言路由、本地化内容的基础
- **SEO 价值**: 为搜索引擎提供语言区分能力

#### SEO Utils
- **作用**: 处理核心元数据（标题、描述、规范URL）
- **SEO 价值**: 自动生成开放图谱标签，联动 i18n 生成 hreflang 标签

#### Sitemap
- **作用**: 自动生成包含多语言路由的站点地图
- **SEO 价值**: 加速搜索引擎收录，明确各语言版本页面关系

#### Robots
- **作用**: 控制爬虫抓取范围
- **SEO 价值**: 避免无效内容占用索引资源，适配多语言路径规则

### 2. 增强模块（提升分享与展现）

#### OG Image
- **作用**: 生成动态多语言分享图片
- **SEO 价值**: 提升社交媒体分享体验，自动适配不同语言

#### Schema.org
- **作用**: 结构化数据标记
- **SEO 价值**: 在搜索结果中展示富文本信息

## 当前配置状态

### nuxt.config.ts 配置

```typescript
export default defineNuxtConfig({
  // 站点配置
  site: {
    url: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com',
    name: process.env.NUXT_PUBLIC_SITENAME || 'NuxtAir',
    description: 'A modern Nuxt.js application with i18n and SEO optimization',
    defaultLocale: 'en-US'
  },

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-schema-org'
  ],

  // i18n 配置
  i18n: {
    strategy: 'prefix_except_default',
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com',
    locales: [
      {
        code: 'en-US',
        iso: 'en-US',
        language: 'en-US',
        name: 'English',
        dir: 'ltr',
        file: 'en-US.json',
        isCatchallLocale: true
      },
      {
        code: 'zh-CN',
        iso: 'zh-CN',
        language: 'zh-CN',
        name: '简体中文',
        dir: 'ltr',
        files: [{ path: 'zh-CN.json', cache: true }, 'zh-CN.js']
      }
    ],
    defaultLocale: 'en-US',
    langDir: 'i18n/locales',
    experimental: {
      strictSeo: true
    }
  },

  // SEO 模块配置
  sitemap: {
    hostname: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com',
    gzip: true,
    exclude: ['/admin/**', '/dev-api/**', '/prod-api/**']
  },

  robots: {
    groups: [{
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dev-api', '/prod-api']
    }],
    sitemap: `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}/sitemap.xml`
  },

  ogImage: {
    enabled: true,
    defaults: {
      component: 'OgImageDefault',
      width: 1200,
      height: 630
    }
  },

  seo: {
    automaticDefaults: true,
    fallbackTitle: process.env.NUXT_PUBLIC_SITENAME || 'NuxtAir'
  }
})
```

### app.vue 全局 SEO 配置

```vue
<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const sitename = useSiteName()

// 动态 SEO 元数据
useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  keywords: () => t('seo.keywords'),
  ogTitle: () => t('seo.ogTitle'),
  ogDescription: () => t('seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.title'),
  twitterDescription: () => t('seo.description')
})

// 配置 OG Image
defineOgImage({
  component: 'OgImageDefault',
  title: () => t('seo.ogTitle'),
  description: () => t('seo.ogDescription'),
  siteName: () => unref(sitename) as string,
  locale: () => locale.value
})

// i18n 头部信息
const i18nHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true
})

// 复杂头部配置
useHead(() => ({
  titleTemplate: (titleChunk?: string): string => {
    const baseTitle = unref(sitename) as string
    return titleChunk ? `${titleChunk} - ${baseTitle}` : baseTitle
  },
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang || locale.value,
    dir: i18nHead.value.htmlAttrs?.dir || 'ltr'
  },
  link: [...i18nHead.value.link || []],
  meta: [...i18nHead.value.meta || []]
}))

// 结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: () => t('seo.title'),
    description: () => t('seo.description'),
    inLanguage: locale.value,
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}${route.path}`
  })
])
</script>
```

## OG Image 优化实现

### 1. 默认 OG Image 组件 (OgImageDefault.vue)

```vue
<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- 背景渐变 -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
    
    <!-- 装饰性几何图形 -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
    
    <!-- 主要内容 -->
    <div class="relative z-10 w-full h-full flex flex-col justify-center items-center text-white p-16">
      <!-- Logo -->
      <div class="mb-8">
        <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
          <Icon name="uil:rocket" class="w-14 h-14 text-white" />
        </div>
      </div>
      
      <!-- 标题 -->
      <h1 class="text-6xl font-bold text-center mb-6 leading-tight max-w-4xl">
        {{ title || defaultTitle }}
      </h1>
      
      <!-- 描述 -->
      <p class="text-2xl text-center text-white/90 max-w-4xl leading-relaxed mb-8" v-if="description">
        {{ description }}
      </p>
      
      <!-- 底部信息 -->
      <div class="flex items-center gap-4 mt-auto">
        <div class="text-lg text-white/80">
          {{ siteName || defaultSiteName }}
        </div>
        <div class="w-2 h-2 bg-white/60 rounded-full"></div>
        <div class="text-lg text-white/80">
          {{ currentLocale === 'zh-CN' ? '现代化网络应用' : 'Modern Web Application' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  siteName?: string
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  siteName: '',
  locale: 'en-US'
})

const currentLocale = computed(() => props.locale || 'en-US')

const defaultTitle = computed(() => {
  return currentLocale.value === 'zh-CN' 
    ? 'NuxtAir - 现代化网络应用'
    : 'NuxtAir - Modern Web Application'
})

const defaultSiteName = computed(() => 'NuxtAir')
</script>
```

### 2. 博客专用 OG Image 组件 (OgImageBlog.vue)

已创建专门的博客文章 OG Image 组件，包含：
- 不同的配色方案（绿色系）
- 博客特有的视觉元素
- 作者和发布日期信息
- 多语言支持

### 3. 页面级 OG Image 使用

```vue
<!-- 博客文章页面 -->
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 博客文章专用 OG Image
defineOgImage({
  component: 'OgImageBlog',
  title: () => t('blog.post.title'),
  description: () => t('blog.post.description'),
  siteName: 'NuxtAir Blog',
  locale: () => locale.value,
  author: 'NuxtAir Team',
  publishDate: '2024-01-15'
})
</script>
```

## 语言文件 SEO 内容优化

### en-US.json
```json
{
  "seo": {
    "title": "NuxtAir - Modern Web Application",
    "description": "A modern, fast, and SEO-optimized web application built with Nuxt.js and Vue.js",
    "ogTitle": "NuxtAir - Experience the Future of Web",
    "ogDescription": "Discover our cutting-edge web application with internationalization support and modern design",
    "keywords": "nuxt, vue, web application, modern, fast, SEO"
  },
  "pages": {
    "home": {
      "title": "Home",
      "description": "Welcome to NuxtAir - your gateway to modern web experiences",
      "ogTitle": "NuxtAir - Your Gateway to Modern Web",
      "ogDescription": "Experience the future of web development with our modern, fast, and SEO-optimized application"
    },
    "about": {
      "title": "About Us",
      "description": "Learn more about our mission and values",
      "ogTitle": "About NuxtAir - Our Mission",
      "ogDescription": "Discover our commitment to creating exceptional web experiences using cutting-edge technologies"
    },
    "blog": {
      "title": "Blog",
      "description": "Read our latest articles and insights",
      "ogTitle": "NuxtAir Blog - Latest Insights",
      "ogDescription": "Stay updated with our latest articles on web development, technology trends, and best practices"
    }
  }
}
```

### zh-CN.json
```json
{
  "seo": {
    "title": "NuxtAir - 现代化网络应用",
    "description": "基于 Nuxt.js 和 Vue.js 构建的现代化、快速且 SEO 优化的网络应用",
    "ogTitle": "NuxtAir - 体验网络的未来",
    "ogDescription": "探索我们支持国际化和现代设计的前沿网络应用",
    "keywords": "nuxt, vue, 网络应用, 现代化, 快速, SEO"
  },
  "pages": {
    "home": {
      "title": "首页",
      "description": "欢迎来到 NuxtAir - 您通往现代网络体验的门户",
      "ogTitle": "NuxtAir - 您的现代网络门户",
      "ogDescription": "体验我们现代化、快速且 SEO 优化的网络应用的未来"
    },
    "about": {
      "title": "关于我们",
      "description": "了解更多关于我们的使命和价值观",
      "ogTitle": "关于 NuxtAir - 我们的使命",
      "ogDescription": "了解我们致力于使用前沿技术创造卓越网络体验的承诺"
    },
    "blog": {
      "title": "博客",
      "description": "阅读我们最新的文章和见解",
      "ogTitle": "NuxtAir 博客 - 最新见解",
      "ogDescription": "关注我们关于网络开发、技术趋势和最佳实践的最新文章"
    }
  }
}
```

## 最佳实践

### 1. 性能优化
- **OG Image 缓存**: 启用组件级缓存
- **Sitemap 压缩**: 启用 Gzip 压缩
- **按需加载**: 条件性模块加载

### 2. 监控与维护
- **SEO 审计**: 定期使用 Google Lighthouse 检查
- **链接检查**: 使用 Link Checker 检测失效链接
- **性能监控**: 监控页面加载速度和 Core Web Vitals

### 3. 国际化 SEO
- **hreflang 标签**: 自动生成正确的语言标签
- **规范 URL**: 确保每个页面有唯一的规范 URL
- **语言特定内容**: 为不同语言提供独特的 SEO 内容

### 4. 结构化数据
- **WebPage Schema**: 基础页面信息
- **Organization Schema**: 企业信息
- **Article Schema**: 博客文章信息
- **Product Schema**: 产品页面信息（如需要）

## 测试与验证

### 1. SEO 功能测试
- 访问 `/sitemap.xml` 查看站点地图
- 访问 `/robots.txt` 查看爬虫规则
- 检查页面源码中的 meta 标签
- 验证 JSON-LD 结构化数据

### 2. 国际化测试
- 测试语言切换功能
- 验证多语言 URL 结构
- 检查 hreflang 标签生成
- 确认 OG Image 多语言适配

### 3. 社交媒体测试
- 使用 Facebook Sharing Debugger
- 使用 Twitter Card Validator
- 测试 LinkedIn 分享预览

## 部署注意事项

### 1. 环境变量配置
```bash
NUXT_PUBLIC_BASE_URL=https://your-domain.com
NUXT_PUBLIC_SITENAME=Your Site Name
```

### 2. 生产环境优化
- 启用 SSR 或 SSG
- 配置 CDN 缓存策略
- 设置正确的 robots.txt
- 提交站点地图到搜索引擎

### 3. 监控设置
- Google Search Console
- Google Analytics
- 性能监控工具

## 总结

本方案提供了完整的 Nuxt SEO 优化解决方案，重点关注：

1. **全面覆盖**: 搜索引擎索引、基础元数据、国际化识别、社交媒体分享
2. **低维护成本**: 模块间自动联动，OG Image 模板复用
3. **现代化设计**: 美观的 OG Image 模板，支持多语言
4. **最佳实践**: 遵循 SEO 最佳实践和性能优化原则

通过这套方案，可以高效完成国际化官网的 SEO 搭建，兼顾技术规范与用户分享体验。