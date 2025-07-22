# Nuxt SEO 完整实现指南

## 概述

本文档详细记录了 NuxtAir 项目中完整的 SEO 优化实现，包括基础配置、OG Image 优化、Schema.org 结构化数据、多语言支持等。

## 🎯 实现的功能

### 1. 核心 SEO 模块配置

#### nuxt.config.ts 配置
```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    'nuxt-schema-org'
  ],
  
  // 站点基础配置
  site: {
    url: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com',
    name: 'NuxtAir',
    description: 'Modern web application built with Nuxt.js',
    defaultLocale: 'en-US'
  },
  
  // OG Image 配置
  ogImage: {
    enabled: true,
    component: 'OgImageDefault',
    defaults: {
      width: 1200,
      height: 630
    }
  },
  
  // Sitemap 配置
  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },
  
  // Robots 配置
  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
        disallow: ['/admin', '/api']
      }
    ]
  }
})
```

### 2. OG Image 组件优化

#### OgImageDefault.vue - 通用 OG Image
```vue
<template>
  <div class="og-container">
    <!-- 渐变背景 -->
    <div class="bg-gradient" />
    
    <!-- 装饰性几何图形 -->
    <div class="decorative-shapes">
      <div class="shape shape-1" />
      <div class="shape shape-2" />
      <div class="shape shape-3" />
    </div>
    
    <!-- Logo 区域 -->
    <div class="logo-container">
      <div class="logo-icon">🚀</div>
    </div>
    
    <!-- 文本内容 -->
    <div class="content">
      <h1 class="title">{{ title || defaultTitle }}</h1>
      <p class="description">{{ description }}</p>
      <div class="site-info">
        <span class="site-name">{{ siteName || defaultSiteName }}</span>
        <span class="tagline">{{ tagline }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  siteName: String,
  locale: String
})

const currentLocale = computed(() => props.locale || 'en-US')
const isChinese = computed(() => currentLocale.value === 'zh-CN')

const defaultTitle = computed(() => 
  isChinese.value ? 'NuxtAir - 现代化网络应用' : 'NuxtAir - Modern Web Application'
)

const defaultSiteName = computed(() => 
  isChinese.value ? 'NuxtAir 官网' : 'NuxtAir Official'
)

const tagline = computed(() => 
  isChinese.value ? '体验网络的未来' : 'Experience the Future of Web'
)
</script>
```

#### OgImageBlog.vue - 博客专用 OG Image
```vue
<template>
  <div class="blog-og-container">
    <!-- 博客专用渐变背景 -->
    <div class="blog-bg-gradient" />
    
    <!-- 装饰性图案 -->
    <div class="blog-patterns">
      <div class="pattern pattern-1" />
      <div class="pattern pattern-2" />
    </div>
    
    <!-- 内容区域 -->
    <div class="blog-content">
      <div class="blog-header">
        <div class="blog-icon">📝</div>
        <span class="blog-label">{{ blogLabel }}</span>
      </div>
      
      <h1 class="blog-title">{{ title }}</h1>
      <p class="blog-description">{{ description }}</p>
      
      <div class="blog-meta">
        <div class="author-info">
          <span class="author-label">{{ authorLabel }}</span>
          <span class="author-name">{{ author }}</span>
        </div>
        <div class="publish-info">
          <span class="date-label">{{ dateLabel }}</span>
          <span class="publish-date">{{ formattedDate }}</span>
        </div>
      </div>
      
      <div class="blog-footer">
        <span class="site-name">{{ siteName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  author: String,
  publishDate: String,
  siteName: String,
  locale: String
})

const currentLocale = computed(() => props.locale || 'en-US')
const isChinese = computed(() => currentLocale.value === 'zh-CN')

const blogLabel = computed(() => isChinese.value ? '博客文章' : 'Blog Post')
const authorLabel = computed(() => isChinese.value ? '作者:' : 'By')
const dateLabel = computed(() => isChinese.value ? '发布:' : 'Published')

const formattedDate = computed(() => {
  if (!props.publishDate) return ''
  const date = new Date(props.publishDate)
  return date.toLocaleDateString(currentLocale.value)
})
</script>
```

### 3. 页面级 SEO 实现

#### app.vue - 全局 SEO 配置
```vue
<script setup>
const { t, locale } = useI18n()

// 全局 SEO 配置
useSeoMeta({
  titleTemplate: '%s | NuxtAir',
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  keywords: () => t('seo.keywords'),
  ogTitle: () => t('seo.ogTitle'),
  ogDescription: () => t('seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// 全局 OG Image
defineOgImage({
  component: 'OgImageDefault',
  title: () => t('seo.ogTitle'),
  description: () => t('seo.ogDescription'),
  siteName: 'NuxtAir',
  locale: () => locale.value
})

// 全局结构化数据
useSchemaOrg([
  defineWebSite({
    name: 'NuxtAir',
    description: () => t('seo.description'),
    inLanguage: locale.value,
    url: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'
  })
])
</script>
```

#### 页面级 SEO 示例 (about/index.vue)
```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 页面级 SEO 配置
useSeoMeta({
  title: () => t('pages.about.title'),
  description: () => t('pages.about.description'),
  keywords: () => 'about us, company, mission, values, team, NuxtAir',
  ogTitle: () => t('pages.about.ogTitle'),
  ogDescription: () => t('pages.about.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('pages.about.ogTitle'),
  twitterDescription: () => t('pages.about.ogDescription')
})

// 页面级 OG Image
defineOgImage({
  component: 'OgImageDefault',
  title: () => t('pages.about.ogTitle'),
  description: () => t('pages.about.ogDescription'),
  siteName: 'NuxtAir',
  locale: () => locale.value
})

// 页面级结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: () => t('pages.about.title'),
    description: () => t('pages.about.description'),
    inLanguage: locale.value,
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}${route.path}`,
    mainEntity: {
      '@type': 'Organization',
      name: 'NuxtAir',
      description: () => t('pages.about.description'),
      url: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'
    }
  })
])
</script>
```

#### 博客文章页面 SEO (blog/[slug].vue)
```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 页面级 SEO 配置
useSeoMeta({
  title: () => `${post.value?.title} | ${t('pages.blog.title')}`,
  description: () => post.value?.excerpt,
  keywords: () => post.value?.tags.join(', '),
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.excerpt,
  ogType: 'article',
  articleAuthor: () => post.value?.author,
  articlePublishedTime: () => post.value?.date,
  articleSection: () => 'Technology',
  articleTag: () => post.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title,
  twitterDescription: () => post.value?.excerpt
})

// 博客文章专用 OG Image
defineOgImage({
  component: 'OgImageBlog',
  title: () => post.value?.title,
  description: () => post.value?.excerpt,
  author: () => post.value?.author,
  publishDate: () => post.value?.date,
  siteName: 'NuxtAir',
  locale: () => locale.value
})

// 文章级结构化数据
useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    headline: () => post.value?.title,
    description: () => post.value?.excerpt,
    image: () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}/api/__og-image__/image/blog/${route.params.slug}/og.png`,
    datePublished: () => post.value?.date,
    dateModified: () => post.value?.date,
    author: {
      '@type': 'Person',
      name: () => post.value?.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'NuxtAir',
      url: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}${route.path}`
    },
    articleSection: 'Technology',
    keywords: () => post.value?.tags,
    wordCount: () => post.value?.content.split(' ').length,
    inLanguage: locale.value
  })
])
</script>
```

### 4. 多语言 SEO 内容

#### en-US.json
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
      "subtitle": "Your Gateway to Modern Web Experiences",
      "ogTitle": "NuxtAir - Your Gateway to Modern Web",
      "ogDescription": "Experience the future of web development with our modern, fast, and SEO-optimized application"
    },
    "about": {
      "title": "About Us",
      "description": "Learn more about our mission and values",
      "content": "We are dedicated to creating exceptional web experiences using the latest technologies.",
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

#### zh-CN.json
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
      "subtitle": "您通往现代网络体验的门户",
      "ogTitle": "NuxtAir - 您的现代网络门户",
      "ogDescription": "体验我们现代化、快速且 SEO 优化的网络应用的未来"
    },
    "about": {
      "title": "关于我们",
      "description": "了解更多关于我们的使命和价值观",
      "content": "我们致力于使用最新技术创造卓越的网络体验。",
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

### 5. 环境配置

#### .env.example
```env
# SEO 基础配置
NUXT_PUBLIC_BASE_URL=https://your-domain.com
NUXT_PUBLIC_SITENAME=NuxtAir

# API 配置
NUXT_PUBLIC_API_BASE=https://api.your-domain.com

# 图片服务配置
NUXT_PUBLIC_IMAGE_DOMAIN=images.your-domain.com

# 联系信息
NUXT_PUBLIC_CONTACT_EMAIL=contact@your-domain.com
NUXT_PUBLIC_SUPPORT_EMAIL=support@your-domain.com

# 社交媒体
NUXT_PUBLIC_TWITTER_HANDLE=@yourtwitterhandle
NUXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/yourcompany

# 开发环境设置
NUXT_PUBLIC_DEV_MODE=false

# 生产环境设置
NUXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NUXT_PUBLIC_GTM_ID=your-gtm-id
```

## 🚀 最佳实践

### 1. SEO 性能优化
- 使用 `useSeoMeta` 而不是 `useHead` 来设置 meta 标签
- 利用 `defineOgImage` 生成动态 OG 图片
- 实现结构化数据以提高搜索引擎理解
- 确保所有页面都有唯一的 title 和 description

### 2. 国际化 SEO
- 为每种语言提供完整的 SEO 内容
- 使用 `hreflang` 标签指示语言版本
- 确保 URL 结构支持多语言
- 为不同语言提供本地化的 OG 图片

### 3. 监控和测试
- 使用 Google Search Console 监控索引状态
- 定期检查 OG 图片生成是否正常
- 验证结构化数据的正确性
- 测试不同设备和社交平台的显示效果

### 4. 部署注意事项
- 确保 `NUXT_PUBLIC_BASE_URL` 设置正确
- 验证 sitemap 和 robots.txt 生成
- 检查 OG 图片 API 端点可访问性
- 监控页面加载速度和 Core Web Vitals

## 📊 SEO 检查清单

### 基础 SEO
- [x] 每个页面都有唯一的 title
- [x] 每个页面都有描述性的 meta description
- [x] 实现了 Open Graph 标签
- [x] 实现了 Twitter Card 标签
- [x] 设置了正确的 canonical URL

### 结构化数据
- [x] 网站级别的 WebSite schema
- [x] 页面级别的 WebPage schema
- [x] 文章页面的 Article schema
- [x] 组织信息的 Organization schema

### 技术 SEO
- [x] 生成了 sitemap.xml
- [x] 配置了 robots.txt
- [x] 实现了多语言 hreflang
- [x] 优化了页面加载速度

### OG 图片
- [x] 默认 OG 图片组件
- [x] 博客专用 OG 图片组件
- [x] 多语言 OG 图片支持
- [x] 动态内容 OG 图片生成

## 🔧 故障排除

### 常见问题
1. **OG 图片不显示**: 检查 API 端点和图片生成逻辑
2. **结构化数据错误**: 使用 Google Rich Results Test 验证
3. **多语言 SEO 问题**: 确保语言文件完整且格式正确
4. **性能问题**: 优化图片大小和减少不必要的 meta 标签

### 调试工具
- Google Search Console
- Facebook Sharing Debugger
- Twitter Card Validator
- Google Rich Results Test
- Lighthouse SEO 审计

## 📈 下一步优化

1. **高级结构化数据**
   - 实现 FAQ schema
   - 添加 BreadcrumbList schema
   - 实现 Product schema（如适用）

2. **性能优化**
   - 实现 OG 图片缓存
   - 优化 meta 标签生成性能
   - 减少 JavaScript 包大小

3. **监控和分析**
   - 集成 Google Analytics 4
   - 设置 Core Web Vitals 监控
   - 实现 SEO 性能仪表板

4. **内容优化**
   - 实现自动 meta description 生成
   - 添加相关文章推荐
   - 优化内部链接结构

---

**实现状态**: ✅ 完成  
**最后更新**: 2024-01-15  
**维护者**: NuxtAir Team