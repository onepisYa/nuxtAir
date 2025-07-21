import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default {
  // 自定义滚动行为
  scrollBehavior(to, from, savedPosition) {
    console.log(" to", to)
    console.log(" from", from)
    console.log(" savedPosition", savedPosition)
    if (savedPosition) {
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