#!/usr/bin/env node

/**
 * 测试 baseUrl 生成逻辑的脚本
 * 验证智能端口处理功能
 */

// 测试用例
const testCases = [
  {
    name: 'HTTPS 标准端口 443（应该被忽略）',
    env: {
      NODE_ENV: 'production',
      NUXT_PUBLIC_BASE_URL: 'https://www.example.com',
      PORT: '443'
    },
    expected: 'https://www.example.com'
  },
  {
    name: 'HTTP 标准端口 80（应该被忽略）',
    env: {
      NODE_ENV: 'production',
      NUXT_PUBLIC_BASE_URL: 'http://www.example.com',
      PORT: '80'
    },
    expected: 'http://www.example.com'
  },
  {
    name: 'HTTPS 非标准端口 8443（应该被添加）',
    env: {
      NODE_ENV: 'production',
      NUXT_PUBLIC_BASE_URL: 'https://www.example.com',
      PORT: '8443'
    },
    expected: 'https://www.example.com:8443'
  },
  {
    name: 'HTTP 非标准端口 8080（应该被添加）',
    env: {
      NODE_ENV: 'production',
      NUXT_PUBLIC_BASE_URL: 'http://www.example.com',
      PORT: '8080'
    },
    expected: 'http://www.example.com:8080'
  },
  {
    name: '没有 PORT 环境变量（应该返回原始 BASE_URL）',
    env: {
      NODE_ENV: 'production',
      NUXT_PUBLIC_BASE_URL: 'https://www.example.com'
    },
    expected: 'https://www.example.com'
  },
  {
    name: '开发环境（应该使用开发端口）',
    env: {
      NODE_ENV: 'development',
      NUXT_DEV_PORT: '3000',
      NUXT_DEV_HOST: 'localhost'
    },
    expected: 'http://localhost:3000'
  }
]

// baseUrl 生成逻辑函数
function generateBaseUrl(envVars) {
  // 临时设置环境变量
  const originalEnv = {}
  Object.keys(envVars).forEach(key => {
    originalEnv[key] = process.env[key]
    process.env[key] = envVars[key]
  })
  
  let result
  try {
    // 复制 nuxt.config.ts 中的逻辑
    if (process.env.NODE_ENV === 'production') {
      // 生产环境：智能组合 BASE_URL 和端口
      const baseUrl = process.env.NUXT_PUBLIC_BASE_URL || 'https://your-domain.com'
      const port = process.env.PORT
      
      if (!port) {
        result = baseUrl
      } else {
        try {
          const url = new URL(baseUrl)
          const portNum = parseInt(port)
          
          // 忽略标准端口：HTTP 80, HTTPS 443
          const isStandardPort = (url.protocol === 'http:' && portNum === 80) || 
                               (url.protocol === 'https:' && portNum === 443)
          
          if (!isStandardPort) {
            url.port = port
          }
          
          result = url.toString().replace(/\/$/, '')
        } catch (error) {
          // 如果 baseUrl 不是有效的 URL，直接返回
          result = baseUrl
        }
      }
    } else {
      // 开发环境：根据实际端口动态生成
      const devPort = process.env.NUXT_DEV_PORT || '3000'
      const devHost = process.env.NUXT_DEV_HOST === 'localhost' ? 'localhost' : 'localhost'
      result = `http://${devHost}:${devPort}`
    }
  } finally {
    // 恢复原始环境变量
    Object.keys(envVars).forEach(key => {
      if (originalEnv[key] !== undefined) {
        process.env[key] = originalEnv[key]
      } else {
        delete process.env[key]
      }
    })
  }
  
  return result
}

// 运行测试
function runTests() {
  console.log('🧪 开始测试 baseUrl 生成逻辑...\n')
  
  let passedTests = 0
  let failedTests = 0
  
  for (const testCase of testCases) {
    try {
      const result = generateBaseUrl(testCase.env)
      
      if (result === testCase.expected) {
        console.log(`✅ ${testCase.name}`)
        console.log(`   期望: ${testCase.expected}`)
        console.log(`   实际: ${result}\n`)
        passedTests++
      } else {
        console.log(`❌ ${testCase.name}`)
        console.log(`   期望: ${testCase.expected}`)
        console.log(`   实际: ${result}\n`)
        failedTests++
      }
    } catch (error) {
      console.log(`❌ ${testCase.name} - 执行错误`)
      console.log(`   错误: ${error.message}\n`)
      failedTests++
    }
  }
  
  console.log('📊 测试结果汇总:')
  console.log(`   通过: ${passedTests}`)
  console.log(`   失败: ${failedTests}`)
  console.log(`   总计: ${passedTests + failedTests}`)
  
  if (failedTests === 0) {
    console.log('\n🎉 所有测试通过！')
    process.exit(0)
  } else {
    console.log('\n⚠️  部分测试失败，请检查实现逻辑。')
    process.exit(1)
  }
}

// 运行测试
runTests()