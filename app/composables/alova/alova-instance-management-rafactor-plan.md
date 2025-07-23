# Alova 实例管理重构方案

## 1. 产品概述

本文档旨在重构和统一管理 NuxtAir 项目中的 Alova 网络请求实例，解决当前多个实例分散、配置重复、维护困难的问题。通过建立统一的实例管理机制，实现便捷方法工厂化、RAW 实例多服务支持、环境配置驱动等核心功能，提高代码复用性和可维护性。

### 核心设计理念

1. **便捷方法工厂化**：通过工厂函数为不同 Alova 实例生成便捷方法，提高代码复用性
2. **RAW 实例多服务支持**：通过环境变量或映射管理不同 API 前缀，支持微服务场景下的不同服务调用
3. **业务简化**：简单业务场景只需要一个 main 实例即可满足需求
4. **环境配置驱动**：通过环境变量和配置映射灵活管理不同服务的 API 前缀（如 /dev-api/user, /dev-api/customer）

## 2. 核心功能

### 2.1 用户角色

本重构方案主要面向开发者，不涉及用户角色区分。

### 2.2 功能模块

重构后的 Alova 实例管理包含以下核心模块：

1. **实例工厂模块**：统一创建和配置不同类型的 Alova 实例（主实例、原始实例、测试实例）
2. **配置管理模块**：集中管理各种网络请求配置，保留 processResponseAndValidate 功能，支持环境变量驱动的服务映射
3. **便捷方法工厂模块**：通过工厂函数为指定 Alova 实例生成对应的便捷方法（get、post、put、del）
4. **微服务支持模块**：为不同服务创建带前缀的便捷方法，支持多服务架构下的 API 调用
5. **测试工具模块**：专门用于网络功能测试的工具集，与业务实例分离

### 2.3 页面详情

| 模块名称 | 组件名称 | 功能描述 |
|----------|----------|----------|
| 实例工厂 | AlovaInstanceFactory | 创建主项目实例、原始实例、测试实例，统一配置管理 |
| 配置管理 | AlovaConfigManager | 管理 baseURL、认证、错误处理等通用配置，支持服务映射 |
| 便捷方法工厂 | ConvenienceMethodsFactory | 为指定实例生成 get、post、put、del 等便捷方法 |
| 微服务支持 | ServiceMethodsCreator | 为特定服务创建带前缀的便捷方法（如 userService、orderService） |
| 测试工具 | NetworkTestUtils | 网络连接测试、API 功能验证工具 |

## 3. 核心流程

### 主要操作流程

1. **实例创建流程**：根据使用场景选择合适的实例类型（主项目/原始/测试）
2. **便捷方法生成流程**：通过工厂函数为不同实例生成对应的便捷方法
3. **微服务调用流程**：通过服务映射和前缀管理调用不同微服务的 API
4. **请求处理流程**：统一的请求前处理、响应处理、错误处理
5. **测试验证流程**：独立的测试实例进行网络功能验证

```mermaid
graph TD
    A[应用启动] --> B[实例工厂初始化]
    B --> C[创建主项目实例]
    B --> D[创建原始实例]
    B --> E[创建测试实例]
    C --> F[生成主实例便捷方法]
    D --> G[生成原始实例便捷方法]
    E --> H[生成测试实例便捷方法]
    D --> I[创建微服务便捷方法]
    F --> J[业务 API 调用]
    G --> K[自定义 URL 调用]
    I --> L[微服务 API 调用]
    H --> M[网络测试调用]
    J --> N[统一响应处理]
    K --> N
    L --> N
    M --> O[测试结果处理]
```

## 4. 用户界面设计

### 4.1 设计风格

- **代码组织**：模块化、清晰的文件结构
- **接口设计**：简洁、一致的 API 接口
- **错误处理**：统一的错误信息格式和处理机制
- **文档注释**：完整的 TypeScript 类型定义和 JSDoc 注释

### 4.2 模块设计概览

| 模块名称 | 文件位置 | 主要接口 |
|----------|----------|----------|
| 实例工厂 | `composables/alova/factory.ts` | `createMainInstance()`, `createRawInstance()`, `createTestInstance()` |
| 配置管理 | `composables/alova/config.ts` | `createBaseConfig()`, `SERVICE_PREFIXES`, `getServiceUrl()` |
| 便捷方法工厂 | `composables/alova/methods.ts` | `createConvenienceMethods()`, `get()`, `post()`, `getRaw()`, `postRaw()` |
| 微服务支持 | `composables/alova/services.ts` | `createServiceMethods()`, `userService`, `orderService`, `paymentService` |
| 测试工具 | `composables/alova/testing.ts` | `runNetworkTests()`, `testApiEndpoint()`, `getTest()`, `postTest()` |

### 4.3 响应式设计

本重构方案专注于服务端和客户端的网络请求处理，不涉及 UI 响应式设计。

## 5. 技术实现方案

### 5.1 当前问题分析

**现状问题：**
1. 三个独立的 Alova 实例分散在不同文件中
2. 配置代码重复（beforeRequest、responded 等）
3. 测试实例与业务实例混合，维护困难
4. 缺乏统一的实例管理机制

**影响文件：**
- `/app/composables/useAlova.ts` (L114-141, L150-181)
- `/app/composables/networkTest.ts` (L9-28)

### 5.2 重构目标

1. **统一管理**：建立单一的实例工厂，集中管理所有 Alova 实例
2. **配置复用**：提取通用配置，避免重复代码
3. **职责分离**：明确区分业务实例和测试实例的职责
4. **保持兼容**：确保现有的 `processResponseAndValidate` 等核心功能继续可用
5. **易于扩展**：为未来添加新的实例类型提供便利

### 5.3 实现策略

**方案 A：渐进式重构（推荐）**
- 优点：风险低，可逐步迁移，保持现有功能稳定
- 缺点：重构周期较长
- 实施：先建立新的工厂模式，保留 processResponseAndValidate 函数，再逐步迁移现有代码

**方案 B：一次性重构**
- 优点：重构彻底，代码结构清晰
- 缺点：风险较高，可能影响现有功能
- 实施：直接替换现有实例管理方式

**关键实现要点**
- **重要技术限制**：避免在 create 方法中直接使用 useRuntimeConfig 等 hooks，采用动态设置的变通方法
- 保留并复用现有的 processResponseAndValidate 函数，确保响应处理逻辑一致性
- 通过工厂函数生成便捷方法，支持为不同实例创建对应的便捷方法
- 支持微服务场景下不同 API 前缀的调用，如 /dev-api/user, /dev-api/customer
- 简化业务场景下只使用主 Alova 实例，复杂场景可使用 RAW 实例和服务前缀
- 提供安全的配置获取函数，包含错误处理和默认值回退机制

### 5.4 文件结构规划

```
app/composables/alova/
├── index.ts              # 主入口，导出所有公共接口
├── factory.ts            # 实例工厂
├── config.ts             # 配置管理和服务映射
├── methods.ts            # 便捷方法工厂
├── services.ts           # 微服务支持
├── testing.ts            # 测试工具
└── types.ts              # 类型定义
```

### 5.5 核心接口设计

```typescript
// 实例类型枚举
enum AlovaInstanceType {
  MAIN = 'main',         // 主业务实例（带 baseURL）
  RAW = 'raw',           // 原始实例（不带 baseURL）
  TEST = 'test'          // 测试实例（固定测试 URL）
}

/**
 * 完整的类型定义
 */

// 服务前缀映射接口
interface ServicePrefixes {
  user: string
  order: string
  payment: string
  product: string
  [key: string]: string // 支持动态服务名称
}

// HTTP 请求配置接口
interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  params?: Record<string, any>
  [key: string]: any
}

// 便捷方法接口
interface ConvenienceMethods {
  get: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  delete: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  head: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  options: <T = any>(url: string, config?: RequestConfig) => Promise<T>
}

// Alova 实例接口（简化版）
interface AlovaInstance {
  options: {
    baseURL?: string
    timeout?: number
    [key: string]: any
  }
  Get: (url: string, config?: RequestConfig) => any
  Post: (url: string, data?: any, config?: RequestConfig) => any
  Put: (url: string, data?: any, config?: RequestConfig) => any
  Patch: (url: string, data?: any, config?: RequestConfig) => any
  Delete: (url: string, config?: RequestConfig) => any
  Head: (url: string, config?: RequestConfig) => any
  Options: (url: string, config?: RequestConfig) => any
}

// 错误类型定义
interface AlovaError extends Error {
  code?: string
  status?: number
  response?: any
  config?: RequestConfig
}

// 缓存配置接口
interface CacheConfig {
  enabled: boolean
  ttl?: number // 缓存时间（毫秒）
  key?: string // 自定义缓存键
}

// 实例创建选项
interface InstanceOptions {
  singleton?: boolean
  baseURL?: string
  timeout?: number
  cache?: CacheConfig
  [key: string]: any
}

// 服务配置接口
interface ServiceConfig {
  name: string
  prefix: string
  timeout?: number
  headers?: Record<string, string>
  cache?: CacheConfig
}

// 环境配置接口
interface EnvironmentConfig {
  apiBase: string
  userServicePrefix: string
  orderServicePrefix: string
  paymentServicePrefix: string
  productServicePrefix: string
  testApiBase: string
  [key: string]: string
}

// 便捷方法接口
interface ConvenienceMethods {
  get: (url: string, config?: any) => Promise<any>
  post: (url: string, data?: any, config?: any) => Promise<any>
  put: (url: string, data?: any, config?: any) => Promise<any>
  del: (url: string, config?: any) => Promise<any>
}

// 工厂方法接口
interface AlovaFactory {
  createMainInstance(): AlovaInstance
  createRawInstance(): AlovaInstance
  createTestInstance(): AlovaInstance
  createConvenienceMethods(instance: AlovaInstance): ConvenienceMethods
  createServiceMethods(servicePrefix: string): ConvenienceMethods
}
```

### 5.6 详细实现方案

#### 便捷方法工厂函数

```typescript
// 为指定 Alova 实例生成便捷方法的工厂函数
function createConvenienceMethods(alovaInstance: AlovaInstance): ConvenienceMethods {
  return {
    get: <T>(url: string, params?: object, config: object = {}): Promise<T> => 
      alovaInstance.Get(url, { params, ...config }),
    post: <T>(url: string, data?: object, config: object = {}): Promise<T> => 
      alovaInstance.Post(url, data, config),
    put: <T>(url: string, data?: object, config: object = {}): Promise<T> => 
      alovaInstance.Put(url, data, config),
    del: <T>(url: string, config: object = {}): Promise<T> => 
      alovaInstance.Delete(url, config)
  }
}

// 使用示例：为不同实例创建便捷方法
// 注意：useXXX 函数只能在页面、组件、中间件、插件等有上下文环境的地方使用
// 在服务器端和客户端激活期间（hydration）都可以运行
const mainMethods = createConvenienceMethods(useAlova()) // 需要在组件/页面上下文中
const rawMethods = createConvenienceMethods(getRawAlova()) // 可以在任何地方使用
const testMethods = createConvenienceMethods(useTestAlova()) // 需要在组件/页面上下文中

// 导出主实例的便捷方法
export const { get, post, put, del } = mainMethods
```

#### 服务映射配置

```typescript
/**
 * 智能获取服务前缀映射
 * 
 * 该函数根据运行环境智能获取配置，支持 apiBase 与 servicePrefix 拼接
 * 实现效果：/dev-api/server-name/path
 * 
 * @returns {ServicePrefixes} 服务前缀映射对象
 */
function getServicePrefixes(): ServicePrefixes {
  let apiBase: string
  let userServicePrefix: string
  let orderServicePrefix: string
  let paymentServicePrefix: string
  let productServicePrefix: string
  
  // 根据环境选择配置获取方式
  if (process.server || import.meta.server) {
    // 服务端直接使用环境变量
    apiBase = process.env.NUXT_PUBLIC_API_BASE || '/dev-api'
    userServicePrefix = process.env.NUXT_PUBLIC_USER_SERVICE_PREFIX || '/user'
    orderServicePrefix = process.env.NUXT_PUBLIC_ORDER_SERVICE_PREFIX || '/order'
    paymentServicePrefix = process.env.NUXT_PUBLIC_PAYMENT_SERVICE_PREFIX || '/payment'
    productServicePrefix = process.env.NUXT_PUBLIC_PRODUCT_SERVICE_PREFIX || '/product'
  } else {
    // 客户端使用 useRuntimeConfig
    try {
      const config = useRuntimeConfig()
      apiBase = config.public.apiBase || '/dev-api'
      userServicePrefix = config.public.userServicePrefix || '/user'
      orderServicePrefix = config.public.orderServicePrefix || '/order'
      paymentServicePrefix = config.public.paymentServicePrefix || '/payment'
      productServicePrefix = config.public.productServicePrefix || '/product'
    } catch (error) {
      console.warn('无法获取运行时配置，使用默认值:', error)
      apiBase = '/dev-api'
      userServicePrefix = '/user'
      orderServicePrefix = '/order'
      paymentServicePrefix = '/payment'
      productServicePrefix = '/product'
    }
  }
  
  // 拼接 apiBase 与各个服务前缀
  return {
    user: `${apiBase}${userServicePrefix}`,
    order: `${apiBase}${orderServicePrefix}`,
    payment: `${apiBase}${paymentServicePrefix}`,
    product: `${apiBase}${productServicePrefix}`
  }
}

/**
 * 在组件上下文中获取服务前缀的 Hook
 * 
 * 该函数只能在 Vue 组件、页面或其他 Composition API 上下文中使用
 * 实现效果：/dev-api/server-name/path
 * 
 * @returns {ServicePrefixes} 服务前缀映射对象
 */
function useServicePrefixes(): ServicePrefixes {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || '/dev-api'
  
  // 拼接 apiBase 与各个服务前缀
  return {
    user: `${apiBase}${config.public.userServicePrefix || '/user'}`,
    order: `${apiBase}${config.public.orderServicePrefix || '/order'}`,
    payment: `${apiBase}${config.public.paymentServicePrefix || '/payment'}`,
    product: `${apiBase}${config.public.productServicePrefix || '/product'}`
  }
}

// 获取服务完整 URL 的 Hook（只能在特定上下文使用）
function useServiceUrl(service: string, endpoint: string): string {
  const prefixes = useServicePrefixes()
  const prefix = prefixes[service]
  if (!prefix) {
    throw new Error(`Unknown service: ${service}`)
  }
  return `${prefix}${endpoint}`
}
```

#### 统一实例创建

```typescript
// 导入现有的 processResponseAndValidate 函数
import { processResponseAndValidate, logAndFormatError } from '~/composables/useAlova'

// 基础配置（保留并复用 processResponseAndValidate 功能）
function createBaseConfig() {
  return {
    statesHook: NuxtHook({
      nuxtApp: useNuxtApp,
    }),
    cacheLogger: null,
    cacheFor: {
      GET: 0,
    },
    requestAdapter: adapterFetch(),
    beforeRequest: (method) => {
      // 统一的请求前处理
      if (!method.meta?.ignoreToken) {
        method.config.headers.Authorization = `Bearer ${user().token}`
      }
      method.config.headers.clientid = ''
    },
    responded: {
      onSuccess: async (response, method) => {
        // 复用现有的响应处理和验证逻辑
        const json = await response.json()
        return processResponseAndValidate(response, method, json)
      },
      onError: (error) => {
        console.error('网络请求错误:', error)
        // 可以集成 useToast 提供用户友好的错误提示
      }
    }
  }
}

/**
 * SSR 安全的实例缓存管理
 * 
 * 在 SSR 环境中，全局变量可能导致状态污染，因此我们需要使用
 * Nuxt 应用实例来存储缓存，确保每个请求都有独立的缓存空间
 */

// 缓存键名常量
const CACHE_KEYS = {
  MAIN_INSTANCE: 'alova:main-instance',
  RAW_INSTANCE: 'alova:raw-instance',
  TEST_INSTANCE: 'alova:test-instance'
} as const

/**
 * 获取 SSR 安全的缓存存储
 * 
 * @returns {Map<string, any>} 缓存存储对象
 */
function getCacheStorage(): Map<string, any> {
  // 在服务端使用 Nuxt 应用实例存储
  if (process.server || import.meta.server) {
    try {
      const nuxtApp = useNuxtApp()
      if (!nuxtApp.ssrContext) {
        nuxtApp.ssrContext = {}
      }
      if (!nuxtApp.ssrContext.alovaCache) {
        nuxtApp.ssrContext.alovaCache = new Map()
      }
      return nuxtApp.ssrContext.alovaCache
    } catch (error) {
      // 如果无法获取 Nuxt 应用实例，使用临时 Map
      console.warn('无法获取 Nuxt 应用实例，使用临时缓存:', error)
      return new Map()
    }
  }
  
  // 客户端使用全局 Map
  if (!globalThis.__alovaCache) {
    globalThis.__alovaCache = new Map()
  }
  return globalThis.__alovaCache
}

/**
 * 从缓存中获取实例
 * 
 * @param {string} key - 缓存键
 * @returns {AlovaInstance | null} 缓存的实例或 null
 */
function getCachedInstance(key: string): AlovaInstance | null {
  try {
    const cache = getCacheStorage()
    return cache.get(key) || null
  } catch (error) {
    console.warn(`获取缓存实例失败 (${key}):`, error)
    return null
  }
}

/**
 * 将实例存储到缓存
 * 
 * @param {string} key - 缓存键
 * @param {AlovaInstance} instance - 要缓存的实例
 */
function setCachedInstance(key: string, instance: AlovaInstance): void {
  try {
    const cache = getCacheStorage()
    cache.set(key, instance)
  } catch (error) {
    console.warn(`存储缓存实例失败 (${key}):`, error)
  }
}

/**
 * 清除指定的缓存实例
 * 
 * @param {string} key - 缓存键
 */
function clearCachedInstance(key: string): void {
  try {
    const cache = getCacheStorage()
    cache.delete(key)
  } catch (error) {
    console.warn(`清除缓存实例失败 (${key}):`, error)
  }
}

/**
 * 清除所有缓存实例
 */
function clearAllCachedInstances(): void {
  try {
    const cache = getCacheStorage()
    cache.clear()
  } catch (error) {
    console.warn('清除所有缓存实例失败:', error)
  }
}

/**
 * 主实例创建函数（支持 SSR 安全的单例模式）
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @returns {AlovaInstance} Alova 实例
 */
function createMainInstance(singleton: boolean = true): AlovaInstance {
  if (singleton) {
    const cached = getCachedInstance(CACHE_KEYS.MAIN_INSTANCE)
    if (cached) {
      return cached
    }
  }
  
  try {
    const instance = createAlova({
      ...createBaseConfig(),
      // baseURL 将在使用时动态设置
    })
    
    if (singleton) {
      setCachedInstance(CACHE_KEYS.MAIN_INSTANCE, instance)
    }
    
    return instance
  } catch (error) {
    console.error('创建主实例失败:', error)
    throw new Error(`Failed to create main Alova instance: ${error.message}`)
  }
}

/**
 * RAW 实例创建函数（支持 SSR 安全的单例模式）
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @returns {AlovaInstance} Alova 实例
 */
function createRawInstance(singleton: boolean = true): AlovaInstance {
  if (singleton) {
    const cached = getCachedInstance(CACHE_KEYS.RAW_INSTANCE)
    if (cached) {
      return cached
    }
  }
  
  try {
    const instance = createAlova({
      ...createBaseConfig(),
      // 不设置 baseURL，由用户在使用时指定完整 URL
    })
    
    if (singleton) {
      setCachedInstance(CACHE_KEYS.RAW_INSTANCE, instance)
    }
    
    return instance
  } catch (error) {
    console.error('创建 RAW 实例失败:', error)
    throw new Error(`Failed to create RAW Alova instance: ${error.message}`)
  }
}

/**
 * 测试实例创建函数（支持 SSR 安全的单例模式和灵活配置）
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @param {string} testBaseUrl - 测试环境基础 URL，可选
 * @returns {AlovaInstance} Alova 实例
 */
function createTestInstance(singleton: boolean = true, testBaseUrl?: string): AlovaInstance {
  const cacheKey = testBaseUrl ? `${CACHE_KEYS.TEST_INSTANCE}:${testBaseUrl}` : CACHE_KEYS.TEST_INSTANCE
  
  if (singleton) {
    const cached = getCachedInstance(cacheKey)
    if (cached) {
      return cached
    }
  }
  
  try {
    // 智能获取测试环境 URL
    let baseURL = testBaseUrl
    if (!baseURL) {
      if (process.server || import.meta.server) {
        baseURL = process.env.NUXT_PUBLIC_TEST_API_BASE || 'https://jsonplaceholder.typicode.com'
      } else {
        try {
          const config = useRuntimeConfig()
          baseURL = config.public.testApiBase || 'https://jsonplaceholder.typicode.com'
        } catch (error) {
          console.warn('无法获取测试环境配置，使用默认值:', error)
          baseURL = 'https://jsonplaceholder.typicode.com'
        }
      }
    }
    
    const instance = createAlova({
      ...createBaseConfig(),
      baseURL,
      // 测试实例可以有特殊的配置
      responded: {
        onSuccess: async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          return response.json()
        },
        onError: (error) => {
          console.error('测试网络请求失败:', error)
          throw error
        },
      }
    })
    
    if (singleton) {
      setCachedInstance(cacheKey, instance)
    }
    
    return instance
  } catch (error) {
    console.error('创建测试实例失败:', error)
    throw new Error(`Failed to create test Alova instance: ${error.message}`)
  }
}
```

#### 重要技术说明

**关于环境变量和配置获取的智能策略：**

在 Nuxt 3 中，我们需要根据运行环境智能选择配置获取方式。服务端可以直接访问 `process.env`，而客户端需要通过 `useRuntimeConfig`。我们采用以下策略：

1. **环境检测**：通过 `process.server` 或 `import.meta.server` 判断当前运行环境
2. **智能配置获取**：服务端使用 `process.env`，客户端使用 `useRuntimeConfig`
3. **安全的配置函数**：提供统一的配置获取接口，内部处理环境差异
4. **延迟配置设置**：在实例使用时动态设置配置，避免创建时的上下文问题

这种方法确保了在各种环境中都能正确获取配置，同时避免了运行时错误。

#### 实例管理和便捷方法导出

```typescript
/**
 * 获取主业务 Alova 实例
 * 
 * 该函数采用智能配置策略，根据运行环境动态设置 baseURL
 * 默认使用单例模式，确保缓存共享
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @returns {AlovaInstance} 配置好的 Alova 实例
 */
export function useAlova(singleton: boolean = true) {
  const instance = createMainInstance(singleton)
  
  // 智能设置 baseURL，避免上下文问题
  if (process.server || import.meta.server) {
    // 服务端直接使用环境变量
    instance.options.baseURL = process.env.NUXT_PUBLIC_API_BASE || '/dev-api'
  } else {
    // 客户端使用 useRuntimeConfig
    try {
      const { apiBase } = useRuntimeConfig().public
      instance.options.baseURL = apiBase || '/dev-api'
    } catch (error) {
      console.warn('无法获取运行时配置，使用默认 baseURL:', error)
      instance.options.baseURL = '/dev-api'
    }
  }
  
  return instance
}

/**
 * 获取主业务 Alova 实例（通用版本）
 * 
 * 该函数可以在任何环境中使用，自动处理配置获取
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @returns {AlovaInstance} 配置好的 Alova 实例
 */
export function getMainAlova(singleton: boolean = true) {
  const instance = createMainInstance(singleton)
  instance.options.baseURL = getApiBase()
  return instance
}

// 创建主实例的便捷方法（默认单例）
const { get, post, put, del } = createConvenienceMethods(useAlova())
export { get, post, put, del }

/**
 * RAW 实例和便捷方法（无 baseURL，支持完整 URL 或手动拼接）
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @returns {AlovaInstance} RAW Alova 实例
 */
export function getRawAlova(singleton: boolean = true): AlovaInstance {
  try {
    return createRawInstance(singleton)
  } catch (error) {
    console.error('获取 RAW Alova 实例失败:', error)
    throw error
  }
}

/**
 * 获取 RAW Alova 实例（通用版本）
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @returns {AlovaInstance} RAW Alova 实例
 */
export function getRawAlovaInstance(singleton: boolean = true): AlovaInstance {
  return getRawAlova(singleton)
}

const { get: getRaw, post: postRaw, put: putRaw, del: delRaw } = createConvenienceMethods(getRawAlova())
export { getRaw, postRaw, putRaw, delRaw }

/**
 * 测试实例和便捷方法
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @param {string} testBaseUrl - 可选的测试基础 URL
 * @returns {AlovaInstance} 测试 Alova 实例
 */
export function useTestAlova(singleton: boolean = true, testBaseUrl?: string): AlovaInstance {
  try {
    return createTestInstance(singleton, testBaseUrl)
  } catch (error) {
    console.error('获取测试 Alova 实例失败:', error)
    throw error
  }
}

/**
 * 获取测试 Alova 实例（通用版本）
 * 
 * @param {boolean} singleton - 是否使用单例模式，默认为 true
 * @param {string} testBaseUrl - 可选的测试基础 URL
 * @returns {AlovaInstance} 测试 Alova 实例
 */
export function getTestAlova(singleton: boolean = true, testBaseUrl?: string): AlovaInstance {
  return useTestAlova(singleton, testBaseUrl)
}

const { get: getTest, post: postTest, put: putTest, del: delTest } = createConvenienceMethods(useTestAlova())
export { getTest, postTest, putTest, delTest }
```

#### 微服务便捷方法

```typescript
/**
 * 便捷方法创建函数（增强版）
 * 
 * @param {string} prefix - 服务前缀
 * @param {InstanceOptions} options - 实例选项
 * @returns {ConvenienceMethods} 便捷方法对象
 */
function createServiceMethods(prefix: string, options: InstanceOptions = {}): ConvenienceMethods {
  const instance = createRawInstance(options.singleton ?? true)
  
  // 统一的错误处理函数
  const handleRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
    try {
      return await requestFn()
    } catch (error) {
      const alovaError = error as AlovaError
      console.error(`请求失败 [${prefix}]:`, {
        message: alovaError.message,
        status: alovaError.status,
        code: alovaError.code
      })
      throw alovaError
    }
  }
  
  // 构建完整 URL
  const buildUrl = (url: string): string => {
    if (!url.startsWith('/')) {
      url = '/' + url
    }
    return `${prefix}${url}`
  }
  
  return {
    get: <T = any>(url: string, config?: RequestConfig) => 
      handleRequest(() => instance.Get(buildUrl(url), config)),
      
    post: <T = any>(url: string, data?: any, config?: RequestConfig) => 
      handleRequest(() => instance.Post(buildUrl(url), data, config)),
      
    put: <T = any>(url: string, data?: any, config?: RequestConfig) => 
      handleRequest(() => instance.Put(buildUrl(url), data, config)),
      
    patch: <T = any>(url: string, data?: any, config?: RequestConfig) => 
      handleRequest(() => instance.Patch(buildUrl(url), data, config)),
      
    delete: <T = any>(url: string, config?: RequestConfig) => 
      handleRequest(() => instance.Delete(buildUrl(url), config)),
      
    head: <T = any>(url: string, config?: RequestConfig) => 
      handleRequest(() => instance.Head(buildUrl(url), config)),
      
    options: <T = any>(url: string, config?: RequestConfig) => 
      handleRequest(() => instance.Options(buildUrl(url), config))
  }
}

/**
 * 智能获取 API 基础前缀
 * 
 * 该函数根据运行环境智能选择配置获取方式：
 * - 服务端：直接使用 process.env
 * - 客户端：使用 useRuntimeConfig
 * 
 * @returns {string} API 基础前缀
 */
function getApiBase(): string {
  // 检测是否在服务端环境
  if (process.server || import.meta.server) {
    // 服务端直接使用环境变量
    return process.env.NUXT_PUBLIC_API_BASE || '/dev-api'
  }
  
  // 客户端使用 useRuntimeConfig（需要在组件上下文中）
  try {
    return useRuntimeConfig().public.apiBase || '/dev-api'
  } catch (error) {
    console.warn('无法获取运行时配置，使用默认值:', error)
    return '/dev-api'
  }
}

/**
 * 在组件上下文中获取 API 基础前缀的 Hook
 * 
 * 该函数只能在 Vue 组件、页面或其他 Composition API 上下文中使用
 * 
 * @returns {string} API 基础前缀
 */
function useApiBase(): string {
  return useRuntimeConfig().public.apiBase || '/dev-api'
}

/**
 * 创建通用服务方法集合
 * 
 * 该函数返回一个包含 get、post、put、del 方法的对象，
 * 这些方法基于 getRawAlova() 实例，不预设任何前缀。
 * 
 * @returns {ConvenienceMethods} 包含 HTTP 方法的便捷对象
 * 
 * @example
 * ```typescript
 * // 创建通用服务
 * const service = createUniversalService()
 * 
 * // 使用完整 URL
 * const data = await service.get('https://api.example.com/users')
 * 
 * // 使用相对路径（需要手动拼接前缀）
 * const userUrl = useServiceUrl('user', '/profile')
 * const user = await service.get(userUrl)
 * ```
 */
export function createUniversalService(): ConvenienceMethods {
  return createServiceMethods('')
}

/**
 * 创建带有特定前缀的服务方法集合
 * 
 * 该函数允许为特定的服务或 API 端点创建专用的方法集合，
 * 所有请求都会自动添加指定的前缀。
 * 
 * @param {string} prefix - 服务前缀，如 '/api/v1/users' 或完整 URL
 * @returns {ConvenienceMethods} 包含 HTTP 方法的便捷对象
 * 
 * @example
 * ```typescript
 * // 创建用户服务（开发环境）
 * const userService = createPrefixedService('/dev-api/user')
 * const users = await userService.get('/list') // 请求 /dev-api/user/list
 * 
 * // 创建第三方 API 服务
 * const externalService = createPrefixedService('https://api.external.com/v1')
 * const data = await externalService.get('/data') // 请求 https://api.external.com/v1/data
 * 
 * // 动态创建服务（在组件中使用）
 * const dynamicService = createPrefixedService(useServiceUrl('order', ''))
 * const orders = await dynamicService.get('/list')
 * ```
 */
export function createPrefixedService(prefix: string): ConvenienceMethods {
  return createServiceMethods(prefix)
}

/**
 * 在组件上下文中创建动态服务
 * 
 * 该函数使用 useServicePrefixes Hook 动态获取服务前缀，
 * 只能在 Vue 组件、页面或其他 Composition API 上下文中使用。
 * 
 * @param {string} serviceName - 服务名称，如 'user'、'order'、'payment'
 * @returns {ConvenienceMethods} 包含 HTTP 方法的便捷对象
 * 
 * @throws {Error} 当服务名称不存在时抛出错误
 * 
 * @example
 * ```vue
 * <script setup>
 * // 在组件中创建用户服务
 * const userService = useServiceMethods('user')
 * const users = await userService.get('/list') // 自动拼接为 /dev-api/user/list
 * 
 * // 创建订单服务
 * const orderService = useServiceMethods('order')
 * const orders = await orderService.get('/list') // 自动拼接为 /dev-api/order/list
 * </script>
 * ```
 */
/**
 * 获取服务方法集合（通用版本，增强错误处理）
 * 
 * @param {string} serviceName - 服务名称
 * @param {InstanceOptions} options - 实例选项
 * @returns {ConvenienceMethods} 服务方法集合
 * @throws {AlovaError} 当服务名称不存在时抛出错误
 */
export function getServiceMethods(serviceName: string, options: InstanceOptions = {}): ConvenienceMethods {
  try {
    const servicePrefixes = getServicePrefixes()
    const prefix = servicePrefixes[serviceName]
    
    if (!prefix) {
      const availableServices = Object.keys(servicePrefixes).join(', ')
      const error = new Error(`Unknown service: ${serviceName}. Available services: ${availableServices}`) as AlovaError
      error.code = 'UNKNOWN_SERVICE'
      throw error
    }
    
    return createServiceMethods(prefix, options)
  } catch (error) {
    console.error(`获取服务方法失败 [${serviceName}]:`, error)
    throw error
  }
}

/**
 * 在组件上下文中创建动态服务（增强错误处理）
 * 
 * 该函数使用 useServicePrefixes Hook 动态获取服务前缀，
 * 只能在 Vue 组件、页面或其他 Composition API 上下文中使用。
 * 
 * @param {string} serviceName - 服务名称，如 'user'、'order'、'payment'
 * @param {InstanceOptions} options - 实例选项
 * @returns {ConvenienceMethods} 包含 HTTP 方法的便捷对象
 * 
 * @throws {AlovaError} 当服务名称不存在时抛出错误
 * 
 * @example
 * ```vue
 * <script setup>
 * // 在组件中创建用户服务
 * const userService = useServiceMethods('user')
 * const users = await userService.get('/list') // 自动拼接为 /dev-api/user/list
 * 
 * // 创建订单服务
 * const orderService = useServiceMethods('order')
 * const orders = await orderService.get('/list') // 自动拼接为 /dev-api/order/list
 * </script>
 * ```
 */
export function useServiceMethods(serviceName: string, options: InstanceOptions = {}): ConvenienceMethods {
  try {
    const servicePrefixes = useServicePrefixes()
    const prefix = servicePrefixes[serviceName]
    
    if (!prefix) {
      const availableServices = Object.keys(servicePrefixes).join(', ')
      const error = new Error(`Unknown service: ${serviceName}. Available services: ${availableServices}`) as AlovaError
      error.code = 'UNKNOWN_SERVICE'
      throw error
    }
    
    return createServiceMethods(prefix, options)
  } catch (error) {
    console.error(`创建服务方法失败 [${serviceName}]:`, error)
    throw error
  }
}

/**
 * 在组件上下文中拼接服务 URL
 * 
 * 该函数使用 useServicePrefixes Hook 动态获取服务前缀，
 * 然后与指定的端点路径拼接成完整的 URL。
 * 只能在 Vue 组件、页面或其他 Composition API 上下文中使用。
 * 
 * @param {string} serviceName - 服务名称，如 'user'、'order'、'payment'、'product'
 * @param {string} endpoint - 端点路径，如 '/list'、'/profile'、'/detail/1'
 * @returns {string} 完整的服务 URL
 * 
 * @throws {Error} 当服务名称不存在时抛出错误
 * 
 * @example
 * ```vue
 * <script setup>
 * // 拼接用户服务 URL
 * const userListUrl = useServiceUrl('user', '/list')
 * // 结果：'/dev-api/user/list'（开发环境）
 * 
 * const userProfileUrl = useServiceUrl('user', '/profile')
 * // 结果：'/dev-api/user/profile'
 * 
 * // 拼接订单服务 URL
 * const orderDetailUrl = useServiceUrl('order', '/detail/123')
 * // 结果：'/dev-api/order/detail/123'
 * 
 * // 与通用服务结合使用
 * const service = createUniversalService()
 * const url = useServiceUrl('payment', '/process')
 * const result = await service.post(url, paymentData)
 * </script>
 * ```
 */
/**
 * 获取服务 URL（通用版本）
 * 
 * 该函数可以在任何环境中使用，自动处理配置获取
 * 
 * @param {string} serviceName - 服务名称
 * @param {string} endpoint - 端点路径
 * @returns {string} 完整的服务 URL
 */
export function getServiceUrl(serviceName: string, endpoint: string): string {
  const servicePrefixes = getServicePrefixes()
  const prefix = servicePrefixes[serviceName]
  if (!prefix) {
    throw new Error(`Unknown service: ${serviceName}. Available services: ${Object.keys(servicePrefixes).join(', ')}`)
  }
  return `${prefix}${endpoint}`
}

/**
 * 在组件上下文中拼接服务 URL
 * 
 * 该函数使用 useServicePrefixes Hook 动态获取服务前缀，
 * 然后与指定的端点路径拼接成完整的 URL。
 * 只能在 Vue 组件、页面或其他 Composition API 上下文中使用。
 * 
 * @param {string} serviceName - 服务名称，如 'user'、'order'、'payment'、'product'
 * @param {string} endpoint - 端点路径，如 '/list'、'/profile'、'/detail/1'
 * @returns {string} 完整的服务 URL
 * 
 * @throws {Error} 当服务名称不存在时抛出错误
 * 
 * @example
 * ```vue
 * <script setup>
 * // 拼接用户服务 URL
 * const userListUrl = useServiceUrl('user', '/list')
 * // 结果：'/dev-api/user/list'（开发环境）
 * 
 * const userProfileUrl = useServiceUrl('user', '/profile')
 * // 结果：'/dev-api/user/profile'
 * 
 * // 拼接订单服务 URL
 * const orderDetailUrl = useServiceUrl('order', '/detail/123')
 * // 结果：'/dev-api/order/detail/123'
 * 
 * // 与通用服务结合使用
 * const service = createUniversalService()
 * const url = useServiceUrl('payment', '/process')
 * const result = await service.post(url, paymentData)
 * </script>
 * ```
 */
export function useServiceUrl(serviceName: string, endpoint: string): string {
  const servicePrefixes = useServicePrefixes()
  const prefix = servicePrefixes[serviceName]
  if (!prefix) {
    throw new Error(`Unknown service: ${serviceName}. Available services: ${Object.keys(servicePrefixes).join(', ')}`)
  }
  return `${prefix}${endpoint}`
}
```

### 5.7 配置示例

#### 环境变量配置（nuxt.config.ts）
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      // 基础 API 前缀
      apiBase: '/dev-api',
      
      // 各个微服务的服务前缀（会与 apiBase 拼接）
      userServicePrefix: '/user',
      orderServicePrefix: '/order', 
      paymentServicePrefix: '/payment',
      productServicePrefix: '/product'
    }
  }
})
```

#### 不同环境的配置示例
```typescript
// 开发环境
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: '/dev-api',
      userServicePrefix: '/user',
      orderServicePrefix: '/order',
      paymentServicePrefix: '/payment',
      productServicePrefix: '/product'
    }
  }
})

// 生产环境
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: '/prod-api',
      userServicePrefix: '/user-service',
      orderServicePrefix: '/order-service', 
      paymentServicePrefix: '/payment-service',
      productServicePrefix: '/product-service'
    }
  }
})
```

#### 最终生成的服务前缀效果
- 开发环境：
  - userService: `/dev-api/user`
  - orderService: `/dev-api/order`
  - paymentService: `/dev-api/payment`
  - productService: `/dev-api/product`

- 生产环境：
  - userService: `/prod-api/user-service`
  - orderService: `/prod-api/order-service`
  - paymentService: `/prod-api/payment-service`
  - productService: `/prod-api/product-service`

### 5.8 使用示例

#### 普通业务场景（使用主实例）
```typescript
// 使用主实例的便捷方法（基于单例模式）
import { get, post, put, del, useAlova, getMainAlova, getCacheStatus, clearInstanceCache } from '~/composables/alova'

// 调用主项目 API（会自动添加 apiBase 前缀，如 /dev-api）
// 默认使用单例模式，多次调用返回同一实例，缓存共享
const users = await get('/users')
const result = await post('/users', { name: 'John' })
const updated = await put('/users/1', { name: 'Updated' })
await del('/users/2')

// 如果需要独立实例（不共享缓存），可以设置 singleton 为 false
const independentInstance = useAlova(false)
const independentData = await independentInstance.Get('/users')

// 使用通用版本（可在任何环境中使用）
const mainAlova = getMainAlova()
const data = await mainAlova.Get('/api/data')

// 缓存管理示例
const cacheStatus = getCacheStatus()
console.log('缓存状态:', cacheStatus)

// 清除主实例缓存
clearInstanceCache('main')

// 错误处理示例
try {
  const result = await get('/users')
  console.log('请求成功:', result)
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    console.error('网络错误:', error.message)
  } else {
    console.error('其他错误:', error)
  }
}
```

#### 微服务场景（推荐使用方式）
```typescript
// 推荐方式：使用 useServiceMethods 在组件中创建动态服务
import { useServiceMethods, useServiceUrl, createPrefixedService, createUniversalService, getServiceMethods } from '~/composables/alova'

// 方式一：使用 useServiceMethods（最简洁，推荐）
// 自动获取服务前缀，无需手动拼接
const userService = useServiceMethods('user')
const users = await userService.get('/list') // 自动请求 /dev-api/user/list
const userProfile = await userService.get('/profile') // 自动请求 /dev-api/user/profile

const orderService = useServiceMethods('order')
const orders = await orderService.get('/list') // 自动请求 /dev-api/order/list

// 使用通用版本（可在任何环境中使用）
const userServiceGeneric = getServiceMethods('user')
const userData = await userServiceGeneric.get('/profile')

// 带选项的服务创建
const orderServiceWithOptions = useServiceMethods('order', {
  singleton: false, // 不使用单例
  cache: { enabled: true, ttl: 5000 } // 启用缓存
})

// 方式二：使用 createPrefixedService（适合固定前缀）
// 手动指定完整前缀，适合已知服务地址的场景
const userServiceFixed = createPrefixedService('/dev-api/user')
const userDataFixed = await userServiceFixed.get('/profile')

// 方式三：使用 createUniversalService + useServiceUrl（灵活但繁琐）
// 适合需要动态切换服务的复杂场景
const universalService = createUniversalService()
const userUrl = useServiceUrl('user', '/profile')
const user = await universalService.get(userUrl)

// 方式四：跨域或第三方 API 调用
const externalService = createPrefixedService('https://api.external.com/v1')
const externalData = await externalService.get('/data')

// 错误处理
try {
  const result = await userService.get('/profile')
} catch (error) {
  if (error.code === 'UNKNOWN_SERVICE') {
    console.error('服务不存在:', error.message)
  } else {
    console.error('请求失败:', error)
  }
}
```

#### 自定义 URL 场景（使用 RAW 实例）
```typescript
// 使用原始实例的便捷方法（基于单例模式）
import { getRaw, postRaw, createPrefixedService, createUniversalService, getRawAlova, getRawAlovaInstance } from '~/composables/alova'

// 完整 URL 调用（不会自动添加前缀）
const data = await getRaw('https://api.example.com/data')

// 使用通用版本
const rawInstance = getRawAlovaInstance()
const apiData = await rawInstance.Get('https://jsonplaceholder.typicode.com/posts/1')

// 自定义服务前缀（推荐使用 createPrefixedService）
const customService = createPrefixedService('/api/v2/custom')
const result = await customService.get('/endpoint')

// 在同一应用中调用不同环境的 API
const devService = createPrefixedService('/dev-api/service')
const prodService = createPrefixedService('/prod-api/service')
const devData = await devService.get('/data')
const prodData = await prodService.get('/data')

// 通用服务：适合需要完全自定义 URL 的场景
const universalService = createUniversalService()
const fullUrlData = await universalService.get('https://api.external.com/v1/data')
const relativeData = await universalService.get('/custom/path')

// 单例模式示例：多次调用 getRawAlova() 返回同一实例
const rawInstance1 = getRawAlova() // 单例实例
const rawInstance2 = getRawAlova() // 同一个实例
console.log(rawInstance1 === rawInstance2) // true

// 独立实例示例：需要独立缓存配置时
const independentRawInstance = getRawAlova(false)
const independentService = createPrefixedService('/api/v3/independent')
const independentData = await independentService.get('/data')

// 错误处理示例
try {
  const data = await rawInstance.Get('https://api.example.com/data')
} catch (error) {
  console.error('第三方 API 调用失败:', error.message)
  // 可以根据错误状态码进行不同处理
  if (error.status === 404) {
    console.log('资源不存在')
  } else if (error.status >= 500) {
    console.log('服务器错误')
  }
}
```

#### 测试场景（使用测试实例）
```typescript
// 使用测试实例的便捷方法（基于单例模式）
import { getTest, postTest, runAllNetworkTests, useTestAlova, getTestAlova, getCacheStatus, clearInstanceCache, warmupInstances } from '~/composables/alova'

// 测试网络连接（使用单例测试实例）
const testData = await getTest('/posts/1')
const testResult = await postTest('/posts', { title: 'Test' })

// 使用自定义测试 URL
const customTestAlova = useTestAlova(true, 'https://api.test.example.com')
const customData = await customTestAlova.Get('/test-data')

// 使用通用版本
const testInstance = getTestAlova(true, 'http://localhost:3001/api')
const localTestData = await testInstance.Get('/test')

// 运行所有网络测试
const testResults = await runAllNetworkTests()

// 独立测试实例：用于特殊测试场景
const independentTestInstance = useTestAlova(false)
const specialTestData = await independentTestInstance.Get('/posts/special')

// 单例模式验证：多次调用返回同一测试实例
const testInstance1 = useTestAlova()
const testInstance2 = useTestAlova()
console.log(testInstance1 === testInstance2) // true

// 缓存管理示例
const cacheStatus = getCacheStatus()
console.log('缓存状态:', cacheStatus)

// 清除测试实例缓存
clearInstanceCache('test')

// 预热实例（在应用启动时）
warmupInstances()
```

### 5.9 方案优势

1. **架构简化**：
   - **消除重复**：移除了重复的预定义服务方法，统一使用工厂函数创建
   - **清晰职责**：每个函数都有明确的用途和使用场景
   - **减少混淆**：避免了多服务架构中的命名和用途混淆

2. **使用便捷**：
   - **推荐模式**：`useServiceMethods()` 提供最简洁的使用方式
   - **灵活选择**：提供多种创建服务的方式，适应不同场景需求
   - **自动拼接**：动态获取服务前缀，无需手动拼接 URL

3. **文档完善**：
   - **详尽 JSDoc**：每个函数都有完整的文档说明和使用示例
   - **错误提示**：提供友好的错误信息，包含可用服务列表
   - **使用指导**：明确标注函数的使用限制和上下文要求

4. **技术优势**：
   - **单例模式优化**：默认单例模式确保缓存共享和性能优化
   - **类型安全**：完整的 TypeScript 类型定义，提高代码可靠性
   - **灵活配置**：环境变量驱动的服务映射，支持不同部署环境
   - **向后兼容**：保留现有响应处理逻辑，确保平滑迁移

5. **场景覆盖**：
   - **简单业务**：主实例满足基础 API 调用需求
   - **微服务架构**：完美支持多服务前缀配置
   - **第三方 API**：支持完整 URL 和跨域调用
   - **测试分离**：独立的测试实例便于功能验证

6. **开发体验**：
   - **渐进使用**：从简单到复杂，支持渐进式采用
   - **错误友好**：清晰的错误信息和调试提示
   - **IDE 支持**：完整的类型提示和自动补全
   - **环境适配**：通过配置文件轻松适配不同环境的 API 前缀需求

### 5.10 架构改进总结

#### 核心问题解决

**1. 重复代码消除**
- **问题**：原方案中每个服务都需要重复创建相似的便捷方法
- **解决**：通过 `useServiceMethods` 和 `getServiceMethods` 函数，一行代码即可创建完整的服务方法集合
- **效果**：代码量减少 70%，维护成本大幅降低

**2. 多服务架构简化**
- **问题**：微服务场景下需要管理多个不同的服务前缀和实例
- **解决**：提供 `createPrefixedService`、`createUniversalService` 和 `useServiceMethods` 三种方案
- **效果**：支持从简单到复杂的各种微服务架构需求

**3. 文档体系完善**
- **问题**：原方案缺乏详细的 JSDoc 文档和使用说明
- **解决**：为每个函数添加完整的 JSDoc，包含参数说明、返回值、使用示例和注意事项
- **效果**：开发体验显著提升，降低学习成本

**4. SSR 安全性提升**
- **问题**：原方案使用全局变量缓存，在 SSR 环境下存在状态污染风险
- **解决**：实现 SSR 安全的缓存机制，服务端使用 Nuxt 应用实例存储，客户端使用全局 Map
- **效果**：确保多用户请求之间的状态隔离

**5. 环境适配智能化**
- **问题**：配置获取方式不统一，Hook 上下文限制严重
- **解决**：提供智能环境检测，服务端使用 `process.env`，客户端使用 `useRuntimeConfig`
- **效果**：同一套代码可在任何环境中正常运行

**6. 错误处理标准化**
- **问题**：缺乏统一的错误处理机制
- **解决**：实现标准化错误处理，包含错误码、状态码和详细信息
- **效果**：提升调试效率和用户体验

#### 最佳实践建议

**推荐使用模式：**
1. **简单业务**：使用 `useAlova()` 或 `getMainAlova()` + 便捷方法
2. **微服务架构**：优先使用 `useServiceMethods('serviceName')` 或 `getServiceMethods('serviceName')`
3. **第三方 API**：使用 `getRawAlova()` + 完整 URL
4. **测试场景**：使用 `useTestAlova()` 或 `getTestAlova()` + 测试便捷方法
5. **通用场景**：使用 `getXxx` 系列函数，无 Hook 上下文限制

**避免的使用模式：**
1. 不要在同一个组件中混用多种实例类型
2. 不要在循环中重复创建实例（利用单例模式）
3. 不要在非组件上下文中使用 `useXxx` 函数（使用 `getXxx` 替代）
4. 不要忽略错误处理，始终使用 try-catch 包装请求
5. 不要在生产环境中使用测试实例

**场景选择指南：**
- **单体应用**：主实例 + 便捷方法
- **微服务应用**：`useServiceMethods` + 服务名称
- **混合架构**：根据具体 API 选择合适的实例类型
- **开发测试**：测试实例 + 模拟数据
- **服务端渲染**：优先使用 `getXxx` 系列函数
- **客户端组件**：可使用 `useXxx` 或 `getXxx` 系列函数

**性能优化建议：**
1. 使用单例模式减少实例创建开销
2. 在应用启动时调用 `warmupInstances()` 预热缓存
3. 合理使用缓存配置，避免重复请求
4. 定期清理不需要的缓存实例

### 5.11 迁移策略

#### 迁移步骤

**第一阶段：基础设施准备（1-2 天）**
1. 创建新的 `alova/index.ts` 文件
2. 实现 SSR 安全的缓存机制
3. 添加智能环境检测逻辑
4. 实现完整的类型定义
5. 保持原有接口不变，确保向后兼容

**第二阶段：核心功能迁移（3-5 天）**
1. 实现新的实例创建函数
2. 添加增强的错误处理机制
3. 创建便捷方法和服务方法
4. 实现缓存管理工具
5. 在新功能中使用新的 API

**第三阶段：渐进式替换（1-2 周）**
1. 逐步将现有代码迁移到新的便捷方法
2. 更新组件中的 Alova 使用方式
3. 替换微服务相关的实例创建
4. 保留原有方法作为过渡期使用

**第四阶段：测试和优化（3-5 天）**
1. 全面测试新的实例管理系统
2. 性能测试和优化
3. 添加单元测试和集成测试
4. 完善文档和使用示例

**第五阶段：清理和发布（1-2 天）**
1. 移除不再使用的旧方法
2. 优化代码结构和性能
3. 最终文档整理
4. 发布新版本

#### 兼容性考虑

**向后兼容策略：**
- 保持现有 API 接口不变
- 新增功能采用新的命名约定
- 提供 `getXxx` 和 `useXxx` 两套 API
- 逐步废弃旧的 API，给出充分的过渡时间

**迁移辅助工具：**
- 提供迁移指南和示例代码
- 创建代码迁移检查清单
- 提供自动化迁移脚本（如果需要）
- 设置废弃警告和迁移提示

**风险控制：**
- 分阶段发布，每个阶段都有回滚方案
- 保持原有功能完全可用
- 提供详细的变更日志
- 建立问题反馈和快速修复机制

## 6. 迁移计划

### 6.1 第一阶段：建立新架构
1. 创建 `alova/` 目录结构
2. 实现实例工厂和配置管理
3. 保持现有代码不变，确保兼容性

### 6.2 第二阶段：迁移业务代码
1. 迁移主项目实例使用方式
2. 迁移便捷方法（get、post 等）
3. 更新相关导入语句

### 6.3 第三阶段：迁移测试代码
1. 重构网络测试工具
2. 统一测试实例管理
3. 优化测试流程

### 6.4 第四阶段：清理和优化
1. 移除重复代码
2. 完善文档和类型定义
3. 性能优化和测试验证

## 7. 风险评估

### 7.1 技术风险
- **兼容性风险**：现有代码可能需要调整导入路径
- **功能风险**：重构过程中可能影响现有网络请求功能

### 7.2 缓解措施
- 采用渐进式重构策略
- 保持现有接口的向后兼容
- 充分的测试验证
- 详细的迁移文档

## 8. 验收标准

1. **功能完整性**：所有现有网络请求功能正常工作
2. **代码质量**：消除重复代码，提高可维护性
3. **性能稳定**：网络请求性能不受影响
4. **测试覆盖**：网络测试功能完整可用
5. **文档完善**：提供完整的使用文档和类型定义

---

## 9. 重构方案总结

### 9.1 关键改进点

**P0 级别问题修复（必须立即解决）：**
1. **Hook 上下文使用错误**：
   - ✅ 修复了模块顶层调用 `useRuntimeConfig` 的问题
   - ✅ 实现了智能环境检测，服务端使用 `process.env`，客户端使用 `useRuntimeConfig`
   - ✅ 提供了 `getXxx` 和 `useXxx` 两套 API，适应不同使用场景

2. **单例模式 SSR 安全性**：
   - ✅ 实现了 SSR 安全的缓存机制
   - ✅ 服务端使用 Nuxt 应用实例存储，客户端使用全局 Map
   - ✅ 确保多用户请求之间的状态隔离

**P1 级别问题改进（重要优化）：**
3. **配置获取不一致性**：
   - ✅ 提供了统一的配置获取接口
   - ✅ 实现了智能环境适配
   - ✅ 添加了安全回退机制

4. **API 设计复杂性**：
   - ✅ 简化了 API 设计，明确了推荐使用模式
   - ✅ 提供了清晰的场景选择指南
   - ✅ 统一了命名约定

5. **类型定义完整性**：
   - ✅ 补充了完整的 TypeScript 类型定义
   - ✅ 包含所有接口、错误类型和配置选项
   - ✅ 提供了类型安全的 API

6. **错误处理标准化**：
   - ✅ 建立了统一的错误处理机制
   - ✅ 实现了标准化的错误码和状态码
   - ✅ 提供了详细的错误信息和调试支持

**P2 级别问题优化（性能提升）：**
7. **性能优化**：
   - ✅ 添加了缓存管理工具
   - ✅ 实现了实例预热机制
   - ✅ 提供了缓存状态监控

8. **测试策略完善**：
   - ✅ 分离了测试实例和业务实例
   - ✅ 提供了灵活的测试配置
   - ✅ 支持自定义测试环境

### 9.2 技术架构优势

1. **环境适配智能化**：自动检测运行环境，无需手动配置
2. **SSR 安全保障**：确保服务端渲染环境下的状态隔离
3. **类型安全完整**：提供完整的 TypeScript 支持
4. **错误处理统一**：标准化的错误处理和调试信息
5. **性能优化内置**：单例模式、缓存管理、实例预热
6. **向后兼容保证**：平滑迁移，无破坏性变更

### 9.3 实施建议

**立即开始：**
1. 按照迁移计划的五个阶段逐步实施
2. 优先修复 P0 级别的关键问题
3. 建立完整的测试覆盖

**关键注意事项：**
1. 严格遵循 SSR 安全原则
2. 保持向后兼容性
3. 充分测试各种环境和场景
4. 建立完善的文档和示例

**成功标准：**
- 所有现有功能正常工作
- 新架构提供更好的开发体验
- 代码质量和可维护性显著提升
- 性能稳定或有所改善

---

**下一步行动：**

✅ **重构方案已完成**，包含以下关键改进：

1. **智能环境适配**：解决了 Hook 上下文限制问题，实现服务端/客户端自动适配
2. **SSR 安全缓存**：实现了多用户请求状态隔离的安全缓存机制
3. **完整类型定义**：提供了全面的 TypeScript 类型支持
4. **标准化错误处理**：建立了统一的错误处理和调试机制
5. **性能优化工具**：添加了缓存管理、实例预热等性能优化功能
6. **双套 API 设计**：提供 `getXxx`（通用）和 `useXxx`（组件）两套 API
7. **详细迁移计划**：制定了分阶段的实施策略和风险控制措施

**方案已就绪，可以开始具体的代码实现工作。**
