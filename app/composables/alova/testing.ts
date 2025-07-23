/**
 * Alova 实例管理重构 - 测试工具模块
 * 
 * 本文件提供完整的网络测试功能：
 * - 基础 API 测试（JSONPlaceholder）
 * - 新架构便捷方法测试
 * - 实例管理测试（main、test、raw 三种实例）
 * - 性能和缓存测试
 * - /test-api 前缀和直接 URL 请求测试
 */

import type { TestPost, TestUser, TestResult, NetworkTestResults } from './types'
import { createTestInstance, createMainInstance, createRawInstance } from './factory'
import { get, post, put, del, testMethods, mainMethods, rawMethods } from './methods'
import { useServiceUrl } from './config'

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
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
 * 测试 Main 实例（使用 /test-api 前缀）
 */
export async function testMainInstance(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const mainInstance = createMainInstance()
    const method = mainInstance.Get('/test-api/posts/1')
    const { data } = await method.send()
    
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
 * 测试 Test 实例（使用 /test-api 前缀）
 */
export async function testTestInstance(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const testInstance = createTestInstance()
    const method = testInstance.Get('/test-api/posts/1')
    const { data } = await method.send()
    
    if (!data || typeof data.id !== 'number') {
      throw new Error('Test 实例测试失败：返回数据格式不正确')
    }
    
    return {
      instanceType: 'test',
      url: '/test-api/posts/1',
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
    const { data } = await method.send()
    
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
 * 测试 Raw 实例（使用 /test-api 前缀）
 */
export async function testRawInstanceProxy(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const rawInstance = createRawInstance()
    const method = rawInstance.Get('/test-api/posts/1')
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
    const { data } = await method.send()
    
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
    const testResult = await testMethod.send()
    
    // 测试指定 RAW 实例
    const rawMethod = get<TestPost[]>(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts?_limit=1`, { instanceType: 'raw' })
    const rawResult = await rawMethod.send()
    
    if (!testResult.data || !rawResult.data) {
      throw new Error('实例类型指定测试失败')
    }
    
    return {
      testInstance: testResult.data,
      rawInstance: rawResult.data
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
    const testResult = await testMethod.send()
    
    // 测试 RAW 实例方法
    const rawMethod = rawMethods.get(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts?_limit=1`)
    const rawResult = await rawMethod.send()
    
    if (!testResult.data || !rawResult.data) {
      throw new Error('特定实例方法测试失败')
    }
    
    return {
      testMethods: testResult.data,
      rawMethods: rawResult.data
    }
  }, '特定实例方法测试')
}

/**
 * 测试缓存功能
 */
export async function testCaching(): Promise<TestResult> {
  return executeWithRetry(async () => {
    const startTime = Date.now()
    
    // 第一次请求
    const method1 = get(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts/1`)
    const result1 = await method1.send()
    const firstRequestTime = Date.now() - startTime
    
    // 第二次相同请求（应该使用缓存）
    const method2 = get(`${TEST_CONFIG.JSONPLACEHOLDER_BASE}/posts/1`)
    const result2 = await method2.send()
    const secondRequestTime = Date.now() - startTime - firstRequestTime
    
    return {
      firstRequest: result1.data,
      secondRequest: result2.data,
      firstRequestTime,
      secondRequestTime,
      cacheWorking: secondRequestTime < firstRequestTime / 2 // 缓存应该更快
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
    const { data } = await method.send()
    
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