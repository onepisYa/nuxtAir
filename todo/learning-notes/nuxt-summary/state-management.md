# Nuxt v4 状态管理完整指南

> 📚 **参考文档**
> - [Nuxt 4 状态管理官方文档](https://nuxt.com/docs/4.x/getting-started/state-management#best-practices) <mcreference link="https://nuxt.com/docs/getting-started/state-management" index="1">1</mcreference>
> - [Pinia SSR Nuxt 集成指南](https://pinia.vuejs.org/ssr/nuxt.html) <mcreference link="https://pinia.vuejs.org/ssr/nuxt.html" index="2">2</mcreference>
> - [useState API 详细文档](https://nuxt.com/docs/4.x/api/composables/use-state) <mcreference link="https://nuxt.com/docs/4.x/api/composables/use-state" index="3">3</mcreference>

## 🎯 核心工具：`useState` 组合式API

### 基本概念
- **功能**：创建响应式、支持SSR（服务器端渲染）的共享状态，是`ref`的SSR友好替代方案 <mcreference link="https://nuxt.com/docs/getting-started/state-management" index="1">1</mcreference>
- **特性**：其值在SSR后（客户端 hydration 阶段）会被保留，通过唯一键在所有组件间共享
- **限制**：内部数据需可序列化为JSON，不能包含类、函数、符号等不可序列化内容 <mcreference link="https://nuxt.com/docs/4.x/api/composables/use-state" index="3">3</mcreference>

### 语法格式
```typescript
// 基本用法
const state = useState<T>(key: string, init?: () => T | Ref<T>)

// 示例
const count = useState('counter', () => Math.round(Math.random() * 100))
```

### 自动键生成
如果不提供键值，Nuxt会根据文件和行号自动生成唯一键 <mcreference link="https://nuxt.com/docs/4.x/api/composables/use-state" index="3">3</mcreference>：
```typescript
// 自动生成键值
const count = useState(() => 0) // 键值基于文件位置自动生成
```

## ⚠️ 最佳实践与安全规范

### 🚫 避免的错误做法
```typescript
// ❌ 错误：在模块作用域定义状态
export const myState = ref({})

// ❌ 错误：在 setup 外部定义状态
const globalState = ref('danger')
```
**风险**：会导致服务器上请求共享状态，可能引发内存泄漏和安全问题 <mcreference link="https://nuxt.com/docs/getting-started/state-management" index="1">1</mcreference>

### ✅ 正确的做法
```typescript
// ✅ 正确：使用 composable 封装状态
export const useMyState = () => useState('myState', () => ({}))

// ✅ 正确：在组件中使用
const myState = useMyState()
```


## 💡 实用示例与技巧

### 1. 基本状态管理
```typescript
// composables/useCounter.ts
export const useCounter = () => {
  const count = useState<number>('counter', () => 0)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = 0
  
  return {
    count: readonly(count), // 只读访问
    increment,
    decrement,
    reset
  }
}
```

### 2. 用户偏好管理
```typescript
// composables/useTheme.ts
export const useTheme = () => {
  const isDark = useState<boolean>('theme.dark', () => false)
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    // 同步到 DOM
    if (process.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }
  
  return { isDark, toggleTheme }
}
```

### 3. 异步状态初始化 <mcreference link="https://nuxt.com/docs/getting-started/state-management" index="4">4</mcreference>
```typescript
// app.vue 或页面组件中
<script setup>
const websiteConfig = useState('config')

// 类似 Nuxt 2 的 nuxtServerInit
await callOnce(async () => {
  websiteConfig.value = await $fetch('https://my-cms.com/api/website-config')
})
</script>
```

### 4. 浅层响应式优化
对于大型对象，可以使用 `shallowRef` 优化性能 <mcreference link="https://nuxt.com/docs/4.x/api/composables/use-state" index="3">3</mcreference>：
```typescript
const state = useState('my-shallow-state', () => 
  shallowRef({ deep: 'not reactive' })
)
// isShallow(state) === true
```


## 🚀 高级用法与模式

### 1. 国际化状态管理
```typescript
// composables/useLocale.ts
export const useLocale = () => {
  const locale = useState<string>('locale', () => {
    // 服务端：从请求头获取
    if (process.server) {
      const event = useRequestEvent()
      return event?.node.req.headers['accept-language']?.split(',')[0] || 'en'
    }
    // 客户端：从浏览器获取
    return navigator.language || 'en'
  })
  
  const setLocale = (newLocale: string) => {
    locale.value = newLocale
  }
  
  return { locale, setLocale }
}

// composables/useDateFormat.ts
export const useDateFormat = () => {
  const { locale } = useLocale()
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale.value).format(date)
  }
  
  return { formatDate }
}
```

### 2. 购物车状态管理 <mcreference link="https://sri-ram-kumar.medium.com/unlocking-the-power-of-nuxt-advanced-state-management-strategies-af30423ecb99" index="5">5</mcreference>
```typescript
// composables/useCart.ts
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export const useCart = () => {
  const items = useState<CartItem[]>('cart.items', () => [])
  
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existingItem = items.value.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
  }
  
  const removeItem = (id: string) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) items.value.splice(index, 1)
  }
  
  const total = computed(() => 
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  
  const itemCount = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  return {
    items: readonly(items),
    addItem,
    removeItem,
    total,
    itemCount
  }
}
```

### 3. 全局加载状态
```typescript
// composables/useLoading.ts
export const useLoading = () => {
  const isLoading = useState<boolean>('app.loading', () => false)
  const loadingMessage = useState<string>('app.loadingMessage', () => '')
  
  const startLoading = (message = '加载中...') => {
    isLoading.value = true
    loadingMessage.value = message
  }
  
  const stopLoading = () => {
    isLoading.value = false
    loadingMessage.value = ''
  }
  
  return {
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    startLoading,
    stopLoading
  }
}
```

## 🎨 共享状态最佳实践

### 类型安全的全局状态 <mcreference link="https://nuxt.com/docs/getting-started/state-management" index="1">1</mcreference>
```typescript
// composables/useColor.ts
export const useColor = () => useState<string>('color', () => 'pink')

// 在组件中使用
<script setup>
const color = useColor() // 自动类型推断
</script>

<template>
  <p :style="{ color }">当前颜色: {{ color }}</p>
</template>
```

### 状态持久化模式
```typescript
// composables/usePersistedState.ts
export const usePersistedState = <T>(key: string, defaultValue: T) => {
  const state = useState<T>(key, () => defaultValue)
  
  // 客户端持久化到 localStorage
  if (process.client) {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        state.value = JSON.parse(stored)
      } catch (e) {
        console.warn(`Failed to parse stored state for key: ${key}`)
      }
    }
    
    // 监听变化并保存
    watch(state, (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    }, { deep: true })
  }
  
  return state
}
```


## 🔧 第三方库支持

Nuxt不强制指定状态管理方案，支持多种主流库 <mcreference link="https://nuxt.com/docs/getting-started/state-management" index="1">1</mcreference>：

### 推荐方案
- **Pinia**（Vue官方推荐）- 现代化状态管理，完美支持TypeScript
- **Harlem** - 不可变全局状态管理
- **XState** - 状态机方案，支持可视化和测试
- **Zustand** - 轻量级状态管理

### 从Nuxt 2迁移
原依赖Vuex的项目可以：
1. 迁移到Pinia（推荐）
2. 继续使用Vuex 4
3. 逐步迁移到`useState`


---

# 🍍 Pinia 状态管理完整指南

## 🚀 快速开始

### 安装配置 <mcreference link="https://pinia.vuejs.org/ssr/nuxt.html" index="2">2</mcreference>
```bash
# 推荐方式：使用 Nuxt 模块
npx nuxi@latest module add pinia

# 手动安装（如果自动安装失败）
npm install pinia @pinia/nuxt
```

### 基础配置
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'], // 自定义store路径
  },
})
```

### 解决依赖冲突
如遇到npm依赖错误，在`package.json`中添加：
```json
{
  "overrides": {
    "vue": "latest"
  }
}
```

## 📦 Store 定义与使用

### 1. 基础 Store 定义
```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  
  // 操作
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      user.value = response.user
      return response
    } catch (error) {
      throw error
    }
  }
  
  const logout = () => {
    user.value = null
    return navigateTo('/login')
  }
  
  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout
  }
})
```

### 2. 在组件中使用 <mcreference link="https://pinia.vuejs.org/core-concepts/" index="3">3</mcreference>
```vue
<script setup>
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// ✅ 正确：使用 storeToRefs 保持响应性
const { user, isLoggedIn } = storeToRefs(userStore)

// ✅ 正确：直接解构 actions
const { login, logout } = userStore

// ❌ 错误：直接解构会失去响应性
// const { user, isLoggedIn } = userStore
</script>
```

## ⚡ 高级技巧与最佳实践

### 1. 异步数据初始化 <mcreference link="https://nuxt.com/docs/getting-started/state-management" index="4">4</mcreference>
```typescript
// 在页面或 app.vue 中
<script setup>
const userStore = useUserStore()

// 避免重复请求
await callOnce('user-init', async () => {
  await userStore.fetchUserProfile()
})

// 支持导航模式
await callOnce('user-data', () => userStore.fetchUserData(), {
  mode: 'navigation' // 类似 useFetch 的行为
})
</script>
```

### 2. 持久化存储
```typescript
// stores/settings.ts
export const useSettingsStore = defineStore('settings', () => {
  const theme = ref('light')
  const language = ref('zh-CN')
  
  return {
    theme,
    language
  }
}, {
  persist: true // 启用持久化
})
```

### 3. Store 组合与模块化
```typescript
// stores/app.ts - 组合多个 stores
export const useAppStore = defineStore('app', () => {
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()
  
  const isReady = computed(() => {
    return userStore.isLoggedIn && settingsStore.theme
  })
  
  const initialize = async () => {
    await Promise.all([
      userStore.fetchUserProfile(),
      settingsStore.loadSettings()
    ])
  }
  
  return {
    isReady,
    initialize
  }
})
```

### 4. 类型安全的 Store
```typescript
// types/store.ts
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

// stores/user.ts
export const useUserStore = defineStore('user', (): UserState & {
  // actions
  fetchUser: () => Promise<void>
  clearError: () => void
} => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const fetchUser = async () => {
    loading.value = true
    error.value = null
    try {
      user.value = await $fetch<User>('/api/user')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户信息失败'
    } finally {
      loading.value = false
    }
  }
  
  const clearError = () => {
    error.value = null
  }
  
  return {
    user,
    loading,
    error,
    fetchUser,
    clearError
  }
})
```

## 🔧 自动导入配置 <mcreference link="https://pinia.vuejs.org/ssr/nuxt.html" index="1">1</mcreference>

### 默认自动导入
- `usePinia()` - 获取 Pinia 实例
- `defineStore()` - 定义 Store
- `storeToRefs()` - 保持响应性的解构
- `acceptHMRUpdate()` - 热更新支持
- `stores/` 目录下的所有 Store（不包括嵌套目录）

### 自定义 Store 目录 <mcreference link="https://stackoverflow.com/questions/75862614/how-to-auto-import-pinia-stores-in-nuxt" index="2">2</mcreference>
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  pinia: {
    storesDirs: [
      './stores/**',           // 默认目录
      './modules/*/stores/**', // 模块化目录
      './features/*/store/**'  // 功能模块目录
    ]
  }
})
```

## 🛠️ SSR 注意事项 <mcreference link="https://pinia.vuejs.org/ssr/" index="1">1</mcreference>

### 在非组件上下文中使用
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // ❌ 错误：在中间件中直接使用
  // const userStore = useUserStore()
  
  // ✅ 正确：传递 pinia 实例
  const { $pinia } = useNuxtApp()
  const userStore = useUserStore($pinia)
  
  if (!userStore.isLoggedIn) {
    return navigateTo('/login')
  }
})
```

### Composables 集成 <mcreference link="https://pinia.vuejs.org/cookbook/composables.html" index="3">3</mcreference>
```typescript
// stores/media.ts
import { useMediaControls } from '@vueuse/core'

export const useMediaStore = defineStore('media', () => {
  const videoElement = ref<HTMLVideoElement>()
  const src = ref('/video.mp4')
  
  const { playing, volume, currentTime } = useMediaControls(videoElement, { src })
  
  return {
    videoElement,
    src,
    playing,
    volume,
    currentTime
  }
})
```

## 📱 Nuxt 2 支持 <mcreference link="https://pinia.vuejs.org/ssr/nuxt.html" index="2">2</mcreference>

### 安装依赖
```bash
yarn add pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
# 或
npm install pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
```

### 配置
```javascript
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt'
  ],
  // 与 Vuex 共存
  pinia: {
    disableVuex: false
  }
}
```

### TypeScript 支持
 ```json
 // tsconfig.json
 {
   "compilerOptions": {
     "types": ["@pinia/nuxt"]
   }
 }
 ```

---

## 🎯 实用技巧总结

### useState vs Pinia 选择指南

| 场景 | 推荐方案 | 理由 |
|------|----------|------|
| 简单全局状态 | `useState` | 轻量级，SSR友好 |
| 复杂业务逻辑 | `Pinia` | 更好的组织结构，类型安全 |
| 用户认证状态 | `Pinia` | 需要复杂的状态管理和持久化 |
| 主题/语言设置 | `useState` | 简单的键值对状态 |
| 购物车功能 | `Pinia` | 复杂的状态操作和计算属性 |
| 临时UI状态 | `useState` | 组件间简单共享 |

### 性能优化技巧

1. **合理使用 `readonly`**
   ```typescript
   // 防止意外修改
   return {
     user: readonly(user),
     settings: readonly(settings)
   }
   ```

2. **使用 `shallowRef` 优化大对象**
   ```typescript
   const largeData = useState('data', () => shallowRef(bigObject))
   ```

3. **按需加载 Store**
   ```typescript
   // 动态导入大型 Store
   const loadUserStore = () => import('~/stores/user')
   ```

4. **避免在 computed 中进行重计算**
   ```typescript
   // ❌ 避免
   const expensiveComputed = computed(() => heavyCalculation(data.value))
   
   // ✅ 推荐：缓存结果
   const cachedResult = useState('cached', () => null)
   watch(data, (newData) => {
     cachedResult.value = heavyCalculation(newData)
   })
   ```

### 调试技巧

1. **开发工具集成**
   ```typescript
   // stores/user.ts
   export const useUserStore = defineStore('user', () => {
     // ... store logic
   }, {
     // 启用 Vue DevTools 支持
     devtools: true
   })
   ```

2. **状态日志记录**
   ```typescript
   // 开发环境下的状态变化日志
   if (process.dev) {
     watch(user, (newUser, oldUser) => {
       console.log('User state changed:', { old: oldUser, new: newUser })
     }, { deep: true })
   }
   ```

3. **错误边界处理**
   ```typescript
   const handleStoreError = (error: Error, storeName: string) => {
     console.error(`Store ${storeName} error:`, error)
     // 发送错误报告
     if (process.client) {
       // 错误上报逻辑
     }
   }
   ```

## 📚 相关资源

### 官方文档
- [Nuxt 状态管理指南](https://nuxt.com/docs/getting-started/state-management)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### 实用工具
- [VueUse](https://vueuse.org/) - 实用的 Composition API 工具集
- [Pinia Plugin Persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) - 状态持久化插件
- [Pinia Colada](https://github.com/posva/pinia-colada) - 数据获取和缓存

### 社区资源
- [Nuxt Examples](https://github.com/nuxt/examples) - 官方示例集合
- [Awesome Nuxt](https://github.com/nuxt-community/awesome-nuxt) - 精选资源列表
- [Pinia Examples](https://github.com/piniajs/example-vue-3-vite) - Pinia 示例项目

---

> 💡 **提示**: 本文档基于 Nuxt 4 和 Pinia 最新版本编写，建议结合实际项目需求选择合适的状态管理方案。对于大型应用，推荐使用 Pinia；对于简单状态共享，`useState` 已经足够。