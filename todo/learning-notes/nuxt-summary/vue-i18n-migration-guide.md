# Vue I18n 复数形式 API 迁移指南

## 概述

在 Vue I18n v10 版本中，`tc` 和 `$tc` 仍然存在以方便迁移，但在 v11 版本中将被完全移除。如果继续使用这些旧版 API，Vue I18n 会在控制台输出警告。

## 当前项目状态

- **Vue I18n 版本**: @nuxtjs/i18n 10.0.1
- **影响范围**: 主要在测试页面 `app/pages/test/i18n-test.vue` 中使用
- **迁移紧急程度**: 中等（v11 发布前需要完成）

## API 变化对比

### 旧版 API (即将废弃)

```javascript
// Options API
$tc(key, choice, values)

// Composition API  
tc(key, choice, values)
```

### 新版 API (推荐使用)

```javascript
// Options API
$t(key, values, choice)

// Composition API
t(key, values, choice)
```

## 具体迁移示例

### 1. 基础复数形式

**旧版写法:**
```vue
<template>
  <!-- 旧版 API -->
  <p>{{ $tc('itemCount', 0) }}</p>
  <p>{{ $tc('itemCount', 1) }}</p>
  <p>{{ $tc('itemCount', 5) }}</p>
</template>
```

**新版写法:**
```vue
<template>
  <!-- 新版 API -->
  <p>{{ $t('itemCount', 0) }}</p>
  <p>{{ $t('itemCount', 1) }}</p>
  <p>{{ $t('itemCount', 5) }}</p>
</template>
```

### 2. 带参数的复数形式

**旧版写法:**
```vue
<template>
  <!-- 旧版 API -->
  <p>{{ $tc('itemCount', 5, { count: 5 }) }}</p>
  <p>{{ $tc('messageCount', 10, { n: 10 }) }}</p>
</template>
```

**新版写法:**
```vue
<template>
  <!-- 新版 API - 参数顺序改变 -->
  <p>{{ $t('itemCount', { count: 5 }, 5) }}</p>
  <p>{{ $t('messageCount', { n: 10 }, 10) }}</p>
</template>
```

### 3. Composition API 迁移

**旧版写法:**
```vue
<script setup>
const { tc } = useI18n()

// 使用
const message = tc('itemCount', count, { count })
</script>
```

**新版写法:**
```vue
<script setup>
const { t } = useI18n()

// 使用 - 注意参数顺序
const message = t('itemCount', { count }, count)
</script>
```

## 语言文件格式

复数形式的语言文件格式保持不变：

```javascript
// i18n/locales/zh-CN.js
export default defineI18nLocale(() => {
  return {
    // 复数形式翻译 (格式不变)
    itemCount: '没有项目 | 1个项目 | {count}个项目',
    messageCount: '没有消息 | 1条消息 | {n}条消息',
  }
})
```