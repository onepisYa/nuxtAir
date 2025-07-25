<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 to-orange-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          ⚡ 性能测试
        </h1>
        <p class="text-gray-600">
          测试 Pinia Store 的性能表现，包括响应时间、内存使用和渲染优化
        </p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- 左侧：性能监控面板 -->
        <div class="xl:col-span-2 space-y-6">
          <!-- 实时性能指标 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:activity" class="mr-3 w-6 h-6 text-red-500" />
              实时性能指标
            </h2>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ performanceMetrics.responseTime }}ms</div>
                <div class="text-sm text-gray-600">平均响应时间</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ performanceMetrics.operationsPerSecond }}</div>
                <div class="text-sm text-gray-600">操作/秒</div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ performanceMetrics.memoryUsage }}MB</div>
                <div class="text-sm text-gray-600">内存使用</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">{{ performanceMetrics.renderCount }}</div>
                <div class="text-sm text-gray-600">渲染次数</div>
              </div>
            </div>
          </div>

          <!-- 性能测试控制台 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:terminal" class="mr-3 w-6 h-6 text-green-500" />
              性能测试控制台
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 批量操作测试 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">批量操作测试</h3>
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <input 
                      v-model.number="batchSize"
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="批量大小"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <button 
                      @click="runBatchTest"
                      :disabled="isRunningTest"
                      class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      测试
                    </button>
                  </div>
                  
                  <button 
                    @click="runStressTest"
                    :disabled="isRunningTest"
                    class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {{ isRunningTest ? '测试中...' : '压力测试 (1000 操作)' }}
                  </button>
                </div>
              </div>
              
              <!-- 响应时间测试 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">响应时间测试</h3>
                <div class="space-y-3">
                  <button 
                    @click="testSyncOperations"
                    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    同步操作测试
                  </button>
                  
                  <button 
                    @click="testAsyncOperations"
                    :disabled="isRunningAsyncTest"
                    class="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {{ isRunningAsyncTest ? '测试中...' : '异步操作测试' }}
                  </button>
                  
                  <button 
                    @click="testComputedPerformance"
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    计算属性性能测试
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 性能图表 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:bar-chart-3" class="mr-3 w-6 h-6 text-indigo-500" />
              性能趋势图表
            </h2>
            
            <div class="space-y-4">
              <!-- 响应时间趋势 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">响应时间趋势 (最近 20 次操作)</h3>
                <div class="h-32 bg-gray-50 rounded-lg flex items-end justify-between px-2 py-2">
                  <div 
                    v-for="(time, index) in responseTimeHistory.slice(-20)" 
                    :key="index"
                    class="bg-blue-500 rounded-t"
                    :style="{ 
                      height: `${Math.max(5, (time / Math.max(...responseTimeHistory)) * 100)}%`,
                      width: `${100 / 20 - 1}%`
                    }"
                    :title="`${time}ms`"
                  ></div>
                </div>
                <div class="text-sm text-gray-600 mt-2">
                  平均: {{ averageResponseTime }}ms | 最大: {{ maxResponseTime }}ms | 最小: {{ minResponseTime }}ms
                </div>
              </div>
              
              <!-- 操作频率 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">操作频率统计</h3>
                <div class="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div class="text-xl font-bold text-blue-600">{{ operationStats.increment }}</div>
                    <div class="text-sm text-gray-600">增加操作</div>
                  </div>
                  <div>
                    <div class="text-xl font-bold text-red-600">{{ operationStats.decrement }}</div>
                    <div class="text-sm text-gray-600">减少操作</div>
                  </div>
                  <div>
                    <div class="text-xl font-bold text-green-600">{{ operationStats.async }}</div>
                    <div class="text-sm text-gray-600">异步操作</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：Store 状态和控制 -->
        <div class="space-y-6">
          <!-- Counter Store 状态 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:gauge" class="mr-2 w-5 h-5" />
              Counter Store
            </h3>
            
            <div class="space-y-4">
              <!-- 当前状态 -->
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">{{ counterStore.count }}</div>
                <div class="text-sm text-gray-600">
                  双倍值: {{ counterStore.doubleCount }}
                </div>
              </div>
              
              <!-- 快速操作 -->
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="performOperation('increment')"
                  class="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  +1
                </button>
                <button 
                  @click="performOperation('decrement')"
                  class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  -1
                </button>
                <button 
                  @click="performOperation('incrementBy', 10)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  +10
                </button>
                <button 
                  @click="performOperation('reset')"
                  class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  重置
                </button>
              </div>
              
              <!-- 异步操作 -->
              <div class="space-y-2">
                <button 
                  @click="performAsyncOperation('fetchAndSetCount')"
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
                  @click="performAsyncOperation('fetchRandomUserCount')"
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
          </div>

          <!-- 性能优化建议 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:lightbulb" class="mr-2 w-5 h-5" />
              性能优化建议
            </h3>
            
            <div class="space-y-3">
              <div 
                v-for="suggestion in performanceSuggestions" 
                :key="suggestion.id"
                class="p-3 rounded-lg border"
                :class="{
                  'bg-green-50 border-green-200': suggestion.type === 'good',
                  'bg-yellow-50 border-yellow-200': suggestion.type === 'warning',
                  'bg-red-50 border-red-200': suggestion.type === 'critical'
                }"
              >
                <div class="flex items-start">
                  <Icon 
                    :name="suggestion.icon" 
                    :class="[
                      'mr-2 w-4 h-4 mt-0.5',
                      {
                        'text-green-600': suggestion.type === 'good',
                        'text-yellow-600': suggestion.type === 'warning',
                        'text-red-600': suggestion.type === 'critical'
                      }
                    ]"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-sm">{{ suggestion.title }}</div>
                    <div class="text-xs text-gray-600 mt-1">{{ suggestion.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 测试历史 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:history" class="mr-2 w-5 h-5" />
              测试历史
            </h3>
            
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div 
                v-for="(test, index) in testHistory" 
                :key="index"
                class="p-3 rounded-lg text-sm"
                :class="{
                  'bg-green-50 border border-green-200': test.result === 'success',
                  'bg-red-50 border border-red-200': test.result === 'error',
                  'bg-blue-50 border border-blue-200': test.result === 'info'
                }"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ test.name }}</span>
                  <span class="text-xs text-gray-500">{{ test.time }}</span>
                </div>
                <div class="text-gray-600 mt-1">{{ test.details }}</div>
                <div v-if="test.metrics" class="text-xs text-gray-500 mt-1">
                  耗时: {{ test.metrics.duration }}ms | 操作数: {{ test.metrics.operations }}
                </div>
              </div>
              
              <div v-if="testHistory.length === 0" class="text-center text-gray-500 py-4">
                暂无测试历史
              </div>
            </div>
            
            <button 
              @click="clearTestHistory"
              class="mt-3 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            >
              清空历史
            </button>
          </div>

          <!-- 控制面板 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:settings" class="mr-2 w-5 h-5" />
              控制面板
            </h3>
            
            <div class="space-y-3">
              <button 
                @click="resetAllMetrics"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                重置所有指标
              </button>
              
              <button 
                @click="startContinuousMonitoring"
                :disabled="isMonitoring"
                class="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {{ isMonitoring ? '监控中...' : '开始连续监控' }}
              </button>
              
              <button 
                @click="stopContinuousMonitoring"
                :disabled="!isMonitoring"
                class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
              >
                停止监控
              </button>
              
              <button 
                @click="exportPerformanceData"
                class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                导出性能数据
              </button>
            </div>
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
  title: '性能测试',
  meta: [
    { name: 'description', content: '测试 Pinia Store 的性能表现' }
  ]
})

// 导入 Stores
const counterStore = useCounterStore()

// 响应式数据
const batchSize = ref(100)
const isRunningTest = ref(false)
const isRunningAsyncTest = ref(false)
const isMonitoring = ref(false)
const monitoringInterval = ref(null)

// 性能指标
const performanceMetrics = reactive({
  responseTime: 0,
  operationsPerSecond: 0,
  memoryUsage: 0,
  renderCount: 0
})

// 性能历史数据
const responseTimeHistory = ref([])
const operationStats = reactive({
  increment: 0,
  decrement: 0,
  async: 0
})

const testHistory = ref([])

// 计算属性
const averageResponseTime = computed(() => {
  if (responseTimeHistory.value.length === 0) return 0
  const sum = responseTimeHistory.value.reduce((a, b) => a + b, 0)
  return Math.round(sum / responseTimeHistory.value.length)
})

const maxResponseTime = computed(() => {
  return responseTimeHistory.value.length > 0 ? Math.max(...responseTimeHistory.value) : 0
})

const minResponseTime = computed(() => {
  return responseTimeHistory.value.length > 0 ? Math.min(...responseTimeHistory.value) : 0
})

// 性能优化建议
const performanceSuggestions = computed(() => {
  const suggestions = []
  
  if (averageResponseTime.value > 100) {
    suggestions.push({
      id: 'slow-response',
      type: 'warning',
      icon: 'lucide:clock',
      title: '响应时间较慢',
      description: '平均响应时间超过 100ms，考虑优化操作逻辑'
    })
  } else {
    suggestions.push({
      id: 'good-response',
      type: 'good',
      icon: 'lucide:check-circle',
      title: '响应时间良好',
      description: '平均响应时间在可接受范围内'
    })
  }
  
  if (performanceMetrics.renderCount > 100) {
    suggestions.push({
      id: 'high-render',
      type: 'critical',
      icon: 'lucide:alert-triangle',
      title: '渲染次数过多',
      description: '考虑使用 computed 或 memo 优化渲染性能'
    })
  }
  
  if (responseTimeHistory.value.length > 50) {
    suggestions.push({
      id: 'memory-usage',
      type: 'warning',
      icon: 'lucide:memory-stick',
      title: '内存使用监控',
      description: '建议定期清理历史数据以释放内存'
    })
  }
  
  return suggestions
})

// 添加测试历史
const addTestHistory = (name, result, details, metrics = null) => {
  testHistory.value.unshift({
    name,
    result,
    details,
    metrics,
    time: new Date().toLocaleTimeString('zh-CN')
  })
  
  // 只保留最近 20 条记录
  if (testHistory.value.length > 20) {
    testHistory.value = testHistory.value.slice(0, 20)
  }
}

// 记录响应时间
const recordResponseTime = (time) => {
  responseTimeHistory.value.push(time)
  
  // 只保留最近 100 条记录
  if (responseTimeHistory.value.length > 100) {
    responseTimeHistory.value = responseTimeHistory.value.slice(-100)
  }
  
  // 更新平均响应时间
  performanceMetrics.responseTime = averageResponseTime.value
}

// 执行操作并测量性能
const performOperation = (operation, ...args) => {
  const startTime = performance.now()
  
  try {
    counterStore[operation](...args)
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    recordResponseTime(duration)
    
    // 更新操作统计
    if (operation === 'increment' || operation === 'incrementBy') {
      operationStats.increment++
    } else if (operation === 'decrement') {
      operationStats.decrement++
    }
    
    // 更新每秒操作数
    updateOperationsPerSecond()
    
  } catch (error) {
    addTestHistory(operation, 'error', error.message)
  }
}

// 执行异步操作并测量性能
const performAsyncOperation = async (operation) => {
  const startTime = performance.now()
  
  try {
    await counterStore[operation]()
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    recordResponseTime(duration)
    operationStats.async++
    
    addTestHistory(operation, 'success', `异步操作完成，耗时 ${duration}ms`, {
      duration,
      operations: 1
    })
    
  } catch (error) {
    addTestHistory(operation, 'error', error.message)
  }
}

// 更新每秒操作数
const updateOperationsPerSecond = () => {
  const totalOps = operationStats.increment + operationStats.decrement + operationStats.async
  const timeElapsed = (Date.now() - startTime) / 1000
  performanceMetrics.operationsPerSecond = Math.round(totalOps / Math.max(timeElapsed, 1))
}

// 批量测试
const runBatchTest = async () => {
  if (isRunningTest.value) return
  
  isRunningTest.value = true
  const startTime = performance.now()
  
  try {
    for (let i = 0; i < batchSize.value; i++) {
      counterStore.increment()
      
      // 每 100 次操作暂停一下，避免阻塞 UI
      if (i % 100 === 0) {
        await nextTick()
      }
    }
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    addTestHistory('批量测试', 'success', `完成 ${batchSize.value} 次操作`, {
      duration,
      operations: batchSize.value
    })
    
  } catch (error) {
    addTestHistory('批量测试', 'error', error.message)
  } finally {
    isRunningTest.value = false
  }
}

// 压力测试
const runStressTest = async () => {
  if (isRunningTest.value) return
  
  isRunningTest.value = true
  const startTime = performance.now()
  const operations = 1000
  
  try {
    const promises = []
    
    for (let i = 0; i < operations; i++) {
      if (i % 3 === 0) {
        promises.push(Promise.resolve(counterStore.increment()))
      } else if (i % 3 === 1) {
        promises.push(Promise.resolve(counterStore.decrement()))
      } else {
        promises.push(Promise.resolve(counterStore.incrementBy(Math.floor(Math.random() * 10))))
      }
      
      // 每 50 个操作等待一下
      if (promises.length >= 50) {
        await Promise.all(promises)
        promises.length = 0
        await nextTick()
      }
    }
    
    // 等待剩余操作完成
    if (promises.length > 0) {
      await Promise.all(promises)
    }
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    addTestHistory('压力测试', 'success', `完成 ${operations} 次高频操作`, {
      duration,
      operations
    })
    
  } catch (error) {
    addTestHistory('压力测试', 'error', error.message)
  } finally {
    isRunningTest.value = false
  }
}

// 同步操作测试
const testSyncOperations = () => {
  const startTime = performance.now()
  const operations = 100
  
  for (let i = 0; i < operations; i++) {
    counterStore.increment()
    counterStore.decrement()
  }
  
  const endTime = performance.now()
  const duration = Math.round(endTime - startTime)
  
  addTestHistory('同步操作测试', 'success', `完成 ${operations * 2} 次同步操作`, {
    duration,
    operations: operations * 2
  })
}

// 异步操作测试
const testAsyncOperations = async () => {
  if (isRunningAsyncTest.value) return
  
  isRunningAsyncTest.value = true
  const startTime = performance.now()
  
  try {
    const promises = [
      counterStore.fetchAndSetCount(),
      counterStore.fetchRandomUserCount()
    ]
    
    await Promise.all(promises)
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    addTestHistory('异步操作测试', 'success', '完成并发异步操作', {
      duration,
      operations: 2
    })
    
  } catch (error) {
    addTestHistory('异步操作测试', 'error', error.message)
  } finally {
    isRunningAsyncTest.value = false
  }
}

// 计算属性性能测试
const testComputedPerformance = () => {
  const startTime = performance.now()
  const iterations = 1000
  
  // 触发计算属性多次计算
  for (let i = 0; i < iterations; i++) {
    const _ = counterStore.doubleCount
    const __ = counterStore.isEven
    const ___ = counterStore.isPositive
  }
  
  const endTime = performance.now()
  const duration = Math.round(endTime - startTime)
  
  addTestHistory('计算属性测试', 'success', `完成 ${iterations * 3} 次计算属性访问`, {
    duration,
    operations: iterations * 3
  })
}

// 开始连续监控
const startContinuousMonitoring = () => {
  if (isMonitoring.value) return
  
  isMonitoring.value = true
  
  monitoringInterval.value = setInterval(() => {
    // 更新内存使用（模拟）
    if (process.client && performance.memory) {
      performanceMetrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
    } else {
      performanceMetrics.memoryUsage = Math.round(Math.random() * 50 + 10)
    }
    
    // 更新操作频率
    updateOperationsPerSecond()
  }, 1000)
  
  addTestHistory('连续监控', 'info', '开始连续性能监控')
}

// 停止连续监控
const stopContinuousMonitoring = () => {
  if (!isMonitoring.value) return
  
  isMonitoring.value = false
  
  if (monitoringInterval.value) {
    clearInterval(monitoringInterval.value)
    monitoringInterval.value = null
  }
  
  addTestHistory('连续监控', 'info', '停止连续性能监控')
}

// 重置所有指标
const resetAllMetrics = () => {
  performanceMetrics.responseTime = 0
  performanceMetrics.operationsPerSecond = 0
  performanceMetrics.memoryUsage = 0
  performanceMetrics.renderCount = 0
  
  responseTimeHistory.value = []
  operationStats.increment = 0
  operationStats.decrement = 0
  operationStats.async = 0
  
  addTestHistory('重置指标', 'info', '所有性能指标已重置')
}

// 清空测试历史
const clearTestHistory = () => {
  testHistory.value = []
}

// 导出性能数据
const exportPerformanceData = () => {
  const data = {
    timestamp: new Date().toISOString(),
    metrics: performanceMetrics,
    responseTimeHistory: responseTimeHistory.value,
    operationStats,
    testHistory: testHistory.value,
    suggestions: performanceSuggestions.value
  }
  
  if (process.client) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pinia-performance-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    addTestHistory('导出数据', 'success', '性能数据已导出')
  }
}

// 记录开始时间
const startTime = Date.now()

// 监听渲染次数
onUpdated(() => {
  performanceMetrics.renderCount++
})

// 组件挂载时初始化
onMounted(() => {
  addTestHistory('页面加载', 'info', '性能测试页面已加载')
  performanceMetrics.renderCount = 1
})

// 组件卸载时清理
onUnmounted(() => {
  stopContinuousMonitoring()
})
</script>