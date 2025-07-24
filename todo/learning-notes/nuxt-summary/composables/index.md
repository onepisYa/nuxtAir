- [VueUse Nuxt Module](https://nuxt.com/modules/vueuse)
- [Nuxt Composables API 文档](https://nuxt.com/docs/4.x/api/composables)


VueUse 为了避免与 Nuxt 内置的同名工具函数冲突，会禁用一部分工具的自动导入，其中 `useStorage` 正好在列。


### 具体处理方式：
对于这些被禁用自动导入的工具（包括 `useStorage`），需要**显式从 `@vueuse/core` 导入**才能使用，即使你已经安装了 `@vueuse/nuxt`。

示例代码：
```vue
<script setup>
// 必须显式导入，不能直接使用
import { useStorage } from '@vueuse/core'

// 使用 VueUse 的 useStorage
const storedData = useStorage('my-key', { foo: 'bar' })
</script>
```


### 为什么会有这个限制？

因为 Nuxt 本身内置了同名的 `useStorage`（Nuxt 的内置版本主要用于 SSR 场景下的状态同步），为了避免两者混淆或冲突，VueUse 主动禁用了自动导入。

两者的核心区别：
- **Nuxt 内置的 `useStorage`**：更侧重 SSR 环境下的服务端与客户端状态同步，默认使用 `useState` 实现。
- **VueUse 的 `useStorage`**：功能更丰富（支持 localStorage/sessionStorage/cookie 等），API 更灵活，适合纯客户端存储场景。


### 依赖说明不变：

即使需要显式导入 `@vueuse/core` 的函数，也**不需要将 `@vueuse/core` 移到 `dependencies`** 中。因为 `@vueuse/nuxt` 已经将其作为依赖声明，安装时会自动包含，直接导入使用即可。


总结：对于 `useStorage` 这类被禁用自动导入的工具，只需显式从 `@vueuse/core` 导入即可，无需调整依赖配置。



不需要在 `devDependencies` 中显式保留 `@vueuse/core`，原因如下：

### 1. `@vueuse/core` 已经通过 `@vueuse/nuxt` 间接安装
`@vueuse/nuxt` 的内部依赖中已经包含了 `@vueuse/core`（这是它的核心依赖），当你安装 `@vueuse/nuxt` 时，npm/yarn 会自动将 `@vueuse/core` 安装到 `node_modules` 中，无论你是否在 `package.json` 中显式声明它。

因此，即使你从 `devDependencies` 中删除 `@vueuse/core`，项目中依然可以正常导入和使用它的函数（比如 `import { useStorage } from '@vueuse/core'`），因为 Node 会自动从 `@vueuse/nuxt` 依赖的 `@vueuse/core` 中查找模块。


### 2. 显式保留可能导致版本冲突
如果在 `devDependencies` 中显式声明 `@vueuse/core`，可能会出现版本不一致的问题：  
`@vueuse/nuxt` 本身依赖某个特定版本的 `@vueuse/core`，而你手动声明的版本可能与之冲突，导致运行时错误（比如函数 API 不兼容）。

最佳实践是：**依赖由上游模块（这里是 `@vueuse/nuxt`）管理，避免手动重复声明**。


### 总结
即使你需要显式导入 `@vueuse/core` 的函数（如 `useStorage`），也**不需要在 `devDependencies` 中保留 `@vueuse/core`**。  
删除它既不会影响使用，还能避免潜在的版本冲突，让依赖管理更清晰。