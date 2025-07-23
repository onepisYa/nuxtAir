/**
 * Alova 实例管理重构 - 实例工厂模块
 * 
 * 本文件负责创建和管理不同类型的 Alova 实例：
 * - 主业务实例（带 baseURL）
 * - 原始实例（不带 baseURL）
 * - 测试实例（固定测试 URL）
 * - SSR 安全的单例模式
 */

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import NuxtHook from 'alova/nuxt'
import type { AlovaInstance, InstanceOptions, CacheKey } from './types'
import { CACHE_KEYS } from './types'
import { createBaseConfig, getMainInstanceBaseURL, getTestInstanceBaseURL } from './config'
import { processResponseAndValidate, logAndFormatError } from './utils'

/**
 * SSR 安全的实例缓存管理
 * 
 * 在 SSR 环境中，全局变量可能导致状态污染，因此我们需要使用
 * Nuxt 应用实例来存储缓存，确保每个请求都有独立的缓存空间
 */

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
        nuxtApp.ssrContext = {} as any
      }
      if (!(nuxtApp.ssrContext as any).alovaCache) {
        (nuxtApp.ssrContext as any).alovaCache = new Map()
      }
      return (nuxtApp.ssrContext as any).alovaCache
    } catch (error) {
      // 如果无法获取 Nuxt 应用实例，使用临时 Map
      console.warn('无法获取 Nuxt 应用实例，使用临时缓存:', error)
      return new Map()
    }
  }
  
  // 客户端使用全局 Map
  if (!(globalThis as any).__alovaCache) {
    (globalThis as any).__alovaCache = new Map()
  }
  return (globalThis as any).__alovaCache
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
export function clearCachedInstance(key: string): void {
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
export function clearAllCachedInstances(): void {
  try {
    const cache = getCacheStorage()
    cache.clear()
  } catch (error) {
    console.warn('清除所有缓存实例失败:', error)
  }
}

/**
 * 创建增强的基础配置
 * 
 * 正确导入并使用现有的响应处理函数
 * 
 * @returns {object} 增强的 Alova 配置对象
 */
function createEnhancedBaseConfig() {
  return {
    statesHook: NuxtHook({
      nuxtApp: useNuxtApp,
    }),
    cacheLogger: true,
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
        // 复用现有的响应处理和验证逻辑
        const json = await response.json()
        return processResponseAndValidate(response, method, json)
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
 * 主实例创建函数（支持 SSR 安全的单例模式）
 * 
 * @param {InstanceOptions} options - 实例创建选项
 * @returns {AlovaInstance} Alova 实例
 */
export function createMainInstance(options: InstanceOptions = {}): AlovaInstance {
  const { singleton = true, baseURL, ...otherOptions } = options
  
  if (singleton) {
    const cached = getCachedInstance(CACHE_KEYS.MAIN_INSTANCE)
    if (cached) {
      return cached
    }
  }
  
  try {
    const finalBaseURL = baseURL || getMainInstanceBaseURL()
    
    const instance = createAlova({
      ...createEnhancedBaseConfig(),
      baseURL: finalBaseURL,
      ...otherOptions
    })
    
    if (singleton) {
      setCachedInstance(CACHE_KEYS.MAIN_INSTANCE, instance)
    }
    
    return instance
  } catch (error) {
    console.error('创建主实例失败:', error)
    throw new Error(`Failed to create main Alova instance: ${(error as Error).message}`)
  }
}

/**
 * RAW 实例创建函数（支持 SSR 安全的单例模式）
 * 
 * @param {InstanceOptions} options - 实例创建选项
 * @returns {AlovaInstance} Alova 实例
 */
export function createRawInstance(options: InstanceOptions = {}): AlovaInstance {
  const { singleton = true, ...otherOptions } = options
  
  if (singleton) {
    const cached = getCachedInstance(CACHE_KEYS.RAW_INSTANCE)
    if (cached) {
      return cached
    }
  }
  
  try {
    const instance = createAlova({
      ...createEnhancedBaseConfig(),
      // 不设置 baseURL，由用户在使用时指定完整 URL
      ...otherOptions
    })
    
    if (singleton) {
      setCachedInstance(CACHE_KEYS.RAW_INSTANCE, instance)
    }
    
    return instance
  } catch (error) {
    console.error('创建 RAW 实例失败:', error)
    throw new Error(`Failed to create RAW Alova instance: ${(error as Error).message}`)
  }
}

/**
 * 测试实例创建函数（支持 SSR 安全的单例模式和灵活配置）
 * 
 * @param {InstanceOptions} options - 实例创建选项
 * @returns {AlovaInstance} Alova 实例
 */
export function createTestInstance(options: InstanceOptions = {}): AlovaInstance {
  const { singleton = true, baseURL, ...otherOptions } = options
  const testBaseUrl = baseURL || getTestInstanceBaseURL()
  const cacheKey = baseURL ? `${CACHE_KEYS.TEST_INSTANCE}:${baseURL}` : CACHE_KEYS.TEST_INSTANCE
  
  if (singleton) {
    const cached = getCachedInstance(cacheKey)
    if (cached) {
      return cached
    }
  }
  
  try {
    const instance = createAlova({
      ...createEnhancedBaseConfig(),
      baseURL: testBaseUrl,
      ...otherOptions
    })
    
    if (singleton) {
      setCachedInstance(cacheKey, instance)
    }
    
    return instance
  } catch (error) {
    console.error('创建测试实例失败:', error)
    throw new Error(`Failed to create test Alova instance: ${(error as Error).message}`)
  }
}

/**
 * 获取主实例（Hook 版本，只能在组件上下文中使用）
 * 
 * @param {InstanceOptions} options - 实例创建选项
 * @returns {AlovaInstance} Alova 实例
 */
export function useMainInstance(options: InstanceOptions = {}): AlovaInstance {
  return createMainInstance(options)
}

/**
 * 获取 RAW 实例（Hook 版本，只能在组件上下文中使用）
 * 
 * @param {InstanceOptions} options - 实例创建选项
 * @returns {AlovaInstance} Alova 实例
 */
export function useRawInstance(options: InstanceOptions = {}): AlovaInstance {
  return createRawInstance(options)
}

/**
 * 获取测试实例（Hook 版本，只能在组件上下文中使用）
 * 
 * @param {InstanceOptions} options - 实例创建选项
 * @returns {AlovaInstance} Alova 实例
 */
export function useTestInstance(options: InstanceOptions = {}): AlovaInstance {
  return createTestInstance(options)
}

/**
 * 实例工厂类
 * 
 * 提供统一的实例创建接口
 */
export class AlovaInstanceFactory {
  /**
   * 创建主实例
   */
  static createMain(options?: InstanceOptions): AlovaInstance {
    return createMainInstance(options)
  }
  
  /**
   * 创建 RAW 实例
   */
  static createRaw(options?: InstanceOptions): AlovaInstance {
    return createRawInstance(options)
  }
  
  /**
   * 创建测试实例
   */
  static createTest(options?: InstanceOptions): AlovaInstance {
    return createTestInstance(options)
  }
  
  /**
   * 清除指定实例缓存
   */
  static clearCache(key: CacheKey): void {
    clearCachedInstance(key)
  }
  
  /**
   * 清除所有实例缓存
   */
  static clearAllCache(): void {
    clearAllCachedInstances()
  }
}

/**
 * 默认导出工厂实例
 */
export default AlovaInstanceFactory