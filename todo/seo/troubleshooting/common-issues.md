# SEO 常见问题解答

## 🔍 概述

本文档收集了在实施 Nuxt.js SEO 和国际化过程中遇到的常见问题及其解决方案。问题按类别分组，便于快速查找。

## 🌍 国际化相关问题

### Q1: 为什么 hreflang 标签没有生成？

**症状**: 页面源码中看不到 `<link rel="alternate" hreflang="..." />` 标签

**可能原因**:
1. `baseUrl` 配置缺失或错误
2. `useLocaleHead()` 未正确调用
3. i18n 配置中的 `locales` 格式不正确

**解决方案**:

```typescript
// nuxt.config.ts - 确保正确配置
i18n: {
  baseUrl: 'https://your-domain.com', // 必须是完整的 URL
  locales: [
    {
      code: 'en-US',
      iso: 'en-US',        // 必须包含 iso 属性
      language: 'en-US'    // 用于生成 hreflang
    },
    {
      code: 'zh-CN',
      iso: 'zh-CN',
      language: 'zh-CN'
    }
  ]
}
```

```vue
<!-- app.vue - 确保正确使用 useLocaleHead -->
<script setup>
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true,
  addCanonicalLinks: true,
  addHreflangLinks: true  // 明确启用 hreflang
})

useHead(() => ({
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
}))
</script>
```

> **参考来源**: [权威指南第2章 - baseUrl 配置的重要性](../reference/nuxt-seo-i18n-guide.md#nuxtconfigts-基本配置)

### Q2: 语言切换后 SEO 元数据没有更新

**症状**: 切换语言后，页面标题和描述仍然显示之前语言的内容

**解决方案**:

```vue
<script setup>
const { t, locale } = useI18n()

// 使用响应式函数确保语言切换时更新
useSeoMeta({
  title: () => t('pages.home.title'),        // 使用箭头函数
  description: () => t('pages.home.description'),
  // 避免直接使用 t('pages.home.title')
})
</script>
```

### Q3: 默认语言的 URL 包含了语言前缀

**症状**: 英文页面显示为 `/en-US/about` 而不是 `/about`

**解决方案**:

```typescript
// nuxt.config.ts
i18n: {
  strategy: 'prefix_except_default', // 默认语言不使用前缀
  defaultLocale: 'en-US'
}
```

## 🏷️ Meta 标签相关问题

### Q4: Open Graph 图片不显示

**症状**: 在社交媒体分享时，图片不显示或显示错误

**可能原因**:
1. 图片路径不正确
2. 图片尺寸不符合要求
3. 图片无法访问（404错误）

**解决方案**:

```vue
<script setup>
// 确保使用完整的 URL
useSeoMeta({
  ogImage: `${process.env.NUXT_PUBLIC_BASE_URL}/images/og-image.jpg`,
  // 或者使用相对路径（确保图片在 public 目录下）
  ogImage: '/images/og-image.jpg'
})

// 使用 OG Image 组件生成动态图片
defineOgImage({
  component: 'OgImageDefault',
  width: 1200,
  height: 630
})
</script>
```

**图片要求**:
- 尺寸: 1200x630px (推荐)
- 格式: JPG, PNG, WebP
- 大小: < 8MB
- 必须可公开访问

### Q5: 页面标题模板不工作

**症状**: 页面标题没有按照预期的模板格式显示

**解决方案**:

```vue
<!-- app.vue -->
<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    const siteName = 'Your Site Name'
    return titleChunk ? `${titleChunk} | ${siteName}` : siteName
  }
})
</script>
```

```vue
<!-- 页面组件 -->
<script setup>
// 只设置页面特定的标题，模板会自动应用
useSeoMeta({
  title: 'About Us'  // 最终显示: "About Us | Your Site Name"
})
</script>
```

### Q6: OG Image 中文字符显示异常

**症状**: 动态生成的 OG Image 中，中文字符显示为方块或乱码

**可能原因**:
1. Satori 渲染器缺少中文字体支持
2. OG Image 组件未配置中文字体
3. 字体加载配置不正确

**解决方案**:

1. **在 nuxt.config.ts 中添加中文字体支持**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ogImage: {
    fonts: [
      'Inter:400',
      'Inter:700',
      'Noto+Sans:400',
      'Noto+Sans:700',
      'Noto+Sans+SC:400',  // 添加简体中文字体
      'Noto+Sans+SC:700'   // 添加简体中文粗体
    ]
  }
})
```

2. **在 OG Image 组件中配置字体样式**:
```vue
<!-- components/OgImage/OgImageTest.vue -->
<template>
  <div class="test-og-container">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <div class="author">{{ author }}</div>
  </div>
</template>

<style scoped>
.test-og-container {
  font-family: 'Noto Sans SC', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  /* 其他样式... */
}
</style>
```

3. **重启开发服务器**:
```bash
npm run dev
```

**验证方法**:
- 访问 OG Image 测试页面检查显示效果
- 使用 curl 命令测试 OG Image 生成：
```bash
curl "http://localhost:4000/__og-image__/image/OgImageTest/og-image.png?title=测试中文标题&description=这是中文描述&author=中文作者" -o test-chinese-og.png
```

**支持的中文字体**:
- `Noto Sans SC`: 简体中文
- `Noto Sans TC`: 繁体中文
- `Noto Sans CJK`: 全面支持中日韩文字

> **注意**: 字体配置修改后需要重启开发服务器才能生效。

## 🗺️ Sitemap 相关问题

### Q7: 站点地图没有包含所有页面

**症状**: 生成的 sitemap.xml 缺少某些页面

**解决方案**:

```typescript
// nuxt.config.ts
sitemap: {
  sources: [
    '/api/__sitemap__/urls'  // 添加动态 URL 源
  ],
  exclude: [
    '/admin/**',
    '/api/**'
  ]
}
```

```typescript
// server/api/__sitemap__/urls.ts
export default defineSitemapEventHandler(async () => {
  // 获取动态页面
  const posts = await $fetch('/api/posts')
  
  return posts.map(post => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.updatedAt,
    _i18nTransform: true  // 自动生成多语言版本
  }))
})
```

### Q8: 多语言站点地图结构不正确

**症状**: 没有生成 sitemap_index.xml 或语言特定的站点地图

**解决方案**:

确保 i18n 配置正确，模块会自动生成多语言站点地图：

```typescript
// nuxt.config.ts
i18n: {
  strategy: 'prefix_except_default', // 或其他非 'no_prefix' 策略
  locales: [
    { code: 'en-US', iso: 'en-US' },
    { code: 'zh-CN', iso: 'zh-CN' }
  ]
}
```

## 🤖 Robots.txt 相关问题

### Q9: robots.txt 没有包含多语言路径

**症状**: robots.txt 中的规则没有自动应用到所有语言版本

**解决方案**:

```typescript
// nuxt.config.ts
robots: {
  groups: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api']  // 会自动扩展为 /en-US/admin, /zh-CN/admin 等
    }
  ],
  sitemap: `${process.env.NUXT_PUBLIC_BASE_URL}/sitemap.xml`
}
```

> **参考来源**: [权威指南第3章 - robots.txt 多语言配置](../reference/nuxt-seo-i18n-guide.md#为多语言站点配置-robotstxt)

## 📊 Schema.org 相关问题

### Q10: 结构化数据验证失败

**症状**: Google Rich Results Test 显示错误或警告

**常见错误和解决方案**:

```vue
<script setup>
// ❌ 错误：缺少必需属性
useSchemaOrg([
  defineArticle({
    headline: 'Article Title'
    // 缺少 author, datePublished 等必需属性
  })
])

// ✅ 正确：包含所有必需属性
useSchemaOrg([
  defineArticle({
    headline: 'Article Title',
    author: {
      '@type': 'Person',
      name: 'Author Name'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Site Name',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    },
    datePublished: '2024-01-15',
    dateModified: '2024-01-15',
    image: 'https://example.com/article-image.jpg'
  })
])
</script>
```

### Q11: 结构化数据重复

**症状**: 同一页面出现多个相同类型的结构化数据

**解决方案**:

```vue
<script setup>
// 确保每个页面只定义一次相同类型的 Schema
const { $router } = useNuxtApp()

// 只在特定条件下添加 Schema
if (process.client && $router.currentRoute.value.name === 'index') {
  useSchemaOrg([
    defineWebSite({
      name: 'Site Name',
      url: 'https://example.com'
    })
  ])
}
</script>
```

## ⚡ 性能相关问题

### Q12: SEO 配置导致页面加载缓慢

**症状**: 添加 SEO 配置后，页面首次加载时间明显增加

**优化方案**:

```vue
<script setup>
// 延迟加载非关键 SEO 内容
const { t } = useI18n()

// 关键 SEO 内容立即加载
useSeoMeta({
  title: () => t('pages.home.title'),
  description: () => t('pages.home.description')
})

// 非关键内容延迟加载
onMounted(() => {
  // 复杂的结构化数据
  useSchemaOrg([
    defineOrganization({
      // 复杂配置...
    })
  ])
})
</script>
```

### Q13: OG 图片生成太慢

**症状**: 动态 OG 图片生成时间过长，影响页面性能

**解决方案**:

```typescript
// nuxt.config.ts
ogImage: {
  defaults: {
    cacheMaxAge: 60 * 60 * 24 * 7, // 缓存 7 天
    width: 1200,
    height: 630
  },
  // 预生成常用图片
  preGenerate: [
    '/og-image/home',
    '/og-image/about'
  ]
}
```

## 🔧 开发环境问题

### Q14: 开发环境下 SEO 功能不正常

**症状**: 在开发环境中，某些 SEO 功能（如 OG 图片）无法正常工作

**解决方案**:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 确保开发环境也有正确的 baseUrl
  site: {
    url: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://your-production-domain.com'
  },
  
  // 开发环境启用 SEO 功能
  ssr: true, // 确保 SSR 开启
  
  ogImage: {
    enabled: true // 开发环境也启用 OG 图片
  }
})
```

## 🚀 部署相关问题

### Q15: 生产环境 SEO 功能失效

**症状**: 本地开发正常，部署后 SEO 功能不工作

**检查清单**:

1. **环境变量配置**:
```bash
# .env.production
NUXT_PUBLIC_BASE_URL=https://your-domain.com
NUXT_PUBLIC_SITENAME=Your Site Name
```

2. **构建配置**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: 'node-server', // 或适合你的部署环境的 preset
  },
  ssr: true // 确保 SSR 启用
})
```

3. **静态资源路径**:
```vue
<script setup>
// 使用环境变量确保路径正确
useSeoMeta({
  ogImage: `${process.env.NUXT_PUBLIC_BASE_URL}/images/og-image.jpg`
})
</script>
```

## 🛠️ 调试技巧

### 验证 SEO 配置

1. **查看页面源码**:
   - 右键 → 查看页面源码
   - 检查 `<head>` 部分的 meta 标签

2. **使用浏览器开发者工具**:
   - F12 → Elements → `<head>` 标签
   - 检查动态生成的标签

3. **在线验证工具**:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [Google Rich Results Test](https://search.google.com/test/rich-results)

4. **Nuxt DevTools**:
   - 安装 `@nuxt/devtools`
   - 查看 SEO 标签和 Schema.org 数据

### 常用调试代码

```vue
<script setup>
// 开发环境下输出 SEO 数据
if (process.dev) {
  const { t, locale } = useI18n()
  const route = useRoute()
  
  console.log('Current locale:', locale.value)
  console.log('Current route:', route.path)
  console.log('SEO title:', t('pages.home.title'))
}
</script>
```

## 📞 获取帮助

如果以上解决方案都无法解决你的问题：

1. 查看 [权威指南](../reference/nuxt-seo-i18n-guide.md) 的相关章节
2. 检查 [修复记录](./fixes-summary.md) 中是否有类似问题
3. 参考 [完整配置指南](../implementation/complete-setup.md) 确认配置正确性
4. 查看官方文档：
   - [Nuxt SEO 文档](https://nuxtseo.com/)
   - [Nuxt i18n 文档](https://i18n.nuxtjs.org/)

---

> 💡 **提示**: 大多数 SEO 问题都与配置不当有关。建议先检查基础配置，然后逐步添加高级功能。