# Nuxt SEO 优化指南

基于 Nuxt SEO v7+ 和 @nuxtjs/i18n 的完整 SEO 实现方案

## 核心模块配置

### 1. 必选模块（基础 SEO + 国际化）

#### Nuxt I18n
- **作用**: 多语言路由、本地化内容，为 SEO 提供语言区分的底层能力
- **配置要点**:
  - `baseUrl`: 生成完整的 alternate URLs（SEO 必需）
  - `language` 属性: 用于生成 hreflang 标签
  - `isCatchallLocale`: 设置 catchall locale
  - `experimental.strictSeo`: 启用严格 SEO 模式

#### SEO Utils
- **作用**: 处理核心元数据、自动生成开放图谱基础标签、联动 i18n 生成 hreflang 标签
- **配置要点**:
  - `automaticDefaults`: 自动生成默认 SEO 标签
  - `fallbackTitle`: 设置回退标题

#### Sitemap
- **作用**: 自动生成包含多语言路由的站点地图
- **配置要点**:
  - `hostname`: 站点域名
  - `gzip`: 启用压缩
  - `exclude`: 排除不需要索引的路径

#### Robots
- **作用**: 控制爬虫抓取范围，适配多语言站点的路径规则
- **配置要点**:
  - `groups`: 替代旧的 `rules` 配置
  - `sitemap`: 指向站点地图
  - `blockAiBots`: 可选择阻止 AI 爬虫

### 2. 增强模块（提升分享与展现）

#### OG Image
- **作用**: 生成动态多语言分享图片
- **实现要点**:
  - 模板设计: 1-2套通用模板（标题+品牌Logo+背景）
  - 语言适配: 通过 `i18n.locale` 判断当前语言，动态加载对应资源
  - 自动关联: 由 SEO Utils 自动同步至页面 meta 标签

#### Schema.org（可选）
- **作用**: 在搜索结果中展示企业信息、产品属性等富文本
- **适用场景**: 需要展示联系方式、评分等结构化信息的官网

## 当前配置状态分析

### ✅ 已正确配置

1. **基础模块安装**
   - `@nuxtjs/i18n` ✅
   - `@nuxtjs/seo` ✅
   - `nuxt-schema-org` ✅

2. **i18n 配置优化**
   - ✅ 添加了 `baseUrl` 配置
   - ✅ 设置了 `isCatchallLocale`
   - ✅ 启用了 `experimental.strictSeo`
   - ✅ 修正了 `langDir` 路径

3. **SEO Utils 配置**
   - ✅ `automaticDefaults: true`
   - ✅ `fallbackTitle` 设置

4. **app.vue 优化**
   - ✅ 使用正确的 `useLocaleHead` 参数
   - ✅ 集成 `useSeoMeta`、`useHead`、`useSchemaOrg`

### 🔧 建议进一步优化

#### 1. 环境变量配置

在 `.env` 文件中添加：
```env
NUXT_PUBLIC_BASE_URL=https://your-domain.com
NUXT_PUBLIC_SITENAME=Your Site Name
```

#### 2. OG Image 模板优化

当前的 `OgImageDefault.vue` 可以进一步优化：

```vue
<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  siteName?: string
  locale?: string
}

const { locale } = useI18n()
const props = withDefaults(defineProps<Props>(), {
  title: 'Default Title',
  description: 'Default Description',
  siteName: 'NuxtAir',
  locale: () => locale.value
})

// 根据语言动态选择背景
const backgroundImage = computed(() => {
  return `/images/og-bg-${props.locale}.png`
})
</script>

<template>
  <div class="og-image" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- 模板内容 -->
  </div>
</template>
```

#### 3. 页面级 SEO 优化

在具体页面中使用：

```vue
<script setup>
const { t, locale } = useI18n()
const route = useRoute()

// 页面级 SEO
useSeoMeta({
  title: () => t('pages.about.title'),
  description: () => t('pages.about.description'),
  ogTitle: () => t('pages.about.ogTitle'),
  ogDescription: () => t('pages.about.ogDescription'),
  ogImage: () => `/images/og-about-${locale.value}.jpg`
})

// 页面级结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: () => t('pages.about.title'),
    description: () => t('pages.about.description'),
    inLanguage: locale.value,
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL}${route.path}`
  })
])
</script>
```

#### 4. 语言文件 SEO 内容

确保语言文件包含完整的 SEO 内容：

```json
{
  "seo": {
    "title": "Your Site Title",
    "description": "Your site description",
    "keywords": "keyword1, keyword2, keyword3",
    "ogTitle": "Social Media Title",
    "ogDescription": "Social media description"
  },
  "pages": {
    "home": {
      "title": "Home",
      "description": "Welcome to our homepage"
    },
    "about": {
      "title": "About Us",
      "description": "Learn more about our company"
    }
  }
}
```

## 最佳实践建议

### 1. 性能优化
- 使用 `computed` 属性避免不必要的重新计算
- OG Image 启用缓存：`defineOgImage` 默认已缓存
- 合理使用 `nitro.prerender.routes` 预渲染重要页面

### 2. SEO 监控
- 集成 Google Search Console
- 使用 `@nuxtjs/seo` 的 Link Checker 功能（Pro 版本）
- 定期检查 sitemap.xml 和 robots.txt

### 3. 国际化 SEO
- 确保每个语言版本都有独特的内容
- 使用正确的 `hreflang` 标签
- 避免重复内容问题

### 4. 结构化数据
- 根据页面类型选择合适的 Schema.org 类型
- 使用 Google Rich Results Test 验证结构化数据
- 保持结构化数据与页面内容一致

## 测试和验证

### 1. 开发环境测试
```bash
# 启动开发服务器
pnpm dev

# 测试多语言 SEO
http://localhost:4000/
http://localhost:4000/zh-CN/
```

### 2. SEO 检查清单
- [ ] 页面标题唯一且描述性强
- [ ] Meta description 长度适中（150-160字符）
- [ ] hreflang 标签正确设置
- [ ] Open Graph 标签完整
- [ ] 结构化数据有效
- [ ] Sitemap 包含所有重要页面
- [ ] Robots.txt 配置正确

### 3. 工具验证
- Google Search Console
- Google Rich Results Test
- Facebook Sharing Debugger
- Twitter Card Validator

## 部署注意事项

### 1. 环境变量
确保生产环境设置正确的环境变量：
```env
NUXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

### 2. 预渲染配置
```typescript
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/', '/about', '/zh-CN/', '/zh-CN/guan-yu-wo-men']
    }
  }
})
```

### 3. CDN 配置
如果使用 CDN，确保：
- OG Image 路径正确
- Sitemap 和 robots.txt 可访问
- 多语言路由正确处理

## 总结

当前的 Nuxt SEO 配置已经涵盖了国际化官网的核心需求：

✅ **全面覆盖**: 搜索引擎索引、基础元数据、国际化识别、社交媒体分享
✅ **低维护成本**: 模块间自动联动，OG Image 模板复用
✅ **技术规范**: 符合最新的 Nuxt SEO 最佳实践

按照本指南的建议进行优化，可以实现高效的国际化官网 SEO 搭建，兼顾技术规范与用户分享体验。