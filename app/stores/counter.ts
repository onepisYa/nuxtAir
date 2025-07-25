import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref<number>(0)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  const isPositive = computed(() => count.value > 0)
  
  // 基本操作
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = 0
    error.value = null
  }
  
  const clearError = () => {
    error.value = null
  }
  
  const setCount = (value: number) => {
    count.value = value
  }
  
  const incrementBy = (amount: number) => {
    count.value += amount
  }
  
  // 异步操作 - 模拟从 API 获取数据
  const fetchAndSetCount = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 使用 JSONPlaceholder API 获取数据
      const response = await $fetch<{ id: number }>('/test-api/posts/1')
      count.value = response.id
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取数据失败'
      console.error('Failed to fetch count:', err)
    } finally {
      loading.value = false
    }
  }
  
  // 获取随机用户数量作为计数值
  const fetchRandomUserCount = async () => {
    loading.value = true
    error.value = null
    
    try {
      const users = await $fetch<Array<{ id: number }>>('/test-api/users')
      count.value = users.length
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户数据失败'
      console.error('Failed to fetch users:', err)
    } finally {
      loading.value = false
    }
  }
  
  return {
    // 状态
    count,
    loading,
    error,
    
    // 计算属性
    doubleCount,
    isEven,
    isPositive,
    
    // 操作
    increment,
    decrement,
    reset,
    clearError,
    setCount,
    incrementBy,
    fetchAndSetCount,
    fetchRandomUserCount
  }
}, {
  persist: {
    key: 'counter-store',
    pick: ['count'], // 只持久化 count 值
    // 因为在服务端所以实际上是存储在 cookie 中的
    // storage: piniaPluginPersistedstate.sessionStorage(),
    // localStorage 和 sessionStorage 存储仅仅在客户端有效
  }
})