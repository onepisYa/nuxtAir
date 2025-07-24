# Server API 文档

## 概述

本目录包含 NuxtAir 项目的服务端 API 路由和插件配置。

## 📁 目录结构

```
server/
├── api/                    # API 路由
│   └── __sitemap__/       # Sitemap 相关 API
│       └── urls.ts        # 动态 URL 生成
├── plugins/               # 服务端插件
└── routes/                # 自定义路由
```

## 🗺️ Sitemap API

### `/api/__sitemap__/urls.ts`

这个 API 端点为 Nuxt Sitemap 模块提供动态 URL 数据源。

#### 功能特性
- ✅ 自动生成多语言版本 (`_i18nTransform: true`)
- ✅ 静态路由配置
- ✅ 动态路由支持（可从 API 获取）
- ✅ 错误处理和降级

#### 配置示例

```typescript
// server/api/__sitemap__/urls.ts
export default defineSitemapEventHandler(async () => {
  // 静态页面路由
  const routes = [
    {
      loc: '/',
      lastmod: new Date().toISOString(),
      _i18nTransform: true // 自动生成多语言版本
    }
  ]

  // 动态路由示例
  try {
    // const posts = await $fetch('/api/posts')
    // const dynamicRoutes = posts.map(post => ({
    //   loc: `/blog/${post.slug}`,
    //   lastmod: post.updatedAt,
    //   _i18nTransform: true
    // }))
    // routes.push(...dynamicRoutes)
  } catch (error) {
    console.warn('Failed to fetch dynamic routes for sitemap:', error)
  }

  return routes
})
```

#### 在 nuxt.config.ts 中启用

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  sitemap: {
    sources: ['/api/__sitemap__/urls'], // 启用动态数据源
    exclude: [
      '/admin/**',
      '/dev-api/**',
      '/prod-api/**',
      '/test-api/**',
    ]
  }
})
```

#### 多语言支持

当设置 `_i18nTransform: true` 时，Sitemap 会自动为每个配置的语言生成对应的 URL：

- `/` → `/` (默认语言 en-US)
- `/` → `/zh-CN/` (中文)

#### 动态内容集成

如果你的项目有博客、产品页面等动态内容，可以在此 API 中集成：

```typescript
// 示例：集成博客文章
try {
  const posts = await $fetch('/api/posts')
  const blogRoutes = posts.map(post => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.updatedAt,
    _i18nTransform: true,
    changefreq: 'weekly',
    priority: 0.8
  }))
  routes.push(...blogRoutes)
} catch (error) {
  console.warn('Failed to fetch blog posts for sitemap:', error)
}
```

## 🔧 开发指南

### 添加新的 API 路由

1. 在 `server/api/` 目录下创建新文件
2. 使用 `defineEventHandler` 定义处理函数
3. 路由会自动基于文件路径生成

### 添加服务端插件

1. 在 `server/plugins/` 目录下创建插件文件
2. 插件会在服务器启动时自动加载

### 自定义路由

1. 在 `server/routes/` 目录下创建路由文件
2. 支持动态路由和中间件

## 📚 相关文档

- [Nuxt Server API](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt Sitemap 模块](https://github.com/nuxt-modules/sitemap)
- [Sitemap 数据源配置](https://nuxtseo.com/docs/sitemap/guides/data-sources)

## 🐛 故障排除

### Sitemap 不更新
1. 检查 `nuxt.config.ts` 中的 `sources` 配置
2. 确认 API 端点返回正确的数据格式
3. 查看控制台是否有错误信息

### 多语言 URL 不生成
1. 确认设置了 `_i18nTransform: true`
2. 检查 i18n 配置是否正确
3. 验证 `baseUrl` 配置

### 动态路由获取失败
1. 检查 API 端点是否可访问
2. 确认错误处理逻辑
3. 查看服务器日志