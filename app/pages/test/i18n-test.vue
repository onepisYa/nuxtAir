<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">{{ $t('welcome', {count: '333'}) }}</h1>
    
    <!-- 语言切换器 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">语言切换</h2>
      <div class="flex gap-4">
        <NuxtLink 
          v-for="locale in availableLocales" 
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {{ locale.name }}
        </NuxtLink>
      </div>
      <p class="mt-2 text-gray-600">当前语言: {{ currentLocale.name }} ({{ currentLocale.code }})</p>
    </div>

    <!-- 动态翻译测试 -->
    <div class="mb-8" v-if="locale === 'zh-CN'">
      <h2 class="text-xl font-semibold mb-4">动态翻译功能</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">动态问候语</h3>
          <p>{{ $t('dynamicGreeting') }}</p>
        </div>
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">季节性问候</h3>
          <p>{{ $t('seasonalGreeting') }}</p>
        </div>
      </div>
    </div>

    <!-- 参数传递测试 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">参数传递</h2>
      <div class="space-y-4">
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">个性化问候</h3>
          <p>{{ $t('greeting', { name: '张三' }) }}</p>
        </div>
        <div class="p-4 border rounded" v-if="locale === 'zh-CN'">
          <h3 class="font-medium mb-2">用户资料</h3>
          <p>{{ $t('userProfile', { username: 'developer' }) }}</p>
        </div>
      </div>
    </div>

    <!-- 复数形式测试 -->
    <div class="mb-8" v-if="locale === 'zh-CN'">
      <h2 class="text-xl font-semibold mb-4">复数形式</h2>
      <div class="space-y-4">
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">项目计数 (新版 API)</h3>
          <div class="space-y-2">
            <p>{{ $t('itemCount', 0) }}</p>
            <p>{{ $t('itemCount', 1) }}</p>
            <p>{{ $t('itemCount', { count: 5 }, 5) }}</p>
          </div>
        </div>
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">消息计数 (新版 API)</h3>
          <div class="space-y-2">
            <p>{{ $t('messageCount', 0) }}</p>
            <p>{{ $t('messageCount', 1) }}</p>
            <p>{{ $t('messageCount', { n: 10 }, 10) }}</p>
          </div>
        </div>
        
        <!-- 旧版 API 对比 (即将废弃) -->
        <!-- <div class="p-4 border rounded bg-yellow-50 border-yellow-200">
          <h3 class="font-medium mb-2 text-yellow-800">⚠️ 旧版 API (v11 将移除)</h3>
          <div class="space-y-2 text-sm">
            <p class="text-yellow-700">{{ $tc('itemCount', 0) }} - 使用 $tc</p>
            <p class="text-yellow-700">{{ $tc('itemCount', 1) }} - 使用 $tc</p>
            <p class="text-yellow-700">{{ $tc('itemCount', 5, { count: 5 }) }} - 使用 $tc</p>
          </div>
        </div> -->
      </div>
    </div>

    <!-- 嵌套翻译测试 -->
    <div class="mb-8" v-if="locale === 'zh-CN'">
      <h2 class="text-xl font-semibold mb-4">嵌套翻译</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">导航菜单</h3>
          <ul class="space-y-1">
            <li>{{ $t('navigation.home') }}</li>
            <li>{{ $t('navigation.about') }}</li>
            <li>{{ $t('navigation.contact') }}</li>
            <li>{{ $t('navigation.products') }}</li>
          </ul>
        </div>
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">表单按钮</h3>
          <div class="flex gap-2 flex-wrap">
            <button class="px-3 py-1 bg-green-500 text-white rounded text-sm">{{ $t('form.submit') }}</button>
            <button class="px-3 py-1 bg-gray-500 text-white rounded text-sm">{{ $t('form.cancel') }}</button>
            <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm">{{ $t('form.save') }}</button>
            <button class="px-3 py-1 bg-red-500 text-white rounded text-sm">{{ $t('form.delete') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 数字格式化测试 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">数字格式化</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">货币格式</h3>
          <p>{{ $n(1234.56, 'currency') }}</p>
        </div>
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">小数格式</h3>
          <p>{{ $n(1234.56, 'decimal') }}</p>
        </div>
      </div>
    </div>

    <!-- 日期时间格式化测试 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">日期时间格式化</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">短格式</h3>
          <p>{{ $d(currentDate, 'short') }}</p>
        </div>
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">长格式</h3>
          <p>{{ $d(currentDate, 'long') }}</p>
        </div>
      </div>
    </div>

    <!-- 状态消息测试 -->
    <div class="mb-8" v-if="locale === 'zh-CN'">
      <h2 class="text-xl font-semibold mb-4">状态消息</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-3 bg-blue-100 rounded text-center">
          <p class="text-sm">{{ $t('status.loading') }}</p>
        </div>
        <div class="p-3 bg-green-100 rounded text-center">
          <p class="text-sm">{{ $t('status.success') }}</p>
        </div>
        <div class="p-3 bg-red-100 rounded text-center">
          <p class="text-sm">{{ $t('status.error') }}</p>
        </div>
        <div class="p-3 bg-gray-100 rounded text-center">
          <p class="text-sm">{{ $t('status.noData') }}</p>
        </div>
      </div>
    </div>

    <!-- 时间相关翻译测试 -->
    <div class="mb-8" v-if="locale === 'zh-CN'">
      <h2 class="text-xl font-semibold mb-4">时间相关翻译</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">时间描述</h3>
          <div class="space-y-2 text-sm">
            <p>{{ $t('time.now') }}</p>
            <p>{{ $t('time.minutesAgo', { minutes: 5 }) }}</p>
            <p>{{ $t('time.hoursAgo', { hours: 2 }) }}</p>
            <p>{{ $t('time.daysAgo', { days: 3 }) }}</p>
          </div>
        </div>
        <div class="p-4 border rounded">
          <h3 class="font-medium mb-2">日期描述</h3>
          <div class="space-y-2 text-sm">
            <p>{{ $t('time.yesterday') }}</p>
            <p>{{ $t('time.today') }}</p>
            <p>{{ $t('time.tomorrow') }}</p>
          </div>
        </div>
        <div class="p-4 border rounded">
          <ClientOnly>
            <h3 class="font-medium mb-2">动态时间示例</h3>
            <div class="space-y-2 text-sm">
              <p>{{ $t('time.minutesAgo', { minutes: Math.floor(Math.random() * 60) + 1 }) }}</p>
              <p>{{ $t('time.hoursAgo', { hours: Math.floor(Math.random() * 24) + 1 }) }}</p>
              <p>{{ $t('time.daysAgo', { days: Math.floor(Math.random() * 30) + 1 }) }}</p>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- 当前时间显示 -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">实时时间</h2>
      <ClientOnly>
        <p class="text-lg">{{ formattedTime }}</p>
      </ClientOnly>      
    </div>
  </div>
</template>

<script setup>
// 获取 i18n 相关的 composables
const { locale, locales, t, n, d } = useI18n()
// 注意：tc 在 Vue I18n v11 中将被移除，请使用 t 函数的复数形式
const switchLocalePath = useSwitchLocalePath()

// 当前日期
const currentDate = ref(new Date())

// 当前语言信息
const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value)
})

// 可切换的语言列表
const availableLocales = computed(() => {
  return locales.value.filter(l => l.code !== locale.value)
})

// 格式化时间显示
const formattedTime = computed(() => {
  return currentDate.value.toLocaleString(locale.value)
})

// 每秒更新时间
onMounted(() => {
  const timer = setInterval(() => {
    currentDate.value = new Date()
  }, 1000)
  
  onUnmounted(() => {
    clearInterval(timer)
  })
})

// 页面元数据
useHead({
  title: () => t('pages.home.title'),
  meta: [
    {
      name: 'description',
      content: () => t('pages.home.subtitle')
    }
  ]
})
</script>