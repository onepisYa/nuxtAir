<template>
    <div class="container mx-auto p-6 max-w-4xl">
      <!-- 语言切换区域 -->
      <div class="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">语言切换</h3>
          <div class="flex gap-2">
            <UButton 
               v-for="locale in locales" 
               :key="locale.code"
               @click="setLocale(locale.code)"
               :variant="locale.code === $i18n.locale ? 'solid' : 'outline'"
               :color="locale.code === $i18n.locale ? 'primary' : 'neutral'"
               size="sm"
               class="transition-all duration-200"
             >
              <template #leading>
                <UIcon 
                  :name="locale.code === 'zh-CN' ? 'i-twemoji-flag-china' : 'i-twemoji-flag-us-outlying-islands'" 
                  class="w-4 h-4"
                />
              </template>
              {{ locale.name }}
            </UButton>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <h1 class="text-xl font-medium text-gray-700 dark:text-gray-300">{{ $t('welcome') }}</h1>
          <h1 class="text-xl font-medium text-gray-700 dark:text-gray-300">{{ t('welcome') }}</h1>
              <!-- 数字格式化 -->
    <p>{{ $n(1234.56, 'currency') }}</p>
    <!-- 日期格式化 -->
    <p>{{ $d(new Date(), 'short') }}</p>

        </div>
      </div>

    <div class="space-y-6">
      <!-- 页面标题 -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Nuxt Air 功能测试页面
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          测试网络请求、配置管理和其他核心功能
        </p>
      </div>

      <!-- 配置信息展示 -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">当前配置信息</h2>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">网站名称</p>
            <p class="font-medium">{{ sitename }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">联系电话</p>
            <p class="font-medium">{{ phonenumber }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">API Base</p>
            <p class="font-medium">{{ runtimeConfig.apiBase }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">API Base URL</p>
            <p class="font-medium">{{ runtimeConfig.apiBaseUrl }}</p>
          </div>
        </div>
      </UCard>

      <!-- 网络测试 -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">网络请求测试</h2>
            <UButton 
              @click="runNetworkTests" 
              :loading="testing"
              color="primary"
            >
              {{ testing ? '测试中...' : '开始测试' }}
            </UButton>
          </div>
        </template>
        
        <div class="space-y-4">
          <div v-if="testResults" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              v-for="(result, method) in testResults" 
              :key="method"
              class="p-4 rounded-lg border"
              :class="result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'"
            >
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="result.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="result.success ? 'text-green-500' : 'text-red-500'"
                />
                <span class="font-medium uppercase">{{ method }}</span>
              </div>
              <p class="text-sm mt-1" :class="result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                {{ result.success ? '测试通过' : result.error }}
              </p>
            </div>
          </div>
          
          <div v-if="!testResults && !testing" class="text-center text-gray-500 dark:text-gray-400">
            点击上方按钮开始网络测试
          </div>
        </div>
      </UCard>

      <!-- useAlova 便捷方法测试 -->
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">useAlova 便捷方法测试</h2>
            <UButton 
               @click="runAlovaTests" 
               :loading="alovaMethodsTesting"
               color="success"
             >
              {{ alovaMethodsTesting ? '测试中...' : '测试便捷方法' }}
            </UButton>
          </div>
        </template>
        
        <div class="space-y-4">
          <div v-if="alovaMethodsResults" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              v-for="(result, method) in alovaMethodsResults" 
              :key="method"
              class="p-4 rounded-lg border"
              :class="result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'"
            >
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="result.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="result.success ? 'text-green-500' : 'text-red-500'"
                />
                <span class="font-medium uppercase">{{ method }}</span>
              </div>
              <p class="text-sm mt-1" :class="result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                {{ result.success ? '便捷方法测试通过' : result.error }}
              </p>
            </div>
          </div>
          
          <div v-if="!alovaMethodsResults && !alovaMethodsTesting" class="text-center text-gray-500 dark:text-gray-400">
            点击上方按钮测试 useAlova 便捷方法 (get, post, put, del)
          </div>
        </div>
      </UCard>

      <!-- HTML实体解码测试 -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">HTML实体解码测试</h2>
        </template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              输入包含HTML实体的文本：
            </label>
            <UTextarea 
              v-model="htmlEntityText" 
              placeholder="例如：&quot;Hello&quot; &amp; &lt;World&gt; &#8364;100"
              :rows="3"
            />
          </div>
          
          <div v-if="htmlEntityText">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">解码结果：</p>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="font-mono">{{ decodedText }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入测试相关的函数
import { runAllNetworkTests, testProjectApiConfig, runAlovaMethodsTests } from '~/composables/networkTest'

// 页面元数据
definePageMeta({
  title: '功能测试',
  description: 'Nuxt Air 项目功能测试页面'
})

const { locales, setLocale } = useI18n()
const { t, n, d } = useI18n()
// 获取配置信息
const runtimeConfig = useRuntimeConfig().public

const phonenumber = runtimeConfig.phonenumber
const sitename = runtimeConfig.sitename

// 网络测试相关
const testing = ref(false)
const testResults = ref<any>(null)

// useAlova 便捷方法测试相关
const alovaMethodsTesting = ref(false)
const alovaMethodsResults = ref<any>(null)

// HTML实体解码测试
const htmlEntityText = ref('&quot;Hello&quot; &amp; &lt;World&gt; &#8364;100 &copy;2024')
const decodedText = computed(() => {
  return htmlEntityText.value ? decodeHtmlEntities(htmlEntityText.value) : ''
})

// 运行网络测试
async function runNetworkTests() {
  testing.value = true
  testResults.value = null
  
  try {
    // 运行所有网络测试
    const results = await runAllNetworkTests()
    testResults.value = results
    
    // 测试项目API配置
    const configTest = await testProjectApiConfig()
    console.log('项目API配置测试结果:', configTest)
    
  } catch (error) {
    console.error('网络测试失败:', error)
  } finally {
    testing.value = false
  }
}

// 运行 useAlova 便捷方法测试
async function runAlovaTests() {
  alovaMethodsTesting.value = true
  alovaMethodsResults.value = null
  
  try {
    // 运行所有 useAlova 便捷方法测试
    const results = await runAlovaMethodsTests()
    alovaMethodsResults.value = results
    
  } catch (error) {
    console.error('useAlova 便捷方法测试失败:', error)
  } finally {
    alovaMethodsTesting.value = false
  }
}

// 页面加载时显示配置信息
onMounted(() => {
  console.log('当前运行时配置:', runtimeConfig)
})
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>