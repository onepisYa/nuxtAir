export default defineSitemapEventHandler(async () => {
  // 静态页面路由、其实我们并不需要、因为应用会自动获取内部的静态源
  const routes = [
    {
      loc: '/',
      lastmod: new Date().toISOString(),
      _i18nTransform: true // 自动生成多语言版本
    },
    // {
    //   loc: '/about',
    //   lastmod: new Date().toISOString(),
    //   _i18nTransform: true
    // },
    // {
    //   loc: '/contact',
    //   lastmod: new Date().toISOString(),
    //   _i18nTransform: true
    // },
    // {
    //   loc: '/test/blog',
    //   lastmod: new Date().toISOString(),
    //   _i18nTransform: true
    // }
  ]

  // 可以在这里添加动态路由
  // 例如从 API 获取博客文章
  try {
    // const posts = await $fetch('/api/posts')
    // const dynamicRoutes = posts.map(post => ({
    //   loc: `/blog/${post.slug}`,
    //   lastmod: post.updatedAt,
    //   _i18nTransform: true
    // }))
    // routes.push(...dynamicRoutes)
  } catch (error) {
    console.warn('Failed to fetch dynamic routes for sitemap:', error)
  }

  return routes
})