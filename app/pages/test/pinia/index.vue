<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          🍍 Pinia 状态管理测试
        </h1>
        <p class="text-lg text-gray-600">
          测试 Pinia 全局状态管理的各种功能和特性
        </p>
      </div>

      <!-- 测试功能卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Counter 测试 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">🔢</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800">Counter 测试</h3>
              <p class="text-sm text-gray-600">基础计数器功能</p>
            </div>
          </div>
          <NuxtLink 
            to="/test/pinia/counter" 
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始测试
            <Icon name="lucide:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- 异步操作测试 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">⚡</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800">异步操作</h3>
              <p class="text-sm text-gray-600">API 请求与状态管理</p>
            </div>
          </div>
          <NuxtLink 
            to="/test/pinia/async" 
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            开始测试
            <Icon name="lucide:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Store 组合测试 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">🔗</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800">Store 组合</h3>
              <p class="text-sm text-gray-600">多个 Store 协作</p>
            </div>
          </div>
          <NuxtLink 
            to="/test/pinia/composition" 
            class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            开始测试
            <Icon name="lucide:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- 持久化测试 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">💾</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800">持久化测试</h3>
              <p class="text-sm text-gray-600">状态持久化存储</p>
            </div>
          </div>
          <NuxtLink 
            to="/test/pinia/persistence" 
            class="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            开始测试
            <Icon name="lucide:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- 性能测试 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">🚀</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800">性能测试</h3>
              <p class="text-sm text-gray-600">响应性能与优化</p>
            </div>
          </div>
          <NuxtLink 
            to="/test/pinia/performance" 
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            开始测试
            <Icon name="lucide:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- DevTools 测试 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">🛠️</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800">DevTools</h3>
              <p class="text-sm text-gray-600">开发工具集成</p>
            </div>
          </div>
          <NuxtLink 
            to="/test/pinia/devtools" 
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            开始测试
            <Icon name="lucide:arrow-right" class="ml-2 w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- 当前状态预览 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Icon name="lucide:eye" class="mr-3 w-6 h-6" />
          当前状态预览
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Counter Store 状态 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <Icon name="lucide:hash" class="mr-2 w-5 h-5" />
              Counter Store
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">当前计数:</span>
                <span class="font-mono font-bold text-blue-600">{{ counterStore.count }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">双倍值:</span>
                <span class="font-mono text-green-600">{{ counterStore.doubleCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">是否为偶数:</span>
                <span class="font-mono" :class="counterStore.isEven ? 'text-green-600' : 'text-red-600'">
                  {{ counterStore.isEven ? '是' : '否' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">加载状态:</span>
                <span class="font-mono" :class="counterStore.loading ? 'text-orange-600' : 'text-gray-400'">
                  {{ counterStore.loading ? '加载中...' : '空闲' }}
                </span>
              </div>
              <div v-if="counterStore.error" class="flex justify-between">
                <span class="text-gray-600">错误信息:</span>
                <span class="font-mono text-red-600 text-xs">{{ counterStore.error }}</span>
              </div>
            </div>
          </div>

          <!-- User Store 状态 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <Icon name="lucide:user" class="mr-2 w-5 h-5" />
              User Store
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">登录状态:</span>
                <span class="font-mono" :class="userStore.isLogin ? 'text-green-600' : 'text-red-600'">
                  {{ userStore.isLogin ? '已登录' : '未登录' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Token:</span>
                <span class="font-mono text-xs text-gray-500">
                  {{ userStore.token ? userStore.token.substring(0, 20) + '...' : '无' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="mt-8 text-center">
        <NuxtLink 
          to="/test" 
          class="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Icon name="lucide:arrow-left" class="mr-2 w-4 h-4" />
          返回测试首页
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

// 页面元数据
useHead({
  title: 'Pinia 状态管理测试',
  meta: [
    { name: 'description', content: '测试 Pinia 全局状态管理的各种功能和特性' }
  ]
})

// 使用 stores
const counterStore = useCounterStore()
const userStore = user()

// 响应式解构（如果需要在模板中使用）
// const { count, loading, error } = storeToRefs(counterStore)
// const { isLogin, token } = storeToRefs(userStore)
</script>

<style scoped>
/* 自定义样式 */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>