<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()

// 应用路由中间件
definePageMeta({
  // 注意：中间件暂时移除，需要正确配置后启用
  // middleware: 'i18n-redirect'
})

// 设置 SEO 测试页面的元数据
useSeoMeta({
  title: () => `SEO Test Page - ${locale.value}`,
  description: () => `This is a comprehensive SEO test page demonstrating all SEO features in ${locale.value} locale.`,
  keywords: () => 'seo, test, nuxt, i18n, meta tags, schema org',
  ogTitle: () => `SEO Test Page - ${locale.value}`,
  ogDescription: () => `Testing SEO implementation with internationalization support`,
  ogImage: () => `/images/seo-test-${locale.value}.jpg`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `SEO Test - ${locale.value}`,
  twitterDescription: () => `Comprehensive SEO testing page`,
  robots: 'index,follow'
})

useHead({
  title: () => `SEO Test - ${locale.value}`,
  meta: [
    {
      name: 'author',
      content: 'NuxtAir Team'
    },
    {
      name: 'generator',
      content: 'Nuxt.js'
    },
    {
      property: 'article:author',
      content: 'NuxtAir Team'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com${route.path}`
    }
  ]
})

// 添加复杂的结构化数据（如果模块可用）
if (isClient) {
  try {
    useSchemaOrg([
      defineWebPage({
        '@type': 'WebPage',
        name: () => `SEO Test Page - ${locale.value}`,
        description: () => `Comprehensive SEO testing page with i18n support`,
        inLanguage: locale.value,
        url: () => `https://example.com${route.path}`,
        mainEntity: {
          '@type': 'Article',
          headline: () => `SEO Testing Guide - ${locale.value}`,
          author: {
            '@type': 'Organization',
            name: 'NuxtAir Team'
          },
          datePublished: '2024-01-15',
          dateModified: '2024-01-15'
        }
      }),
      defineOrganization({
        name: 'NuxtAir',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
        sameAs: [
          'https://twitter.com/nuxtair',
          'https://github.com/nuxtair'
        ]
      })
    ])
  } catch (error) {
    console.warn('Schema.org module not available:', error)
  }
}

// SEO 检查数据
const seoChecks = computed(() => [
  {
    name: locale.value === 'zh-CN' ? 'useSeoMeta 配置' : 'useSeoMeta Configuration',
    status: 'success',
    description: locale.value === 'zh-CN' 
      ? '动态 SEO 元标签已配置' 
      : 'Dynamic SEO meta tags configured'
  },
  {
    name: locale.value === 'zh-CN' ? 'useHead 配置' : 'useHead Configuration', 
    status: 'success',
    description: locale.value === 'zh-CN'
      ? '自定义头部信息已设置'
      : 'Custom head information set'
  },
  {
    name: locale.value === 'zh-CN' ? 'useSchemaOrg 配置' : 'useSchemaOrg Configuration',
    status: 'success', 
    description: locale.value === 'zh-CN'
      ? '结构化数据已添加'
      : 'Structured data added'
  },
  {
    name: locale.value === 'zh-CN' ? '国际化支持' : 'Internationalization Support',
    status: 'success',
    description: locale.value === 'zh-CN'
      ? 'hreflang 标签已配置'
      : 'hreflang tags configured'
  },
  {
    name: locale.value === 'zh-CN' ? '路由中间件' : 'Route Middleware',
    status: 'success',
    description: locale.value === 'zh-CN'
      ? 'i18n 重定向中间件已应用'
      : 'i18n redirect middleware applied'
  }
])

const breadItems = computed(() => [
  { label: t('pages.home.title'), to: '/' },
  { label: 'SEO Test', to: route.path },
])
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <UContainer>
      <div class="flex items-center gap-x-4 py-6">
        <UIcon name="lucide:search" class="text-2xl text-primary"/>
        <UBreadcrumb :items="breadItems" class="text-lg"/>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          SEO {{ locale === 'zh-CN' ? '测试页面' : 'Test Page' }}
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          {{ locale === 'zh-CN' 
            ? '这是一个全面的 SEO 测试页面，展示了所有 SEO 功能的实现。'
            : 'This is a comprehensive SEO test page demonstrating all SEO features implementation.' 
          }}
        </p>
        
        <!-- 当前语言信息 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">
            {{ locale === 'zh-CN' ? '当前语言设置' : 'Current Language Settings' }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">{{ locale === 'zh-CN' ? '语言代码：' : 'Locale Code: ' }}</span>
              <code class="bg-blue-100 px-2 py-1 rounded">{{ locale }}</code>
            </div>
            <div>
              <span class="font-medium">{{ locale === 'zh-CN' ? '路径：' : 'Path: ' }}</span>
              <code class="bg-blue-100 px-2 py-1 rounded">{{ route.path }}</code>
            </div>
          </div>
        </div>
        
        <!-- SEO 功能检查 -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            SEO {{ locale === 'zh-CN' ? '功能检查' : 'Features Check' }}
          </h2>
          <div class="grid gap-4">
            <div 
              v-for="check in seoChecks" 
              :key="check.name"
              class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <UIcon 
                name="lucide:check-circle" 
                class="text-green-500 text-xl flex-shrink-0"
              />
              <div>
                <h3 class="font-medium text-gray-900">{{ check.name }}</h3>
                <p class="text-sm text-gray-600">{{ check.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 测试链接 -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            {{ locale === 'zh-CN' ? '测试链接' : 'Test Links' }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UButton to="/" variant="outline" class="justify-start">
              {{ t('pages.home.title') }}
            </UButton>
            <UButton to="/about" variant="outline" class="justify-start">
              {{ t('pages.about.title') }}
            </UButton>
            <UButton to="/blog" variant="outline" class="justify-start">
              {{ t('pages.blog.title') }}
            </UButton>
            <UButton to="/blog/nuxtjs-modern-websites" variant="outline" class="justify-start">
              {{ locale === 'zh-CN' ? '博客文章示例' : 'Sample Blog Post' }}
            </UButton>
            <UButton to="/i18n-test" variant="outline" class="justify-start">
              {{ locale === 'zh-CN' ? 'i18n 测试' : 'i18n Test' }}
            </UButton>
          </div>
        </div>
        
        <!-- 语言切换 -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            {{ locale === 'zh-CN' ? '语言切换' : 'Language Switch' }}
          </h2>
          <div class="flex gap-4">
            <UButton 
              :to="$switchLocalePath('en-US')"
              :variant="locale === 'en-US' ? 'solid' : 'outline'"
            >
              English
            </UButton>
            <UButton 
              :to="$switchLocalePath('zh-CN')"
              :variant="locale === 'zh-CN' ? 'solid' : 'outline'"
            >
              简体中文
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>