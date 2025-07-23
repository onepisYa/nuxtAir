/**
 * Alova 实例管理重构 - 主入口文件
 * 
 * 本文件提供统一的导出接口，包括：
 * - 实例创建和管理
 * - 便捷方法
 * - 配置管理
 * - 测试工具
 * - 类型定义
 */

// import { createClientTokenAuthentication } from 'alova/client'
// import { useCookie } from '#app'

// === 类型定义导出 ===
export type {
  AlovaInstanceType,
  ServicePrefixes,
  RequestConfig,
  ConvenienceMethods,
  AlovaInstance,
  AlovaError,
  CacheConfig,
  InstanceOptions,
  ServiceConfig,
  EnvironmentConfig,
  AlovaFactory,
  TestPost,
  TestUser,
  TestResult,
  NetworkTestResults,
  CacheKey
} from './types'

export { CACHE_KEYS } from './types'

// === 配置管理导出 ===
export {
  getServicePrefixes,
  useServicePrefixes,
  useServiceUrl,
  getEnvironmentConfig,
  createBaseConfig,
  getMainInstanceBaseURL,
  getTestInstanceBaseURL,
  DEFAULT_SERVICE_PREFIXES,
  DEFAULT_API_BASES
} from './config'

// === 实例工厂导出 ===
export {
  createMainInstance,
  createRawInstance,
  createTestInstance,
  useMainInstance,
  useRawInstance,
  useTestInstance,
  clearCachedInstance,
  clearAllCachedInstances,
  AlovaInstanceFactory
} from './factory'

// === 内部使用的导入 ===
import {
  createMainInstance,
  createRawInstance,
  createTestInstance,
  useMainInstance,
  useRawInstance,
  useTestInstance,
  clearCachedInstance,
  clearAllCachedInstances
} from './factory'

import {
  processResponseAndValidate,
  logAndFormatError
} from './utils'

import {
  get,
  post,
  put,
  patch,
  del,
  head,
  options,
  upload,
  mainMethods,
  rawMethods,
  testMethods
} from './methods'

import {
  runAllTests,
  runBasicApiTests,
  runConvenienceMethodsTests,
  quickHealthCheck
} from './testing'

import {
  getServicePrefixes,
  useServicePrefixes,
  useServiceUrl,
  getEnvironmentConfig
} from './config'

// === 向后兼容的函数导出 ===
// 这些函数通过 useAlova 函数内部动态导入，避免重复导出

// AlovaInstanceFactory 已经通过上面的导出提供，不需要重复导出

// === 便捷方法导出 ===
export {
  get,
  post,
  put,
  patch,
  del,
  head,
  options,
  upload,
  methods,
  createMethodsWithInstance,
  mainMethods,
  rawMethods,
  testMethods
} from './methods'

export { default as convenienceMethods } from './methods'

// === 测试工具导出 ===
export {
  testGetPosts,
  testGetPost,
  testCreatePost,
  testUpdatePost,
  testDeletePost,
  testGetUsers,
  testConvenienceGet,
  testConveniencePost,
  testConveniencePut,
  testConvenienceDelete,
  testInstanceTypes,
  testSpecificInstanceMethods,
  testCaching,
  runBasicApiTests,
  runConvenienceMethodsTests,
  runAllTests,
  quickHealthCheck
} from './testing'

export { default as testingTools } from './testing'

// === 便捷的组合导出 ===

/**
 * 创建完整的 Alova 管理器
 * 
 * 提供所有功能的统一接口
 */
export function createAlovaManager() {
  return {
    // 实例创建
    instances: {
      createMain: createMainInstance,
      createRaw: createRawInstance,
      createTest: createTestInstance,
      useMain: useMainInstance,
      useRaw: useRawInstance,
      useTest: useTestInstance
    },
    
    // 便捷方法
    methods: {
      get,
      post,
      put,
      patch,
      del,
      head,
      options,
      upload
    },
    
    // 特定实例方法
    mainMethods,
    rawMethods,
    testMethods,
    
    // 缓存管理
    cache: {
      clear: clearCachedInstance,
      clearAll: clearAllCachedInstances
    },
    
    // 测试工具
    testing: {
      runAll: runAllTests,
      runBasic: runBasicApiTests,
      runConvenience: runConvenienceMethodsTests,
      quickCheck: quickHealthCheck
    },
    
    // 配置
    config: {
      getServicePrefixes,
      useServicePrefixes,
      useServiceUrl,
      getEnvironmentConfig
    }
  }
}

/**
 * 默认 Alova 管理器实例
 */
export const alovaManager = createAlovaManager()

// === 向后兼容的导出 ===

/**
 * 向后兼容：导出原有的 useAlova 函数
 * 
 * 这个函数保持与原有 API 的兼容性，同时内部使用新的架构
 */
export function useAlova() {
  // 直接使用已导入的函数，无需重新赋值
  
  return {
    // 主实例（带 baseURL）
    instance: createMainInstance(),
    
    // RAW 实例（不带 baseURL）
    rawInstance: createRawInstance(),
    
    // 测试实例
    testInstance: createTestInstance(),
    
    // 便捷方法（向后兼容）
    get: (url: string, config?: any) => {
      // 如果是完整 URL，使用 RAW 实例；否则使用主实例
      return /^https?:\/\//i.test(url) 
        ? rawMethods.get(url, config)
        : mainMethods.get(url, config)
    },
    
    post: (url: string, data?: any, config?: any) => {
      return /^https?:\/\//i.test(url)
        ? rawMethods.post(url, data, config)
        : mainMethods.post(url, data, config)
    },
    
    put: (url: string, data?: any, config?: any) => {
      return /^https?:\/\//i.test(url)
        ? rawMethods.put(url, data, config)
        : mainMethods.put(url, data, config)
    },
    
    del: (url: string, config?: any) => {
      return /^https?:\/\//i.test(url)
        ? rawMethods.del(url, config)
        : mainMethods.del(url, config)
    },
    
    upload: (url: string, data: FormData | File | Blob, config?: any) => {
      return /^https?:\/\//i.test(url)
        ? rawMethods.upload(url, data, config)
        : mainMethods.upload(url, data, config)
    },
    
    // 从原有 useAlova 导入的函数（已在文件顶部导入）
    processResponseAndValidate,
    logAndFormatError
  }
}

// === 工具函数导出 ===
export { processResponseAndValidate, logAndFormatError }

// === 默认导出 ===

/**
 * 默认导出 Alova 管理器
 */
export default alovaManager

// === 使用示例和文档 ===

/**
 * 使用示例：
 * 
 * ```typescript
 * // 1. 使用便捷方法（推荐）
 * import { get, post } from '~/composables/alova'
 * 
 * // 自动选择实例类型
 * const posts = await get('/api/posts').send()
 * const externalData = await get('https://api.example.com/data').send()
 * 
 * // 2. 使用特定实例方法
 * import { mainMethods, rawMethods, testMethods } from '~/composables/alova'
 * 
 * const posts = await mainMethods.get('/api/posts').send()
 * const externalData = await rawMethods.get('https://api.example.com/data').send()
 * const testData = await testMethods.get('/posts').send()
 * 
 * // 3. 使用实例工厂
 * import { createMainInstance, createRawInstance } from '~/composables/alova'
 * 
 * const mainInstance = createMainInstance()
 * const rawInstance = createRawInstance()
 * 
 * // 4. 向后兼容使用
 * import { useAlova } from '~/composables/alova'
 * 
 * const { get, post, instance } = useAlova()
 * 
 * // 5. 运行测试
 * import { runAllTests } from '~/composables/alova'
 * 
 * const testResults = await runAllTests()
 * ```
 */