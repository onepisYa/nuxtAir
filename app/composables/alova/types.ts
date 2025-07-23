/**
 * Alova 实例管理重构 - 类型定义
 * 
 * 本文件定义了重构后 Alova 实例管理所需的所有类型和接口
 */

// Method 类型定义（简化版）
export interface Method<T = any> {
  send(): Promise<{ data: T }>
  [key: string]: any
}

// 实例类型枚举
export enum AlovaInstanceType {
  MAIN = 'main',         // 主业务实例（带 baseURL）
  RAW = 'raw',           // 原始实例（不带 baseURL）
  TEST = 'test'          // 测试实例（固定测试 URL）
}

/**
 * Alova 实例类型字符串联合类型
 */
export type AlovaInstanceTypeString = 'main' | 'raw' | 'test'

// 服务前缀映射接口
export interface ServicePrefixes {
  user: string
  order: string
  payment: string
  product: string
  [key: string]: string // 支持动态服务名称
}

// HTTP 请求配置接口
export interface RequestConfig<T = any> {
  headers?: Record<string, string>
  timeout?: number
  params?: Record<string, any>
  meta?: {
    ignoreToken?: boolean
    isTestApi?: boolean
    [key: string]: any
  }
  [key: string]: any
}

// 便捷方法接口
export interface ConvenienceMethods {
  get: <T = any>(url: string, config?: RequestConfig) => Method<T>
  post: <T = any, D = any>(url: string, data?: D, config?: RequestConfig) => Method<T>
  put: <T = any, D = any>(url: string, data?: D, config?: RequestConfig) => Method<T>
  patch: <T = any, D = any>(url: string, data?: D, config?: RequestConfig) => Method<T>
  delete: <T = any>(url: string, config?: RequestConfig) => Method<T>
  del: <T = any>(url: string, config?: RequestConfig) => Method<T> // delete 的别名
  head: <T = any>(url: string, config?: RequestConfig) => Method<T>
  options: <T = any>(url: string, config?: RequestConfig) => Method<T>
  upload: <T = any>(url: string, data: FormData | File | Blob, config?: RequestConfig) => Method<T>
}

// Alova 实例接口（简化版）
export interface AlovaInstance {
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
export interface AlovaError extends Error {
  code?: string
  status?: number
  response?: any
  config?: RequestConfig
  cause?: {
    type: 'HTTP_ERROR' | 'API_ERROR' | 'NETWORK_ERROR'
    details: any
    response?: any
  }
}

// 缓存配置接口
export interface CacheConfig {
  enabled: boolean
  ttl?: number // 缓存时间（毫秒）
  key?: string // 自定义缓存键
}

// 实例创建选项
export interface InstanceOptions {
  singleton?: boolean
  baseURL?: string
  timeout?: number
  cache?: CacheConfig
  [key: string]: any
}

// 服务配置接口
export interface ServiceConfig {
  name: string
  prefix: string
  timeout?: number
  headers?: Record<string, string>
  cache?: CacheConfig
}

// 环境配置接口
export interface EnvironmentConfig {
  apiBase: string
  userServicePrefix: string
  orderServicePrefix: string
  paymentServicePrefix: string
  productServicePrefix: string
  testApiBase: string
  [key: string]: string
}

// 工厂方法接口
export interface AlovaFactory {
  createMainInstance(options?: InstanceOptions): AlovaInstance
  createRawInstance(options?: InstanceOptions): AlovaInstance
  createTestInstance(options?: InstanceOptions): AlovaInstance
  createConvenienceMethods(instance: AlovaInstance): ConvenienceMethods
  createServiceMethods(servicePrefix: string): ConvenienceMethods
}

// 测试接口类型定义
export interface TestPost {
  userId: number
  id: number
  title: string
  body: string
}

export interface TestUser {
  id: number
  name: string
  username: string
  email: string
}

// 测试结果接口
export interface TestResult<T = any> {
  name: string
  success: boolean
  duration: number
  data?: T
  error?: string
  attempt?: number
}

// 网络测试结果集合
export interface NetworkTestResults {
  results: TestResult[]
  summary: {
    total: number
    success: number
    failed: number
    totalTime: number
    successRate: number
  }
}

// 缓存键名常量
export const CACHE_KEYS = {
  MAIN_INSTANCE: 'alova:main-instance',
  RAW_INSTANCE: 'alova:raw-instance',
  TEST_INSTANCE: 'alova:test-instance'
} as const

// 缓存键类型
export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS]