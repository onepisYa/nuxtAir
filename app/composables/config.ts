// app/composables/config.ts

// 真正的常量（编译时确定）
export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  API_TIMEOUT: 5000,
  SUPPORTED_LOCALES: ['zh-CN', 'en-US'],
} as const

// 运行时配置（需要 Nuxt 上下文）
export const useMyRuntimeConfig = () => {
  const config = useRuntimeConfig()
  
  return {
    phonenumber: config.public.phonenumber || '未设置',
    sitename: config.public.sitename || 'Nuxt App',
    apiBase: config.public.apiBase || '/api',
    apiBaseUrl: config.public.apiBaseUrl || config.public.baseUrl || 'http://localhost',
    baseUrl: config.public.baseUrl || 'http://localhost',
  }
}

// 便捷访问函数
export const usePhoneNumber = () => useMyRuntimeConfig().phonenumber
export const useSiteName = () => useMyRuntimeConfig().sitename
