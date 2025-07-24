# Nuxt.js 国际化 (i18n) 实施指南

## 概述

本项目使用 `@nuxtjs/i18n` 模块实现国际化功能。默认语言为英文 (en-US)，支持中文 (zh-CN) 作为扩展语言。项目采用最小化配置策略，主要维护英文语言包，中文仅用于测试和未来扩展。

## 配置文件说明

### 1. langDir 配置详解

**重要说明**：`langDir` 是相对于 `restructureDir` 的路径，而 `restructureDir` 的默认值是 `'i18n'`。

- `restructureDir`: 默认值为 `'i18n'`，用于配置解析 i18n 文件的目录
- `langDir`: 默认值为 `'locales'`，相对于 `restructureDir` 的路径

**配置示例**：
- ✅ 默认配置：`langDir: 'locales'` （查找 `<rootDir>/i18n/locales/`）
- ✅ 自定义配置：`langDir: 'lang'` （查找 `<rootDir>/i18n/lang/`）
- ❌ 绝对路径：`langDir: '/locales'` （生产环境会失败）

参考文档：
- [restructureDir 配置](https://i18n.nuxtjs.org/docs/api/options#restructuredir)
- [langDir 配置](https://i18n.nuxtjs.org/docs/api/options#langdir)

**实际路径解析**：
- 最终语言文件路径 = `<rootDir>/<restructureDir>/<langDir>/`
- 默认情况下 = `<rootDir>/i18n/locales/`
- 如果设置 `restructureDir: 'translations'` 和 `langDir: 'files'`，则为 `<rootDir>/translations/files/`

### 2. 配置文件架构

项目采用双配置文件架构：

#### nuxt.config.ts - 构建时配置
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    // 路由策略配置
    strategy: 'prefix_except_default', // 参考：https://i18n.nuxtjs.org/docs/api/options#strategy
    
    // 语言配置
    locales: [ // 参考：https://i18n.nuxtjs.org/docs/api/options#locales
      {
        code: 'en-US',
        iso: 'en-US', 
        name: 'English',
        dir: 'ltr',
        file: 'en-US.json'
      },
      // 生产环境可注释掉中文配置
      {
        code: 'zh-CN',
        iso: 'zh-CN',
        name: '简体中文', 
        dir: 'ltr',
        file: 'zh-CN.json'
      }
    ],
    defaultLocale: 'en-US', // 参考：https://i18n.nuxtjs.org/docs/api/options#defaultlocale
    
    // 文件路径配置
    langDir: 'locales', // 参考：https://i18n.nuxtjs.org/docs/api/options#langdir
    // restructureDir: 'i18n', // 默认值，参考：https://i18n.nuxtjs.org/docs/api/options#restructuredir
    
    // 浏览器语言检测
    detectBrowserLanguage: { // 参考：https://i18n.nuxtjs.org/docs/api/options#detectbrowserlanguage
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en-US'
    },
    
    // Vue I18n 配置文件路径
    vueI18n: './i18n/i18n.config.ts' // 参考：https://i18n.nuxtjs.org/docs/api/options#vuei18n
  }
})
```

参考文档：
- [Nuxt i18n 配置选项总览](https://i18n.nuxtjs.org/docs/api/options)
- [模块安装和基础配置](https://i18n.nuxtjs.org/docs/getting-started)

#### i18n/i18n.config.ts - 运行时配置
```typescript
export default defineI18nConfig(() => ({
  // Vue I18n 基础配置
  legacy: false, // 使用 Composition API，参考：https://vue-i18n.intlify.dev/guide/advanced/composition.html
  locale: 'en-US', // 当前语言，参考：https://vue-i18n.intlify.dev/api/general.html#locale
  fallbackLocale: 'en-US', // 回退语言，参考：https://vue-i18n.intlify.dev/api/general.html#fallbacklocale
  
  // 数字格式化配置
  numberFormats: { // 参考：https://vue-i18n.intlify.dev/guide/essentials/number.html
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    },
    'zh-CN': {
      currency: {
        style: 'currency', 
        currency: 'CNY',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    }
  },
  
  // 日期时间格式化配置
  datetimeFormats: { // 参考：https://vue-i18n.intlify.dev/guide/essentials/datetime.html
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    'zh-CN': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
  
  // 其他可选配置：
  // messages: {...}, // 如果不使用文件加载，可在此定义消息
  // modifiers: {...}, // 自定义修饰符
  // pluralRules: {...}, // 自定义复数规则
  // postTranslation: (str) => str, // 后处理函数
}))
```

参考文档：
- [defineI18nConfig 使用指南](https://i18n.nuxtjs.org/docs/composables/define-i18n-config)
- [Vue I18n 配置选项](https://vue-i18n.intlify.dev/api/general.html)
- [数字格式化](https://vue-i18n.intlify.dev/guide/essentials/number.html)
- [日期时间格式化](https://vue-i18n.intlify.dev/guide/essentials/datetime.html)
- [Nuxt i18n Vue I18n 集成](https://i18n.nuxtjs.org/docs/guide/vue-i18n)

### 3. 配置文件合并机制

**是否需要 i18n.config.ts 文件？**

虽然可以在 `nuxt.config.ts` 中配置所有 Vue I18n 选项，但推荐使用独立的 `i18n.config.ts` 文件，原因如下：

1. **更好的代码组织**：分离构建时配置和运行时配置
2. **类型安全**：`defineI18nConfig` 提供完整的类型推断
3. **运行时灵活性**：支持动态配置和条件逻辑
4. **性能优化**：避免在 `nuxt.config.ts` 中包含大量运行时配置

参考文档：[vueI18n 配置选项](https://i18n.nuxtjs.org/docs/api/options#vuei18n)

**配置文件合并规则**：

两个配置文件的配置**会自动合并**，遵循以下规则：

1. `nuxt.config.ts` 中的 `i18n` 配置（模块级配置）
2. `i18n.config.ts` 中的配置（Vue I18n 配置）
3. 如果有冲突，`i18n.config.ts` 中的配置会覆盖 `nuxt.config.ts` 中的相同选项

参考文档：[Vue I18n 配置指南](https://i18n.nuxtjs.org/docs/guide/vue-i18n)

**推荐的配置分离策略**：

**nuxt.config.ts** - 模块配置（构建时）：
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    // 路由和构建相关配置
    strategy: 'prefix_except_default',
    defaultLocale: 'en-US',
    locales: [...],
    langDir: 'locales',
    detectBrowserLanguage: {...},
    
    // 指向 Vue I18n 配置文件
    vueI18n: './i18n/i18n.config.ts'
  }
})
```

**i18n.config.ts** - Vue I18n 配置（运行时）：
```typescript
export default defineI18nConfig(() => ({
  // Vue I18n 运行时配置
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  numberFormats: {...},
  datetimeFormats: {...},
  // 其他 Vue I18n 选项
}))
```

参考文档：[defineI18nConfig 使用指南](https://i18n.nuxtjs.org/docs/composables/define-i18n-config)

**能否只使用 i18n.config.ts？**

**不推荐**只使用 `i18n.config.ts`，因为：

1. **模块配置必须在 nuxt.config.ts 中**：`locales`、`langDir`、`strategy` 等是 Nuxt I18n 模块的配置，不是 Vue I18n 的配置
2. **构建时优化**：模块配置在构建时处理，性能更好
3. **类型安全**：模块配置有专门的类型定义

参考文档：[模块选项 API](https://i18n.nuxtjs.org/docs/api/options)

**最佳实践总结**：
- ✅ 在 `nuxt.config.ts` 中保持**最小化模块配置**
- ✅ 将 Vue I18n 相关配置移到 `i18n.config.ts` 中
- ✅ 使用 `vueI18n: './i18n/i18n.config.ts'` 连接两个文件
- ❌ 不要在 `nuxt.config.ts` 中配置 `numberFormats`、`datetimeFormats` 等 Vue I18n 选项
- ❌ 不要试图只使用一个配置文件

## 目录结构

```
project-root/
├── nuxt.config.ts          # 主配置文件
├── i18n/
│   ├── i18n.config.ts       # Vue I18n 配置
│   └── locales/             # 语言文件目录
│       ├── en-US.json       # 英文语言包（主要维护）
│       └── zh-CN.json       # 中文语言包（测试用）
└── ...
```

## 语言文件管理

### 当前语言包内容

**en-US.json**（主要维护）：
```json
{
  "welcome": "Welcome"
}
```

**zh-CN.json**（测试用）：
```json
{
  "welcome": "欢迎"
}
```

### 懒加载翻译 (Lazy Loading)

#### 1. 静态文件懒加载

支持多种文件格式：JSON、JS、TS

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'en-US',
        file: 'en-US.json'  // 静态 JSON 文件
      },
      {
        code: 'zh-CN', 
        file: 'zh-CN.js'    // 动态 JS 文件
      },
      {
        code: 'fr-FR',
        file: 'fr-FR.ts'    // TypeScript 文件
      }
    ]
  }
})
```

#### 2. 动态翻译文件 (.js/.ts)

**i18n/locales/zh-CN.js** - 支持参数传递和动态内容：
```javascript
// 方式1：直接返回对象
export default {
  welcome: '欢迎',
  greeting: '你好，{name}！',
  itemCount: '没有项目 | 1个项目 | {count}个项目',
  dynamicMessage: (context) => {
    const hour = new Date().getHours()
    return hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
  }
}

// 方式2：使用 defineI18nLocale 进行异步加载
export default defineI18nLocale(() => {
  return {
    welcome: '欢迎',
    greeting: '你好，{name}！'
  }
})

// 方式3：从 API 动态获取翻译
export default defineI18nLocale(async (locale) => {
  // 从服务器获取翻译数据
  return await $fetch(`/api/translations/${locale}`)
})
```

#### 3. 多文件合并策略

支持为同一语言加载多个文件，实现翻译覆盖：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'es-AR',
        name: 'Español (Argentina)',
        // 加载顺序：es.json -> es-AR.json，后者覆盖前者
        files: ['es.json', 'es-AR.json']
      },
      {
        code: 'es-US', 
        name: 'Español (Estados Unidos)',
        files: ['es.json', 'es-US.json']
      }
    ]
  }
})
```

**目录结构示例**：
```
i18n/
└── locales/
    ├── es.json        # 通用西班牙语
    ├── es-AR.json     # 阿根廷特定翻译
    ├── es-US.json     # 美国西班牙语特定翻译
    └── zh-CN.js       # 中文动态翻译
```

#### 4. 缓存控制

可以为每个文件单独控制缓存：

```typescript
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'zh-CN',
        // 禁用单个文件缓存
        file: { path: 'zh-CN.js', cache: false }
      },
      {
        code: 'es-AR',
        // 混合配置：部分文件禁用缓存
        files: [
          { path: 'es.js', cache: false },
          'es-AR.json'  // 默认启用缓存
        ]
      }
    ]
  }
})
```

#### 5. 手动加载翻译

在组件中动态加载特定语言的翻译：

```vue
<script setup>
const { loadLocaleMessages, t } = useI18n()

// 手动加载荷兰语翻译
await loadLocaleMessages('nl')

// 使用加载的翻译
const welcome = computed(() => t('welcome'))
const welcomeDutch = computed(() => t('welcome', 1, { locale: 'nl' }))
</script>
```

### 语言包扩展策略

1. **开发阶段**：维护英文和中文两个语言包用于测试
2. **生产部署**：注释掉 `nuxt.config.ts` 中的中文配置
3. **未来扩展**：根据需要添加新语言支持
4. **动态内容**：使用 .js 文件处理需要参数传递或动态生成的翻译
5. **API 集成**：通过 `defineI18nLocale` 从后端 API 获取翻译数据

参考文档：[Nuxt i18n - Lazy Loading](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations)

## 路由策略

当前使用 `prefix_except_default` 策略：
- 默认语言 (en-US)：`/` 、`/about`
- 其他语言 (zh-CN)：`/zh-CN/`、`/zh-CN/about`

参考文档：[Nuxt i18n - Routing Strategies](https://i18n.nuxtjs.org/docs/guide/routing-strategies)

## 浏览器语言检测

配置说明：
- `useCookie: true`：使用 Cookie 记住用户语言选择
- `redirectOn: 'root'`：仅在访问根路径时进行语言检测（SEO 友好）
- `alwaysRedirect: false`：避免每次访问都重定向

参考文档：[Nuxt i18n - Browser Language Detection](https://i18n.nuxtjs.org/docs/guide/browser-language-detection)

## 使用示例

### 在组件中使用翻译

```vue
<template>
  <div>
    <!-- Options API 方式 -->
    <h1>{{ $t('welcome') }}</h1>
    
    <!-- Composition API 方式 -->
    <p>{{ t('welcome') }}</p>
    
    <!-- 带参数的翻译 -->
    <p>{{ t('greeting', { name: 'John' }) }}</p>
    
    <!-- 复数形式 (新版 API) -->
    <p>{{ $t('item', { count }, count) }}</p>
    
    <!-- 数字格式化 -->
    <p>{{ $n(1234.56, 'currency') }}</p>
    
    <!-- 日期格式化 -->
    <p>{{ $d(new Date(), 'short') }}</p>
  </div>
</template>

<script setup>
// 使用 Composition API
const { t, n, d } = useI18n()
// 注意：tc 在 Vue I18n v11 中将被移除，请使用 t 函数

// 响应式数据
const count = ref(5)
</script>
```

参考文档：
- [基础翻译使用](https://i18n.nuxtjs.org/docs/guide/basic-usage)
- [Vue I18n 翻译函数](https://vue-i18n.intlify.dev/guide/essentials/syntax.html)
- [useI18n Composable](https://i18n.nuxtjs.org/docs/composables/use-i18n)

### 语言切换器组件

```vue
<template>
  <div class="language-switcher">
    <!-- 当前语言显示 -->
    <div class="current-locale">
      <span>{{ currentLocale.name }}</span>
      <span>{{ currentLocale.code }}</span>
    </div>
    
    <!-- 语言切换链接 -->
    <nav class="locale-links">
      <NuxtLink 
        v-for="locale in availableLocales" 
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
        class="locale-link"
        :class="{ active: locale.code === currentLocale.code }"
      >
        {{ locale.name }}
      </NuxtLink>
    </nav>
    
    <!-- 使用 localePath 生成本地化路径 -->
    <NuxtLink :to="localePath('/about')">{{ t('about') }}</NuxtLink>
  </div>
</template>

<script setup>
// 获取 i18n 相关的 composables
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const { t } = useI18n()

// 当前语言信息
const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value)
})

// 可切换的语言列表（排除当前语言）
const availableLocales = computed(() => {
  return locales.value.filter(l => l.code !== locale.value)
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.locale-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.locale-link:hover {
  background-color: #f0f0f0;
}

.locale-link.active {
  background-color: #007acc;
  color: white;
}
</style>
```

参考文档：
- [语言切换器指南](https://i18n.nuxtjs.org/docs/guide/lang-switcher)
- [useSwitchLocalePath](https://i18n.nuxtjs.org/docs/composables/use-switch-locale-path)
- [useLocalePath](https://i18n.nuxtjs.org/docs/composables/use-locale-path)

### 高级使用示例

```vue
<template>
  <div>
    <!-- 条件渲染基于语言 -->
    <div v-if="locale === 'zh-CN'" class="chinese-specific">
      <p>中文特定内容</p>
    </div>
    
    <!-- 使用语言方向 -->
    <div :dir="localeProperties.dir">
      <p>{{ t('content') }}</p>
    </div>
    
    <!-- 动态切换语言 -->
    <button @click="setLocale('en-US')">English</button>
    <button @click="setLocale('zh-CN')">中文</button>
    
    <!-- 检测浏览器语言 -->
    <p>{{ t('detected_language', { lang: getBrowserLocale() }) }}</p>
  </div>
</template>

<script setup>
const { 
  locale, 
  locales, 
  setLocale, 
  getBrowserLocale,
  localeProperties 
} = useI18n()

// 监听语言变化
watch(locale, (newLocale) => {
  console.log(`Language changed to: ${newLocale}`)
  // 可以在这里执行其他逻辑，如更新页面标题等
})

// 页面元数据本地化
useSeoMeta({
  title: () => t('page.title'),
  description: () => t('page.description')
})
</script>
```

参考文档：
- [setLocale 函数](https://i18n.nuxtjs.org/docs/composables/use-i18n#setlocale)
- [语言检测](https://i18n.nuxtjs.org/docs/guide/browser-language-detection)
- [SEO 和元数据](https://i18n.nuxtjs.org/docs/guide/seo)

## 生产部署配置

生产环境建议配置：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  i18n: {
    locales: [
      {
        code: 'en-US',
        iso: 'en-US',
        name: 'English',
        dir: 'ltr', 
        file: 'en-US.json'
      }
      // 注释掉中文配置
      // {
      //   code: 'zh-CN',
      //   iso: 'zh-CN', 
      //   name: '简体中文',
      //   dir: 'ltr',
      //   file: 'zh-CN.json'
      // }
    ],
    // 其他配置保持不变
  }
})
```

## 常见问题解答

### Q: langDir 和 restructureDir 的关系是什么？
A: `langDir` 是相对于 `restructureDir` 的路径，而 `restructureDir` 默认值为 `'i18n'`。所以 `langDir: 'locales'` 实际指向 `<rootDir>/i18n/locales/` 目录。绝对路径（如 `'/locales'`）在生产环境会失败。

参考文档：
- [restructureDir 配置](https://i18n.nuxtjs.org/docs/api/options#restructuredir)
- [langDir 配置](https://i18n.nuxtjs.org/docs/api/options#langdir)

### Q: 是否真的需要 i18n.config.ts 文件？
A: **强烈推荐使用**。虽然技术上可以在 `nuxt.config.ts` 中配置所有选项，但分离配置有以下重要好处：
- **更好的代码组织**：清晰分离模块配置和 Vue I18n 配置
- **类型安全**：`defineI18nConfig` 提供完整的 TypeScript 类型推断
- **运行时灵活性**：支持动态配置、条件逻辑和异步操作
- **性能优化**：避免在构建配置中包含大量运行时数据
- **开发体验**：更好的 IDE 支持和错误提示

参考文档：[vueI18n 配置选项](https://i18n.nuxtjs.org/docs/api/options#vuei18n)

### Q: 两个配置文件的配置会合并吗？
A: **是的，会自动合并**。合并规则如下：
1. Nuxt I18n 模块首先加载 `nuxt.config.ts` 中的模块配置
2. 然后加载 `vueI18n` 指向的配置文件（如 `i18n.config.ts`）
3. 如果有相同的 Vue I18n 选项，`i18n.config.ts` 中的配置会覆盖 `nuxt.config.ts` 中的配置
4. 最终合并后的配置传递给 Vue I18n 实例

参考文档：[Vue I18n 配置指南](https://i18n.nuxtjs.org/docs/guide/vue-i18n)

### Q: 能否只使用 i18n.config.ts？
A: **不可以，也不推荐**。原因如下：

**技术限制**：
- `locales`、`langDir`、`strategy`、`detectBrowserLanguage` 等是 **Nuxt I18n 模块的配置**，不是 Vue I18n 的配置
- 这些配置必须在 `nuxt.config.ts` 的 `i18n` 选项中定义
- `i18n.config.ts` 只能配置 Vue I18n 的运行时选项

**性能考虑**：
- 模块配置在构建时处理，性能更好
- 运行时配置会在每次应用启动时处理

**最佳实践**：
- ✅ `nuxt.config.ts`：模块配置（locales、routing、lazy loading 等）
- ✅ `i18n.config.ts`：Vue I18n 配置（messages、formats、plugins 等）

参考文档：[模块选项 API](https://i18n.nuxtjs.org/docs/api/options)

### Q: 如何在 nuxt.config.ts 中保持最小化配置？
A: **推荐的最小化配置策略**：

**nuxt.config.ts** - 只保留模块必需配置：
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    // 必需的模块配置
    strategy: 'prefix_except_default',
    defaultLocale: 'en-US',
    locales: [...],
    langDir: 'locales',
    detectBrowserLanguage: {...},
    
    // 指向 Vue I18n 配置
    vueI18n: './i18n/i18n.config.ts'
    
    // ❌ 不要在这里配置 Vue I18n 选项：
    // legacy: false,
    // numberFormats: {...},
    // datetimeFormats: {...}
  }
})
```

**i18n.config.ts** - Vue I18n 运行时配置：
```typescript
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  numberFormats: {...},
  datetimeFormats: {...},
  // 其他 Vue I18n 选项
}))
```

参考文档：[defineI18nConfig 使用指南](https://i18n.nuxtjs.org/docs/composables/define-i18n-config)

## 相关链接

### 官方文档
- [Nuxt i18n 官方文档](https://i18n.nuxtjs.org/) - 主要参考文档
- [Vue I18n 文档](https://vue-i18n.intlify.dev/) - Vue I18n 核心库文档
- [Nuxt.js 官方文档](https://nuxt.com/) - Nuxt 框架文档

### 配置参考
- [模块配置选项](https://i18n.nuxtjs.org/docs/api/options) - 完整的配置选项列表
- [Vue I18n 配置](https://i18n.nuxtjs.org/docs/guide/vue-i18n) - Vue I18n 集成指南
- [路由策略](https://i18n.nuxtjs.org/docs/guide/routing-strategies) - 不同路由策略的详细说明
- [懒加载翻译](https://i18n.nuxtjs.org/docs/guide/lazy-load-translations) - 性能优化指南

### Composables API
- [useI18n](https://i18n.nuxtjs.org/docs/composables/use-i18n) - 主要的 i18n composable
- [useSwitchLocalePath](https://i18n.nuxtjs.org/docs/composables/use-switch-locale-path) - 语言切换
- [useLocalePath](https://i18n.nuxtjs.org/docs/composables/use-locale-path) - 本地化路径
- [defineI18nConfig](https://i18n.nuxtjs.org/docs/composables/define-i18n-config) - 配置定义

### 高级功能
- [SEO 优化](https://i18n.nuxtjs.org/docs/guide/seo) - 搜索引擎优化
- [浏览器语言检测](https://i18n.nuxtjs.org/docs/guide/browser-language-detection) - 自动语言检测
- [自定义路径](https://i18n.nuxtjs.org/docs/guide/custom-paths) - 自定义本地化路径
- [多域名支持](https://i18n.nuxtjs.org/docs/guide/multi-domain-locales) - 多域名部署

### Vue I18n 核心功能
- [翻译语法](https://vue-i18n.intlify.dev/guide/essentials/syntax.html) - 基础翻译语法
- [数字格式化](https://vue-i18n.intlify.dev/guide/essentials/number.html) - 数字本地化
- [日期时间格式化](https://vue-i18n.intlify.dev/guide/essentials/datetime.html) - 日期时间本地化
- [复数规则](https://vue-i18n.intlify.dev/guide/essentials/pluralization.html) - 复数形式处理

### 迁移和升级
- [迁移指南](https://i18n.nuxtjs.org/docs/guide/migrating) - 从旧版本迁移
- [更新日志](https://github.com/nuxt-modules/i18n/releases) - 版本更新记录
- [常见问题](https://i18n.nuxtjs.org/docs/guide/troubleshooting) - 故障排除

## 更新日志

- **2025-01-21**: 重大更新 - 完善配置文件说明
  - ✅ 详细回答了配置文件合并机制的问题
  - ✅ 明确说明了 `i18n.config.ts` 的必要性和优势
  - ✅ 解释了为什么不能只使用 `i18n.config.ts`
  - ✅ 提供了最小化配置的最佳实践
  - ✅ 为每个配置选项添加了官方文档链接
  - ✅ 扩展了使用示例，包含高级用法
  - ✅ 完善了常见问题解答部分
  - ✅ 添加了完整的官方文档链接索引

- **2025-01-21**: 修正 langDir 配置说明，明确其与 restructureDir 的关系

- **2025-01-21**: 初始版本，包含基础配置和使用指南

## SEO 优化最佳实践

### 1. 页面元数据本地化

`useSeoMeta` 组合式函数允许你将网站的SEO元标签定义为一个平面对象，并提供完整的TypeScript支持。

`useHead` 组合式函数允许你以编程式和响应式的方式管理页面头部标签，它由 `Unhead` 提供支持。如果数据来自用户或其他不可信来源，建议你查看 `useHeadSafe`。

- [use-seo-meta](https://nuxt.com/docs/4.x/api/composables/use-seo-meta)
- [use-head](https://nuxt.com/docs/4.x/api/composables/use-head)

```vue
// app.vue
<script setup>
// 在页面组件中设置本地化的 SEO 元数据
const { t, locale } = useI18n()

// 使用 useSeoMeta 设置动态元数据
useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('seo.ogTitle'),
  ogDescription: () => t('seo.ogDescription'),
  ogImage: () => `/images/og-${locale.value}.jpg`,
  twitterCard: 'summary_large_image'
})


// 使用 useHead 设置更复杂的头部信息
useHead({
  htmlAttrs: {
    lang: locale.value
  },
  link: [
    {
      rel: 'alternate',
      hreflang: 'en-US',
      href: 'https://example.com/en-US/page'
    },
    {
      rel: 'alternate',
      hreflang: 'zh-CN', 
      href: 'https://example.com/zh-CN/page'
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: 'https://example.com/page'
    }
  ]
})
</script>
```

### 2. 结构化数据本地化

- [Schema.org](https://schema.org/)


需要安装  nuxt-schema-org 模块

- [nuxt-schema-org](https://nuxtseo.com/docs/schema-org/guides/default-schema-org)

```vue
// app.vue
<script setup>
const { t, locale } = useI18n()

// 添加结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: t('seo.title'),
    description: t('seo.description'),
    inLanguage: locale.value,
    url: `https://example.com${useRoute().path}`
  })
])
</script>
```

### 3. 站点地图配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },
  i18n: {
    // 自动生成本地化站点地图
    seo: true,
    baseUrl: 'https://example.com'
  }
})
```

参考文档：[SEO 优化指南](https://i18n.nuxtjs.org/docs/guide/seo)

## 高级路由处理

### 1. 自定义路径配置

```vue
<!-- pages/about.vue -->
<script setup>
// 为不同语言定义自定义路径
defineI18nRoute({
  paths: {
    'en-US': '/about-us',
    'zh-CN': '/guan-yu-wo-men'
  }
})
</script>

<template>
  <div>
    <h1>{{ t('about.title') }}</h1>
    <p>{{ t('about.content') }}</p>
  </div>
</template>
```

### 2. 动态路由本地化

```vue
<!-- pages/test/blog/[slug].vue -->
<script setup>
const route = useRoute()
const { locale } = useI18n()

// 根据语言获取不同的内容
const { data: post } = await $fetch(`/api/posts/${route.params.slug}`, {
  query: { locale: locale.value }
})

// 设置本地化的页面元数据
useSeoMeta({
  title: post.title,
  description: post.excerpt
})
</script>
```

### 3. 路由中间件

```typescript
// middleware/i18n-redirect.ts
export default defineNuxtRouteMiddleware((to) => {
  const { locale, defaultLocale } = useI18n()
  
  // 检查是否需要重定向到正确的语言版本
  if (to.path.startsWith('/admin') && locale.value !== 'en-US') {
    return navigateTo(`/en-US${to.path}`)
  }
})
```

参考文档：
- [自定义路径](https://i18n.nuxtjs.org/docs/guide/custom-paths)
- [defineI18nRoute](https://i18n.nuxtjs.org/docs/compiler-macros/define-i18n-route)

---



## 性能优化指南

### 1. 懒加载优化

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  i18n: {
    lazy: true,
    langDir: 'locales',
    locales: [
      {
        code: 'en-US',
        file: 'en-US.json'
      },
      {
        code: 'zh-CN',
        // 使用 JS 文件实现按需加载
        file: 'zh-CN.js'
      }
    ],
    // 预加载默认语言
    precompile: {
      strictMessage: false
    }
  }
})
```

### 2. 构建时优化

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  i18n: {
    compilation: {
      strictMessage: false,
      escapeHtml: false
    },
    // 生产环境移除未使用的语言
    locales: process.env.NODE_ENV === 'production' 
      ? [{ code: 'en-US', file: 'en-US.json' }]
      : [
          { code: 'en-US', file: 'en-US.json' },
          { code: 'zh-CN', file: 'zh-CN.json' }
        ]
  }
})
```



- **待更新**: 根据项目发展添加更多语言支持和高级功能
  - ✅ 添加：SEO 优化最佳实践
  - ✅ 添加：高级路由处理
  - ✅ 添加：TypeScript 类型定义
  - ✅ 添加：性能优化指南