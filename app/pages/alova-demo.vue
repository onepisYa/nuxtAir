<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Alova 重构架构测试
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          测试重构后的 Alova 实例管理功能
        </p>
      </div>

      <div class="space-y-6">
        <!-- Main 实例测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Main 实例测试(根据 apiBase )代理发送请求 </h2>
              <UButton 
                @click="runMainInstanceTest" 
                :loading="mainInstanceTesting"
                color="primary"
              >
                {{ mainInstanceTesting ? '测试中...' : '测试 Main 实例' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="mainInstanceResults" class="p-4 rounded-lg border" :class="mainInstanceResults.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'">
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="mainInstanceResults.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="mainInstanceResults.success ? 'text-green-500' : 'text-red-500'"
                />
                <span class="font-medium">Main 实例</span>
              </div>
              <p class="text-sm mt-1" :class="mainInstanceResults.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                {{ mainInstanceResults.success ? 'Main 实例测试通过' : mainInstanceResults.error }}
              </p>
              <div v-if="mainInstanceResults.success && mainInstanceResults.data" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <div><strong>URL:</strong> {{ mainInstanceResults.data.url }}</div>
                  <div><strong>实例类型:</strong> {{ mainInstanceResults.data.instanceType }}</div>
                  <div><strong>响应数据:</strong> {{ JSON.stringify(mainInstanceResults.data.data).substring(0, 100) }}...</div>
                </div>
              </div>
            </div>
            
            <div v-if="!mainInstanceResults && !mainInstanceTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮测试 Main 实例功能
            </div>
          </div>
        </UCard>

        <!-- Test 实例测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Test 实例测试（/test-api 前缀）</h2>
              <UButton 
                @click="runTestInstanceTest" 
                :loading="testInstanceTesting"
                color="success"
              >
                {{ testInstanceTesting ? '测试中...' : '测试 Test 实例' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="testInstanceResults" class="p-4 rounded-lg border" :class="testInstanceResults.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'">
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="testInstanceResults.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="testInstanceResults.success ? 'text-green-500' : 'text-red-500'"
                />
                <span class="font-medium">Test 实例</span>
              </div>
              <p class="text-sm mt-1" :class="testInstanceResults.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                {{ testInstanceResults.success ? 'Test 实例测试通过' : testInstanceResults.error }}
              </p>
              <div v-if="testInstanceResults.success && testInstanceResults.data" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <div><strong>URL:</strong> {{ testInstanceResults.data.url }}</div>
                  <div><strong>实例类型:</strong> {{ testInstanceResults.data.instanceType }}</div>
                  <div><strong>响应数据:</strong> {{ JSON.stringify(testInstanceResults.data.data).substring(0, 100) }}...</div>
                </div>
              </div>
            </div>
            
            <div v-if="!testInstanceResults && !testInstanceTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮测试 Test 实例功能（使用 /test-api 前缀）
            </div>
          </div>
        </UCard>

        <!-- Raw 实例测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Raw 实例测试（直接 URL + /test-api 前缀）</h2>
              <UButton 
                @click="runRawInstanceTest" 
                :loading="rawInstanceTesting"
                color="secondary"
              >
                {{ rawInstanceTesting ? '测试中...' : '测试 Raw 实例' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="rawInstanceResults" class="space-y-3">
              <div 
                v-for="(result, testType) in rawInstanceResults" 
                :key="testType"
                class="p-4 rounded-lg border"
                :class="result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'"
              >
                <div class="flex items-center space-x-2">
                  <UIcon 
                    :name="result.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                    :class="result.success ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="font-medium">{{ result.name || testType }}</span>
                </div>
                <p class="text-sm mt-1" :class="result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                  {{ result.success ? 'Raw 实例测试通过' : result.error }}
                </p>
                <div v-if="result.success && result.data" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <div v-if="result.data.url"><strong>URL:</strong> {{ result.data.url }}</div>
                    <div v-if="result.data.instanceType"><strong>实例类型:</strong> {{ result.data.instanceType }}</div>
                    <div v-if="result.data.requestType"><strong>请求类型:</strong> {{ result.data.requestType }}</div>
                    <div v-if="result.data.format"><strong>格式:</strong> {{ result.data.format }}</div>
                    <div v-if="result.data.dataType"><strong>数据类型:</strong> {{ result.data.dataType }}</div>
                    <div v-if="result.data.count"><strong>数据数量:</strong> {{ result.data.count }}</div>
                    <div v-if="result.data.data"><strong>响应数据:</strong> {{ JSON.stringify(result.data.data).substring(0, 100) }}...</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="!rawInstanceResults && !rawInstanceTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮测试 Raw 实例功能（包括直接 URL 请求和 /test-api 前缀请求）
            </div>
          </div>
        </UCard>

        <!-- 便捷方法测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">便捷方法测试</h2>
              <UButton 
                @click="runConvenienceTests" 
                :loading="convenienceTesting"
                color="success"
              >
                {{ convenienceTesting ? '测试中...' : '测试便捷方法' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="convenienceResults" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                v-for="(result, index) in convenienceResults.results" 
                :key="index"
                class="p-4 rounded-lg border"
                :class="result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'"
              >
                <div class="flex items-center space-x-2">
                  <UIcon 
                    :name="result.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                    :class="result.success ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="font-medium uppercase">{{result.name}} </span>
                </div>
                <p class="text-sm mt-1" :class="result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                  {{ result.success ? '便捷方法测试通过' : result.error }}
                </p>
              </div>
            </div>
            
            <div v-if="!convenienceResults && !convenienceTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮测试便捷方法 (get, post, put, del)
            </div>
          </div>
        </UCard>

        <!-- 基础 API 测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">基础 API 测试</h2>
              <UButton 
                @click="runBasicApiTests" 
                :loading="basicApiTesting"
                color="primary"
              >
                {{ basicApiTesting ? '测试中...' : '测试基础 API' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="basicApiResults" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                v-for="(result, index) in basicApiResults.results" 
                :key="index"
                class="p-4 rounded-lg border"
                :class="result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'"
              >
                <div class="flex items-center space-x-2">
                  <UIcon 
                    :name="result.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                    :class="result.success ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="font-medium uppercase">{{ result.name}}</span>
                </div>
                <p class="text-sm mt-1" :class="result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                  {{ result.success ? 'API 测试通过' : result.error }}
                </p>
              </div>
            </div>
            
            <div v-if="!basicApiResults && !basicApiTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮测试基础 API 功能
            </div>
          </div>
        </UCard>

        <!-- 综合实例测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">综合实例测试</h2>
              <UButton 
                @click="runAllInstanceTests" 
                :loading="allInstanceTesting"
                color="secondary"
              >
                {{ allInstanceTesting ? '测试中...' : '测试所有实例' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="allInstanceResults" class="space-y-3">
              <div class="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">实例测试总结</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">总测试数：</span>
                    <span class="font-medium">{{ allInstanceResults.summary.total }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">通过：</span>
                    <span class="font-medium text-green-600">{{ allInstanceResults.summary.success }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">失败：</span>
                    <span class="font-medium text-red-600">{{ allInstanceResults.summary.failed }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">成功率：</span>
                    <span class="font-medium" :class="allInstanceResults.summary.successRate === 100 ? 'text-green-600' : 'text-yellow-600'">
                      {{ allInstanceResults.summary.successRate.toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div 
                v-for="(result, index) in allInstanceResults.results" 
                :key="index"
                class="p-4 rounded-lg border"
                :class="result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'"
              >
                <div class="flex items-center space-x-2">
                  <UIcon 
                    :name="result.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                    :class="result.success ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="font-medium">{{ result.name }}</span>
                  <span class="text-xs text-gray-500">({{ result.duration }}ms)</span>
                </div>
                <p class="text-sm mt-1" :class="result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                  {{ result.success ? '测试通过' : result.error }}
                </p>
              </div>
            </div>
            
            <div v-if="!allInstanceResults && !allInstanceTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮运行所有实例的综合测试
            </div>
          </div>
        </UCard>

        <!-- 缓存管理测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">缓存管理测试</h2>
              <div class="flex space-x-2">
                <UButton 
                  @click="runCacheTests" 
                  :loading="cacheTesting"
                  color="primary"
                >
                  {{ cacheTesting ? '测试中...' : '测试缓存' }}
                </UButton>
                <UButton 
                  @click="clearAllCaches" 
                  :loading="clearingCache"
                  color="primary"
                  variant="outline"
                >
                  {{ clearingCache ? '清除中...' : '清除缓存' }}
                </UButton>
              </div>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="cacheResults" class="space-y-3">
              <div 
                v-for="(result, test) in cacheResults" 
                :key="test"
                class="p-4 rounded-lg border"
                :class="result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'"
              >
                <div class="flex items-center space-x-2">
                  <UIcon 
                    :name="result.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                    :class="result.success ? 'text-green-500' : 'text-red-500'"
                  />
                  <span class="font-medium">{{ test }}</span>
                </div>
                <p class="text-sm mt-1" :class="result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                  {{ result.success ? result.message || '缓存测试通过' : result.error }}
                </p>
              </div>
            </div>
            
            <div v-if="!cacheResults && !cacheTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮测试缓存管理功能
            </div>
          </div>
        </UCard>

        <!-- 快速健康检查 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">快速健康检查</h2>
              <UButton 
                @click="runQuickHealthCheck" 
                :loading="healthCheckTesting"
                color="primary"
              >
                {{ healthCheckTesting ? '检查中...' : '快速检查' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="healthCheckResults" class="p-4 rounded-lg border" :class="healthCheckResults.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'">
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="healthCheckResults.success ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                  :class="healthCheckResults.success ? 'text-green-500' : 'text-red-500'"
                />
                <span class="font-medium">系统健康状态</span>
              </div>
              <p class="text-sm mt-1" :class="healthCheckResults.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                {{ healthCheckResults.success ? healthCheckResults.message : healthCheckResults.error }}
              </p>
              <div v-if="healthCheckResults.details" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <pre>{{ JSON.stringify(healthCheckResults.details, null, 2) }}</pre>
              </div>
            </div>
            
            <div v-if="!healthCheckResults && !healthCheckTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮进行快速健康检查
            </div>
          </div>
        </UCard>

        <!-- 综合测试 -->
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">综合测试</h2>
              <UButton 
                @click="runAllTests" 
                :loading="allTesting"
                color="primary"
                size="lg"
              >
                {{ allTesting ? '全面测试中...' : '运行所有测试' }}
              </UButton>
            </div>
          </template>
          
          <div class="space-y-4">
            <div v-if="allTestsResults" class="space-y-3">
              <div class="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">测试总结</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">总测试数：</span>
                    <span class="font-medium">{{ allTestsResults.total }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">通过：</span>
                    <span class="font-medium text-green-600">{{ allTestsResults.passed }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">失败：</span>
                    <span class="font-medium text-red-600">{{ allTestsResults.failed }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600 dark:text-gray-400">成功率：</span>
                    <span class="font-medium" :class="allTestsResults.successRate === 100 ? 'text-green-600' : 'text-yellow-600'">
                      {{ allTestsResults.successRate }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="!allTestsResults && !allTesting" class="text-center text-gray-500 dark:text-gray-400">
              点击上方按钮运行所有测试项目
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入重构后的 Alova 测试相关函数
import { 
  runAllTests as newRunAllTests,
  runBasicApiTests as newRunBasicApiTests,
  runConvenienceMethodsTests as newRunConvenienceMethodsTests,
  runInstanceTests as newRunInstanceTests,
  quickHealthCheck as newQuickHealthCheck,
  testMainInstance,
  testTestInstance,
  testRawInstanceDirect,
  testRawInstanceProxy,
  testJsonPlaceholderFormat,
  testCaching
} from '~/composables/alova/testing'

import {
  createMainInstance,
  createRawInstance,
  createTestInstance,
  clearAllCachedInstances,
  mainMethods,
  rawMethods
} from '~/composables/alova'

// 页面元数据
definePageMeta({
  title: 'Alova 重构测试',
  description: 'Alova 实例管理重构功能测试页面'
})



// 三种实例独立测试相关
const mainInstanceTesting = ref(false)
const mainInstanceResults = ref<any>(null)
const testInstanceTesting = ref(false)
const testInstanceResults = ref<any>(null)
const rawInstanceTesting = ref(false)
const rawInstanceResults = ref<any>(null)

// 便捷方法测试相关
const convenienceTesting = ref(false)
const convenienceResults = ref<any>(null)

// 基础 API 测试相关
const basicApiTesting = ref(false)
const basicApiResults = ref<any>(null)

// 综合实例测试相关
const allInstanceTesting = ref(false)
const allInstanceResults = ref<any>(null)

// 缓存管理测试相关
const cacheTesting = ref(false)
const cacheResults = ref<any>(null)
const clearingCache = ref(false)

// 快速健康检查相关
const healthCheckTesting = ref(false)
const healthCheckResults = ref<any>(null)

// 综合测试相关
const allTesting = ref(false)
const allTestsResults = ref<any>(null)

/**
 * 测试 Main 实例
 */
async function runMainInstanceTest() {
  mainInstanceTesting.value = true
  mainInstanceResults.value = null
  
  try {
    const result = await testMainInstance()
    mainInstanceResults.value = result
  } catch (error) {
    console.error('Main 实例测试失败:', error)
    mainInstanceResults.value = {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  } finally {
    mainInstanceTesting.value = false
  }
}

/**
 * 测试 Test 实例
 */
async function runTestInstanceTest() {
  testInstanceTesting.value = true
  testInstanceResults.value = null
  
  try {
    const result = await testTestInstance()
    testInstanceResults.value = result
  } catch (error) {
    console.error('Test 实例测试失败:', error)
    testInstanceResults.value = {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  } finally {
    testInstanceTesting.value = false
  }
}

/**
 * 测试 Raw 实例
 */
async function runRawInstanceTest() {
  rawInstanceTesting.value = true
  rawInstanceResults.value = null
  
  try {
    const results: any = {}
    
    // 测试直接 URL 请求
    const directResult = await testRawInstanceDirect()
    results.direct = directResult
    
    // 测试代理请求
    const proxyResult = await testRawInstanceProxy()
    results.proxy = proxyResult
    
    // 测试 JSONPlaceholder 格式处理
    const formatResult = await testJsonPlaceholderFormat()
    results.format = formatResult
    
    rawInstanceResults.value = results
  } catch (error) {
    console.error('Raw 实例测试失败:', error)
    rawInstanceResults.value = {
      error: {
        success: false,
        title: 'Raw 实例测试',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  } finally {
    rawInstanceTesting.value = false
  }
}

/**
 * 测试便捷方法
 */
async function runConvenienceTests() {
  convenienceTesting.value = true
  convenienceResults.value = null
  
  try {
    const results = await newRunConvenienceMethodsTests()
    convenienceResults.value = results
    
  } catch (error) {
    console.error('便捷方法测试失败:', error)
  } finally {
    convenienceTesting.value = false
  }
}

/**
 * 测试基础 API
 */
async function runBasicApiTests() {
  basicApiTesting.value = true
  basicApiResults.value = null
  
  try {
    const results = await newRunBasicApiTests()
    basicApiResults.value = results
    
  } catch (error) {
    console.error('基础 API 测试失败:', error)
  } finally {
    basicApiTesting.value = false
  }
}

/**
 * 测试所有实例
 */
async function runAllInstanceTests() {
  allInstanceTesting.value = true
  allInstanceResults.value = null
  
  try {
    const results = await newRunInstanceTests()
    allInstanceResults.value = results
    
    console.log('所有实例测试完成:', results)
    
  } catch (error) {
    console.error('综合实例测试失败:', error)
    allInstanceResults.value = {
      results: [],
      summary: {
        total: 0,
        success: 0,
        failed: 1,
        successRate: 0
      }
    }
  } finally {
    allInstanceTesting.value = false
  }
}

/**
 * 测试缓存管理
 */
async function runCacheTests() {
  cacheTesting.value = true
  cacheResults.value = null
  
  try {
    // 使用真正的 Alova 缓存测试
    const result = await testCaching()
    
    if (result.success && result.data?.testResults) {
      // 将详细的测试步骤作为单独的测试结果显示
      const testResults = result.data.testResults.map((step: any) => ({
        name: step.step,
        success: step.success,
        message: step.message,
        data: step
      }))
      
      // 添加总结信息
      testResults.push({
        name: '缓存测试总结',
        success: result.data.allTestsPassed,
        message: `测试完成: ${result.data.successRate} 项通过，首次请求: ${result.data.firstRequestTime}ms，缓存请求: ${result.data.secondRequestTime}ms`,
        data: {
          summary: true,
          ...result.data
        }
      })
      
      // 转换为对象格式以匹配模板
      const results: any = {}
      testResults.forEach((test: any, index: number) => {
        results[`test_${index}`] = {
          success: test.success,
          message: test.message,
          name: test.name
        }
      })
      
      cacheResults.value = results
    } else {
      // 测试失败的情况
      cacheResults.value = {
        cacheTest: {
          success: false,
          message: (result as any).message || '缓存测试失败'
        }
      }
    }
  } catch (error) {
    console.error('缓存管理测试失败:', error)
    cacheResults.value = {
      cacheTestError: {
        success: false,
        error: `测试执行失败: ${(error as Error).message}`
      }
    }
  } finally {
    cacheTesting.value = false
  }
}

/**
 * 清除所有缓存
 */
async function clearAllCaches() {
  clearingCache.value = true
  
  try {
    clearAllCachedInstances()
    console.log('所有缓存已清除')
    
    // 重置测试结果
    mainInstanceResults.value = null
    testInstanceResults.value = null
    rawInstanceResults.value = null
    convenienceResults.value = null
    basicApiResults.value = null
    allInstanceResults.value = null
    cacheResults.value = null
    healthCheckResults.value = null
    allTestsResults.value = null
    
  } catch (error) {
    console.error('清除缓存失败:', error)
  } finally {
    clearingCache.value = false
  }
}

/**
 * 快速健康检查
 */
async function runQuickHealthCheck() {
  healthCheckTesting.value = true
  healthCheckResults.value = null
  
  try {
    const result = await newQuickHealthCheck()
    healthCheckResults.value = result
    
  } catch (error) {
    console.error('快速健康检查失败:', error)
    healthCheckResults.value = {
      success: false,
      error: error instanceof Error ? error.message : '健康检查失败'
    }
  } finally {
    healthCheckTesting.value = false
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  allTesting.value = true
  allTestsResults.value = null
  
  try {
    // 运行新架构的所有测试
    const results = await newRunAllTests()

    // 直接使用 newRunAllTests 返回的 overall 统计数据
    // newRunAllTests 返回的结构: { basicApi: {results: []}, convenienceMethods: {results: []}, overall: {} }
    const { total, success, failed, successRate } = results.overall
    
    allTestsResults.value = {
      results,
      total,
      passed: success,
      failed,
      successRate: Math.round(successRate)
    }
    
    console.log('所有测试完成:', allTestsResults.value)
    
  } catch (error) {
    console.error('综合测试失败:', error)
    allTestsResults.value = {
      results: {},
      total: 0,
      passed: 0,
      failed: 1,
      successRate: 0
    }
  } finally {
    allTesting.value = false
  }
}

// 页面加载时显示信息
onMounted(() => {
  console.log('Alova 重构架构测试页面已加载')
  console.log('可用的测试功能:')
  console.log('- 实例管理测试')
  console.log('- 便捷方法测试')
  console.log('- 基础 API 测试')
  console.log('- URL 请求方式测试')
  console.log('- 缓存管理测试')
  console.log('- 快速健康检查')
  console.log('- 综合测试')
})
</script>

<style scoped>
/* 自定义样式 */
pre {
  font-size: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}
</style>