<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          ⚡ 异步操作测试
        </h1>
        <p class="text-gray-600">
          测试 Pinia Store 中的异步操作、错误处理和加载状态
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：API 操作 -->
        <div class="space-y-6">
          <!-- JSONPlaceholder API 测试 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:cloud" class="mr-3 w-6 h-6" />
              JSONPlaceholder API
            </h2>
            
            <div class="space-y-4">
              <!-- 获取单个 Post -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">获取 Post 数据</h3>
                <div class="flex gap-2 mb-3">
                  <input 
                    v-model.number="postId"
                    type="number"
                    min="1"
                    max="100"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Post ID (1-100)"
                  />
                  <button 
                    @click="fetchPost"
                    :disabled="loading.post"
                    class="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Icon 
                      :name="loading.post ? 'lucide:loader-2' : 'lucide:download'" 
                      :class="['mr-2 w-4 h-4', { 'animate-spin': loading.post }]" 
                    />
                    {{ loading.post ? '获取中...' : '获取' }}
                  </button>
                </div>
                
                <div v-if="data.post" class="bg-gray-50 rounded p-3 text-sm">
                  <div class="font-semibold text-gray-700">{{ data.post.title }}</div>
                  <div class="text-gray-600 mt-1">{{ data.post.body }}</div>
                  <div class="text-xs text-gray-500 mt-2">
                    ID: {{ data.post.id }} | User ID: {{ data.post.userId }}
                  </div>
                </div>
              </div>

              <!-- 获取用户列表 -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">获取用户列表</h3>
                <button 
                  @click="fetchUsers"
                  :disabled="loading.users"
                  class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Icon 
                    :name="loading.users ? 'lucide:loader-2' : 'lucide:users'" 
                    :class="['mr-2 w-4 h-4', { 'animate-spin': loading.users }]" 
                  />
                  {{ loading.users ? '获取中...' : '获取所有用户' }}
                </button>
                
                <div v-if="data.users.length > 0" class="mt-3 max-h-40 overflow-y-auto">
                  <div 
                    v-for="user in data.users" 
                    :key="user.id"
                    class="flex justify-between items-center p-2 bg-gray-50 rounded mb-1 text-sm"
                  >
                    <span class="font-medium">{{ user.name }}</span>
                    <span class="text-gray-500">{{ user.email }}</span>
                  </div>
                </div>
              </div>

              <!-- 获取 Todos -->
              <div class="border rounded-lg p-4">
                <h3 class="font-semibold text-gray-700 mb-3">获取 Todo 列表</h3>
                <div class="flex gap-2 mb-3">
                  <select 
                    v-model.number="todoUserId"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">所有用户</option>
                    <option v-for="i in 10" :key="i" :value="i">用户 {{ i }}</option>
                  </select>
                  <button 
                    @click="fetchTodos"
                    :disabled="loading.todos"
                    class="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Icon 
                      :name="loading.todos ? 'lucide:loader-2' : 'lucide:list'" 
                      :class="['mr-2 w-4 h-4', { 'animate-spin': loading.todos }]" 
                    />
                    {{ loading.todos ? '获取中...' : '获取' }}
                  </button>
                </div>
                
                <div v-if="data.todos.length > 0" class="space-y-1 max-h-32 overflow-y-auto">
                  <div 
                    v-for="todo in data.todos.slice(0, 5)" 
                    :key="todo.id"
                    class="flex items-center p-2 bg-gray-50 rounded text-sm"
                  >
                    <Icon 
                      :name="todo.completed ? 'lucide:check-circle' : 'lucide:circle'" 
                      :class="['mr-2 w-4 h-4', todo.completed ? 'text-green-500' : 'text-gray-400']" 
                    />
                    <span :class="{ 'line-through text-gray-500': todo.completed }">
                      {{ todo.title }}
                    </span>
                  </div>
                  <div v-if="data.todos.length > 5" class="text-xs text-gray-500 text-center py-1">
                    还有 {{ data.todos.length - 5 }} 个项目...
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 错误模拟 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:alert-triangle" class="mr-3 w-6 h-6" />
              错误处理测试
            </h2>
            
            <div class="space-y-3">
              <button 
                @click="simulateNetworkError"
                :disabled="loading.error"
                class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon 
                  :name="loading.error ? 'lucide:loader-2' : 'lucide:wifi-off'" 
                  :class="['mr-2 w-4 h-4', { 'animate-spin': loading.error }]" 
                />
                {{ loading.error ? '模拟中...' : '模拟网络错误' }}
              </button>
              
              <button 
                @click="simulate404Error"
                :disabled="loading.error"
                class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Icon 
                  :name="loading.error ? 'lucide:loader-2' : 'lucide:search-x'" 
                  :class="['mr-2 w-4 h-4', { 'animate-spin': loading.error }]" 
                />
                {{ loading.error ? '模拟中...' : '模拟 404 错误' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：状态监控 -->
        <div class="space-y-6">
          <!-- 加载状态监控 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:activity" class="mr-3 w-6 h-6" />
              加载状态监控
            </h2>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium">Post 请求</span>
                <div class="flex items-center">
                  <div 
                    :class="[
                      'w-3 h-3 rounded-full mr-2',
                      loading.post ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                    ]"
                  ></div>
                  <span class="text-sm text-gray-600">
                    {{ loading.post ? '加载中' : '空闲' }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium">Users 请求</span>
                <div class="flex items-center">
                  <div 
                    :class="[
                      'w-3 h-3 rounded-full mr-2',
                      loading.users ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                    ]"
                  ></div>
                  <span class="text-sm text-gray-600">
                    {{ loading.users ? '加载中' : '空闲' }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium">Todos 请求</span>
                <div class="flex items-center">
                  <div 
                    :class="[
                      'w-3 h-3 rounded-full mr-2',
                      loading.todos ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'
                    ]"
                  ></div>
                  <span class="text-sm text-gray-600">
                    {{ loading.todos ? '加载中' : '空闲' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 错误信息显示 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:bug" class="mr-3 w-6 h-6" />
              错误信息
            </h2>
            
            <div v-if="errors.length === 0" class="text-center text-gray-500 py-8">
              <Icon name="lucide:check-circle" class="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>暂无错误</p>
            </div>
            
            <div v-else class="space-y-3 max-h-64 overflow-y-auto">
              <div 
                v-for="(error, index) in errors" 
                :key="index"
                class="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="font-medium text-red-800">{{ error.type }}</div>
                    <div class="text-sm text-red-600 mt-1">{{ error.message }}</div>
                    <div class="text-xs text-red-500 mt-1">{{ error.time }}</div>
                  </div>
                  <button 
                    @click="removeError(index)"
                    class="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              v-if="errors.length > 0"
              @click="clearAllErrors"
              class="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              清除所有错误
            </button>
          </div>

          <!-- 请求统计 -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="lucide:bar-chart" class="mr-3 w-6 h-6" />
              请求统计
            </h2>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ stats.success }}</div>
                <div class="text-sm text-gray-600">成功请求</div>
              </div>
              <div class="text-center p-3 bg-red-50 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{{ stats.error }}</div>
                <div class="text-sm text-gray-600">失败请求</div>
              </div>
            </div>
            
            <button 
              @click="resetStats"
              class="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
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
  title: '异步操作测试',
  meta: [
    { name: 'description', content: '测试 Pinia Store 中的异步操作、错误处理和加载状态' }
  ]
})

// 响应式数据
const postId = ref(1)
const todoUserId = ref('')

// 加载状态
const loading = reactive({
  post: false,
  users: false,
  todos: false,
  error: false
})

// 数据存储
const data = reactive({
  post: null,
  users: [],
  todos: []
})

// 错误记录
const errors = ref([])

// 统计信息
const stats = reactive({
  success: 0,
  error: 0
})

// 获取单个 Post
const fetchPost = async () => {
  loading.post = true
  try {
    const response = await $fetch(`/test-api/posts/${postId.value}`)
    data.post = response
    stats.success++
  } catch (error) {
    addError('Post 请求', error.message || '获取 Post 失败')
    stats.error++
  } finally {
    loading.post = false
  }
}

// 获取用户列表
const fetchUsers = async () => {
  loading.users = true
  try {
    const response = await $fetch('/test-api/users')
    data.users = response
    stats.success++
  } catch (error) {
    addError('Users 请求', error.message || '获取用户列表失败')
    stats.error++
  } finally {
    loading.users = false
  }
}

// 获取 Todos
const fetchTodos = async () => {
  loading.todos = true
  try {
    const url = todoUserId.value 
      ? `/test-api/users/${todoUserId.value}/todos`
      : '/test-api/todos'
    const response = await $fetch(url)
    data.todos = response
    stats.success++
  } catch (error) {
    addError('Todos 请求', error.message || '获取 Todos 失败')
    stats.error++
  } finally {
    loading.todos = false
  }
}

// 模拟网络错误
const simulateNetworkError = async () => {
  loading.error = true
  try {
    // 故意请求一个不存在的端点
    await $fetch('/test-api/nonexistent-endpoint')
  } catch (error) {
    addError('网络错误模拟', '模拟的网络连接错误')
    stats.error++
  } finally {
    loading.error = false
  }
}

// 模拟 404 错误
const simulate404Error = async () => {
  loading.error = true
  try {
    // 请求一个不存在的资源
    await $fetch('/test-api/posts/999999')
  } catch (error) {
    addError('404 错误模拟', '请求的资源不存在')
    stats.error++
  } finally {
    loading.error = false
  }
}

// 添加错误记录
const addError = (type, message) => {
  errors.value.unshift({
    type,
    message,
    time: new Date().toLocaleTimeString('zh-CN')
  })
  
  // 只保留最近 10 条错误记录
  if (errors.value.length > 10) {
    errors.value = errors.value.slice(0, 10)
  }
}

// 移除单个错误
const removeError = (index) => {
  errors.value.splice(index, 1)
}

// 清除所有错误
const clearAllErrors = () => {
  errors.value = []
}

// 重置统计
const resetStats = () => {
  stats.success = 0
  stats.error = 0
}
</script>