# 基础 SEO 配置示例

## 📖 概述

本文档提供了可直接复制使用的 SEO 配置代码示例，涵盖了常见的页面类型和使用场景。所有示例都基于当前项目的实际配置。

> **参考来源**: 本文档中的配置基于 [权威指南](../reference/nuxt-seo-i18n-guide.md) 的最佳实践

## 🏠 首页 SEO 配置

### `pages/index.vue`

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 首页 SEO 配置
useSeoMeta({
  title: () => t('pages.home.title'),
  description: () => t('pages.home.description'),
  keywords: () => t('pages.home.keywords'),
  ogTitle: () => t('pages.home.ogTitle'),
  ogDescription: () => t('pages.home.ogDescription'),
  ogType: 'website',
  ogImage: '/images/home-og.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('pages.home.title'),
  twitterDescription: () => t('pages.home.description')
})

// 首页结构化数据
useSchemaOrg([
  defineWebSite({
    name: () => t('site.name'),
    description: () => t('site.description'),
    url: process.env.NUXT_PUBLIC_BASE_URL,
    inLanguage: locale.value
  }),
  defineWebPage({
    '@type': 'WebPage',
    name: () => t('pages.home.title'),
    description: () => t('pages.home.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`
  })
])
</script>

<template>
  <div>
    <h1>{{ t('pages.home.title') }}</h1>
    <p>{{ t('pages.home.description') }}</p>
    <!-- 页面内容 -->
  </div>
</template>
```

### 对应的语言文件

```json
// i18n/locales/en-US.json
{
  "site": {
    "name": "NuxtAir",
    "description": "Modern web application built with Nuxt.js"
  },
  "pages": {
    "home": {
      "title": "Welcome to NuxtAir",
      "description": "Experience the future of web development with our modern Nuxt.js application featuring SEO optimization and internationalization.",
      "keywords": "nuxt, vue, seo, i18n, web development",
      "ogTitle": "NuxtAir - Modern Web Development",
      "ogDescription": "Build amazing web applications with Nuxt.js, SEO optimization, and multi-language support."
    }
  }
}
```

```json
// i18n/locales/zh-CN.json
{
  "site": {
    "name": "NuxtAir",
    "description": "使用 Nuxt.js 构建的现代化网络应用"
  },
  "pages": {
    "home": {
      "title": "欢迎来到 NuxtAir",
      "description": "体验现代化网络开发的未来，我们的 Nuxt.js 应用具备 SEO 优化和国际化功能。",
      "keywords": "nuxt, vue, seo, 国际化, 网络开发",
      "ogTitle": "NuxtAir - 现代化网络开发",
      "ogDescription": "使用 Nuxt.js 构建令人惊叹的网络应用，具备 SEO 优化和多语言支持。"
    }
  }
}
```

## 📄 关于页面 SEO 配置

### `pages/about.vue`

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 关于页面 SEO 配置
useSeoMeta({
  title: () => t('pages.about.title'),
  description: () => t('pages.about.description'),
  keywords: () => t('pages.about.keywords'),
  ogTitle: () => t('pages.about.ogTitle'),
  ogDescription: () => t('pages.about.ogDescription'),
  ogType: 'website',
  ogImage: '/images/about-og.jpg',
  twitterCard: 'summary_large_image'
})

// 关于页面结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: () => t('pages.about.title'),
    description: () => t('pages.about.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`,
    inLanguage: locale.value
  }),
  defineOrganization({
    name: () => t('site.name'),
    description: () => t('site.description'),
    url: process.env.NUXT_PUBLIC_BASE_URL
  })
])
</script>

<template>
  <div>
    <h1>{{ t('pages.about.title') }}</h1>
    <p>{{ t('pages.about.description') }}</p>
    <!-- 页面内容 -->
  </div>
</template>
```

## 📝 博客文章页面 SEO 配置

### `pages/test/blog/[slug].vue`

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 假设从 API 或文件系统获取文章数据
const { data: article } = await $fetch(`/api/blog/${route.params.slug}`)

// 博客文章 SEO 配置
useSeoMeta({
  title: article.title,
  description: article.excerpt,
  keywords: article.tags?.join(', '),
  ogTitle: article.title,
  ogDescription: article.excerpt,
  ogType: 'article',
  ogImage: article.featuredImage || '/images/blog-default-og.jpg',
  articleAuthor: article.author,
  articlePublishedTime: article.publishedAt,
  articleModifiedTime: article.updatedAt,
  twitterCard: 'summary_large_image'
})

// 博客文章结构化数据
useSchemaOrg([
  defineArticle({
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: t('site.name')
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: locale.value,
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`
  })
])

// 自定义 OG 图片（博客专用）
defineOgImage({
  component: 'OgImageBlog',
  title: article.title,
  description: article.excerpt,
  author: article.author,
  publishDate: article.publishedAt,
  locale: locale.value
})
</script>

<template>
  <article>
    <h1>{{ article.title }}</h1>
    <p class="excerpt">{{ article.excerpt }}</p>
    <div class="meta">
      <span>{{ t('blog.author') }}: {{ article.author }}</span>
      <span>{{ t('blog.published') }}: {{ formatDate(article.publishedAt) }}</span>
    </div>
    <div class="content" v-html="article.content"></div>
  </article>
</template>
```

## 🛍️ 产品页面 SEO 配置

### `pages/products/[id].vue`

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 获取产品数据
const { data: product } = await $fetch(`/api/products/${route.params.id}`)

// 产品页面 SEO 配置
useSeoMeta({
  title: `${product.name} | ${t('site.name')}`,
  description: product.description,
  keywords: product.tags?.join(', '),
  ogTitle: product.name,
  ogDescription: product.description,
  ogType: 'product',
  ogImage: product.images?.[0] || '/images/product-default-og.jpg',
  productPrice: product.price,
  productCurrency: product.currency,
  productAvailability: product.inStock ? 'in stock' : 'out of stock',
  twitterCard: 'summary_large_image'
})

// 产品结构化数据
useSchemaOrg([
  defineProduct({
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock ? 'InStock' : 'OutOfStock',
      seller: {
        '@type': 'Organization',
        name: t('site.name')
      }
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.average,
      reviewCount: product.rating.count
    } : undefined
  })
])
</script>

<template>
  <div>
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <div class="price">{{ formatPrice(product.price, product.currency) }}</div>
    <!-- 产品详情 -->
  </div>
</template>
```

## 📞 联系页面 SEO 配置

### `pages/contact.vue`

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 联系页面 SEO 配置
useSeoMeta({
  title: () => t('pages.contact.title'),
  description: () => t('pages.contact.description'),
  keywords: () => t('pages.contact.keywords'),
  ogTitle: () => t('pages.contact.ogTitle'),
  ogDescription: () => t('pages.contact.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary'
})

// 联系页面结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: () => t('pages.contact.title'),
    description: () => t('pages.contact.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`
  }),
  defineOrganization({
    name: () => t('site.name'),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'contact@example.com'
    }
  })
])
</script>

<template>
  <div>
    <h1>{{ t('pages.contact.title') }}</h1>
    <p>{{ t('pages.contact.description') }}</p>
    <!-- 联系表单 -->
  </div>
</template>
```

## 🔧 通用 SEO 工具函数

### `composables/useSeo.ts`

```typescript
// composables/useSeo.ts
export const useSeo = () => {
  const { t, locale } = useI18n()
  const route = useRoute()

  /**
   * 设置基础页面 SEO
   */
  const setBasicSeo = (options: {
    titleKey: string
    descriptionKey: string
    keywordsKey?: string
    ogImage?: string
    type?: string
  }) => {
    useSeoMeta({
      title: () => t(options.titleKey),
      description: () => t(options.descriptionKey),
      keywords: options.keywordsKey ? () => t(options.keywordsKey) : undefined,
      ogTitle: () => t(options.titleKey),
      ogDescription: () => t(options.descriptionKey),
      ogType: options.type || 'website',
      ogImage: options.ogImage,
      twitterCard: 'summary_large_image'
    })
  }

  /**
   * 设置页面结构化数据
   */
  const setPageSchema = (options: {
    type?: string
    titleKey: string
    descriptionKey: string
  }) => {
    useSchemaOrg([
      defineWebPage({
        '@type': options.type || 'WebPage',
        name: () => t(options.titleKey),
        description: () => t(options.descriptionKey),
        url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`,
        inLanguage: locale.value
      })
    ])
  }

  /**
   * 获取当前页面的完整 URL
   */
  const getCurrentUrl = () => {
    return `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`
  }

  /**
   * 格式化日期
   */
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(locale.value)
  }

  return {
    setBasicSeo,
    setPageSchema,
    getCurrentUrl,
    formatDate
  }
}
```

### 使用工具函数的简化示例

```vue
<script setup>
const { setBasicSeo, setPageSchema } = useSeo()

// 简化的 SEO 配置
setBasicSeo({
  titleKey: 'pages.about.title',
  descriptionKey: 'pages.about.description',
  keywordsKey: 'pages.about.keywords',
  ogImage: '/images/about-og.jpg'
})

setPageSchema({
  type: 'AboutPage',
  titleKey: 'pages.about.title',
  descriptionKey: 'pages.about.description'
})
</script>
```

## 📱 移动端优化

### 响应式 Meta 标签

```vue
<script setup>
// 移动端优化配置
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'theme-color', content: '#ffffff' }
  ]
})
</script>
```

## 🎯 SEO 最佳实践提醒

### 标题优化
- ✅ 保持在 50-60 字符以内
- ✅ 包含主要关键词
- ✅ 每个页面使用唯一标题
- ✅ 使用品牌名称作为后缀

### 描述优化
- ✅ 保持在 150-160 字符以内
- ✅ 包含相关关键词
- ✅ 提供有价值的信息
- ✅ 包含行动号召（CTA）

### 关键词优化
- ✅ 使用相关的长尾关键词
- ✅ 避免关键词堆砌
- ✅ 考虑用户搜索意图
- ✅ 包含本地化关键词

---

> 💡 **提示**: 这些示例基于当前项目的实际配置。要了解更深入的 SEO 策略和高级配置，请参考 [权威指南](../reference/nuxt-seo-i18n-guide.md) 和 [完整配置指南](../implementation/complete-setup.md)。