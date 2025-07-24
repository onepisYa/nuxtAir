# SEO 快速参考指南

## 🚀 快速开始

### 1. 运行 SEO 验证
```bash
# 验证当前 SEO 配置
npm run seo:validate

# 构建并验证
npm run seo:test
```

### 2. 基础页面 SEO 模板

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 基础 SEO 配置
useSeoMeta({
  title: () => t('pages.yourpage.title'),
  description: () => t('pages.yourpage.description'),
  keywords: () => 'your, keywords, here',
  ogTitle: () => t('pages.yourpage.ogTitle'),
  ogDescription: () => t('pages.yourpage.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// OG Image
defineOgImage({
  component: 'OgImageDefault',
  title: () => t('pages.yourpage.ogTitle'),
  description: () => t('pages.yourpage.ogDescription'),
  locale: () => locale.value
})

// 结构化数据
useSchemaOrg([
  defineWebPage({
    name: () => t('pages.yourpage.title'),
    description: () => t('pages.yourpage.description'),
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`
  })
])
</script>
```

### 3. 语言文件 SEO 内容模板

```json
{
  "pages": {
    "yourpage": {
      "title": "Your Page Title",
      "description": "Your page description for meta tags",
      "ogTitle": "Your Page Title for Social Media",
      "ogDescription": "Your page description for social media sharing"
    }
  }
}
```

## 📋 SEO 检查清单

### 每个页面必须有
- [ ] 唯一的 `title`
- [ ] 描述性的 `description` (150-160 字符)
- [ ] 相关的 `keywords`
- [ ] Open Graph `ogTitle` 和 `ogDescription`
- [ ] Twitter Card 配置
- [ ] 结构化数据 (Schema.org)

### 技术要求
- [ ] 响应式 OG 图片 (1200x630px)
- [ ] 正确的 canonical URL
- [ ] 多语言 hreflang 标签
- [ ] 快速加载速度 (<3秒)

## 🎨 OG Image 组件使用

### 默认 OG Image
```vue
defineOgImage({
  component: 'OgImageDefault',
  title: 'Your Title',
  description: 'Your Description',
  siteName: 'Your Site',
  locale: 'en-US'
})
```

### 博客 OG Image
```vue
defineOgImage({
  component: 'OgImageBlog',
  title: 'Blog Post Title',
  description: 'Blog post excerpt',
  author: 'Author Name',
  publishDate: '2024-01-15',
  locale: 'en-US'
})
```

### ⚠️ OG Image 常见问题

#### z-index 警告解决方案
```vue
<!-- ❌ 避免在 OG Image 组件中使用 z-index -->
<style scoped>
.logo-container {
  z-index: 10; /* Satori 不支持，会产生警告 */
}
</style>

<!-- ✅ 移除 z-index，使用 DOM 层级结构 -->
<template>
  <div class="og-container">
    <!-- 背景层 -->
    <div class="bg-gradient" />
    
    <!-- 装饰层 - 使用内联样式避免未知 CSS 类 -->
    <div class="decorative-shapes">
      <div style="position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.05); width: 200px; height: 200px; top: -100px; right: -100px;" />
    </div>
    
    <!-- 内容层 - DOM 顺序决定层级 -->
    <div class="content">
      <!-- 内容自然在最上层 -->
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  position: absolute;
  top: 60px;
  left: 60px;
  /* 移除 z-index 以避免 satori 警告 */
}

.content {
  position: relative;
  /* 移除 z-index 以避免 satori 警告 */
}
</style>
```

#### 优化的 OG Image 配置
```typescript
// nuxt.config.ts - 优化的 OG Image 配置
ogImage: {
  enabled: true,
  defaults: {
    component: 'OgImageDefault',
    width: 1200,
    height: 630
  },
  googleFontMirror: true, // 解决字体下载问题
  fonts: [
    'Inter:400',
    'Inter:700',
    'Noto+Sans:400',
    'Noto+Sans:700',
    // 中文字体支持
    'Noto+Sans+SC:400',
    'Noto+Sans+SC:700'
  ]
}
```

#### 中文字体配置
```typescript
// nuxt.config.ts
ogImage: {
  fonts: [
    'Inter:400',
    'Inter:700',
    'Noto+Sans+SC:400', // 中文字体
    'Noto+Sans+SC:700'
  ]
}
```

## 🔧 常用 Schema.org 类型

### 网页
```javascript
defineWebPage({
  name: 'Page Name',
  description: 'Page Description',
  url: 'https://example.com/page'
})
```

### 文章
```javascript
defineArticle({
  headline: 'Article Title',
  description: 'Article Description',
  author: { name: 'Author Name' },
  datePublished: '2024-01-15',
  image: 'https://example.com/image.jpg'
})
```

### 组织
```javascript
defineOrganization({
  name: 'Company Name',
  description: 'Company Description',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png'
})
```

## 🌍 多语言 SEO

### 语言文件结构
```
i18n/locales/
├── en-US.json
├── zh-CN.json
└── [other-locales].json
```

### 每个语言文件需要
```json
{
  "seo": {
    "title": "Site Title",
    "description": "Site Description",
    "ogTitle": "OG Title",
    "ogDescription": "OG Description",
    "keywords": "keywords, separated, by, commas"
  },
  "pages": {
    "home": { /* page seo content */ },
    "about": { /* page seo content */ },
    "blog": { /* page seo content */ }
  }
}
```

## ⚡ 性能优化技巧

### 1. 使用 `useSeoMeta` 而不是 `useHead`
```javascript
// ✅ 推荐
useSeoMeta({
  title: 'Page Title',
  description: 'Page Description'
})

// ❌ 避免
useHead({
  title: 'Page Title',
  meta: [{ name: 'description', content: 'Page Description' }]
})
```

### 2. 延迟加载非关键 SEO 内容
```javascript
// 关键 SEO 内容立即加载
useSeoMeta({ /* 基础 meta 标签 */ })

// 非关键内容可以延迟
onMounted(() => {
  // 复杂的结构化数据
})
```

### 3. 缓存 OG 图片
```javascript
// 在 nuxt.config.ts 中配置缓存
ogImage: {
  defaults: {
    cacheMaxAge: 60 * 60 * 24 * 7 // 7 天
  }
}
```

## 🗺️ Sitemap 配置

### 动态 URL 配置
```typescript
// server/api/__sitemap__/urls.ts
export default defineSitemapEventHandler(async () => {
  const routes = [
    {
      loc: '/',
      lastmod: new Date().toISOString(),
      _i18nTransform: true // 自动多语言
    },
    {
      loc: '/about',
      lastmod: new Date().toISOString(),
      _i18nTransform: true
    }
  ]

  // 动态路由示例
  // const posts = await $fetch('/api/posts')
  // const dynamicRoutes = posts.map(post => ({
  //   loc: `/blog/${post.slug}`,
  //   lastmod: post.updatedAt,
  //   _i18nTransform: true
  // }))
  // routes.push(...dynamicRoutes)

  return routes
})
```

### Sitemap 验证
```bash
# 检查主 sitemap
curl "http://localhost:4000/sitemap.xml"

# 检查多语言 sitemap
curl "http://localhost:4000/zh-CN/sitemap.xml"
```

## 🔍 测试和验证工具

### 在线工具
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 本地测试
```bash
# 运行 SEO 验证
npm run seo:validate

# 构建并测试
npm run seo:test

# 启动开发服务器
npm run dev
```

### 检查 OG 图片
```
# 访问 OG 图片 API
http://localhost:3000/api/__og-image__/image/og.png
http://localhost:3000/api/__og-image__/image/blog/[slug]/og.png
```

## 🚨 常见错误和解决方案

### 1. OG 图片不显示
**问题**: 社交媒体不显示 OG 图片
**解决**: 
- 检查图片 URL 是否可访问
- 确保图片尺寸正确 (1200x630px)
- 验证 `og:image` meta 标签

### 2. 结构化数据错误
**问题**: Google Search Console 报告结构化数据错误
**解决**:
- 使用 Google Rich Results Test 验证
- 检查必需字段是否完整
- 确保数据类型正确

### 3. 多语言 SEO 问题
**问题**: 搜索引擎不能正确识别语言版本
**解决**:
- 确保 `hreflang` 标签正确
- 检查语言代码格式 (en-US, zh-CN)
- 验证 URL 结构

### 4. 页面加载速度慢
**问题**: SEO 配置影响页面性能
**解决**:
- 减少不必要的 meta 标签
- 优化 OG 图片生成
- 使用 `useSeoMeta` 而不是 `useHead`

## 📊 监控和分析

### Google Search Console
- 监控索引状态
- 检查结构化数据
- 分析搜索性能
- 查看 Core Web Vitals

### 定期检查
```bash
# 每周运行 SEO 验证
npm run seo:validate

# 每月检查
# - Google Search Console
# - 页面加载速度
# - OG 图片显示
# - 结构化数据状态
```

## 🎯 SEO 评分标准

### 优秀 (90-100%)
- 所有页面都有完整的 SEO 配置
- OG 图片正常生成
- 结构化数据无错误
- 页面加载速度 <2秒

### 良好 (70-89%)
- 大部分页面有 SEO 配置
- 少量警告项目
- 页面加载速度 <3秒

### 需要改进 (<70%)
- 缺少关键 SEO 配置
- 多个错误项目
- 性能问题

## 💡 最佳实践总结

1. **始终使用 `useSeoMeta`** 进行 meta 标签配置
2. **为每个页面提供唯一的 title 和 description**
3. **实现动态 OG 图片生成**
4. **添加相关的结构化数据**
5. **确保多语言 SEO 内容完整**
6. **定期运行 SEO 验证工具**
7. **监控页面性能和 Core Web Vitals**
8. **使用在线工具验证 SEO 配置**

---

**快速帮助**: 运行 `npm run seo:validate` 获取当前项目的 SEO 状态报告