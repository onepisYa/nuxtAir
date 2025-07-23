<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-foreground">Alova 配置调试测试页面</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 服务前缀测试 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-foreground">服务前缀测试</h2>
        <button 
          @click="testServicePrefixes" 
          class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 mb-4"
        >
          获取服务前缀
        </button>
        <pre v-if="servicePrefixes" class="bg-muted p-3 rounded text-sm overflow-auto text-muted-foreground">{{ JSON.stringify(servicePrefixes, null, 2) }}</pre>
      </div>
      
      <!-- 环境配置测试 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-foreground">环境配置测试</h2>
        <button 
          @click="testEnvironmentConfig" 
          class="bg-success text-white px-4 py-2 rounded hover:bg-success/90 mb-4"
        >
          获取环境配置
        </button>
        <pre v-if="environmentConfig" class="bg-muted p-3 rounded text-sm overflow-auto text-muted-foreground">{{ JSON.stringify(environmentConfig, null, 2) }}</pre>
      </div>
      
      <!-- BaseURL 测试 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-foreground">BaseURL 测试</h2>
        <div class="space-y-2">
          <button 
            @click="testMainBaseURL" 
            class="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 mr-2"
          >
            主实例 BaseURL
          </button>
          <button 
            @click="testTestBaseURL" 
            class="bg-warning text-black px-4 py-2 rounded hover:bg-warning/90"
          >
            测试实例 BaseURL
          </button>
        </div>
        <pre v-if="baseURLs" class="bg-muted p-3 rounded text-sm overflow-auto mt-4 text-muted-foreground">{{ JSON.stringify(baseURLs, null, 2) }}</pre>
      </div>
      
      <!-- 常量测试 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-foreground">预定义常量</h2>
        <button 
          @click="showConstants" 
          class="bg-info text-white px-4 py-2 rounded hover:bg-info/90 mb-4"
        >
          显示常量
        </button>
        <pre v-if="constants" class="bg-muted p-3 rounded text-sm overflow-auto text-muted-foreground font-mono">{{ JSON.stringify(constants, null, 2) }}</pre>
      </div>
    </div>
    
    <!-- 控制台提示 -->
    <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-yellow-800 mb-2">📝 调试提示</h3>
      <p class="text-yellow-700">
        请打开浏览器开发者工具的控制台（Console）查看详细的配置调试信息。
        每次点击按钮时，都会在控制台输出相应的配置数据。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  getServicePrefixes, 
  useServicePrefixes, 
  getEnvironmentConfig,
  getMainInstanceBaseURL,
  getTestInstanceBaseURL,
  DEFAULT_SERVICE_PREFIXES,
  DEFAULT_API_BASES
} from '~/composables/alova/config'

// 响应式数据
const servicePrefixes = ref<any>(null)
const environmentConfig = ref<any>(null)
const baseURLs = ref<any>(null)
const constants = ref<any>(null)

// 测试服务前缀
function testServicePrefixes() {
  console.log('=== 开始测试服务前缀 ===')
  
  // 测试智能获取服务前缀
  const smartPrefixes = getServicePrefixes()
  console.log('智能获取服务前缀结果:', smartPrefixes)
  
  // 测试 Hook 方式获取服务前缀
  const hookPrefixes = useServicePrefixes()
  console.log('Hook 方式获取服务前缀结果:', hookPrefixes)
  
  servicePrefixes.value = {
    smart: smartPrefixes,
    hook: hookPrefixes
  }
  
  console.log('=== 服务前缀测试完成 ===')
}

// 测试环境配置
function testEnvironmentConfig() {
  console.log('=== 开始测试环境配置 ===')
  
  const config = getEnvironmentConfig()
  console.log('环境配置结果:', config)
  
  environmentConfig.value = config
  
  console.log('=== 环境配置测试完成 ===')
}

// 测试主实例 BaseURL
function testMainBaseURL() {
  console.log('=== 开始测试主实例 BaseURL ===')
  
  const mainURL = getMainInstanceBaseURL()
  console.log('主实例 BaseURL:', mainURL)
  
  baseURLs.value = {
    ...baseURLs.value,
    main: mainURL
  }
  
  console.log('=== 主实例 BaseURL 测试完成 ===')
}

// 测试测试实例 BaseURL
function testTestBaseURL() {
  console.log('=== 开始测试测试实例 BaseURL ===')
  
  const testURL = getTestInstanceBaseURL()
  const customURL = getTestInstanceBaseURL('https://custom-api.example.com')
  
  console.log('默认测试实例 BaseURL:', testURL)
  console.log('自定义测试实例 BaseURL:', customURL)
  
  baseURLs.value = {
    ...baseURLs.value,
    test: testURL,
    custom: customURL
  }
  
  console.log('=== 测试实例 BaseURL 测试完成 ===')
}

// 显示预定义常量
function showConstants() {
  console.log('=== 预定义常量 ===')
  console.log('DEFAULT_SERVICE_PREFIXES:', DEFAULT_SERVICE_PREFIXES)
  console.log('DEFAULT_API_BASES:', DEFAULT_API_BASES)
  
  constants.value = {
    servicePrefixes: DEFAULT_SERVICE_PREFIXES,
    apiBases: DEFAULT_API_BASES
  }
  
  console.log('=== 常量显示完成 ===')
}

// 页面标题
useHead({
  title: 'Alova 配置调试测试'
})
</script>

<style scoped>
/* 自定义样式 */
.container {
  max-width: 1200px;
}

pre {
  max-height: 300px;
  font-size: 12px;
}

button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>