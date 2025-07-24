<script setup lang="ts">
const router = useRouter()

// 添加页面元数据
useHead({
  title: '页面未找到 - 404',
  meta: [
    { name: 'description', content: '抱歉，您访问的页面不存在' }
  ]
})

// 添加一些交互动画
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <div 
      class="text-center max-w-md mx-auto transform transition-all duration-1000 ease-out"
      :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
    >
      <!-- 404 大数字 -->
      <div class="relative mb-8">
        <h1 class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 select-none">
          404
        </h1>
        <div class="absolute inset-0 text-9xl font-bold text-blue-200 dark:text-gray-700 -z-10 transform translate-x-2 translate-y-2">
          404
        </div>
      </div>

      <!-- 图标和动画 -->
      <div class="mb-6 relative">
        <div class="w-24 h-24 mx-auto mb-4 relative">
          <!-- 外圈动画 -->
          <div class="absolute inset-0 border-4 border-blue-200 dark:border-gray-600 rounded-full animate-ping opacity-20"></div>
          <div class="absolute inset-2 border-4 border-blue-300 dark:border-gray-500 rounded-full animate-pulse opacity-40"></div>
          
          <!-- 中心图标 -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 text-blue-600 dark:text-blue-400">
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 标题和描述 -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          页面走丢了
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          抱歉，您访问的页面可能已被移动、删除或从未存在过。
          <br>
          让我们帮您找到正确的方向。
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="router.push('/')"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              返回首页
            </span>
          </button>
          
          <button 
            @click="router.back()"
            class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-600 transform transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
              </svg>
              返回上页
            </span>
          </button>
        </div>
        
        <!-- 搜索建议 -->
        <div class="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">或者尝试以下操作：</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <NuxtLink 
              to="/about" 
              class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              关于我们
            </NuxtLink>
            <NuxtLink 
              to="/test/blog" 
              class="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              博客
            </NuxtLink>
            <button 
              @click="router.push('/contact')"
              class="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              联系我们
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
