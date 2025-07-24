# Schema.org 结构化数据实现指南

基于 Nuxt SEO 和 Schema.org 的完整结构化数据配置方案

## 概述

Schema.org 是一套用于标记网页内容的结构化数据词汇表，帮助搜索引擎更好地理解和展示网页内容。在 Nuxt 项目中，我们使用 `nuxt-schema-org` 模块来实现结构化数据。

## 核心概念

### 1. 基本结构

所有 Schema.org 标记都包含以下基本元素：
- `@context`: 指向 Schema.org 词汇表
- `@type`: 定义实体类型
- 属性: 描述实体的具体信息

### 2. 常用实体类型

#### 网站基础类型
- `WebSite`: 网站本身
- `WebPage`: 网页
- `Organization`: 组织/公司
- `Person`: 个人
- `BreadcrumbList`: 面包屑导航

#### 内容类型
- `Article`: 文章
- `BlogPosting`: 博客文章
- `NewsArticle`: 新闻文章
- `Product`: 产品
- `Service`: 服务

## 在 Nuxt 中的实现

### 1. 基础配置

在 `nuxt.config.ts` 中确保已启用 Schema.org 模块：

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo' // 包含 nuxt-schema-org
  ],
  schemaOrg: {
    enabled: true
  }
})
```

### 2. 全局网站配置

在 `app.vue` 中设置网站级别的结构化数据：

```vue
<script setup>
const { locale } = useI18n()
const route = useRoute()

// 网站基础信息
useSchemaOrg([
  defineWebSite({
    name: 'NuxtAir',
    description: 'A modern web application built with Nuxt',
    url: process.env.NUXT_PUBLIC_BASE_URL,
    inLanguage: locale.value,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NUXT_PUBLIC_BASE_URL}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }),
  
  defineOrganization({
    name: 'NuxtAir',
    url: process.env.NUXT_PUBLIC_BASE_URL,
    logo: `${process.env.NUXT_PUBLIC_BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/nuxtair',
      'https://github.com/nuxtair'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese']
    }
  }),
  
  defineWebPage({
    '@type': 'WebPage',
    name: () => useHead().value.title || 'NuxtAir',
    description: () => useSeoMeta().description || 'Welcome to NuxtAir',
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`,
    inLanguage: locale.value,
    isPartOf: {
      '@id': `${process.env.NUXT_PUBLIC_BASE_URL}#website`
    }
  })
])
</script>
```

### 3. 页面级别配置

#### 首页 (pages/index.vue)

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 首页 SEO
useSeoMeta({
  title: () => t('pages.home.title'),
  description: () => t('pages.home.description')
})

// 首页结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: () => t('pages.home.title'),
    description: () => t('pages.home.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`,
    inLanguage: locale.value,
    mainEntity: {
      '@type': 'Organization',
      '@id': `${process.env.NUXT_PUBLIC_BASE_URL}#organization`
    }
  })
])
</script>
```

#### 关于页面 (pages/about.vue)

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 关于页面 SEO
useSeoMeta({
  title: () => t('pages.about.title'),
  description: () => t('pages.about.description')
})

// 关于页面结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: () => t('pages.about.title'),
    description: () => t('pages.about.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`,
    inLanguage: locale.value,
    mainEntity: {
      '@type': 'Organization',
      '@id': `${process.env.NUXT_PUBLIC_BASE_URL}#organization`,
      foundingDate: '2024',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '10-50'
      },
      knowsAbout: [
        'Web Development',
        'Vue.js',
        'Nuxt.js',
        'TypeScript'
      ]
    }
  })
])
</script>
```

#### 博客列表页面 (pages/test/blog/index.vue)

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 假设从 API 获取博客列表
const { data: posts } = await $fetch('/api/blog')

// 博客列表页面结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: () => t('pages.blog.title'),
    description: () => t('pages.blog.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`,
    inLanguage: locale.value,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts?.length || 0,
      itemListElement: posts?.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          '@id': `${process.env.NUXT_PUBLIC_BASE_URL}/test/blog/${post.slug}`,
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: {
            '@type': 'Person',
            name: post.author.name
          }
        }
      })) || []
    }
  })
])
</script>
```

#### 博客文章页面 (pages/test/blog/[slug].vue)

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 获取文章数据
const { data: post } = await $fetch(`/api/blog/${route.params.slug}`)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

// 文章页面 SEO
useSeoMeta({
  title: post.title,
  description: post.excerpt,
  ogImage: post.featuredImage
})

// 文章页面结构化数据
useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
      image: post.author.avatar
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${process.env.NUXT_PUBLIC_BASE_URL}#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
    wordCount: post.wordCount,
    inLanguage: locale.value
  }),
  
  // 面包屑导航
  defineBreadcrumb([
    { name: t('nav.home'), item: '/' },
    { name: t('nav.blog'), item: '/test/blog' },
    { name: post.title, item: route.path }
  ])
])
</script>
```

### 4. 产品/服务页面

如果网站包含产品或服务，可以添加相应的结构化数据：

```vue
<script setup>
// 产品页面示例
useSchemaOrg([
  defineProduct({
    name: 'NuxtAir Pro',
    description: 'Professional web development service',
    image: '/images/product-pro.jpg',
    brand: {
      '@type': 'Brand',
      name: 'NuxtAir'
    },
    offers: {
      '@type': 'Offer',
      price: '999',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2024-01-01',
      seller: {
        '@type': 'Organization',
        '@id': `${process.env.NUXT_PUBLIC_BASE_URL}#organization`
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 127,
      bestRating: 5,
      worstRating: 1
    }
  })
])
</script>
```

### 5. 联系页面

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 联系页面结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: () => t('pages.contact.title'),
    description: () => t('pages.contact.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`,
    inLanguage: locale.value,
    mainEntity: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      email: 'contact@nuxtair.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese'],
      areaServed: 'Worldwide',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
        validFrom: '2024-01-01',
        validThrough: '2024-12-31'
      }
    }
  })
])
</script>
```

## 多语言支持

### 1. 语言特定的结构化数据

```vue
<script setup>
const { locale } = useI18n()

// 根据语言设置不同的结构化数据
const getLocalizedSchema = () => {
  const baseSchema = {
    '@type': 'Organization',
    name: 'NuxtAir',
    url: process.env.NUXT_PUBLIC_BASE_URL
  }
  
  if (locale.value === 'zh-CN') {
    return {
      ...baseSchema,
      name: 'NuxtAir 中国',
      description: '专业的网站开发服务',
      areaServed: {
        '@type': 'Country',
        name: 'China'
      }
    }
  }
  
  return {
    ...baseSchema,
    description: 'Professional web development services',
    areaServed: {
      '@type': 'Country',
      name: 'Global'
    }
  }
}

useSchemaOrg([getLocalizedSchema()])
</script>
```

### 2. 多语言内容标记

```vue
<script setup>
const { locale, locales } = useI18n()
const route = useRoute()

// 为多语言页面添加 sameAs 属性
const alternateUrls = locales.value
  .filter(l => l.code !== locale.value)
  .map(l => `${process.env.NUXT_PUBLIC_BASE_URL}${l.code === 'en-US' ? '' : '/' + l.code}${route.path}`)

useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    inLanguage: locale.value,
    sameAs: alternateUrls
  })
])
</script>
```

## 最佳实践

### 1. 数据验证

使用 Google 的结构化数据测试工具验证：
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

### 2. 性能优化

```vue
<script setup>
// 使用 computed 避免不必要的重新计算
const schemaData = computed(() => ({
  '@type': 'WebPage',
  name: pageTitle.value,
  description: pageDescription.value
}))

useSchemaOrg([schemaData])
</script>
```

### 3. 错误处理

```vue
<script setup>
try {
  const { data: post } = await $fetch(`/api/blog/${route.params.slug}`)
  
  if (post) {
    useSchemaOrg([
      defineArticle({
        headline: post.title,
        // ... 其他属性
      })
    ])
  }
} catch (error) {
  console.error('Failed to load schema data:', error)
  // 提供默认的结构化数据
  useSchemaOrg([
    defineWebPage({
      '@type': 'WebPage',
      name: 'Page Not Found'
    })
  ])
}
</script>
```

### 4. 开发环境调试

```vue
<script setup>
// 开发环境下输出结构化数据用于调试
if (process.dev) {
  const schemaData = {
    '@type': 'WebPage',
    name: 'Debug Page'
  }
  
  console.log('Schema.org data:', JSON.stringify(schemaData, null, 2))
  useSchemaOrg([schemaData])
}
</script>
```

## 常见问题

### 1. 重复的结构化数据

确保每个页面只定义一次相同类型的结构化数据：

```vue
<script setup>
// ❌ 错误：重复定义
useSchemaOrg([defineWebPage({ name: 'Page 1' })])
useSchemaOrg([defineWebPage({ name: 'Page 2' })]) // 会覆盖第一个

// ✅ 正确：合并定义
useSchemaOrg([
  defineWebPage({
    name: 'Correct Page',
    description: 'Combined data'
  })
])
</script>
```

### 2. 动态数据处理

```vue
<script setup>
// 等待数据加载完成后再设置结构化数据
const { pending, data: post } = await useLazyAsyncData('post', () => 
  $fetch(`/api/blog/${route.params.slug}`)
)

watch(post, (newPost) => {
  if (newPost) {
    useSchemaOrg([
      defineArticle({
        headline: newPost.title,
        datePublished: newPost.publishedAt
      })
    ])
  }
}, { immediate: true })
</script>
```

### 3. 条件性结构化数据

```vue
<script setup>
const { data: user } = await getCurrentUser()

// 只有在用户登录时才添加特定的结构化数据
if (user) {
  useSchemaOrg([
    definePerson({
      name: user.name,
      email: user.email
    })
  ])
}
</script>
```

## 总结

通过合理使用 Schema.org 结构化数据，可以显著提升网站在搜索引擎中的表现：

1. **提高搜索可见性**: 帮助搜索引擎更好地理解页面内容
2. **增强搜索结果**: 可能获得富文本搜索结果（Rich Snippets）
3. **改善用户体验**: 提供更准确的搜索结果预览
4. **支持语音搜索**: 结构化数据有助于语音助手理解内容

记住要定期验证结构化数据的正确性，并根据网站内容的变化及时更新相应的标记。