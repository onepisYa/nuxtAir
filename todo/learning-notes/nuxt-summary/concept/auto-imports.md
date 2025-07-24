# Nuxt 自动导入机制

## 概述

Nuxt 提供了强大的自动导入功能，可以自动导入组件、composables、工具函数等，无需手动编写 import 语句。这是 Nuxt "约定优于配置" 理念的重要体现。

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

**重要：** Nuxt 会自动扫描 `composables/` 目录下的所有文件，**无需手动创建 index.ts 集中导出文件**。

#### 默认扫描规则

```bash
-| composables/
---| index.ts     # 自动扫描
---| useFoo.ts    # 自动扫描
---| config.ts    # 自动扫描
---| useBaseUrl.ts # 自动扫描
---| nested/
-----| utils.ts   # 默认不扫描嵌套目录
```

#### 基本用法

```typescript
// composables/useCounter.ts
export const useCounter = () => {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}

// composables/config.ts
export const useMyRuntimeConfig = () => {
  return useRuntimeConfig()
}

// 在组件中直接使用，无需导入
const { count, increment } = useCounter()
const config = useMyRuntimeConfig()
```

#### 嵌套目录配置

如果需要扫描嵌套目录，可以在 `nuxt.config.ts` 中配置：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      // 扫描顶级 composables
      '~/composables',
      // 扫描特定嵌套文件
      '~/composables/*/index.{ts,js,mjs,mts}',
      // 扫描所有嵌套目录
      '~/composables/**'
    ]
  }
})
```

#### 重要提醒

⚠️ **不要创建 `composables/index.ts` 集中导出文件**

- Nuxt 的自动导入机制已经处理了所有导出
- 手动创建 index.ts 文件是多余的，可能导致重复导出
- 所有 composables 在全局范围内自动可用

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

**重要：** 配置 `imports.dirs` **不会覆盖** Nuxt 的默认自动导入行为，而是会**智能合并**。

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      'stores',           // 新增目录
      'composables/**'    // 扫描嵌套目录
    ]
  }
})
```

实际扫描的目录列表会是：
- `~/composables/` (默认保留)
- `~/utils/` (默认保留)
- `~/stores/` (自定义新增)
- `~/composables/**` (自定义，包含嵌套目录)

✅ **无需手动重新配置默认目录** - Nuxt 会自动保留 `composables/` 和 `utils/` 的扫描

✅ **智能合并** - 你的自定义目录会追加到默认目录列表中

✅ **向后兼容** - 现有的 composables 和 utils 继续正常工作

## 配置行为说明

### 智能合并机制

当你在 `nuxt.config.ts` 中配置 `imports.dirs` 时，Nuxt **不会覆盖**默认的自动导入目录，而是采用**智能合并**的方式：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      // 这些目录会追加到默认目录列表中
      'stores/**',
      'shared/composables/**'
    ]
  }
})
```

### 默认目录保持扫描

以下默认目录会始终被扫描，无需手动重新配置：
- `~/composables/`
- `~/utils/`
- `~/server/utils/`（服务端）

### 实际扫描示例

配置上述 `imports.dirs` 后，Nuxt 实际扫描的目录为：
```
~/composables/          # 默认目录
~/utils/               # 默认目录
~/server/utils/        # 默认目录（服务端）
~/stores/**            # 自定义目录
~/shared/composables/** # 自定义目录
```

### 参考资料

- [Nuxt 官方配置文档 - Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports#auto-imported-functions)
- [GitHub Issue #15785 - imports.dirs behavior clarification](https://github.com/nuxt/nuxt/issues/15785)
- [Nuxt 源码 - imports 配置处理](https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/imports/module.ts)

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

## 显式导入（可选）

如果需要显式导入，可以使用 `#imports` 别名：

```vue
<script setup lang="ts">
import { ref, computed } from '#imports'

const count = ref(1)
const double = computed(() => count.value * 2)
</script>
```

## 类型支持

Nuxt 会自动生成类型定义文件：

- `.nuxt/imports.d.ts` - 自动导入的类型定义
- `.nuxt/components.d.ts` - 组件类型定义

## 最佳实践

1. **依赖 Nuxt 自动导入**：充分利用 Nuxt 的自动导入机制，避免手动管理导出
2. **保持文件命名一致性**：使用清晰的命名约定
3. **避免命名冲突**：确保函数名在全局范围内唯一
4. **合理组织目录结构**：按功能分组组织文件
5. **避免不必要的 index.ts**：让 Nuxt 处理自动导入，不要创建集中导出文件
6. **无需重复配置默认目录**：直接添加自定义目录即可
7. **利用通配符**：使用 `**` 进行递归扫描
8. **按功能分组**：将相关的 composables 放在同一目录下
9. **保持目录结构清晰**：避免过深的嵌套
10. **测试自动导入**：使用 `nuxi info` 查看实际扫描的目录
11. **放心配置自定义目录**：`imports.dirs` 会与默认目录智能合并，不会破坏现有功能

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

## 实际项目示例

在我们的项目中，以下文件会被自动导入：

```bash
composables/
├── config.ts           # useMyRuntimeConfig, usePhoneNumber, useSiteName
├── useBaseUrl.ts       # useBaseUrl
└── alova/
    ├── index.ts        # 需要配置才能自动导入嵌套目录
    ├── methods.ts      # get, post, put, delete 等方法
    └── factory.ts      # alovaManager
```

所有这些 composables 都可以在组件中直接使用，无需手动导入。

## 参考文档

- [Nuxt 自动导入](https://nuxt.com/docs/guide/concepts/auto-imports)
- [组件自动导入](https://nuxt.com/docs/guide/directory-structure/components)
- [Composables 目录](https://nuxt.com/docs/guide/directory-structure/composables)
- [Utils 目录](https://nuxt.com/docs/guide/directory-structure/utils)
- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) - Nuxt 使用的底层自动导入插件