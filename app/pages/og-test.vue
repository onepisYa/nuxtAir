<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">OG Image 测试页面</h1>
      
      <!-- 语言切换按钮 -->
      <div class="flex gap-2">
        <button 
          @click="switchToLocale('zh-CN')"
          :class="[
            'px-4 py-2 rounded transition-colors',
            locale === 'zh-CN' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          中文
        </button>
        <button 
          @click="switchToLocale('en-US')"
          :class="[
            'px-4 py-2 rounded transition-colors',
            locale === 'en-US' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          English
        </button>
      </div>
    </div>
    
    <!-- 当前语言的 OG Image 测试 -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ locale === 'zh-CN' ? '当前 OG Image 测试 (中文)' : 'Current OG Image Test (English)' }}
      </h2>
      <p class="text-gray-600 mb-4">
        {{ locale === 'zh-CN' 
          ? '测试当前语言的字体在 OG Image 中的显示效果' 
          : 'Test current language font display in OG Image' 
        }}
      </p>
      <div class="space-y-2 mb-4">
        <p><strong>{{ locale === 'zh-CN' ? '标题' : 'Title' }}:</strong> {{ currentTitle }}</p>
        <p><strong>{{ locale === 'zh-CN' ? '描述' : 'Description' }}:</strong> {{ currentDescription }}</p>
        <p><strong>{{ locale === 'zh-CN' ? '作者' : 'Author' }}:</strong> {{ currentAuthor }}</p>
        <p><strong>{{ locale === 'zh-CN' ? '语言' : 'Locale' }}:</strong> {{ locale }}</p>
      </div>
      <div class="flex gap-4">
        <a 
          :href="currentOgImageUrl" 
          target="_blank" 
          class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {{ locale === 'zh-CN' ? '查看当前 OG Image' : 'View Current OG Image' }}
        </a>
        <button 
          @click="refreshOgImage"
          class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {{ locale === 'zh-CN' ? '刷新图片' : 'Refresh Image' }}
        </button>
        <a 
          :href="testOgImageUrl" 
          target="_blank" 
          class="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          {{ locale === 'zh-CN' ? '测试简单组件' : 'Test Simple Component' }}
        </a>
      </div>
    </div>
    
    <!-- 对比测试 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- 中文测试 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">中文 OG Image 对比</h2>
        <p class="text-gray-600 mb-4">测试中文字体 (Noto Sans SC)</p>
        <div class="space-y-2">
          <p><strong>标题:</strong> {{ chineseTitle }}</p>
          <p><strong>描述:</strong> {{ chineseDescription }}</p>
          <p><strong>作者:</strong> {{ chineseAuthor }}</p>
        </div>
        <div class="mt-4">
          <a 
            :href="chineseOgImageUrl" 
            target="_blank" 
            class="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            查看中文 OG Image
          </a>
        </div>
      </div>
      
      <!-- 英文测试 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">English OG Image Comparison</h2>
        <p class="text-gray-600 mb-4">Test English font (Inter)</p>
        <div class="space-y-2">
          <p><strong>Title:</strong> {{ englishTitle }}</p>
          <p><strong>Description:</strong> {{ englishDescription }}</p>
          <p><strong>Author:</strong> {{ englishAuthor }}</p>
        </div>
        <div class="mt-4">
          <a 
            :href="englishOgImageUrl" 
            target="_blank" 
            class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View English OG Image
          </a>
        </div>
      </div>
    </div>
    
    <!-- 说明 -->
    <div class="bg-yellow-50 p-6 rounded-lg">
      <h3 class="text-lg font-semibold mb-2">
        {{ locale === 'zh-CN' ? '测试说明' : 'Test Instructions' }}
      </h3>
      <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
        <li v-if="locale === 'zh-CN'">
          点击语言切换按钮可以测试不同语言的 OG Image 生成
        </li>
        <li v-else>
          Click language switch buttons to test OG Image generation for different languages
        </li>
        <li v-if="locale === 'zh-CN'">
          中文 OG Image 应该正确显示中文字符（使用 Noto Sans SC 字体）
        </li>
        <li v-else>
          Chinese OG Image should correctly display Chinese characters (using Noto Sans SC font)
        </li>
        <li v-if="locale === 'zh-CN'">
          英文 OG Image 使用 Inter 字体作为主要字体
        </li>
        <li v-else>
          English OG Image uses Inter font as primary font
        </li>
        <li v-if="locale === 'zh-CN'">
          如果字体仍然显示异常，请检查网络连接或字体加载配置
        </li>
        <li v-else>
          If fonts still display incorrectly, check network connection or font loading configuration
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const route = useRoute()
const router = useRouter()

// 测试数据
const chineseTitle = '这是一个中文标题测试'
const chineseDescription = '这是中文描述内容，用于测试 Noto Sans SC 字体在 OG Image 中的显示效果。'
const chineseAuthor = '张三'

const englishTitle = 'This is an English Title Test'
const englishDescription = 'This is English description content for testing Inter font display in OG Image.'
const englishAuthor = 'John Doe'

// 根据当前语言设置页面 SEO 和 OG Image
const currentTitle = computed(() => 
  locale.value === 'zh-CN' ? chineseTitle : englishTitle
)
const currentDescription = computed(() => 
  locale.value === 'zh-CN' ? chineseDescription : englishDescription
)
const currentAuthor = computed(() => 
  locale.value === 'zh-CN' ? chineseAuthor : englishAuthor
)
const currentSiteName = computed(() => 
  locale.value === 'zh-CN' ? 'NuxtAir 测试' : 'NuxtAir Test'
)

// 页面元数据
useSeoMeta({
  title: () => `OG Image 测试页面 - ${currentTitle.value}`,
  description: () => currentDescription.value
})

// 定义 OG Image - 使用简单的测试组件
defineOgImage({
  component: 'OgImageTest',
  props: {
    title: currentTitle.value,
    description: currentDescription.value,
    author: currentAuthor.value,
    locale: locale.value
  }
})

// OG Image URLs for testing - 使用相对路径，支持多语言路径格式
const refreshKey = ref(0)
const currentOgImageUrl = computed(() => {
  const langPath = locale.value === 'zh-CN' ? '/zh-CN' : ''
  return `/__og-image__/image${langPath}/og-test/og.png?t=${refreshKey.value}`
})
const testOgImageUrl = computed(() => {
  const langPath = locale.value === 'zh-CN' ? '/zh-CN' : ''
  return `/__og-image__/image${langPath}/og-test/og.png?component=OgImageTest&title=${encodeURIComponent(currentTitle.value)}&description=${encodeURIComponent(currentDescription.value)}&author=${encodeURIComponent(currentAuthor.value)}&locale=${locale.value}`
})

const chineseOgImageUrl = computed(() => 
  `/__og-image__/image/zh-CN/og-test/og.png?component=OgImageTest&title=${encodeURIComponent(chineseTitle)}&description=${encodeURIComponent(chineseDescription)}&author=${encodeURIComponent(chineseAuthor)}&locale=zh-CN`
)
const englishOgImageUrl = computed(() => 
  `/__og-image__/image/og-test/og.png?component=OgImageTest&title=${encodeURIComponent(englishTitle)}&description=${encodeURIComponent(englishDescription)}&author=${encodeURIComponent(englishAuthor)}&locale=en-US`
)

// 语言切换功能
const switchToLocale = async (newLocale: 'zh-CN' | 'en-US') => {
  await setLocale(newLocale)
  // 可选：导航到对应语言的路径
  if (newLocale === 'zh-CN') {
    await router.push('/zh-CN/og-test')
  } else {
    await router.push('/og-test')
  }
}

// 刷新 OG Image
const refreshOgImage = () => {
  // 通过更新 refreshKey 来强制刷新图片
  refreshKey.value = Date.now()
  window.open(currentOgImageUrl.value, '_blank')
}
</script>

<style scoped>
/* 页面特定样式 */
</style>