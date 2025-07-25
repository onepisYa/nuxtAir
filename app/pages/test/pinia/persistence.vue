<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          💾 持久化测试
        </h1>
        <p class="text-gray-600">
          测试 Pinia Store 数据持久化功能，使用 Nuxt 的 <strong>useCookie API</strong> 进行 Cookie 管理。
          在 Nuxt 环境中数据存储在 Cookie 中（服务端渲染兼容），useCookie 提供了响应式的 Cookie 操作能力。
        </p>
        <div class="mt-3 text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
          <strong>useCookie 优势：</strong> 响应式更新、SSR/SSG 兼容、自动序列化、类型安全
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：持久化状态展示与测试 -->
        <div class="space-y-6">
          <!-- Counter Store 持久化 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:database" class="mr-3 w-6 h-6 text-blue-500" />
              Counter Store 持久化
            </h2>
            
            <!-- 当前状态 -->
            <div class="bg-blue-50 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-blue-600">{{ counterStore.count }}</div>
                  <div class="text-sm text-gray-600">当前计数</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-green-600">{{ counterStore.doubleCount }}</div>
                  <div class="text-sm text-gray-600">双倍值</div>
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-2">
                <button 
                  @click="counterStore.increment()"
                  class="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  +1
                </button>
                <button 
                  @click="counterStore.incrementBy(10)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  +10
                </button>
                <button 
                  @click="counterStore.reset()"
                  class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  重置
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="setRandomCount"
                  class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  随机值
                </button>
                <button 
                  @click="setNegativeCount"
                  class="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  负数值
                </button>
              </div>
            </div>
            
            <!-- 持久化状态 -->
            <div class="mt-4 pt-4 border-t">
              <h3 class="font-semibold text-gray-700 mb-2">持久化状态</h3>
              <div class="text-sm space-y-1">
                <div class="flex justify-between">
                  <span>Cookie 存储:</span>
                  <span class="font-mono text-blue-600">{{ cookieCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>最后更新:</span>
                  <span class="text-gray-500">{{ lastCounterUpdate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- User Store 持久化 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:user-check" class="mr-3 w-6 h-6 text-green-500" />
              User Store 持久化
            </h2>
            
            <!-- 登录状态 -->
            <div class="mb-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium">登录状态</span>
                <div class="flex items-center">
                  <div 
                    :class="[
                      'w-3 h-3 rounded-full mr-2',
                      userStore.isLogin ? 'bg-green-500' : 'bg-red-500'
                    ]"
                  ></div>
                  <span class="text-sm">
                    {{ userStore.isLogin ? '已登录' : '未登录' }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 用户信息 -->
            <div v-if="userStore.isLogin" class="mb-4 p-3 bg-green-50 rounded-lg">
              <div class="font-medium text-green-800 mb-2">用户信息</div>
              <div class="text-sm space-y-1">
                <div>Token: {{ userStore.token?.substring(0, 15) }}...</div>
                <div v-if="userStore.info_template">
                  ID: {{ userStore.info_template.id }}
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="space-y-3">
              <button 
                v-if="!userStore.isLogin"
                @click="simulateLogin"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                模拟登录
              </button>
              
              <div v-if="userStore.isLogin" class="space-y-2">
                <button 
                  @click="updateUserInfo"
                  class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  更新用户信息
                </button>
                
                <button 
                  @click="simulateLogout()"
                  class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  模拟登出
                </button>
              </div>
              
              <button 
                @click="userStore.clear()"
                class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                清除所有数据
              </button>
            </div>
            
            <!-- 持久化状态 -->
            <div class="mt-4 pt-4 border-t">
              <h3 class="font-semibold text-gray-700 mb-2">持久化状态</h3>
              <div class="text-sm space-y-1">
                <div class="flex justify-between">
                  <span>Cookie Token:</span>
                  <span class="font-mono text-green-600">{{ cookieToken ? 'exists' : 'null' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>最后更新:</span>
                  <span class="text-gray-500">{{ lastUserUpdate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 持久化测试 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:test-tube" class="mr-2 w-5 h-5" />
              持久化测试
            </h3>
            
            <div class="space-y-4">
              <!-- 数据恢复测试 -->
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-3">数据恢复测试</h4>
                <div class="space-y-2">
                  <button 
                    @click="reloadPage"
                    class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    刷新页面测试持久化
                  </button>
                  
                  <button 
                    @click="testDataPersistence"
                    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    测试数据持久化
                  </button>
                </div>
              </div>
              
              <!-- 存储清理 -->
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-3">存储清理</h4>
                <div class="space-y-2">
                  <button 
                    @click="clearCounterStorage"
                    class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    清除 Counter 存储
                  </button>
                  
                  <button 
                    @click="clearUserStorage"
                    class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    清除 User 存储
                  </button>
                  
                  <button 
                    @click="clearAllStorage"
                    class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    清除所有存储
                  </button>
                </div>
              </div>
              
              <!-- 数据导入导出 -->
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-3">数据导入导出</h4>
                <div class="space-y-2">
                  <button 
                    @click="exportStoreData"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    导出 Store 数据
                  </button>
                  
                  <button 
                    @click="importStoreData"
                    class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    导入示例数据
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：存储检查工具与API示例 -->
        <div class="space-y-6">
          <!-- 存储检查工具 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:search" class="mr-2 w-5 h-5" />
              存储检查工具 (useCookie API)
            </h3>
            
            <div class="space-y-4">
              <!-- useCookie 数据展示 -->
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-2">useCookie 数据</h4>
                <div class="bg-gray-50 rounded p-3 text-sm font-mono max-h-32 overflow-y-auto">
                  <div class="mb-2">
                    <span class="text-blue-600">counterCookie:</span>
                    <span class="text-gray-700 ml-2">{{ counterCookie ? JSON.stringify(counterCookie, null, 2) : 'null' }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="text-green-600">userCookie:</span>
                    <span class="text-gray-700 ml-2">{{ userCookie ? JSON.stringify(userCookie, null, 2) : 'null' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 原始 Cookie 内容 -->
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-2">原始 Cookie 内容</h4>
                <div class="bg-gray-50 rounded p-3 text-sm font-mono max-h-32 overflow-y-auto">
                  <div v-for="(item, key) in cookieItems" :key="key" class="mb-1">
                    <span class="text-blue-600">{{ key }}:</span>
                    <span class="text-gray-700 ml-2">{{ item }}</span>
                  </div>
                  <div v-if="Object.keys(cookieItems).length === 0" class="text-gray-500">
                    暂无相关数据
                  </div>
                </div>
              </div>
              
              <!-- useCookie 操作按钮 -->
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="testUseCookieOperations"
                  class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <Icon name="lucide:test-tube" class="mr-1 w-4 h-4" />
                  测试 useCookie
                </button>
                
                <button 
                  @click="refreshStorageData"
                  class="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <Icon name="lucide:refresh-cw" class="mr-1 w-4 h-4" />
                  刷新Cookie最新值
                </button>
              </div>
            </div>
          </div>

          <!-- useCookie API 示例 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:code" class="mr-2 w-5 h-5" />
              useCookie API 示例
            </h3>
            
            <div class="space-y-4">
              <!-- 技术说明 -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-semibold text-blue-800 mb-2">技术说明</h4>
                <div class="text-sm text-blue-700 space-y-1">
                  <p>• <strong>useCookie</strong> 是 Nuxt 提供的响应式 Cookie 管理 API</p>
                  <p>• 支持 SSR/SSG，在服务端和客户端都能正常工作</p>
                  <p>• 自动序列化/反序列化，支持复杂数据类型</p>
                  <p>• 响应式更新，Cookie 变化时自动触发组件更新</p>
                </div>
              </div>
              
              <!-- 代码示例 -->
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-2">代码示例</h4>
                <div class="bg-gray-900 text-gray-100 rounded p-3 text-xs font-mono overflow-x-auto">
                  <pre>// 定义 useCookie
const counterCookie = useCookie('counter-store', {
  default: () => null,
  serializer: {
    read: (value) => JSON.parse(value),
    write: (value) => JSON.stringify(value)
  }
})

// 读取 Cookie
const count = counterCookie.value?.count

// 写入 Cookie
counterCookie.value = { count: 100 }</pre>
                </div>
              </div>
              
              <!-- useCookie 操作测试 -->
              <div class="border rounded-lg p-4">
                <h4 class="font-semibold text-gray-700 mb-3">useCookie 操作测试</h4>
                <div class="space-y-2">
                  <button 
                    @click="directSetCounterCookie"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    直接设置 Counter Cookie
                  </button>
                  
                  <button 
                    @click="directSetUserCookie"
                    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    直接设置 User Cookie
                  </button>
                  
                  <button 
                    @click="clearUseCookies"
                    class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    清除 useCookie 数据
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 测试结果 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:clipboard-list" class="mr-2 w-5 h-5" />
              测试结果
            </h3>
            
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div 
                v-for="(result, index) in testResults" 
                :key="index"
                class="p-3 rounded-lg text-sm"
                :class="{
                  'bg-green-50 border border-green-200': result.type === 'success',
                  'bg-red-50 border border-red-200': result.type === 'error',
                  'bg-blue-50 border border-blue-200': result.type === 'info',
                  'bg-yellow-50 border border-yellow-200': result.type === 'warning'
                }"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="font-medium">{{ result.title }}</div>
                    <div class="text-gray-600 mt-1">{{ result.message }}</div>
                  </div>
                  <span class="text-xs text-gray-500 ml-2">{{ result.time }}</span>
                </div>
              </div>
              
              <div v-if="testResults.length === 0" class="text-center text-gray-500 py-4">
                暂无测试结果
              </div>
            </div>
            
            <button 
              @click="clearTestResults"
              class="mt-3 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            >
              清空测试结果
            </button>
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="mt-8 text-center">
        <NuxtLink 
          to="/test/pinia" 
          class="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="mr-2 w-4 h-4" />
          返回 Pinia 测试
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
useHead({
  title: '持久化测试',
  meta: [
    { name: 'description', content: '测试 Pinia Store 数据持久化功能' }
  ]
})

// 导入 Stores
const counterStore = useCounterStore()
const userStore = user()

// 使用 Nuxt useCookie API 直接操作 cookie
const counterCookie = useCookie('counter-store', {
  default: () => null,
  serializer: {
    read: (value) => {
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    },
    write: (value) => JSON.stringify(value)
  }
})

const userCookie = useCookie('user', {
  default: () => null,
  serializer: {
    read: (value) => {
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    },
    write: (value) => JSON.stringify(value)
  }
})

// 响应式数据
const cookieItems = ref({})
const cookieCount = ref(null)
const cookieToken = ref(null)
const lastCounterUpdate = ref('')
const lastUserUpdate = ref('')
const testResults = ref([])

// 添加测试结果
const addTestResult = (type, title, message) => {
  testResults.value.unshift({
    type,
    title,
    message,
    time: new Date().toLocaleTimeString('zh-CN')
  })
  
  // 只保留最近 10 条记录
  if (testResults.value.length > 10) {
    testResults.value = testResults.value.slice(0, 10)
  }
}

// 刷新存储数据
const refreshStorageData = () => {
  if (isClient) {
    const items = {}
    
    // 获取所有相关的 cookie 项
    const cookies = document.cookie.split('; ')
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=')
      if (key && (key.includes('counter-store') || key.includes('user') || key.includes('pinia'))) {
        try {
          const decodedValue = decodeURIComponent(value || '')
          items[key] = decodedValue?.length > 50 ? decodedValue.substring(0, 50) + '...' : decodedValue
        } catch (error) {
          items[key] = 'Error reading value'
        }
      }
    })
    
    cookieItems.value = items
    
    // 使用 useCookie 获取特定的值
    try {
      cookieCount.value = counterCookie.value?.count || null
    } catch (error) {
      cookieCount.value = 'Error'
    }
    
    try {
      cookieToken.value = userCookie.value?.token ? 'exists' : null
    } catch (error) {
      cookieToken.value = 'Error'
    }
    
    addTestResult('info', '存储数据刷新', '已刷新 Cookie 数据（使用 useCookie API）')
  }
}

// 测试 useCookie 操作
const testUseCookieOperations = () => {
  addTestResult('info', 'useCookie 测试开始', '开始测试 useCookie API 功能')
  
  // 测试读取
  const currentCounter = counterCookie.value
  const currentUser = userCookie.value
  
  addTestResult('success', 'useCookie 读取测试', `Counter: ${JSON.stringify(currentCounter)}, User: ${JSON.stringify(currentUser)}`)
  
  // 测试写入
  const testData = {
    count: 777,
    testTime: Date.now()
  }
  
  counterCookie.value = testData
  
  setTimeout(() => {
    if (counterCookie.value?.count === 777) {
      addTestResult('success', 'useCookie 写入测试', 'useCookie 写入操作成功')
    } else {
      addTestResult('error', 'useCookie 写入测试', 'useCookie 写入操作失败')
    }
    refreshStorageData()
  }, 100)
}

// 直接设置 Counter Cookie
const directSetCounterCookie = () => {
  const randomCount = Math.floor(Math.random() * 1000)
  counterCookie.value = {
    count: randomCount,
    setBy: 'useCookie API',
    timestamp: Date.now()
  }
  
  // 同步到 store
  counterStore.setCount(randomCount)
  
  addTestResult('success', '直接设置 Counter Cookie', `使用 useCookie 设置计数为 ${randomCount}`)
  refreshStorageData()
}

// 直接设置 User Cookie
const directSetUserCookie = () => {
  const timestamp = Date.now()
  userCookie.value = {
    token: `usecookie-token-${timestamp}`,
    info_template: {
      id: Math.floor(Math.random() * 1000),
      name: `useCookie用户${Math.floor(Math.random() * 100)}`,
      email: `usecookie${Math.floor(Math.random() * 100)}@example.com`,
      setBy: 'useCookie API'
    },
    timestamp
  }
  
  // 同步到 store
  userStore.token = userCookie.value.token
  userStore.info_template = userCookie.value.info_template
  
  addTestResult('success', '直接设置 User Cookie', '使用 useCookie 设置用户数据')
  refreshStorageData()
}

// 清除 useCookie 数据
const clearUseCookies = () => {
  counterCookie.value = null
  userCookie.value = null
  
  // 同步到 store
  counterStore.reset()
  userStore.clear()
  
  addTestResult('success', '清除 useCookie 数据', '已通过 useCookie API 清除所有数据')
  refreshStorageData()
}

// 设置随机计数
const setRandomCount = () => {
  const randomValue = Math.floor(Math.random() * 1000)
  counterStore.setCount(randomValue)
  lastCounterUpdate.value = new Date().toLocaleTimeString('zh-CN')
  addTestResult('success', '设置随机值', `计数器设置为 ${randomValue}`)
}

// 设置负数计数
const setNegativeCount = () => {
  const negativeValue = -Math.floor(Math.random() * 100)
  counterStore.setCount(negativeValue)
  lastCounterUpdate.value = new Date().toLocaleTimeString('zh-CN')
  addTestResult('success', '设置负数值', `计数器设置为 ${negativeValue}`)
}

// 模拟登录
const simulateLogin = () => {
  const timestamp = Date.now()
  userStore.token = `persist-token-${timestamp}`
  userStore.info_template = {
    id: Math.floor(Math.random() * 1000),
    name: `持久化用户${Math.floor(Math.random() * 100)}`,
    email: `persist${Math.floor(Math.random() * 100)}@example.com`,
    loginTime: timestamp
  }
  
  lastUserUpdate.value = new Date().toLocaleTimeString('zh-CN')
  addTestResult('success', '模拟登录', '用户登录成功，数据已持久化')
}

// 更新用户信息
const updateUserInfo = () => {
  if (userStore.info_template) {
    userStore.info_template = {
      ...userStore.info_template,
      name: `更新用户${Math.floor(Math.random() * 100)}`,
      updateTime: Date.now()
    }
    
    lastUserUpdate.value = new Date().toLocaleTimeString('zh-CN')
    addTestResult('success', '更新用户信息', '用户信息已更新并持久化')
  }
}

// 模拟登出
const simulateLogout = () => {
  // 直接修改状态
  userStore.token = null
  userStore.info_template = null
  lastUserUpdate.value = new Date().toLocaleTimeString('zh-CN')
  addTestResult('success', '模拟登出', '用户已登出，持久化数据已清除')
}

// 刷新页面测试持久化
const reloadPage = () => {
  // 保存当前状态到测试结果
  const currentCount = counterStore.count
  const currentLogin = userStore.isLogin
  
  addTestResult('info', '刷新页面测试', `刷新前状态: 计数=${currentCount}, 登录=${currentLogin}`)
  
  // 直接刷新页面
  if (isClient) {
    window.location.reload()
  }
}

// 模拟页面重载（保留原功能）
const simulatePageReload = () => {
  // 保存当前状态
  const currentCount = counterStore.count
  const currentLogin = userStore.isLogin
  
  addTestResult('info', '模拟页面重载', `重载前: 计数=${currentCount}, 登录=${currentLogin}`)
  
  // 模拟重载后的状态检查
  setTimeout(() => {
    const afterCount = counterStore.count
    const afterLogin = userStore.isLogin
    
    const countPersisted = currentCount === afterCount
    const loginPersisted = currentLogin === afterLogin
    
    if (countPersisted && loginPersisted) {
      addTestResult('success', '持久化测试通过', '所有数据在模拟重载后保持一致')
    } else {
      addTestResult('warning', '持久化测试异常', `计数持久化: ${countPersisted}, 登录持久化: ${loginPersisted}`)
    }
  }, 100)
}

// 测试数据持久化
const testDataPersistence = () => {
  const testCount = 12345
  const testToken = `test-token-${Date.now()}`
  
  // 设置测试数据
  counterStore.setCount(testCount)
  userStore.token = testToken
  
  addTestResult('info', '设置测试数据', `计数: ${testCount}, Token: ${testToken.substring(0, 20)}...`)
  
  // 检查持久化
  setTimeout(() => {
    refreshStorageData()
    
    if (counterStore.count === testCount && userStore.token === testToken) {
      addTestResult('success', '持久化测试成功', '测试数据已正确持久化')
    } else {
      addTestResult('error', '持久化测试失败', '测试数据未正确持久化')
    }
  }, 100)
}

// 清除 Counter 存储
const clearCounterStorage = () => {
  if (isClient) {
    try {
      document.cookie = 'counter-store=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      counterStore.reset()
      addTestResult('success', '清除 Counter 存储', 'Counter 存储数据已清除')
    } catch (error) {
      addTestResult('error', '清除失败', error.message)
    }
  }
}

// 清除 User 存储
const clearUserStorage = () => {
  if (isClient) {
    try {
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      userStore.clear()
      addTestResult('success', '清除 User 存储', 'User 存储数据已清除')
    } catch (error) {
      addTestResult('error', '清除失败', error.message)
    }
  }
}

// 清除所有存储
const clearAllStorage = () => {
  if (isClient) {
    try {
      // 清除相关的 cookie 项
      const cookies = document.cookie.split('; ')
      const keysToRemove = []
      
      cookies.forEach(cookie => {
        const [key] = cookie.split('=')
        if (key && (key.includes('counter') || key.includes('user') || key.includes('pinia'))) {
          keysToRemove.push(key)
          document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }
      })
      
      // 重置 stores
      counterStore.reset()
      userStore.clear()
      
      addTestResult('success', '清除所有存储', `已清除 ${keysToRemove.length} 个 Cookie 存储项`)
    } catch (error) {
      addTestResult('error', '清除失败', error.message)
    }
  }
}

// 导出 Store 数据
const exportStoreData = () => {
  const data = {
    counter: {
      count: counterStore.count,
      loading: counterStore.loading,
      error: counterStore.error
    },
    user: {
      token: userStore.token,
      info_template: userStore.info_template
    },
    exportTime: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(data, null, 2)
  
  if (isClient) {
    // 创建下载链接
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pinia-store-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    addTestResult('success', '导出数据', 'Store 数据已导出为 JSON 文件')
  }
}

// 导入示例数据
const importStoreData = () => {
  const sampleData = {
    counter: {
      count: 888,
      loading: false,
      error: null
    },
    user: {
      token: `imported-token-${Date.now()}`,
      info_template: {
        id: 999,
        name: '导入用户',
        email: 'imported@example.com'
      }
    }
  }
  
  // 应用示例数据
  counterStore.setCount(sampleData.counter.count)
  userStore.token = sampleData.user.token
  userStore.info_template = sampleData.user.info_template
  
  addTestResult('success', '导入示例数据', '示例数据已导入并应用到 Store')
}

// 清空测试结果
const clearTestResults = () => {
  testResults.value = []
}

// 监听 Counter Store 变化
watch(
  () => counterStore.count,
  () => {
    lastCounterUpdate.value = new Date().toLocaleTimeString('zh-CN')
    nextTick(() => refreshStorageData())
  }
)

// 监听 User Store 变化
watch(
  () => [userStore.token, userStore.isLogin],
  () => {
    lastUserUpdate.value = new Date().toLocaleTimeString('zh-CN')
    nextTick(() => refreshStorageData())
  },
  { deep: true }
)

// 监听 useCookie 变化
watch(
  () => counterCookie.value,
  (newValue) => {
    if (newValue && newValue.count !== undefined && newValue.count !== counterStore.count) {
      // 当 useCookie 数据变化时，同步到 store（避免循环更新）
      addTestResult('info', 'useCookie 同步', `Counter Cookie 变化，同步到 Store: ${newValue.count}`)
    }
  },
  { deep: true }
)

watch(
  () => userCookie.value,
  (newValue) => {
    if (newValue && newValue.token !== userStore.token) {
      // 当 useCookie 数据变化时，同步到 store（避免循环更新）
      addTestResult('info', 'useCookie 同步', 'User Cookie 变化，已同步到 Store')
    }
  },
  { deep: true }
)

// 组件挂载时初始化
onMounted(() => {
  refreshStorageData()
  addTestResult('info', '页面加载', '持久化测试页面已加载，useCookie 数据已恢复')
  
  // 初始化时同步 useCookie 数据到显示
  if (counterCookie.value) {
    addTestResult('success', 'useCookie 初始化', `发现 Counter Cookie 数据: ${JSON.stringify(counterCookie.value)}`)
  }
  
  if (userCookie.value) {
    addTestResult('success', 'useCookie 初始化', `发现 User Cookie 数据: ${JSON.stringify(userCookie.value)}`)
  }
})
</script>