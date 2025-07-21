// 网络测试工具函数
// 使用 jsonplaceholder.typicode.com 测试网络请求功能

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import NuxtHook from 'alova/nuxt'

// 创建测试用的 Alova 实例
const testAlova = createAlova({
  statesHook: NuxtHook({
    nuxtApp: useNuxtApp,
  }),
  baseURL: 'https://jsonplaceholder.typicode.com',
  requestAdapter: adapterFetch(),
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
  },
})

// 测试接口类型定义
interface TestPost {
  userId: number
  id: number
  title: string
  body: string
}

interface TestUser {
  id: number
  name: string
  username: string
  email: string
}

/**
 * 测试 GET 请求
 */
export async function testGetRequest(): Promise<{ success: boolean; data?: TestPost[]; error?: string }> {
  try {
    const posts = await testAlova.Get<TestPost[]>('/posts?_limit=5')
    console.log('GET 请求测试成功:', posts)
    return { success: true, data: posts }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error('GET 请求测试失败:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * 测试 POST 请求
 */
export async function testPostRequest(): Promise<{ success: boolean; data?: TestPost; error?: string }> {
  try {
    const newPost = {
      title: 'Nuxt Air 测试文章',
      body: '这是一个测试网络请求功能的文章',
      userId: 1,
    }
    
    const result = await testAlova.Post<TestPost>('/posts', newPost)
    console.log('POST 请求测试成功:', result)
    return { success: true, data: result }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error('POST 请求测试失败:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * 测试 PUT 请求
 */
export async function testPutRequest(): Promise<{ success: boolean; data?: TestPost; error?: string }> {
  try {
    const updatePost = {
      id: 1,
      title: '更新的测试文章',
      body: '这是一个更新的测试文章内容',
      userId: 1,
    }
    
    const result = await testAlova.Put<TestPost>('/posts/1', updatePost)
    console.log('PUT 请求测试成功:', result)
    return { success: true, data: result }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error('PUT 请求测试失败:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * 测试 DELETE 请求
 */
export async function testDeleteRequest(): Promise<{ success: boolean; error?: string }> {
  try {
    await testAlova.Delete('/posts/1')
    console.log('DELETE 请求测试成功')
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error('DELETE 请求测试失败:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

/**
 * 运行所有网络测试
 */
export async function runAllNetworkTests() {
  console.log('开始网络功能测试...')
  
  const results = {
    get: await testGetRequest(),
    post: await testPostRequest(),
    put: await testPutRequest(),
    delete: await testDeleteRequest(),
  }
  
  const successCount = Object.values(results).filter(r => r.success).length
  const totalTests = Object.keys(results).length
  
  console.log(`网络测试完成: ${successCount}/${totalTests} 个测试通过`)
  
  if (successCount === totalTests) {
    console.log('✅ 所有网络测试通过！')
  } else {
    console.warn('⚠️ 部分网络测试失败，请检查网络连接和配置')
  }
  
  return results
}

/**
 * 测试当前项目的 API 配置
 */
export async function testProjectApiConfig() {
  try {
    const { apiBase, apiBaseUrl } = useRuntimeConfig().public
    console.log('当前 API 配置:')
    console.log('- apiBase:', apiBase)
    console.log('- apiBaseUrl:', apiBaseUrl)
    
    // 这里可以添加对实际项目 API 的测试
    // 但由于不确定实际 API 的可用性，暂时只输出配置信息
    
    return {
      success: true,
      config: { apiBase, apiBaseUrl }
    }
  } catch (error) {
    console.error('API 配置测试失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}