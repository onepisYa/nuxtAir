<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          🔢 Counter 状态管理测试
        </h1>
        <p class="text-gray-600">
          测试基本的状态管理、计算属性和持久化功能
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：计数器控制 -->
        <div class="space-y-6">
          <!-- 当前状态显示 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">📊 当前状态</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-blue-600">{{ counterStore.count }}</div>
                <div class="text-sm text-gray-600 mt-1">当前计数</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-green-600">{{ counterStore.doubleCount }}</div>
                <div class="text-sm text-gray-600 mt-1">双倍值</div>
              </div>
            </div>
            
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div class="bg-purple-50 rounded-lg p-4 text-center">
                <div class="text-lg font-bold" :class="counterStore.isEven ? 'text-green-600' : 'text-red-600'">
                  {{ counterStore.isEven ? '偶数' : '奇数' }}
                </div>
                <div class="text-sm text-gray-600 mt-1">奇偶性</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4 text-center">
                <div class="text-lg font-bold" :class="counterStore.isPositive ? 'text-green-600' : 'text-red-600'">
                  {{ counterStore.isPositive ? '正数' : '非正数' }}
                </div>
                <div class="text-sm text-gray-600 mt-1">正负性</div>
              </div>
            </div>
          </div>

          <!-- 基本操作 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">🎮 基本操作</h3>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="counterStore.increment()"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:plus" class="mr-2 w-4 h-4" />
                +1
              </button>
              <button 
                @click="counterStore.decrement()"
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:minus" class="mr-2 w-4 h-4" />
                -1
              </button>
              <button 
                @click="counterStore.incrementBy(5)"
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:plus-circle" class="mr-2 w-4 h-4" />
                +5
              </button>
              <button 
                @click="counterStore.incrementBy(-5)"
                class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:minus-circle" class="mr-2 w-4 h-4" />
                -5
              </button>
            </div>
            
            <div class="mt-4 grid grid-cols-2 gap-3">
              <button 
                @click="counterStore.reset()"
                class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:rotate-ccw" class="mr-2 w-4 h-4" />
                重置
              </button>
              <button 
                @click="setRandomValue()"
                class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:shuffle" class="mr-2 w-4 h-4" />
                随机值
              </button>
            </div>
          </div>

          <!-- 自定义设置 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">⚙️ 自定义设置</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  设置具体值
                </label>
                <div class="flex gap-2">
                  <input 
                    v-model.number="customValue"
                    type="number"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入数字"
                  />
                  <button 
                    @click="setCustomValue()"
                    class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    设置
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  批量增加
                </label>
                <div class="flex gap-2">
                  <input 
                    v-model.number="incrementAmount"
                    type="number"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="增加数量"
                  />
                  <button 
                    @click="incrementByAmount()"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    增加
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：异步操作和状态监控 -->
        <div class="space-y-6">
          <!-- 异步操作 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">🌐 异步操作</h3>
            <div class="space-y-3">
              <button 
                @click="counterStore.fetchAndSetCount()"
                :disabled="counterStore.loading"
                class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
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
                class="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon 
                  :name="counterStore.loading ? 'lucide:loader-2' : 'lucide:user'" 
                  :class="['mr-2 w-4 h-4', { 'animate-spin': counterStore.loading }]" 
                />
                {{ counterStore.loading ? '获取中...' : '获取随机用户 ID' }}
              </button>
            </div>
            
            <!-- 错误显示 -->
            <div v-if="counterStore.error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <Icon name="lucide:alert-circle" class="text-red-500 mr-2 w-4 h-4" />
                <span class="text-red-700 text-sm">{{ counterStore.error }}</span>
                <button 
                  @click="counterStore.clearError()"
                  class="ml-auto text-red-500 hover:text-red-700"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- 状态历史 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">📈 状态历史</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div 
                v-for="(record, index) in history" 
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <span class="font-mono">{{ record.value }}</span>
                <span class="text-gray-500">{{ record.time }}</span>
              </div>
              <div v-if="history.length === 0" class="text-center text-gray-500 py-4">
                暂无历史记录
              </div>
            </div>
            <button 
              @click="clearHistory()"
              class="mt-3 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            >
              清空历史
            </button>
          </div>

          <!-- 持久化测试 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">💾 持久化测试</h3>
            <p class="text-gray-600 text-sm mb-4">
              计数器值会自动保存到 localStorage，刷新页面后会恢复。
            </p>
            <div class="space-y-3">
              <button 
                @click="refreshPage()"
                class="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:refresh-cw" class="mr-2 w-4 h-4" />
                刷新页面测试持久化
              </button>
              
              <button 
                @click="clearPersistedData()"
                class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon name="lucide:trash-2" class="mr-2 w-4 h-4" />
                清除持久化数据
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

<script setup lang="ts">
import type { Ref } from 'vue'

// 页面元数据
useHead({
  title: 'Counter 状态管理测试',
  meta: [
    { name: 'description', content: '测试基本的 Pinia 状态管理、计算属性和持久化功能' }
  ]
})

// 使用 counter store
const counterStore = useCounterStore()

// 定义历史记录类型
interface HistoryRecord {
  value: number
  action: string
  time: string
}

// 响应式数据
const customValue = ref<number>(0)
const incrementAmount = ref<number>(1)
const history = ref<HistoryRecord[]>([])

// 设置自定义值
const setCustomValue = () => {
  if (customValue.value !== null && customValue.value !== undefined) {
    counterStore.setCount(customValue.value)
  }
}

// 按指定数量增加
const incrementByAmount = () => {
  if (incrementAmount.value !== null && incrementAmount.value !== undefined) {
    counterStore.incrementBy(incrementAmount.value)
  }
}

// 设置随机值
const setRandomValue = () => {
  const randomValue = Math.floor(Math.random() * 100) - 50 // -50 到 49
  counterStore.setCount(randomValue)
}

// 添加到历史记录
const addToHistory = (value: number, action: string) => {
  history.value.unshift({
    value,
    action,
    time: new Date().toLocaleTimeString('zh-CN')
  })
  
  // 只保留最近 20 条记录
  if (history.value.length > 20) {
    history.value = history.value.slice(0, 20)
  }
}

// 清空历史记录
const clearHistory = () => {
  history.value = []
}

// 刷新页面
const refreshPage = () => {
  window.location.reload()
}

// 清除持久化数据
const clearPersistedData = () => {
  if (isClient) {
    localStorage.removeItem('counter-store')
    counterStore.reset()
  }
}

// 监听计数器变化并记录历史
watch(
  () => counterStore.count,
  (newValue, oldValue) => {
    if (oldValue !== undefined) {
      // 根据当前操作类型记录不同的历史信息
      let action = '计数器变化'
      if (newValue === 0 && oldValue !== 0) {
        action = '重置计数器'
      } else if (newValue > oldValue) {
        action = `增加 ${newValue - oldValue}`
      } else if (newValue < oldValue) {
        action = `减少 ${oldValue - newValue}`
      }
      addToHistory(newValue, action)
    }
  }
)

// 组件挂载时添加初始记录
onMounted(() => {
  addToHistory(counterStore.count, '页面加载')
})
</script>