/**
 * Alova 实例管理重构 - 便捷方法模块
 * 
 * 本文件提供统一的 HTTP 请求方法，支持：
 * - 自动实例选择（主实例 vs RAW 实例）
 * - 类型安全的请求配置
 * - 统一的错误处理
 * - 灵活的配置选项
 */

import type { Method } from 'alova'
import type { AlovaInstanceType, AlovaInstanceTypeString, RequestConfig, ConvenienceMethods, AlovaInstance, ServicePrefixes } from './types'
import { createMainInstance, createRawInstance, createTestInstance } from './factory'
import { getServicePrefixes } from './config'

/**
 * 判断 URL 是否为完整 URL（包含协议）
 * 
 * @param {string} url - 要检查的 URL
 * @returns {boolean} 是否为完整 URL
 */
function isFullUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

/**
 * 智能选择 Alova 实例
 * 
 * 根据 URL 类型和配置自动选择合适的实例：
 * - 完整 URL：使用 RAW 实例
 * - 相对 URL：使用主实例
 * - 指定实例类型：使用指定类型
 * 
 * @param {string} url - 请求 URL
 * @param {AlovaInstanceType} instanceType - 指定的实例类型
 * @returns {import('alova').Alova} Alova 实例
 */
function selectInstance(url: string, instanceType?: AlovaInstanceType) {
  if (instanceType === 'test') {
    return createTestInstance()
  }
  
  if (instanceType === 'raw') {
    return createRawInstance()
  }
  
  if (instanceType === 'main') {
    return createMainInstance()
  }
  
  // 自动选择：完整 URL 使用 RAW 实例，相对 URL 使用主实例
  return isFullUrl(url) ? createRawInstance() : createMainInstance()
}

/**
 * 处理 URL，添加服务前缀
 * 
 * @param {string} url - 原始 URL
 * @param {keyof ServicePrefixes} servicePrefix - 服务前缀键
 * @returns {string} 处理后的 URL
 */
function processUrl(url: string, servicePrefix?: keyof ServicePrefixes): string {
  if (!servicePrefix || isFullUrl(url)) {
    return url
  }
  
  try {
    const servicePrefixes = getServicePrefixes()
    const prefixUrl = servicePrefixes[servicePrefix as keyof typeof servicePrefixes]
    return `${prefixUrl}${url.startsWith('/') ? '' : '/'}${url}`
  } catch (error) {
    console.warn(`获取服务前缀失败 (${String(servicePrefix)}):`, error)
    return url
  }
}

/**
 * GET 请求方法
 * 
 * @template T - 响应数据类型
 * @param {string} url - 请求 URL
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function get<T = any>(url: string, config: RequestConfig<T> = {}): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  return instance.Get(processedUrl, alovaConfig)
}

/**
 * POST 请求方法
 * 
 * @template T - 响应数据类型
 * @template D - 请求数据类型
 * @param {string} url - 请求 URL
 * @param {D} data - 请求数据
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function post<T = any, D = any>(
  url: string,
  data?: D,
  config: RequestConfig<T> = {}
): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  return instance.Post(processedUrl, data, alovaConfig)
}

/**
 * PUT 请求方法
 * 
 * @template T - 响应数据类型
 * @template D - 请求数据类型
 * @param {string} url - 请求 URL
 * @param {D} data - 请求数据
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function put<T = any, D = any>(
  url: string,
  data?: D,
  config: RequestConfig<T> = {}
): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  return instance.Put(processedUrl, data, alovaConfig)
}

/**
 * PATCH 请求方法
 * 
 * @template T - 响应数据类型
 * @template D - 请求数据类型
 * @param {string} url - 请求 URL
 * @param {D} data - 请求数据
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function patch<T = any, D = any>(
  url: string,
  data?: D,
  config: RequestConfig<T> = {}
): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  return instance.Patch(processedUrl, data, alovaConfig)
}

/**
 * DELETE 请求方法
 * 
 * @template T - 响应数据类型
 * @param {string} url - 请求 URL
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function del<T = any>(url: string, config: RequestConfig<T> = {}): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  return instance.Delete(processedUrl, alovaConfig)
}

/**
 * HEAD 请求方法
 * 
 * @template T - 响应数据类型
 * @param {string} url - 请求 URL
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function head<T = any>(url: string, config: RequestConfig<T> = {}): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  return instance.Head(processedUrl, alovaConfig)
}

/**
 * OPTIONS 请求方法
 * 
 * @template T - 响应数据类型
 * @param {string} url - 请求 URL
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function options<T = any>(url: string, config: RequestConfig<T> = {}): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  return instance.Options(processedUrl, alovaConfig)
}

/**
 * 文件上传方法
 * 
 * @template T - 响应数据类型
 * @param {string} url - 上传 URL
 * @param {FormData | File | Blob} data - 上传数据
 * @param {RequestConfig<T>} config - 请求配置
 * @returns {Method<T>} Alova Method 对象
 */
export function upload<T = any>(
  url: string,
  data: FormData | File | Blob,
  config: RequestConfig<T> = {}
): Method {
  const { instanceType, servicePrefix, ...alovaConfig } = config
  const processedUrl = processUrl(url, servicePrefix)
  const instance = selectInstance(processedUrl, instanceType)
  
  // 确保上传请求的 Content-Type 正确设置
  const uploadConfig = {
    ...alovaConfig,
    headers: {
      // 让浏览器自动设置 Content-Type（包括 boundary）
      ...alovaConfig.headers
    }
  }
  
  return instance.Post(processedUrl, data, uploadConfig)
}

/**
 * 便捷方法对象
 * 
 * 提供所有 HTTP 方法的统一接口
 */
export const methods: ConvenienceMethods = {
  get,
  post,
  put,
  patch,
  delete: del,
  del,
  head,
  options,
  upload
}

/**
 * 创建带有特定实例类型的便捷方法
 * 
 * @param {AlovaInstanceType} instanceType - 实例类型
 * @returns {ConvenienceMethods} 便捷方法对象
 */
export function createMethodsWithInstance(instanceType: AlovaInstanceTypeString): ConvenienceMethods {
  return {
    get: <T = any>(url: string, config: RequestConfig<T> = {}) => 
      get<T>(url, { ...config, instanceType }),
    
    post: <T = any, D = any>(url: string, data?: D, config: RequestConfig<T> = {}) => 
      post<T, D>(url, data, { ...config, instanceType }),
    
    put: <T = any, D = any>(url: string, data?: D, config: RequestConfig<T> = {}) => 
      put<T, D>(url, data, { ...config, instanceType }),
    
    patch: <T = any, D = any>(url: string, data?: D, config: RequestConfig<T> = {}) => 
      patch<T, D>(url, data, { ...config, instanceType }),
    
    delete: <T = any>(url: string, config: RequestConfig<T> = {}) => 
      del<T>(url, { ...config, instanceType }),
    
    del: <T = any>(url: string, config: RequestConfig<T> = {}) => 
      del<T>(url, { ...config, instanceType }),
    
    head: <T = any>(url: string, config: RequestConfig<T> = {}) => 
      head<T>(url, { ...config, instanceType }),
    
    options: <T = any>(url: string, config: RequestConfig<T> = {}) => 
      options<T>(url, { ...config, instanceType }),
    
    upload: <T = any>(url: string, data: FormData | File | Blob, config: RequestConfig<T> = {}) => 
      upload<T>(url, data, { ...config, instanceType })
  }
}

/**
 * 主实例便捷方法
 */
export const mainMethods = createMethodsWithInstance('main' as AlovaInstanceTypeString)

/**
 * RAW 实例便捷方法
 */
export const rawMethods = createMethodsWithInstance('raw' as AlovaInstanceTypeString)

/**
 * 测试实例便捷方法
 */
export const testMethods = createMethodsWithInstance('test' as AlovaInstanceTypeString)

/**
 * 默认导出便捷方法对象
 */
export default methods