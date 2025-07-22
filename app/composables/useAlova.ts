import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import NuxtHook from 'alova/nuxt'
// import { createClientTokenAuthentication } from 'alova/client'
// import { useCookie } from '#app'

const alova = createAlova({
  statesHook: NuxtHook({
    nuxtApp: useNuxtApp,
  }),
  cacheLogger: null,
  cacheFor: {
    GET: 0,
  },
  async beforeRequest(method) {
    if (!method.meta?.ignoreToken) {
      method.config.headers.Authorization = `Bearer ${user().token}`
    }
    method.config.headers.clientid = ''
  },
  requestAdapter: adapterFetch(),
  responded: {
    onSuccess: async (response) => {
      const json = await response.json()
      if (response.status !== 200) {
        throw new Error(json.msg || response.statusText)
      }
      try {
        if (json.code === 401) {
          user().logout()
          return navigateTo('/?callback=error&message=未登录')
        }
        
        if (json.code !== 200) {
          throw new Error(json.msg || '请求失败')
        }
        
        return json?.data || json
      }
      catch (e: unknown) {
        const error = e instanceof Error ? e : new Error(String(e))
        // 保留完整错误对象用于调试
        throw error
      }
    },
    onError: (error) => {
      console.error('网络请求错误:', error)
      // TODO: 集成 useToast 提供用户友好的错误提示
      // const toast = useToast()
      // toast.add({ title: '网络错误', description: error.message, color: 'red' })
    },
  },
})

export default function useAlova() {
  const { apiBase } = useRuntimeConfig().public
  alova.options.baseURL = apiBase
  return alova
}

export const get = <T>(url: string, params?: object, config: object = {}) => useAlova().Get(url, { params, ...config })

// export const post = <T>(url: string, data?: object, config: object = { baseURL: useRuntimeConfig().public.apiBase}) => useAlova().Post(url, data, config)
export const post = <T>(url: string, data?: object, config: object = {}) => useAlova().Post(url, data, config)

export const del = <T>(url: string, data?: object, config: object = {}) => useAlova().Delete(url, data, config)

export const put = <T>(url: string, data?: object, config: object = {}) => useAlova().Put(url, data, config)

export const upload = <T>(url: string, data: { name: string, filePath: string }, config: object = {}) => useAlova().Post(url, data, { ...config })
