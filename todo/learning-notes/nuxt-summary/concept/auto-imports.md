# Nuxt 自动导入机制

## 概述

Nuxt 提供了强大的自动导入功能，可以自动导入组件、composables、工具函数等，无需手动编写 import 语句。

## 自动导入的内容

### 1. 组件自动导入

- `components/` 目录下的所有组件会自动导入
- 支持嵌套目录结构
- 组件名基于文件路径生成

```
components/
├── BaseButton.vue          # <BaseButton>
├── form/
│   ├── Input.vue          # <FormInput>
│   └── Select.vue         # <FormSelect>
└── ui/
    └── Modal.vue          # <UiModal>
```

### 2. Composables 自动导入

- `composables/` 目录下的函数会自动导入
- 文件名必须以 `use` 开头或导出以 `use` 开头的函数

```typescript
// composables/useCounter.ts
export const useCounter = () => {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}

// 在组件中直接使用，无需导入
const { count, increment } = useCounter()
```

### 3. 工具函数自动导入

- `utils/` 目录下的函数会自动导入
- 支持默认导出和命名导出

```typescript
// utils/formatDate.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

// 在组件中直接使用
const formatted = formatDate(new Date())
```

### 4. Nuxt 内置 API

自动导入的 Nuxt API 包括：

- `useState`、`useRoute`、`useRouter`
- `useFetch`、`useLazyFetch`、`$fetch`
- `useHead`、`useSeoMeta`
- `navigateTo`、`refresh`
- `ref`、`reactive`、`computed`、`watch` (Vue API)

## 配置自动导入

### 禁用自动导入

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    autoImport: false
  }
})
```

### 自定义导入目录

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      'stores',
      'composables/**'
    ]
  }
})
```

### 添加第三方库自动导入

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n']
      }
    ]
  }
})
```

## 类型支持

Nuxt 会自动生成类型定义文件：

- `.nuxt/imports.d.ts` - 自动导入的类型定义
- `.nuxt/components.d.ts` - 组件类型定义

## 最佳实践

1. **保持文件命名一致性**：使用清晰的命名约定
2. **避免命名冲突**：确保函数名在全局范围内唯一
3. **合理组织目录结构**：按功能分组组织文件
4. **显式导入复杂依赖**：对于复杂的第三方库，考虑显式导入

## 调试自动导入

查看自动导入的内容：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    // 在开发模式下显示自动导入信息
    global: true
  }
})
```

## 参考文档

- [Nuxt 自动导入](https://nuxt.com/docs/guide/concepts/auto-imports)
- [组件自动导入](https://nuxt.com/docs/guide/directory-structure/components)
- [Composables 目录](https://nuxt.com/docs/guide/directory-structure/composables)
- [Utils 目录](https://nuxt.com/docs/guide/directory-structure/utils)