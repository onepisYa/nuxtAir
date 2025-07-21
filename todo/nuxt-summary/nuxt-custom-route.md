# Nuxt 自定义路由配置

根据项目需求分析，Nuxt 项目中缺少自定义路由配置文件的问题进行了审查。创建一个 `app/router.options.ts` 文件确实是解决此类需求的最佳实践。

## 问题回顾

项目缺少 `app/router.options.ts` 文件，这使得路由行为完全依赖于 Nuxt 的默认约定。当需要自定义滚动行为、添加全局路由元信息或实现更复杂的路由逻辑时，这会成为一个限制。

## `app/router.options.ts` 的作用

在 Nuxt 3 中，`app/router.options.ts` 文件是自定义 `vue-router` 实例行为的推荐方式。通过这个文件，您可以访问和重写 `vue-router` 的大部分配置项。

### 主要配置项

- **`scrollBehavior`**: 定义页面间导航的滚动行为。这对于保持用户浏览位置或平滑滚动到锚点非常有用。
- **`routes`**: 允许您完全覆盖 Nuxt 自动生成的路由，或者通过 `pages:extend` 钩子进行扩展。
- **`history`**: 用于高级场景，例如自定义 history 模式。

### 解决方案示例

如果需要自定义路由行为，建议创建 `app/router.options.ts` 文件，并根据需求进行配置。例如，可以添加自定义的滚动行为或全局路由守卫。

```typescript
import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default {
  // 自定义滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 仅仅对浏览器的 返回按钮和前进按钮生效。
      return savedPosition
    }
    // 如果有锚点，则滚动到锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // 否则滚动到页面顶部
    return { top: 0 }
  },
  // 其他路由配置...
} satisfies RouterConfig
```

## 参考资料

- [Nuxt 路由配置文件](https://nuxt.com/docs/4.x/api/nuxt-config#options-1) - router.options.ts
- [Nuxt 核心约定 路由](https://nuxt.com/docs/4.x/guide/concepts/vuejs-development#vue-router)
- [Nuxt 自定义路由](https://nuxt.com/docs/4.x/guide/recipes/custom-routing)
- [Nuxt 升级指南-迁移指南](https://nuxt.com/docs/4.x/getting-started/upgrade#migrating-to-nuxt-4)
- [vue router scroll-behavior](https://router.vuejs.org/guide/advanced/scroll-behavior) 有关于 savedPosition 的描述

这些文档详细解释了包括 `router.options.ts`、`pages:extend` 钩子在内的多种自定义路由的方法。
