# 测试页面排除配置说明

本文档说明如何在 Nuxt 项目中配置测试页面的排除功能，使其在生产环境中不参与打包，并可在开发环境中根据环境变量控制是否生成路由。

## 功能概述

- ✅ 生产环境自动排除 `/pages/test/` 文件夹中的所有页面
- ✅ 开发环境可通过环境变量控制是否排除测试页面
- ✅ 测试页面不会出现在 sitemap.xml 中
- ✅ 搜索引擎爬虫被禁止访问测试页面（robots.txt）
- ✅ 支持嵌套的测试页面结构

## 配置详情

### 1. 环境变量配置

在 `.env` 文件中添加以下配置：

```bash
# 测试页面控制
# 设置为 'true' 可在开发环境中排除测试页面
EXCLUDE_TEST_PAGES=false
```

### 2. 自动排除规则

系统会在以下情况下自动排除测试页面：

- `NODE_ENV === 'production'` （生产环境）
- `EXCLUDE_TEST_PAGES === 'true'` （手动启用）

### 3. 排除范围

以下内容会被排除：

- `/pages/test/` 文件夹中的所有 `.vue` 文件
- 所有以 `/test` 开头的路由
- sitemap.xml 中的测试页面链接
- robots.txt 允许爬取的测试页面

## 使用场景

### 开发环境测试

```bash
# 开发时包含测试页面（默认）
EXCLUDE_TEST_PAGES=false
npm run dev
```

访问测试页面：
- http://localhost:4000/test
- http://localhost:4000/test/alova-demo
- http://localhost:4000/test/blog
- http://localhost:4000/test/seo-test

### 开发环境排除测试页面

```bash
# 开发时也排除测试页面
EXCLUDE_TEST_PAGES=true
npm run dev
```

此时访问测试页面会返回 404 错误。

### 生产环境部署

```bash
# 生产环境自动排除测试页面
NODE_ENV=production
npm run build
npm run preview
```

生产环境中测试页面完全不会被打包，访问会返回 404。

## 当前测试页面结构

```
app/pages/test/
├── alova-demo.vue          # Alova 库演示页面
├── blog/                   # 博客测试页面
│   ├── [slug].vue         # 动态路由页面
│   └── index.vue          # 博客首页
├── config-test.vue         # 配置测试页面
├── i18n-test.vue          # 国际化测试页面
├── index.vue              # 测试首页
├── og-test.vue            # Open Graph 测试页面
├── seo-test/              # SEO 测试页面
│   └── index.vue
└── test.vue               # 通用测试页面
```

## SEO 配置

### Sitemap 排除

```typescript
sitemap: {
  exclude: [
    '/test/**' // 排除所有测试页面
  ]
}
```

### Robots.txt 配置

```typescript
robots: {
  groups: [{
    userAgent: '*',
    disallow: ['/test'] // 禁止爬虫访问测试页面
  }]
}
```

## 技术实现

### 页面过滤逻辑

```typescript
hooks: {
  'pages:extend': function (pages) {
    // 根据环境变量过滤测试页面
    const shouldExcludeTestPages = process.env.NODE_ENV === 'production' || 
                                 process.env.EXCLUDE_TEST_PAGES === 'true'
    
    if (shouldExcludeTestPages) {
      // 过滤掉 /test 路径下的所有页面
      const filteredPages = pages.filter(page => {
        return !page.file?.includes('/pages/test/') && !page.path?.startsWith('/test')
      })
      // 清空原数组并添加过滤后的页面
      pages.splice(0, pages.length, ...filteredPages)
    }
  }
}
```

## 注意事项

1. **文件路径匹配**：过滤逻辑基于文件路径 `/pages/test/` 和路由路径 `/test`
2. **嵌套页面**：支持测试文件夹内的嵌套结构
3. **动态路由**：包括 `[slug].vue` 等动态路由页面
4. **构建优化**：生产环境中测试页面不会被打包，减少包体积
5. **SEO 友好**：确保搜索引擎不会索引测试页面

## 验证方法

### 1. 检查路由生成

```bash
# 开发环境查看所有路由
npm run dev
# 访问 http://localhost:4000/__nuxt_devtools__/
```

### 2. 检查构建结果

```bash
# 构建并查看生成的页面
npm run build
ls -la .output/public/
```

### 3. 检查 sitemap

访问：http://localhost:4000/sitemap.xml

### 4. 检查 robots.txt

访问：http://localhost:4000/robots.txt

## 扩展配置

如需排除其他文件夹，可以修改过滤条件：

```typescript
// 排除多个测试文件夹
const filteredPages = pages.filter(page => {
  return !page.file?.includes('/pages/test/') && 
         !page.file?.includes('/pages/demo/') &&
         !page.path?.startsWith('/test') &&
         !page.path?.startsWith('/demo')
})
```