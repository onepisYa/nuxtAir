/**
 * Alova 实例管理重构 - 配置管理模块
 * 
 * 本文件负责管理 Alova 实例的配置，包括：
 * - 基础配置创建
 * - 服务前缀映射
 * - 环境配置获取
 * - SSR 安全的配置处理
 */

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import NuxtHook from 'alova/nuxt'
import type { ServicePrefixes, EnvironmentConfig } from './types'

/**
 * 智能获取服务前缀映射
 * 
 * 该函数根据运行环境智能获取配置，支持 apiBase 与 servicePrefix 拼接
 * 实现效果：/dev-api/server-name/path
 * 
 * @returns {ServicePrefixes} 服务前缀映射对象
 */
export function getServicePrefixes(): ServicePrefixes {
  let apiBase: string
  let userServicePrefix: string
  let orderServicePrefix: string
  let paymentServicePrefix: string
  let productServicePrefix: string
  
  // 根据环境选择配置获取方式
  if (process.server || import.meta.server) {
    // 服务端直接使用环境变量
    apiBase = process.env.NUXT_PUBLIC_API_BASE || '/test-api'
    userServicePrefix = process.env.NUXT_PUBLIC_USER_SERVICE_PREFIX || '/user'
    orderServicePrefix = process.env.NUXT_PUBLIC_ORDER_SERVICE_PREFIX || '/order'
    paymentServicePrefix = process.env.NUXT_PUBLIC_PAYMENT_SERVICE_PREFIX || '/payment'
    productServicePrefix = process.env.NUXT_PUBLIC_PRODUCT_SERVICE_PREFIX || '/product'
  } else {
    // 客户端使用 useRuntimeConfig
    try {
      const config = useRuntimeConfig()
      const publicConfig = config.public as any
      apiBase = publicConfig.apiBase || '/test-api'
      userServicePrefix = publicConfig.userServicePrefix || '/user'
      orderServicePrefix = publicConfig.orderServicePrefix || '/order'
      paymentServicePrefix = publicConfig.paymentServicePrefix || '/payment'
      productServicePrefix = publicConfig.productServicePrefix || '/product'
    } catch (error) {
      console.warn('无法获取运行时配置，使用默认值:', error)
      apiBase = '/test-api'
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
export function useServicePrefixes(): ServicePrefixes {
  const config = useRuntimeConfig()
  const publicConfig = config.public as any
  const apiBase = publicConfig.apiBase || '/test-api'
  
  // 拼接 apiBase 与各个服务前缀
  return {
    user: `${apiBase}${publicConfig.userServicePrefix || '/user'}`,
    order: `${apiBase}${publicConfig.orderServicePrefix || '/order'}`,
    payment: `${apiBase}${publicConfig.paymentServicePrefix || '/payment'}`,
    product: `${apiBase}${publicConfig.productServicePrefix || '/product'}`
  }
}

/**
 * 获取服务完整 URL 的 Hook（只能在特定上下文使用）
 * 
 * @param {string} service - 服务名称
 * @param {string} endpoint - API 端点
 * @returns {string} 完整的服务 URL
 */
export function useServiceUrl(service: string, endpoint: string): string {
  const prefixes = useServicePrefixes()
  const prefix = prefixes[service]
  if (!prefix) {
    throw new Error(`Unknown service: ${service}`)
  }
  return `${prefix}${endpoint}`
}

/**
 * 安全获取环境配置
 * 
 * @returns {EnvironmentConfig} 环境配置对象
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  if (process.server || import.meta.server) {
    // 服务端环境
    return {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/test-api',
      userServicePrefix: process.env.NUXT_PUBLIC_USER_SERVICE_PREFIX || '/user',
      orderServicePrefix: process.env.NUXT_PUBLIC_ORDER_SERVICE_PREFIX || '/order',
      paymentServicePrefix: process.env.NUXT_PUBLIC_PAYMENT_SERVICE_PREFIX || '/payment',
      productServicePrefix: process.env.NUXT_PUBLIC_PRODUCT_SERVICE_PREFIX || '/product',
      testApiBase: process.env.NUXT_PUBLIC_TEST_API_BASE || '/test-api'
    }
  } else {
    // 客户端环境
    try {
      const config = useRuntimeConfig()
      const publicConfig = config.public as any
      return {
        apiBase: publicConfig.apiBase || '/test-api',
        userServicePrefix: publicConfig.userServicePrefix || '/user',
        orderServicePrefix: publicConfig.orderServicePrefix || '/order',
        paymentServicePrefix: publicConfig.paymentServicePrefix || '/payment',
        productServicePrefix: publicConfig.productServicePrefix || '/product',
        testApiBase: publicConfig.testApiBase || 'https://jsonplaceholder.typicode.com'
      }
    } catch (error) {
      console.warn('无法获取运行时配置，使用默认值:', error)
      return {
        apiBase: '/test-api',
        userServicePrefix: '/user',
        orderServicePrefix: '/order',
        paymentServicePrefix: '/payment',
        productServicePrefix: '/product',
        testApiBase: 'https://jsonplaceholder.typicode.com'
      }
    }
  }
}

/**
 * 创建基础 Alova 配置
 * 
 * 提供基础的 Alova 配置，包含请求适配器、状态钩子和响应处理
 * 
 * @returns {object} Alova 基础配置对象
 */
export function createBaseConfig() {
  return {
    statesHook: NuxtHook({
      nuxtApp: useNuxtApp,
    }),
    cacheLogger: null,
    cacheFor: {
      GET: 0,
    },
    requestAdapter: adapterFetch(),
    beforeRequest: (method: any) => {
      // 统一的请求前处理
      if (!method.meta?.ignoreToken) {
        // 这里需要根据实际的用户状态管理来获取 token
        // 暂时注释掉，避免在基础模板中引用不存在的 user() 函数
        // method.config.headers.Authorization = `Bearer ${user().token}`
      }
      method.config.headers.clientid = ''
    },
    responded: {
      onSuccess: async (response: Response, method: any) => {
        // 基础响应处理逻辑
        const json = await response.json()
        // 简单的响应验证
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return json
      },
      onError: (error: any) => {
        console.error('网络请求错误:', error)
        // TODO: 集成 useToast 提供用户友好的错误提示
        // const toast = useToast()
        // toast.add({ title: '网络错误', description: error.message, color: 'red' })
      }
    }
  }
}

/**
 * 获取主实例的 baseURL
 * 
 * @returns {string} 主实例的基础 URL
 */
export function getMainInstanceBaseURL(): string {
  const config = getEnvironmentConfig()
  return config.apiBase
}

/**
 * 获取测试实例的 baseURL
 * 
 * @param {string} customUrl - 自定义测试 URL（可选）
 * @returns {string} 测试实例的基础 URL
 */
export function getTestInstanceBaseURL(customUrl?: string): string {
  if (customUrl) {
    return customUrl
  }
  const config = getEnvironmentConfig()
  return config.testApiBase
}

/**
 * 预定义的服务前缀常量
 * 
 * 这些常量可以在编译时确定，提供更好的类型安全性
 */
export const DEFAULT_SERVICE_PREFIXES = {
  USER: '/user',
  ORDER: '/order',
  PAYMENT: '/payment',
  PRODUCT: '/product'
} as const

/**
 * 预定义的 API 基础路径常量
 */
export const DEFAULT_API_BASES = {
  DEV: '/test-api',
  PROD: '/api',
  // TEST: 'https://jsonplaceholder.typicode.com'
  TEST: '/test-api'
} as const