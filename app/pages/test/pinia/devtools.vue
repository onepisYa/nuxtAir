<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          🛠️ DevTools 测试
        </h1>
        <p class="text-gray-600">
          测试 Pinia DevTools 集成，包括状态检查、时间旅行和调试功能
        </p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- 左侧：DevTools 功能面板 -->
        <div class="xl:col-span-2 space-y-6">
          <!-- DevTools 状态 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:bug" class="mr-3 w-6 h-6 text-blue-500" />
              DevTools 状态
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- DevTools 检测 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3 flex items-center">
                  <Icon name="lucide:search" class="mr-2 w-4 h-4" />
                  DevTools 检测
                </h3>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Vue DevTools:</span>
                    <div class="flex items-center">
                      <div 
                        :class="[
                          'w-2 h-2 rounded-full mr-2',
                          devToolsStatus.vue ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      ></div>
                      <span class="text-sm font-medium">
                        {{ devToolsStatus.vue ? '已连接' : '未检测到' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Pinia DevTools:</span>
                    <div class="flex items-center">
                      <div 
                        :class="[
                          'w-2 h-2 rounded-full mr-2',
                          devToolsStatus.pinia ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      ></div>
                      <span class="text-sm font-medium">
                        {{ devToolsStatus.pinia ? '已连接' : '未检测到' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">时间旅行:</span>
                    <div class="flex items-center">
                      <div 
                        :class="[
                          'w-2 h-2 rounded-full mr-2',
                          devToolsStatus.timeTravel ? 'bg-green-500' : 'bg-yellow-500'
                        ]"
                      ></div>
                      <span class="text-sm font-medium">
                        {{ devToolsStatus.timeTravel ? '支持' : '有限支持' }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  @click="checkDevToolsStatus"
                  class="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  重新检测
                </button>
              </div>
              
              <!-- Store 信息 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3 flex items-center">
                  <Icon name="lucide:database" class="mr-2 w-4 h-4" />
                  Store 信息
                </h3>
                
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">注册的 Store:</span>
                    <span class="font-medium">{{ registeredStores.length }}</span>
                  </div>
                  
                  <div class="space-y-1">
                    <div 
                      v-for="store in registeredStores" 
                      :key="store.id"
                      class="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1"
                    >
                      <span>{{ store.id }}</span>
                      <div class="flex items-center">
                        <div 
                          :class="[
                            'w-1.5 h-1.5 rounded-full mr-1',
                            store.active ? 'bg-green-500' : 'bg-gray-400'
                          ]"
                        ></div>
                        <span class="text-gray-500">{{ store.active ? '活跃' : '非活跃' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 状态快照和时间旅行 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:camera" class="mr-3 w-6 h-6 text-green-500" />
              状态快照和时间旅行
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- 快照管理 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">快照管理</h3>
                
                <div class="space-y-3">
                  <button 
                    @click="takeSnapshot"
                    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Icon name="lucide:camera" class="mr-2 w-4 h-4" />
                    创建快照
                  </button>
                  
                  <div class="text-sm text-gray-600">
                    当前快照数: {{ snapshots.length }}
                  </div>
                  
                  <div class="max-h-32 overflow-y-auto space-y-1">
                    <div 
                      v-for="(snapshot, index) in snapshots" 
                      :key="index"
                      class="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm"
                    >
                      <div>
                        <div class="font-medium">快照 {{ index + 1 }}</div>
                        <div class="text-xs text-gray-500">{{ snapshot.timestamp }}</div>
                      </div>
                      <div class="flex space-x-1">
                        <button 
                          @click="restoreSnapshot(index)"
                          class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          恢复
                        </button>
                        <button 
                          @click="deleteSnapshot(index)"
                          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    @click="clearAllSnapshots"
                    :disabled="snapshots.length === 0"
                    class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    清空所有快照
                  </button>
                </div>
              </div>
              
              <!-- 时间旅行控制 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">时间旅行控制</h3>
                
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="timeTravelBackward"
                      :disabled="!canTravelBackward"
                      class="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Icon name="lucide:skip-back" class="mr-1 w-4 h-4" />
                      后退
                    </button>
                    
                    <button 
                      @click="timeTravelForward"
                      :disabled="!canTravelForward"
                      class="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Icon name="lucide:skip-forward" class="mr-1 w-4 h-4" />
                      前进
                    </button>
                  </div>
                  
                  <div class="text-sm text-gray-600 text-center">
                    历史位置: {{ currentHistoryIndex + 1 }} / {{ actionHistory.length }}
                  </div>
                  
                  <div class="space-y-1 max-h-32 overflow-y-auto">
                    <div 
                      v-for="(action, index) in actionHistory" 
                      :key="index"
                      class="flex items-center justify-between text-xs p-2 rounded"
                      :class="{
                        'bg-blue-100 border border-blue-300': index === currentHistoryIndex,
                        'bg-gray-50': index !== currentHistoryIndex
                      }"
                    >
                      <div>
                        <span class="font-medium">{{ action.type }}</span>
                        <span class="text-gray-500 ml-1">{{ action.payload }}</span>
                      </div>
                      <span class="text-gray-400">{{ action.time }}</span>
                    </div>
                  </div>
                  
                  <button 
                    @click="clearHistory"
                    class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    清空历史
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 调试工具 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:wrench" class="mr-3 w-6 h-6 text-orange-500" />
              调试工具
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- 状态检查器 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">状态检查器</h3>
                
                <div class="space-y-3">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="text-sm font-medium text-gray-700 mb-2">Counter Store 状态:</div>
                    <pre class="text-xs text-gray-600 overflow-x-auto">{{ JSON.stringify(counterStoreState, null, 2) }}</pre>
                  </div>
                  
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="text-sm font-medium text-gray-700 mb-2">User Store 状态:</div>
                    <pre class="text-xs text-gray-600 overflow-x-auto">{{ JSON.stringify(userStoreState, null, 2) }}</pre>
                  </div>
                  
                  <button 
                    @click="refreshStoreStates"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    刷新状态
                  </button>
                </div>
              </div>
              
              <!-- 动作监听器 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">动作监听器</h3>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">监听状态:</span>
                    <div class="flex items-center">
                      <div 
                        :class="[
                          'w-2 h-2 rounded-full mr-2',
                          isListening ? 'bg-green-500' : 'bg-red-500'
                        ]"
                      ></div>
                      <span class="text-sm font-medium">
                        {{ isListening ? '监听中' : '已停止' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <button 
                      @click="startListening"
                      :disabled="isListening"
                      class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      开始监听
                    </button>
                    
                    <button 
                      @click="stopListening"
                      :disabled="!isListening"
                      class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      停止监听
                    </button>
                  </div>
                  
                  <div class="text-sm text-gray-600">
                      捕获的动作: {{ capturedActions.length }}
                    </div>
                  
                  <div class="max-h-32 overflow-y-auto space-y-1">
                    <div 
                      v-for="(action, index) in capturedActions.slice(-10)" 
                      :key="index"
                      class="bg-gray-50 rounded px-2 py-1 text-xs"
                    >
                      <div class="font-medium">{{ action.storeName }}.{{ action.actionName }}</div>
                      <div class="text-gray-500">{{ action.timestamp }}</div>
                      <div v-if="action.payload" class="text-gray-600 mt-1">
                        参数: {{ JSON.stringify(action.payload) }}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    @click="clearCapturedActions"
                    class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    清空记录
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 性能分析 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:trending-up" class="mr-3 w-6 h-6 text-red-500" />
              性能分析
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ performanceStats.totalActions }}</div>
                <div class="text-sm text-gray-600">总动作数</div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ performanceStats.averageTime }}ms</div>
                <div class="text-sm text-gray-600">平均执行时间</div>
              </div>
              
              <div class="bg-purple-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ performanceStats.slowestAction }}</div>
                <div class="text-sm text-gray-600">最慢动作</div>
              </div>
            </div>
            
            <div class="mt-4">
              <h3 class="font-semibold text-gray-700 mb-2">动作性能排行</h3>
              <div class="space-y-2">
                <div 
                  v-for="(stat, index) in actionPerformanceStats.slice(0, 5)" 
                  :key="index"
                  class="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm"
                >
                  <span class="font-medium">{{ stat.name }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-600">{{ stat.count }} 次</span>
                    <span class="text-gray-600">{{ stat.avgTime }}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：Store 操作面板 -->
        <div class="space-y-6">
          <!-- Counter Store 操作 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:calculator" class="mr-2 w-5 h-5" />
              Counter Store 操作
            </h3>
            
            <div class="space-y-4">
              <!-- 当前状态显示 -->
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">{{ counterStore.count }}</div>
                <div class="text-sm text-gray-600">
                  双倍值: {{ counterStore.doubleCount }} | 
                  {{ counterStore.isEven ? '偶数' : '奇数' }}
                </div>
              </div>
              
              <!-- 基本操作 -->
              <div class="grid grid-cols-2 gap-2">
                <button 
                  @click="performCounterAction('increment')"
                  class="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  +1
                </button>
                <button 
                  @click="performCounterAction('decrement')"
                  class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  -1
                </button>
                <button 
                  @click="performCounterAction('incrementBy', 5)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  +5
                </button>
                <button 
                  @click="performCounterAction('reset')"
                  class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  重置
                </button>
              </div>
              
              <!-- 异步操作 -->
              <div class="space-y-2">
                <button 
                  @click="performCounterAction('fetchAndSetCount')"
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
                  @click="performCounterAction('fetchRandomUserCount')"
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

          <!-- User Store 操作 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:user" class="mr-2 w-5 h-5" />
              User Store 操作
            </h3>
            
            <div class="space-y-4">
              <!-- 用户信息显示 -->
              <div class="bg-green-50 rounded-lg p-4">
                <div v-if="userStore.currentUser" class="text-center">
                  <div class="text-lg font-bold text-green-600 mb-1">{{ userStore.currentUser.name }}</div>
                  <div class="text-sm text-gray-600">{{ userStore.currentUser.email }}</div>
                  <div class="text-xs text-gray-500 mt-1">ID: {{ userStore.currentUser.id }}</div>
                </div>
                <div v-else class="text-center text-gray-500">
                  未登录
                </div>
              </div>
              
              <!-- 用户操作 -->
              <div class="space-y-2">
                <button 
                  @click="performUserAction('login', { id: 1, name: 'Test User', email: 'test@example.com' })"
                  :disabled="!!userStore.currentUser"
                  class="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  模拟登录
                </button>
                
                <button 
                  @click="performUserAction('logout')"
                  :disabled="!userStore.currentUser"
                  class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  退出登录
                </button>
                
                <button 
                  @click="performUserAction('updateProfile', { name: 'Updated User' })"
                  :disabled="!userStore.currentUser"
                  class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  更新资料
                </button>
              </div>
            </div>
          </div>

          <!-- DevTools 快捷操作 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:zap" class="mr-2 w-5 h-5" />
              DevTools 快捷操作
            </h3>
            
            <div class="space-y-3">
              <button 
                @click="triggerComplexAction"
                class="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                触发复杂动作
              </button>
              
              <button 
                @click="simulateError"
                class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                模拟错误
              </button>
              
              <button 
                @click="batchOperations"
                class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                批量操作
              </button>
              
              <button 
                @click="resetAllStores"
                class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                重置所有 Store
              </button>
            </div>
          </div>

          <!-- 导出/导入 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:download" class="mr-2 w-5 h-5" />
              导出/导入
            </h3>
            
            <div class="space-y-3">
              <button 
                @click="exportDebugData"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                导出调试数据
              </button>
              
              <button 
                @click="exportStateSnapshot"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                导出状态快照
              </button>
              
              <div class="relative">
                <input 
                  ref="fileInput"
                  type="file"
                  accept=".json"
                  @change="importDebugData"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                <button class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                  导入调试数据
                </button>
              </div>
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
  title: 'DevTools 测试',
  meta: [
    { name: 'description', content: '测试 Pinia DevTools 集成和调试功能' }
  ]
})

// 导入 Stores
const counterStore = useCounterStore()
const userStore = user()

// 响应式数据
const isListening = ref(false)
const capturedActions = ref([])
const snapshots = ref([])
const actionHistory = ref([])
const currentHistoryIndex = ref(-1)
const fileInput = ref(null)

// DevTools 状态
const devToolsStatus = reactive({
  vue: false,
  pinia: false,
  timeTravel: false
})

// Store 状态
const counterStoreState = ref({})
const userStoreState = ref({})

// 性能统计
const performanceStats = reactive({
  totalActions: 0,
  averageTime: 0,
  slowestAction: 'N/A'
})

const actionPerformanceStats = ref([])

// 注册的 Store 列表
const registeredStores = ref([
  { id: 'counter', active: true },
  { id: 'user', active: true }
])

// 计算属性
const canTravelBackward = computed(() => currentHistoryIndex.value > 0)
const canTravelForward = computed(() => currentHistoryIndex.value < actionHistory.value.length - 1)

// 检查 DevTools 状态
const checkDevToolsStatus = () => {
  if (process.client) {
    // 检查 Vue DevTools
    devToolsStatus.vue = !!(window.__VUE_DEVTOOLS_GLOBAL_HOOK__)
    
    // 检查 Pinia DevTools（通过检查 Pinia 实例是否有 DevTools 支持）
    devToolsStatus.pinia = !!(window.__VUE_DEVTOOLS_GLOBAL_HOOK__ && window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps)
    
    // 时间旅行支持（基于浏览器环境）
    devToolsStatus.timeTravel = process.client
  }
}

// 刷新 Store 状态
const refreshStoreStates = () => {
  counterStoreState.value = {
    count: counterStore.count,
    loading: counterStore.loading,
    error: counterStore.error,
    doubleCount: counterStore.doubleCount,
    isEven: counterStore.isEven,
    isPositive: counterStore.isPositive
  }
  
  userStoreState.value = {
    currentUser: userStore.currentUser,
    isLoggedIn: userStore.isLoggedIn,
    preferences: userStore.preferences
  }
}

// 创建快照
const takeSnapshot = () => {
  const snapshot = {
    timestamp: new Date().toLocaleString('zh-CN'),
    counter: { ...counterStoreState.value },
    user: { ...userStoreState.value }
  }
  
  snapshots.value.push(snapshot)
  
  // 只保留最近 10 个快照
  if (snapshots.value.length > 10) {
    snapshots.value = snapshots.value.slice(-10)
  }
}

// 恢复快照
const restoreSnapshot = (index) => {
  const snapshot = snapshots.value[index]
  if (!snapshot) return
  
  // 恢复 Counter Store
  counterStore.setCount(snapshot.counter.count)
  
  // 恢复 User Store
  if (snapshot.user.currentUser) {
    userStore.login(snapshot.user.currentUser)
  } else {
    userStore.logout()
  }
  
  refreshStoreStates()
  
  // 记录恢复操作
  addToHistory('RESTORE_SNAPSHOT', `快照 ${index + 1}`)
}

// 删除快照
const deleteSnapshot = (index) => {
  snapshots.value.splice(index, 1)
}

// 清空所有快照
const clearAllSnapshots = () => {
  snapshots.value = []
}

// 添加到历史记录
const addToHistory = (type, payload = '') => {
  const action = {
    type,
    payload,
    time: new Date().toLocaleTimeString('zh-CN'),
    state: {
      counter: { ...counterStoreState.value },
      user: { ...userStoreState.value }
    }
  }
  
  // 如果当前不在历史末尾，删除后面的记录
  if (currentHistoryIndex.value < actionHistory.value.length - 1) {
    actionHistory.value = actionHistory.value.slice(0, currentHistoryIndex.value + 1)
  }
  
  actionHistory.value.push(action)
  currentHistoryIndex.value = actionHistory.value.length - 1
  
  // 只保留最近 50 条记录
  if (actionHistory.value.length > 50) {
    actionHistory.value = actionHistory.value.slice(-50)
    currentHistoryIndex.value = actionHistory.value.length - 1
  }
}

// 时间旅行后退
const timeTravelBackward = () => {
  if (!canTravelBackward.value) return
  
  currentHistoryIndex.value--
  const action = actionHistory.value[currentHistoryIndex.value]
  
  if (action && action.state) {
    // 恢复到指定状态
    counterStore.setCount(action.state.counter.count)
    
    if (action.state.user.currentUser) {
      userStore.login(action.state.user.currentUser)
    } else {
      userStore.logout()
    }
    
    refreshStoreStates()
  }
}

// 时间旅行前进
const timeTravelForward = () => {
  if (!canTravelForward.value) return
  
  currentHistoryIndex.value++
  const action = actionHistory.value[currentHistoryIndex.value]
  
  if (action && action.state) {
    // 恢复到指定状态
    counterStore.setCount(action.state.counter.count)
    
    if (action.state.user.currentUser) {
      userStore.login(action.state.user.currentUser)
    } else {
      userStore.logout()
    }
    
    refreshStoreStates()
  }
}

// 清空历史
const clearHistory = () => {
  actionHistory.value = []
  currentHistoryIndex.value = -1
}

// 开始监听
const startListening = () => {
  isListening.value = true
  
  // 这里可以添加实际的 Store 监听逻辑
  // 由于这是演示，我们模拟监听行为
}

// 停止监听
const stopListening = () => {
  isListening.value = false
}

// 清空捕获的动作
const clearCapturedActions = () => {
  capturedActions.value = []
}

// 执行 Counter Store 动作
const performCounterAction = async (action, ...args) => {
  const startTime = performance.now()
  
  try {
    if (typeof counterStore[action] === 'function') {
      await counterStore[action](...args)
    }
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    // 记录动作
    if (isListening.value) {
      capturedActions.value.push({
        storeName: 'counter',
        actionName: action,
        payload: args.length > 0 ? args : null,
        timestamp: new Date().toLocaleTimeString('zh-CN'),
        duration
      })
    }
    
    // 更新性能统计
    updatePerformanceStats(action, duration)
    
    // 添加到历史
    addToHistory(`counter.${action}`, args.length > 0 ? JSON.stringify(args) : '')
    
    // 刷新状态
    refreshStoreStates()
    
  } catch (error) {
    console.error('Counter action error:', error)
  }
}

// 执行 User Store 动作
const performUserAction = async (action, ...args) => {
  const startTime = performance.now()
  
  try {
    if (typeof userStore[action] === 'function') {
      await userStore[action](...args)
    }
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    // 记录动作
    if (isListening.value) {
      capturedActions.value.push({
        storeName: 'user',
        actionName: action,
        payload: args.length > 0 ? args : null,
        timestamp: new Date().toLocaleTimeString('zh-CN'),
        duration
      })
    }
    
    // 更新性能统计
    updatePerformanceStats(action, duration)
    
    // 添加到历史
    addToHistory(`user.${action}`, args.length > 0 ? JSON.stringify(args) : '')
    
    // 刷新状态
    refreshStoreStates()
    
  } catch (error) {
    console.error('User action error:', error)
  }
}

// 更新性能统计
const updatePerformanceStats = (actionName, duration) => {
  performanceStats.totalActions++
  
  // 查找或创建动作统计
  let actionStat = actionPerformanceStats.value.find(stat => stat.name === actionName)
  if (!actionStat) {
    actionStat = {
      name: actionName,
      count: 0,
      totalTime: 0,
      avgTime: 0
    }
    actionPerformanceStats.value.push(actionStat)
  }
  
  actionStat.count++
  actionStat.totalTime += duration
  actionStat.avgTime = Math.round(actionStat.totalTime / actionStat.count)
  
  // 更新全局统计
  const totalTime = actionPerformanceStats.value.reduce((sum, stat) => sum + stat.totalTime, 0)
  performanceStats.averageTime = Math.round(totalTime / performanceStats.totalActions)
  
  // 找出最慢的动作
  const slowest = actionPerformanceStats.value.reduce((prev, current) => 
    (prev.avgTime > current.avgTime) ? prev : current
  )
  performanceStats.slowestAction = slowest.name
  
  // 按平均时间排序
  actionPerformanceStats.value.sort((a, b) => b.avgTime - a.avgTime)
}

// 触发复杂动作
const triggerComplexAction = async () => {
  // 模拟复杂的操作序列
  await performCounterAction('increment')
  await new Promise(resolve => setTimeout(resolve, 100))
  await performCounterAction('incrementBy', 10)
  await performUserAction('login', { id: 2, name: 'Complex User', email: 'complex@example.com' })
  await performCounterAction('fetchAndSetCount')
}

// 模拟错误
const simulateError = () => {
  try {
    throw new Error('这是一个模拟的错误，用于测试错误处理')
  } catch (error) {
    console.error('Simulated error:', error)
    
    if (isListening.value) {
      capturedActions.value.push({
        storeName: 'system',
        actionName: 'ERROR',
        payload: error.message,
        timestamp: new Date().toLocaleTimeString('zh-CN'),
        duration: 0
      })
    }
    
    addToHistory('ERROR', error.message)
  }
}

// 批量操作
const batchOperations = async () => {
  const operations = [
    () => performCounterAction('increment'),
    () => performCounterAction('increment'),
    () => performCounterAction('decrement'),
    () => performCounterAction('incrementBy', 5),
    () => performUserAction('updateProfile', { name: 'Batch User' })
  ]
  
  for (const operation of operations) {
    await operation()
    await new Promise(resolve => setTimeout(resolve, 50))
  }
}

// 重置所有 Store
const resetAllStores = () => {
  counterStore.reset()
  userStore.logout()
  refreshStoreStates()
  addToHistory('RESET_ALL', '重置所有 Store')
}

// 导出调试数据
const exportDebugData = () => {
  const debugData = {
    timestamp: new Date().toISOString(),
    devToolsStatus,
    snapshots: snapshots.value,
    actionHistory: actionHistory.value,
    capturedActions: capturedActions.value,
    performanceStats,
    actionPerformanceStats: actionPerformanceStats.value,
    currentStates: {
      counter: counterStoreState.value,
      user: userStoreState.value
    }
  }
  
  if (process.client) {
    const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pinia-debug-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// 导出状态快照
const exportStateSnapshot = () => {
  const snapshot = {
    timestamp: new Date().toISOString(),
    counter: counterStoreState.value,
    user: userStoreState.value
  }
  
  if (process.client) {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pinia-snapshot-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// 导入调试数据
const importDebugData = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      // 恢复数据
      if (data.snapshots) snapshots.value = data.snapshots
      if (data.actionHistory) actionHistory.value = data.actionHistory
      if (data.capturedActions) capturedActions.value = data.capturedActions
      
      // 恢复状态
      if (data.currentStates) {
        if (data.currentStates.counter) {
          counterStore.setCount(data.currentStates.counter.count || 0)
        }
        if (data.currentStates.user && data.currentStates.user.currentUser) {
          userStore.login(data.currentStates.user.currentUser)
        }
      }
      
      refreshStoreStates()
      addToHistory('IMPORT_DATA', '导入调试数据')
      
    } catch (error) {
      console.error('Import error:', error)
    }
  }
  reader.readAsText(file)
  
  // 清空文件输入
  event.target.value = ''
}

// 组件挂载时初始化
onMounted(() => {
  checkDevToolsStatus()
  refreshStoreStates()
  startListening()
  
  // 创建初始快照
  takeSnapshot()
  
  // 添加初始历史记录
  addToHistory('PAGE_LOADED', 'DevTools 测试页面已加载')
})

// 组件卸载时清理
onUnmounted(() => {
  stopListening()
})
</script>