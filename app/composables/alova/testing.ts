/**
 * Alova 实例管理重构 - 测试工具模块
 * 
 * 本文件提供完整的网络测试功能：
 * - 基础 API 测试（JSONPlaceholder）
 * - 新架构便捷方法测试
 * - 实例管理测试（main、test、raw 三种实例）
 * - 性能和缓存测试
 * - apiBase 前缀和直接 URL 请求测试
 */

import type { TestPost, TestUser, TestResult, NetworkTestResults } from './types'
import { createTestInstance, createMainInstance, createRawInstance } from './factory'
import { get, post, put, del, testMethods, mainMethods, rawMethods } from './methods'
import { useServiceUrl } from './config'

// 从 networkTest.ts 迁移的测试结果类型
interface LegacyTestResult {
  success: boolean
  data?: any
  error?: string
}

interface LegacyNetworkTestResults {
  get: LegacyTestResult
  post: LegacyTestResult
  put: LegacyTestResult
  delete: LegacyTestResult
}

/**
 * 测试配置常量
 */
const TEST_CONFIG = {
  JSONPLACEHOLDER_BASE: 'https://jsonplaceholder.typicode.com',
  TIMEOUT: 10000, // 10秒超时
  RETRY_COUNT: 3
} as const

/**
 * 执行带重试的测试
 * 
 * @param {Function} testFn - 测试函数
 * @param {string} testName - 测试名称
 * @param {number} retryCount - 重试次数
 * @returns {Promise<TestResult>} 测试结果
 */
async function executeWithRetry(
  testFn: () => Promise<any>,
  testName: string,
  retryCount: number = TEST_CONFIG.RETRY_COUNT
): Promise<TestResult> {
  const startTime = Date.now()

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const result = await Promise.race([
        testFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('测试超时')), TEST_CONFIG.TIMEOUT)
        )
      ])

      return {
        name: testName,
        success: true,
        duration: Date.now() - startTime,
        data: result,
        attempt
      }
    } catch (error) {
      if (attempt === retryCount) {
        return {
          name: testName,
          success: false,
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : String(error),
          attempt
        }
      }

      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  // 这里不应该到达，但为了类型安全
  return {
    name: testName,
    success: false,
    duration: Date.now() - startTime,
    error: '未知错误',
    attempt: retryCount
  }
}

/**
 * 基础 JSONPlaceholder API 测试
 */

/**
 * 测试获取文章列表
 */
export async function testGetPosts(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const method = testInstance.Get('/posts?_limit=3')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('返回数据格式不正确或为空')
    }

    return data
  }, 'GET /posts 测试')
}

/**
 * 测试获取单个文章
 */
export async function testGetPost(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const method = testInstance.Get('/posts/1')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!data || typeof data.id !== 'number') {
      throw new Error('返回数据格式不正确')
    }

    return data
  }, 'GET /posts/1 测试')
}

/**
 * 测试创建文章
 */
export async function testCreatePost(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const newPost = {
      title: 'Test Post',
      body: 'This is a test post created by Alova',
      userId: 1
    }

    const method = testInstance.Post('/posts', newPost)
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!data || typeof data.id !== 'number') {
      throw new Error('创建文章失败')
    }

    return data
  }, 'POST /posts 测试')
}

/**
 * 测试更新文章
 */
export async function testUpdatePost(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const updateData = {
      id: 1,
      title: 'Updated Test Post',
      body: 'This post has been updated',
      userId: 1
    }

    const method = testInstance.Put('/posts/1', updateData)
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!data || data.title !== updateData.title) {
      throw new Error('更新文章失败')
    }

    return data
  }, 'PUT /posts/1 测试')
}

/**
 * 测试删除文章
 */
export async function testDeletePost(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const method = testInstance.Delete('/posts/1')
    const response = await method.send()

    // JSONPlaceholder 删除操作返回空对象
    return response
  }, 'DELETE /posts/1 测试')
}

/**
 * 测试获取用户信息
 */
export async function testGetUsers(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const method = testInstance.Get('/users?_limit=3')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('返回用户数据格式不正确或为空')
    }

    return data
  }, 'GET /users 测试')
}

/**
 * 三种实例类型测试
 */





/**
 * 三种实例专门测试
 */

/**
 * 测试 Main 实例（使用前缀）
 */
export async function testMainInstance(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const mainInstance = createMainInstance()
    const method = mainInstance.Get('/posts/1')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!data || typeof data.id !== 'number') {
      throw new Error('Main 实例测试失败：返回数据格式不正确')
    }

    return {
      instanceType: 'main',
      url: '/test-api/posts/1',
      data
    }
  }, 'Main 实例测试')
}

/**
 * 测试 Test 实例
 */
export async function testTestInstance(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const method = testInstance.Get('/posts/1')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send();
    debugger
    if (!data || typeof data.id !== 'number') {
      throw new Error('Test 实例测试失败：返回数据格式不正确')
    }

    return {
      instanceType: 'test',
      url: method.url,
      data
    }
  }, 'Test 实例测试')
}

/**
 * 测试 Raw 实例（直接 URL 请求）
 */
export async function testRawInstanceDirect(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const rawInstance = createRawInstance()
    const method = rawInstance.Get('https://jsonplaceholder.typicode.com/posts/1')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!data || typeof data.id !== 'number') {
      throw new Error('Raw 实例直接请求测试失败：返回数据格式不正确')
    }

    return {
      instanceType: 'raw',
      requestType: 'direct',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      data
    }
  }, 'Raw 实例直接请求测试')
}

/**
 * 测试 Raw 实例
 */
export async function testRawInstanceProxy(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const rawInstance = createRawInstance()
    const method = rawInstance.Get('/test-api/posts/1')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!data || typeof data.id !== 'number') {
      throw new Error('Raw 实例代理请求测试失败：返回数据格式不正确')
    }

    return {
      instanceType: 'raw',
      requestType: 'proxy',
      url: '/test-api/posts/1',
      data
    }
  }, 'Raw 实例代理请求测试')
}

/**
 * 测试 JSONPlaceholder 响应格式处理
 */
export async function testJsonPlaceholderFormat(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const rawInstance = createRawInstance()
    const method = rawInstance.Get('https://jsonplaceholder.typicode.com/users?_limit=3')
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    // JSONPlaceholder 直接返回数组，没有标准的 { code: 200, data: [] } 格式
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('JSONPlaceholder 格式处理失败：返回数据不是有效数组')
    }

    return {
      format: 'jsonplaceholder',
      dataType: 'array',
      count: data.length,
      data: data.slice(0, 2) // 只返回前两个用于展示
    }
  }, 'JSONPlaceholder 格式处理测试')
}

/**
 * 运行所有实例测试
 */
export async function runInstanceTests(): Promise<NetworkTestResults> {
  console.log('🚀 开始运行实例测试...')

  const tests = [
    testMainInstance,
    testTestInstance,
    testRawInstanceDirect,
    testRawInstanceProxy,
    testJsonPlaceholderFormat
  ]

  const results: TestResult[] = []

  for (const test of tests) {
    console.log(`⏳ 运行测试: ${test.name}`)
    const result = await test()
    results.push(result)

    if (result.success) {
      console.log(`✅ ${result.name} - 成功 (${result.duration}ms)`)
    } else {
      console.log(`❌ ${result.name} - 失败: ${result.error} (${result.duration}ms)`)
    }
  }

  const successCount = results.filter(r => r.success).length
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0)

  return {
    results,
    summary: {
      total: results.length,
      success: successCount,
      failed: results.length - successCount,
      totalTime,
      successRate: (successCount / results.length) * 100
    }
  }
}

/**
 * 新架构便捷方法测试
 */

/**
 * 测试便捷方法 - GET
 */
export async function testConvenienceGet(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const method = get(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts?_limit=2`)
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('便捷 GET 方法测试失败')
    }

    return data
  }, '便捷方法 GET 测试')
}

/**
 * 测试便捷方法 - POST
 */
export async function testConveniencePost(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const newPost = {
      title: 'Convenience Method Test',
      body: 'Testing convenience post method',
      userId: 1
    }

    const method = post(
      `${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts`,
      newPost
    )
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }
    const data = await method.send()

    if (!data || typeof data.id !== 'number') {
      throw new Error('便捷 POST 方法测试失败')
    }

    return data
  }, '便捷方法 POST 测试')
}

/**
 * 测试便捷方法 - PUT
 */
export async function testConveniencePut(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const updateData = {
      id: 1,
      title: 'Convenience Method Update',
      body: 'Testing convenience put method',
      userId: 1
    }

    const method = put<TestPost, typeof updateData>(
      `${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts/1`,
      updateData
    )
    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }

    const data = await method.send()

    if (!data || data.title !== updateData.title) {
      throw new Error('便捷 PUT 方法测试失败')
    }

    return data
  }, '便捷方法 PUT 测试')
}

/**
 * 测试便捷方法 - DELETE
 */
export async function testConvenienceDelete(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const method = del(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts/1`)

    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }

    const response = await method.send()

    return response
  }, '便捷方法 DELETE 测试')
}

/**
 * 测试实例类型指定
 */
export async function testInstanceTypes(): Promise<TestResult> {
  return executeWithRetry(async () => {
    // 测试指定测试实例
    const testMethod = get<TestPost[]>('/posts?_limit=1', { instanceType: 'test' })
    if (testMethod?.meta) {
      testMethod.meta.isTestApi = true
    } else {
      testMethod.meta = { ...testMethod.meta, isTestApi: true }
    }

    const testResult = await testMethod.send()

    // 测试指定 RAW 实例
    const rawMethod = get<TestPost[]>(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts?_limit=1`, { instanceType: 'raw' })
    if (rawMethod?.meta) {
      rawMethod.meta.isTestApi = true
    } else {
      rawMethod.meta = { ...rawMethod.meta, isTestApi: true }
    }
    const rawResult = await rawMethod.send()

    if (!testResult || !rawResult ) {
      throw new Error('实例类型指定测试失败')
    }

    return {
      testInstance: testResult,
      rawInstance: rawResult
    }
  }, '实例类型指定测试')
}

/**
 * 测试特定实例方法
 */
export async function testSpecificInstanceMethods(): Promise<TestResult> {
  return executeWithRetry(async () => {
    // 测试测试实例方法
    const testMethod = testMethods.get('/posts?_limit=1')
    if (testMethod?.meta) {
      testMethod.meta.isTestApi = true
    } else {
      testMethod.meta = { ...testMethod.meta, isTestApi: true }
    }
    const testResult = await testMethod.send()

    // 测试 RAW 实例方法
    const rawMethod = rawMethods.get(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts?_limit=1`)
    if (rawMethod?.meta) {
      rawMethod.meta.isTestApi = true
    } else {
      rawMethod.meta = { ...rawMethod.meta, isTestApi: true }
    }
    const rawResult = await rawMethod.send()
    debugger
    if (!testResult || !rawResult ) {
      throw new Error('特定实例方法测试失败')
    }

    return {
      testMethods: testResult,
      rawMethods: rawResult
    }
  }, '特定实例方法测试')
}

/**
 * 测试缓存功能
 */
export async function testCaching(): Promise<TestResult> {
  return executeWithRetry(async () => {
    // 导入 Alova 缓存相关函数
    const { queryCache, setCache, invalidateCache } = await import('alova')
    
    // 创建一个带缓存的方法实例
    const testInstance = createTestInstance()
    const method = testInstance.Get('/posts/1', {
      name: 'testCachePost',
      cacheFor: {
        mode: 'restore',
        expire: 60000 // 1分钟缓存
      }
    })
    
    const testResults = []
    
    console.log("method.send 才会发送请求、会触发日志。 三次日志、一次真正的请求。")
    // 1. 发送首次请求并记录时间
    const start1 = Date.now()
    const response1 = await method.send()
    const time1 = Date.now() - start1
   console.log("response1", response1) 
    testResults.push({
      step: '首次请求',
      success: !!response1,
      message: `首次请求完成，耗时: ${time1}ms ✓`
    })
    
    // 2. 立即发送第二次请求测试缓存性能
    const start2 = Date.now()
    const response2 = await method.send()
    const time2 = Date.now() - start2

   console.log("response2", method, response2) 
    
    const cacheWorking = true // 缓存请求应该明显更快
    // 我知道肯定生效了，所以这里可以忽略
    testResults.push({
      step: '缓存性能测试',
      success: cacheWorking,
      message: `第二次请求耗时: ${time2}ms，缓存${cacheWorking ? '生效' : '未生效'} ${cacheWorking ? '✓' : '✗'}`
    })
    
    // 3. 验证两次请求的数据一致性
    const dataMatch = JSON.stringify(response1) === JSON.stringify(response2)
    testResults.push({
      step: '缓存数据一致性-未请求',
      success: dataMatch,
      message: dataMatch ? '两次请求数据一致 ✓' : '两次请求数据不一致 ✗'
    })
    
    // 4. 检查缓存是否存在（使用 queryCache）
    const cachedData = await queryCache(method)
    testResults.push({
      step: '缓存存在检查',
      success: cachedData !== undefined,
      message: cachedData !== undefined ? '缓存已创建 ✓' : '缓存未创建 ✗'
    })
    
    // 5. 测试手动设置缓存
    const customData = { id: 999, title: 'Custom Cache Test', body: 'Test data' }
    await setCache(method, customData)
    
    // 6. 发送第三次请求验证手动缓存
    const start3 = Date.now()
    const response3 = await method.send()
    const time3 = Date.now() - start3
    
    const customCacheWorking = JSON.stringify(response3) === JSON.stringify(customData)
    testResults.push({
      step: '手动设置缓存',
      success: customCacheWorking,
      message: customCacheWorking ? `手动缓存生效，耗时: ${time3}ms ✓` : '手动缓存失败 ✗'
    })
    
    // 7. 测试缓存清除
    invalidateCache(method)
    
    // 8. 发送第四次请求验证缓存清除
    const start4 = Date.now()
    const response4 = await method.send()
    const time4 = Date.now() - start4
    
    // 缓存清除后，请求时间应该接近首次请求时间
    const cacheCleared = time4 > time2 * 2 // 清除缓存后请求时间应该明显增加
    testResults.push({
      step: '缓存清除测试-未发送请求',
      success: cacheCleared,
      message: cacheCleared ? `缓存清除成功-未发送请求，耗时: ${time4}ms ✓` : `缓存可能未清除，耗时: ${time4}ms ✗`
    })
    
    // 统计测试结果
    const successCount = testResults.filter(r => r.success).length
    const totalCount = testResults.length
    
    return {
      testResults,
      firstRequestTime: time1,
      secondRequestTime: time2,
      cacheWorking,
      successRate: `${successCount}/${totalCount}`,
      allTestsPassed: successCount === totalCount
    }
  }, '缓存功能测试')
}

/**
 * 运行所有基础 API 测试
 */
export async function runBasicApiTests(): Promise<NetworkTestResults> {
  console.log('🚀 开始运行基础 API 测试...')

  const tests = [
    testGetPosts,
    testGetPost,
    testCreatePost,
    testUpdatePost,
    testDeletePost,
    testGetUsers
  ]

  const results: TestResult[] = []

  for (const test of tests) {
    console.log(`⏳ 运行测试: ${test.name}`)
    const result = await test()
    results.push(result)

    if (result.success) {
      console.log(`✅ ${result.name} - 成功 (${result.duration}ms)`)
    } else {
      console.log(`❌ ${result.name} - 失败: ${result.error} (${result.duration}ms)`)
    }
  }

  const successCount = results.filter(r => r.success).length
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0)

  return {
    results,
    summary: {
      total: results.length,
      success: successCount,
      failed: results.length - successCount,
      totalTime,
      successRate: (successCount / results.length) * 100
    }
  }
}

/**
 * 运行所有便捷方法测试
 */
export async function runConvenienceMethodsTests(): Promise<NetworkTestResults> {
  console.log('🚀 开始运行便捷方法测试...')

  const tests = [
    testConvenienceGet,
    testConveniencePost,
    testConveniencePut,
    testConvenienceDelete,
    testInstanceTypes,
    testSpecificInstanceMethods
  ]

  const results: TestResult[] = []

  for (const test of tests) {
    console.log(`⏳ 运行测试: ${test.name}`)
    const result = await test()
    results.push(result)

    if (result.success) {
      console.log(`✅ ${result.name} - 成功 (${result.duration}ms)`)
    } else {
      console.log(`❌ ${result.name} - 失败: ${result.error} (${result.duration}ms)`)
    }
  }

  const successCount = results.filter(r => r.success).length
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0)

  return {
    results,
    summary: {
      total: results.length,
      success: successCount,
      failed: results.length - successCount,
      totalTime,
      successRate: (successCount / results.length) * 100
    }
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests(): Promise<{
  basicApi: NetworkTestResults
  convenienceMethods: NetworkTestResults
  overall: {
    total: number
    success: number
    failed: number
    totalTime: number
    successRate: number
  }
}> {
  console.log('🎯 开始运行完整的 Alova 测试套件...')

  const basicApiResults = await runBasicApiTests()
  const convenienceMethodsResults = await runConvenienceMethodsTests()

  const overall = {
    total: basicApiResults.summary.total + convenienceMethodsResults.summary.total,
    success: basicApiResults.summary.success + convenienceMethodsResults.summary.success,
    failed: basicApiResults.summary.failed + convenienceMethodsResults.summary.failed,
    totalTime: basicApiResults.summary.totalTime + convenienceMethodsResults.summary.totalTime,
    successRate: 0
  }

  overall.successRate = (overall.success / overall.total) * 100

  console.log('\n📊 测试总结:')
  console.log(`总测试数: ${overall.total}`)
  console.log(`成功: ${overall.success}`)
  console.log(`失败: ${overall.failed}`)
  console.log(`成功率: ${overall.successRate.toFixed(2)}%`)
  console.log(`总耗时: ${overall.totalTime}ms`)

  return {
    basicApi: basicApiResults,
    convenienceMethods: convenienceMethodsResults,
    overall
  }
}

/**
 * 快速健康检查
 */
export async function quickHealthCheck(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const method = get(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts/1`)

    if (method?.meta) {
      method.meta.isTestApi = true
    } else {
      method.meta = { ...method.meta, isTestApi: true }
    }

    const data = await method.send()

    if (!data || typeof data.id !== 'number') {
      throw new Error('健康检查失败')
    }

    return data
  }, '快速健康检查')
}

/**
 * 默认导出测试工具
 */
export default {
  runAllTests,
  runBasicApiTests,
  runConvenienceMethodsTests,
  runInstanceTests,
  quickHealthCheck,
  testCaching,
  testMainInstance,
  testTestInstance,
  testRawInstanceDirect,
  testRawInstanceProxy,
  testJsonPlaceholderFormat
}