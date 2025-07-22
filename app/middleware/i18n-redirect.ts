// 国际化路由中间件
export default defineNuxtRouteMiddleware((to) => {
  const { locale, defaultLocale } = useI18n()
  
  // 打印调试信息
  console.log('i18n-redirect middleware:', {
    path: to.path,
    locale: locale.value,
    defaultLocale: defaultLocale
  })
  
  // 检查是否需要重定向到正确的语言版本
  if (to.path.startsWith('/admin') && locale.value !== 'en-US') {
    console.log('Redirecting admin route to English')
    return navigateTo(`/en-US${to.path}`)
  }
  
  // 检查特定路径的语言要求
  if (to.path.startsWith('/api-docs') && locale.value !== 'en-US') {
    console.log('Redirecting API docs to English')
    return navigateTo(`/en-US${to.path}`)
  }
  
  // 记录访问日志（仅在开发环境）
  if (process.dev) {
    console.log(`Page accessed: ${to.path} (locale: ${locale.value})`)
  }
}
)