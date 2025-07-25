<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          🔗 Store 组合测试
        </h1>
        <p class="text-gray-600">
          测试多个 Pinia Store 之间的交互、数据共享和状态同步
        </p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- 左侧：Counter Store -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:calculator" class="mr-3 w-6 h-6" />
              Counter Store
            </h2>
            
            <!-- 当前状态 -->
            <div class="bg-blue-50 rounded-lg p-4 mb-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">{{ counterStore.count }}</div>
                <div class="text-sm text-gray-600">
                  双倍值: {{ counterStore.doubleCount }} | 
                  {{ counterStore.isEven ? '偶数' : '奇数' }}
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="counterStore.increment()"
                  class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  +1
                </button>
                <button 
                  @click="counterStore.decrement()"
                  class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  -1
                </button>
              </div>
              
              <button 
                @click="counterStore.incrementBy(5)"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                +5
              </button>
              
              <button 
                @click="counterStore.reset()"
                class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                重置
              </button>
            </div>
            
            <!-- 异步操作 -->
            <div class="mt-4 pt-4 border-t">
              <h3 class="font-semibold text-gray-700 mb-3">异步操作</h3>
              <div class="space-y-2">
                <button 
                  @click="counterStore.fetchAndSetCount()"
                  :disabled="counterStore.loading"
                  class="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Icon 
                    :name="counterStore.loading ? 'lucide:loader-2' : 'lucide:download'" 
                    :class="['mr-2 w-4 h-4', { 'animate-spin': counterStore.loading }]" 
                  />
                  {{ counterStore.loading ? '获取中...' : '获取 Todo ID' }}
                </button>
                
                <button 
                  @click="counterStore.fetchRandomUserCount()"
                  :disabled="counterStore.loading"
                  class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Icon 
                    :name="counterStore.loading ? 'lucide:loader-2' : 'lucide:user'" 
                    :class="['mr-2 w-4 h-4', { 'animate-spin': counterStore.loading }]" 
                  />
                  {{ counterStore.loading ? '获取中...' : '随机用户 ID' }}
                </button>
              </div>
            </div>
            
            <!-- 错误显示 -->
            <div v-if="counterStore.error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="font-medium text-red-800">错误</div>
                  <div class="text-sm text-red-600">{{ counterStore.error }}</div>
                </div>
                <button 
                  @click="counterStore.clearError()"
                  class="text-red-500 hover:text-red-700 ml-2"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间：User Store -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:user" class="mr-3 w-6 h-6" />
              User Store
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
              <div class="font-medium text-green-800">用户信息</div>
              <div class="text-sm text-green-600 mt-1">
                Token: {{ userStore.token?.substring(0, 20) }}...
              </div>
            </div>
            
            <!-- 模拟登录/登出 -->
            <div class="space-y-3">
              <button 
                v-if="!userStore.isLogin"
                @click="simulateLogin"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:log-in" class="mr-2 w-4 h-4" />
                模拟登录
              </button>
              
              <button 
                v-if="userStore.isLogin"
                @click="simulateLogOut"
                class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:log-out" class="mr-2 w-4 h-4" />
                登出
              </button>
              
              <button 
                @click="userStore.clear()"
                class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:trash-2" class="mr-2 w-4 h-4" />
                清除数据
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：Store 交互 -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:shuffle" class="mr-3 w-6 h-6" />
              Store 交互
            </h2>
            
            <!-- 交互操作 -->
            <div class="space-y-4">
              <!-- 基于登录状态的操作 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">条件操作</h3>
                <div class="space-y-2">
                  <button 
                    @click="conditionalIncrement"
                    :disabled="!userStore.isLogin"
                    class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {{ userStore.isLogin ? '登录用户 +10' : '需要登录' }}
                  </button>
                  
                  <button 
                    @click="resetIfLoggedIn"
                    :disabled="!userStore.isLogin"
                    class="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {{ userStore.isLogin ? '重置计数器' : '需要登录' }}
                  </button>
                </div>
              </div>
              
              <!-- 数据同步 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">数据同步</h3>
                <div class="space-y-2">
                  <button 
                    @click="syncCounterWithUser"
                    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    同步计数到用户 ID
                  </button>
                  
                  <button 
                    @click="setCounterFromTimestamp"
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    时间戳设置计数
                  </button>
                </div>
              </div>
              
              <!-- 批量操作 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">批量操作</h3>
                <div class="space-y-2">
                  <button 
                    @click="performBatchOperations"
                    :disabled="batchLoading"
                    class="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Icon 
                      :name="batchLoading ? 'lucide:loader-2' : 'lucide:layers'" 
                      :class="['mr-2 w-4 h-4', { 'animate-spin': batchLoading }]" 
                    />
                    {{ batchLoading ? '执行中...' : '批量操作' }}
                  </button>
                  
                  <button 
                    @click="resetAllStores"
                    class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    重置所有 Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态监控面板 -->
      <div class="mt-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="lucide:monitor" class="mr-3 w-6 h-6" />
            状态监控面板
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Counter 状态 -->
            <div class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-blue-800 mb-2">Counter 状态</h3>
              <div class="space-y-1 text-sm">
                <div>计数: <span class="font-mono">{{ counterStore.count }}</span></div>
                <div>双倍: <span class="font-mono">{{ counterStore.doubleCount }}</span></div>
                <div>状态: <span class="font-mono">{{ counterStore.isEven ? '偶数' : '奇数' }}</span></div>
                <div>加载: <span class="font-mono">{{ counterStore.loading ? 'true' : 'false' }}</span></div>
                <div>错误: <span class="font-mono">{{ counterStore.error ? 'true' : 'false' }}</span></div>
              </div>
            </div>
            
            <!-- User 状态 -->
            <div class="bg-green-50 rounded-lg p-4">
              <h3 class="font-semibold text-green-800 mb-2">User 状态</h3>
              <div class="space-y-1 text-sm">
                <div>登录: <span class="font-mono">{{ userStore.isLogin ? 'true' : 'false' }}</span></div>
                <div>Token: <span class="font-mono">{{ userStore.token ? 'exists' : 'null' }}</span></div>
                <div>信息: <span class="font-mono">{{ userStore.info_template ? 'exists' : 'null' }}</span></div>
              </div>
            </div>
            
            <!-- 交互统计 -->
            <div class="bg-purple-50 rounded-lg p-4">
              <h3 class="font-semibold text-purple-800 mb-2">交互统计</h3>
              <div class="space-y-1 text-sm">
                <div>条件操作: <span class="font-mono">{{ interactionStats.conditionalOps }}</span></div>
                <div>同步操作: <span class="font-mono">{{ interactionStats.syncOps }}</span></div>
                <div>批量操作: <span class="font-mono">{{ interactionStats.batchOps }}</span></div>
                <div>重置操作: <span class="font-mono">{{ interactionStats.resetOps }}</span></div>
              </div>
            </div>
            
            <!-- 性能指标 -->
            <div class="bg-orange-50 rounded-lg p-4">
              <h3 class="font-semibold text-orange-800 mb-2">性能指标</h3>
              <div class="space-y-1 text-sm">
                <div>响应时间: <span class="font-mono">{{ performanceMetrics.responseTime }}ms</span></div>
                <div>操作次数: <span class="font-mono">{{ performanceMetrics.operationCount }}</span></div>
                <div>错误次数: <span class="font-mono">{{ performanceMetrics.errorCount }}</span></div>
                <div>成功率: <span class="font-mono">{{ performanceMetrics.successRate }}%</span></div>
              </div>
            </div>
          </div>
          
          <!-- 重置统计 -->
          <div class="mt-4 text-center">
            <button 
              @click="resetStats"
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              重置统计
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
  title: 'Store 组合测试',
  meta: [
    { name: 'description', content: '测试多个 Pinia Store 之间的交互、数据共享和状态同步' }
  ]
})

// 导入 Stores
const counterStore = useCounterStore()
const userStore = user()

// 批量操作加载状态
const batchLoading = ref(false)

// 交互统计
const interactionStats = reactive({
  conditionalOps: 0,
  syncOps: 0,
  batchOps: 0,
  resetOps: 0
})

// 性能指标
const performanceMetrics = reactive({
  responseTime: 0,
  operationCount: 0,
  errorCount: 0,
  successRate: 100
})

// 模拟登录
const simulateLogin = () => {
  const startTime = Date.now()
  
  // 模拟登录过程
  userStore.token = `mock-token-${Date.now()}`
  userStore.info_template = {
    id: simulateUserId,
    name: `用户${simulateUserId}`,
    email: `user${simulateUserId}@example.com`
  }

  updatePerformanceMetrics(startTime, true)
}

const simulateLogOut = () => {
  const startTime = Date.now()
  
  // 模拟登出过程
  userStore.token = null
  userStore.info_template = null
  
  updatePerformanceMetrics(startTime, true)
}

// 条件增加
const conditionalIncrement = () => {
  const startTime = Date.now()
  
  if (userStore.isLogin) {
    counterStore.incrementBy(10)
    interactionStats.conditionalOps++
    updatePerformanceMetrics(startTime, true)
  } else {
    updatePerformanceMetrics(startTime, false)
  }
}

// 条件重置
const resetIfLoggedIn = () => {
  const startTime = Date.now()
  
  if (userStore.isLogin) {
    counterStore.reset()
    interactionStats.conditionalOps++
    updatePerformanceMetrics(startTime, true)
  } else {
    updatePerformanceMetrics(startTime, false)
  }
}

const simulateUserId = 33
// 同步计数器与用户
const syncCounterWithUser = () => {
  const startTime = Date.now()
  
  if (userStore.isLogin && userStore.info_template?.id) {
    counterStore.setCount(userStore.info_template.id % 100)
  } else {
    // counterStore.setCount(Math.floor(Math.random() * 100))
    counterStore.setCount(simulateUserId)
    // 假设用户的 id 是 simulateUserId
  }
  
  interactionStats.syncOps++
  updatePerformanceMetrics(startTime, true)
}

// 基于时间戳设置计数
const setCounterFromTimestamp = () => {
  const startTime = Date.now()
  const timestamp = Date.now()
  const count = timestamp % 1000
  
  counterStore.setCount(count)
  interactionStats.syncOps++
  updatePerformanceMetrics(startTime, true)
}

// 批量操作
const performBatchOperations = async () => {
  const startTime = Date.now()
  batchLoading.value = true
  
  try {
    // 模拟批量操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 执行多个操作
    counterStore.increment()
    await new Promise(resolve => setTimeout(resolve, 200))
    
    counterStore.incrementBy(5)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (!userStore.isLogin) {
      userStore.token = `batch-token-${Date.now()}`
      userStore.info_template = {
        id: Math.floor(Math.random() * 1000),
        name: '批量用户',
        email: 'batch@example.com'
      }
    }
    
    interactionStats.batchOps++
    updatePerformanceMetrics(startTime, true)
  } catch (error) {
    updatePerformanceMetrics(startTime, false)
  } finally {
    batchLoading.value = false
  }
}

// 重置所有 Store
const resetAllStores = () => {
  const startTime = Date.now()
  
  counterStore.reset()
  counterStore.clearError()
  userStore.clear()
  
  interactionStats.resetOps++
  updatePerformanceMetrics(startTime, true)
}

// 更新性能指标
const updatePerformanceMetrics = (startTime, success) => {
  const endTime = Date.now()
  const responseTime = endTime - startTime
  
  performanceMetrics.responseTime = responseTime
  performanceMetrics.operationCount++
  
  if (!success) {
    performanceMetrics.errorCount++
  }
  
  performanceMetrics.successRate = Math.round(
    ((performanceMetrics.operationCount - performanceMetrics.errorCount) / performanceMetrics.operationCount) * 100
  )
}

// 重置统计
const resetStats = () => {
  interactionStats.conditionalOps = 0
  interactionStats.syncOps = 0
  interactionStats.batchOps = 0
  interactionStats.resetOps = 0
  
  performanceMetrics.responseTime = 0
  performanceMetrics.operationCount = 0
  performanceMetrics.errorCount = 0
  performanceMetrics.successRate = 100
}
</script>