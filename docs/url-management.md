# URL 管理系统

本文档说明 NuxtAir 项目中统一的 URL 管理系统，包括动态 URL 生成、配置优化和最佳实践。

## 系统概述

项目实现了一套完整的 URL 管理系统，解决了以下问题：
- 消除硬编码 URL
- 统一 URL 生成逻辑
- 支持开发和生产环境的动态配置
- 优化配置文件性能
- 提供 SSR 兼容的 URL 处理

## 核心组件

### 1. useBaseUrl Composable

位置：`app/composables/useBaseUrl.ts`

提供统一的 URL 管理接口：

```typescript
const { getBaseUrl, getFullUrl, getCurrentUrl } = useBaseUrl()

// 获取基础 URL
const baseUrl = getBaseUrl() // 'https://your-domain.com'

// 生成完整 URL
const fullUrl = getFullUrl('/api/users') // 'https://your-domain.com/api/users'

// 获取当前页面 URL（SSR 安全）
const currentUrl = getCurrentUrl()
```

#### 功能特性

- **SSR 兼容**：服务端渲染时安全处理路由获取
- **错误处理**：无法获取路由时回退到基础 URL
- **灵活路径处理**：自动处理路径前缀斜杠
- **配置驱动**：从运行时配置获取基础 URL

### 2. 配置文件优化

位置：`nuxt.config.ts`

#### generateBaseUrl 函数

```typescript
function generateBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    // 生产环境：智能组合 BASE_URL 和端口
    const baseUrl = process.env.NUXT_PUBLIC_BASE_URL || 'https://your-domain.com'
    const port = process.env.PORT
    
    // 智能端口处理：忽略标准端口（80, 443）
    // 非标准端口自动添加到 URL
  }
  
  // 开发环境：动态生成本地 URL
  // 支持局域网访问配置
}
```

#### 性能优化

```typescript
// 缓存生成的基础 URL，避免重复计算
const cachedBaseUrl = generateBaseUrl()

// 在配置中使用缓存值
export default defineNuxtConfig({
  site: {
    url: cachedBaseUrl, // 替代重复的函数调用
  },
  i18n: {
    baseUrl: cachedBaseUrl,
  },
  robots: {
    sitemap: `${cachedBaseUrl}/sitemap.xml`,
  },
  runtimeConfig: {
    public: {
      baseUrl: cachedBaseUrl
    }
  }
})
```

## 环境配置

### 开发环境

```bash
# .env 文件
NUXT_DEV_PORT=4000
NUXT_DEV_HOST=0.0.0.0
NUXT_DEV_NETWORK_HOST=192.168.1.100  # 可选：局域网访问
```

生成的 URL：`http://192.168.1.100:4000`（如果配置了网络主机）

### 生产环境

```bash
# 环境变量
NUXT_PUBLIC_BASE_URL=https://your-domain.com
PORT=8080
```

智能端口处理：
- 标准端口（80, 443）：`https://your-domain.com`
- 非标准端口：`https://your-domain.com:8080`

## 使用示例

### 在组件中使用

```vue
<template>
  <div>
    <a :href="getFullUrl('/about')">关于我们</a>
    <img :src="getFullUrl('/images/logo.png')" alt="Logo">
  </div>
</template>

<script setup>
const { getFullUrl } = useBaseUrl()
</script>
```

### 在 API 调用中使用

```typescript
// 使用 Alova 或其他 HTTP 客户端
const { getFullUrl } = useBaseUrl()

const apiClient = createAlova({
  baseURL: getFullUrl('/api'),
  // ...
})
```

### 在 SEO 配置中使用

```typescript
// 页面 SEO 配置
useSeoMeta({
  ogUrl: getCurrentUrl(),
  ogImage: getFullUrl('/images/og-default.png'),
  twitterCard: 'summary_large_image'
})
```

## 技术优势

### 1. 性能优化

- **配置缓存**：`generateBaseUrl()` 只执行一次，结果被缓存
- **减少重复计算**：避免在配置文件中多次执行相同逻辑
- **环境变量读取优化**：减少重复的环境变量访问

### 2. 代码质量

- **DRY 原则**：消除重复的 URL 生成逻辑
- **单一职责**：URL 管理逻辑集中在专门的 composable 中
- **类型安全**：TypeScript 支持，提供完整的类型定义

### 3. 维护性

- **集中管理**：所有 URL 相关逻辑在一个地方维护
- **配置驱动**：通过环境变量控制，无需修改代码
- **向后兼容**：现有代码可以逐步迁移到新系统

### 4. 开发体验

- **局域网支持**：方便团队成员访问开发服务器
- **智能端口处理**：自动处理标准和非标准端口
- **错误容错**：提供回退机制，确保系统稳定性

## 迁移指南

### 从硬编码 URL 迁移

```typescript
// 旧方式（硬编码）
const apiUrl = 'http://localhost:4000/api/users'
const imageUrl = 'http://localhost:4000/images/avatar.png'

// 新方式（动态生成）
const { getFullUrl } = useBaseUrl()
const apiUrl = getFullUrl('/api/users')
const imageUrl = getFullUrl('/images/avatar.png')
```

### 配置文件迁移

```typescript
// 旧方式（重复逻辑）
export default defineNuxtConfig({
  site: {
    url: process.env.NODE_ENV === 'production' 
      ? process.env.NUXT_PUBLIC_BASE_URL 
      : `http://localhost:${process.env.NUXT_DEV_PORT || '4000'}`
  },
  i18n: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? process.env.NUXT_PUBLIC_BASE_URL 
      : `http://localhost:${process.env.NUXT_DEV_PORT || '4000'}`
  }
})

// 新方式（缓存复用）
const cachedBaseUrl = generateBaseUrl()

export default defineNuxtConfig({
  site: {
    url: cachedBaseUrl
  },
  i18n: {
    baseUrl: cachedBaseUrl
  }
})
```

## 最佳实践

1. **始终使用 useBaseUrl**：避免直接硬编码 URL
2. **环境变量配置**：通过 `.env` 文件管理不同环境的配置
3. **SSR 考虑**：在服务端渲染时注意路由获取的安全性
4. **错误处理**：为 URL 生成提供合理的回退机制
5. **性能意识**：避免在渲染循环中重复调用 URL 生成函数

## 相关文件

- `app/composables/useBaseUrl.ts` - 核心 URL 管理 composable
- `nuxt.config.ts` - 配置文件优化和缓存
- `.env` - 环境变量配置
- `docs/port-configuration.md` - 端口配置详细说明
- `docs/url-management.md` - 本文档

## 故障排除

### 常见问题

1. **URL 生成错误**：检查环境变量配置是否正确
2. **SSR 错误**：确保在服务端安全地处理路由获取
3. **端口不匹配**：验证开发环境的端口配置
4. **缓存问题**：重启开发服务器以应用新的配置

### 调试技巧

```typescript
// 在组件中调试 URL 生成
const { getBaseUrl, getFullUrl, getCurrentUrl } = useBaseUrl()

console.log('Base URL:', getBaseUrl())
console.log('Full URL:', getFullUrl('/test'))
console.log('Current URL:', getCurrentUrl())
```