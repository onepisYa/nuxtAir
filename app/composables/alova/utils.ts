/**
 * Alova 实例管理重构 - 工具函数模块
 * 
 * 本文件提供共享的工具函数，避免循环依赖：
 * - 响应处理和验证
 * - 错误处理和格式化
 * - 其他通用工具函数
 */

/**
 * 统一的网络请求错误处理函数
 * @param response HTTP 响应对象
 * @param method Alova 方法对象
 * @param json 解析后的响应数据
 * @returns 处理后的数据或抛出错误
 */
export function processResponseAndValidate(response: Response, method: any, json: any) {
  // HTTP 状态码检查
  // TODO: 完成之后、将 !== 200 替换为以下逻辑
  if (response.status < 200 || response.status >= 300) {
  // if (response.status !== 200 ) {
    const errorDetails = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      method: method.type,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: new Date().toISOString()
    }
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
    error.cause = {
      type: 'HTTP_ERROR',
      details: errorDetails,
      response: response
    }
    
    console.error('HTTP Request Failed:', errorDetails)
    throw error
  }
  
  // 检查是否是测试 API 请求（jsonplaceholder）
  const isTestApi = method.url.includes('/test-api') || method.meta?.isTestApi || method.baseURL === '/test-api'
  
  // 如果是测试 API，直接返回原始数据，不进行业务逻辑处理
  if (isTestApi) {
    console.log('Test API Response:', {
      url: method.url,
      status: response.status,
      data: json,
      timestamp: new Date().toISOString()
    })
    return json
  }
  
  try {
    // 业务逻辑错误处理
    if (json.code === 401) {
      user().logout()
      return navigateTo('/?callback=error&message=未登录')
    }
    
    if (json.code !== 200) {
      const errorDetails = {
        url: method.url,
        method: method.type,
        httpStatus: response.status,
        apiCode: json.code,
        apiMessage: json.msg,
        fullResponse: json,
        timestamp: new Date().toISOString()
      }
      
      const error = new Error(json.msg || `Request failed with code: ${json.code}`)
      error.cause = {
        type: 'API_ERROR',
        details: errorDetails,
        response: response
      }
      
      console.error('API Error:', errorDetails)
      throw error
    }
    
    return json?.data || json
  }
  catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e))
    // 保留完整错误对象用于调试
    throw error
  }
}

/**
 * 统一的错误捕获和日志记录函数
 * @param error 捕获的错误对象
 * @param context 错误上下文信息
 * @returns 格式化的错误信息
 */
export function logAndFormatError(error: unknown, context: string): string {
  const err = error as Error
  console.error(`${context} Error:`, {
    message: err.message,
    cause: (err as any).cause,
    stack: err.stack,
    timestamp: new Date().toISOString()
  })
  
  let errorMessage = err instanceof Error ? err.message : '未知错误'
  if ((err as any).cause?.details) {
    errorMessage += ` (${(err as any).cause.type}: ${JSON.stringify((err as any).cause.details)})`
  }
  
  console.error(`${context}失败:`, errorMessage)
  return errorMessage
}