<script setup lang="ts">
const { t, locale } = useI18n()

// 页面级 SEO 配置
useSeoMeta({
  title: '测试页面 - NuxtAir',
  description: '各种功能测试页面的导航中心',
  keywords: 'test, demo, nuxt, vue, development'
})

// 测试页面配置
const testPages = computed(() => [
  {
    title: 'Alova HTTP 客户端演示',
    description: '展示 Alova HTTP 客户端的使用方法，包括请求拦截、响应处理、错误处理等功能',
    path: '/test/alova-demo',
    icon: 'lucide:globe',
    category: 'HTTP 客户端'
  },
  {
    title: '博客系统',
    description: '完整的博客系统演示，包括文章列表、文章详情、SEO 优化等功能',
    path: '/test/blog',
    icon: 'lucide:book-open',
    category: '内容管理'
  },
  {
    title: '配置测试',
    description: '测试应用配置、环境变量、运行时配置等功能',
    path: '/test/config-test',
    icon: 'lucide:settings',
    category: '配置管理'
  },
  {
    title: '国际化测试',
    description: '多语言支持测试，包括语言切换、动态翻译、本地化格式等功能',
    path: '/test/i18n-test',
    icon: 'lucide:languages',
    category: '国际化'
  },
  {
    title: 'OG Image 测试',
    description: '开放图谱图片生成测试，用于社交媒体分享时的预览图片',
    path: '/test/og-test',
    icon: 'lucide:image',
    category: 'SEO 优化'
  },
  {
    title: 'SEO 测试',
    description: '搜索引擎优化功能测试，包括元标签、结构化数据、站点地图等',
    path: '/test/seo-test',
    icon: 'lucide:search',
    category: 'SEO 优化'
  },
  {
    title: 'Pinia 状态管理测试',
    description: '测试 Pinia 全局状态管理的各种功能，包括计数器、异步操作、Store 组合、持久化、性能测试和开发工具集成',
    path: '/test/pinia',
    icon: 'lucide:database',
    category: '状态管理'
  },
  {
    title: '通用测试',
    description: '其他通用功能测试页面',
    path: '/test/test',
    icon: 'lucide:test-tube',
    category: '通用测试'
  }
])

// 按分类分组
const groupedPages = computed(() => {
  const groups: Record<string, typeof testPages.value> = {}
  testPages.value.forEach(page => {
    if (!groups[page.category]) {
      groups[page.category] = []
    }
    groups[page.category]?.push(page)
  })
  return groups
})

const breadItems = computed(() => [
  { label: '首页', to: '/' },
  { label: '测试页面', to: '/test' },
])
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <UContainer>
      <div class="flex items-center gap-x-4 py-6">
        <UIcon name="lucide:test-tube" class="text-2xl text-primary"/>
        <UBreadcrumb :items="breadItems" class="text-lg"/>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">测试页面导航</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            这里汇集了项目中各种功能的测试页面，方便开发和调试不同的功能模块。
          </p>
        </div>
        
        <div class="space-y-8">
          <div v-for="(pages, category) in groupedPages" :key="category">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UIcon name="lucide:folder" class="text-primary"/>
              {{ category }}
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UCard 
                v-for="page in pages" 
                :key="page.path"
                class="hover:shadow-lg transition-shadow group"
              >
                <template #header>
                  <div class="flex items-center gap-3">
                    <UIcon 
                      :name="page.icon" 
                      class="text-2xl text-primary group-hover:scale-110 transition-transform"
                    />
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {{ page.title }}
                    </h3>
                  </div>
                </template>
                
                <p class="text-gray-600 text-sm leading-relaxed mb-4">
                  {{ page.description }}
                </p>
                
                <template #footer>
                  <div class="flex justify-between items-center">
                    <UBadge variant="soft" color="primary">{{ page.category }}</UBadge>
                    <UButton 
                      :to="page.path" 
                      variant="ghost" 
                      size="sm"
                      trailing-icon="lucide:arrow-right"
                    >
                      访问页面
                    </UButton>
                  </div>
                </template>
              </UCard>
            </div>
          </div>
        </div>
        
        <!-- 快速导航 -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
            快速导航
          </h2>
          <div class="flex flex-wrap justify-center gap-3">
            <UButton 
              v-for="page in testPages" 
              :key="page.path"
              :to="page.path"
              variant="outline"
              size="sm"
              :icon="page.icon"
            >
              {{ page.title }}
            </UButton>
          </div>
        </div>
        
        <!-- 返回首页 -->
        <div class="mt-8 text-center">
          <UButton 
            to="/"
            variant="soft"
            size="lg"
            icon="lucide:home"
          >
            返回首页
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:text-primary {
  color: rgb(var(--color-primary-500));
}
</style>