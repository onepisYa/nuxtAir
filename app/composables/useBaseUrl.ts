/**
 * 统一的 baseUrl 获取 composable
 * 提供一致的 URL 生成方法，避免硬编码
 */
export const useBaseUrl = () => {
  const config = useRuntimeConfig()
  
  /**
   * 获取当前应用的基础 URL
   * @returns {string} 基础 URL，不包含尾部斜杠
   */
  const getBaseUrl = (): string => {
    return (config.public.baseUrl as string) || 'https://example.com'
  }
  
  /**
   * 生成完整的 URL
   * @param path - 路径，可以以 / 开头或不以 / 开头
   * @returns {string} 完整的 URL
   */
  const getFullUrl = (path: string = ''): string => {
    const baseUrl = getBaseUrl()
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${cleanPath}`
  }
  
  /**
   * 获取当前页面的完整 URL
   * @returns {string} 当前页面的完整 URL
   */
  const getCurrentUrl = (): string => {
    // 在服务端渲染时，使用 navigateTo 可能不可用
    if (process.server) {
      // 服务端渲染时返回基础 URL
      return getBaseUrl()
    }
    
    try {
      const route = useRoute()
      return getFullUrl(route.path)
    } catch {
      // 如果无法获取路由信息，返回基础 URL
      return getBaseUrl()
    }
  }
  
  return {
    getBaseUrl,
    getFullUrl,
    getCurrentUrl
  }
}