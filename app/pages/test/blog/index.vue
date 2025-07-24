<script setup lang="ts">
import { useBaseUrl } from '~/composables/useBaseUrl'

const { t, locale } = useI18n()
const route = useRoute()
const { getBaseUrl, getCurrentUrl } = useBaseUrl()

// 页面级 SEO 配置
useSeoMeta({
  title: () => t('pages.blog.title'),
  description: () => t('pages.blog.description'),
  keywords: () => 'blog, articles, insights, web development, technology, NuxtAir',
  ogTitle: () => t('pages.blog.ogTitle'),
  ogDescription: () => t('pages.blog.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('pages.blog.ogTitle'),
  twitterDescription: () => t('pages.blog.ogDescription')
})

// 页面级 OG Image
defineOgImage({
  component: 'OgImageDefault',
  props: {
    title: () => t('pages.blog.ogTitle'),
    description: () => t('pages.blog.ogDescription'),
    siteName: 'NuxtAir',
    locale: () => locale.value
  }
})

// 页面级结构化数据
useSchemaOrg([
  defineWebPage({
    name: () => t('pages.blog.title'),
    description: () => t('pages.blog.description'),
    inLanguage: locale.value,
    url: () => getCurrentUrl(),
    publisher: {
      '@type': 'Organization',
      name: 'NuxtAir',
      url: getBaseUrl()
    }
  })
])

// 模拟博客文章数据
const blogPosts = computed(() => [
  {
    id: 1,
    title: locale.value === 'zh-CN' ? '如何使用 Nuxt.js 构建现代网站' : 'How to Build Modern Websites with Nuxt.js',
    excerpt: locale.value === 'zh-CN' 
      ? '学习如何使用 Nuxt.js 框架创建快速、SEO 友好的现代网站。'
      : 'Learn how to create fast, SEO-friendly modern websites using the Nuxt.js framework.',
    slug: 'nuxtjs-modern-websites',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: locale.value === 'zh-CN' ? '国际化最佳实践' : 'Internationalization Best Practices',
    excerpt: locale.value === 'zh-CN'
      ? '探索网站国际化的最佳实践和常见陷阱。'
      : 'Explore best practices and common pitfalls in website internationalization.',
    slug: 'i18n-best-practices',
    date: '2024-01-10'
  }
])

const breadItems = computed(() => [
  { label: t('pages.home.title'), to: '/' },
  { label: t('pages.blog.title'), to: useRoute().path },
])
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <UContainer>
      <div class="flex items-center gap-x-4 py-6">
        <UIcon name="lucide:book-open" class="text-2xl text-primary"/>
        <UBreadcrumb :items="breadItems" class="text-lg"/>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ t('pages.blog.title') }}</h1>
        <p class="text-xl text-gray-600 mb-8">{{ t('pages.blog.description') }}</p>
        
        <div class="grid gap-6">
          <article 
            v-for="post in blogPosts" 
            :key="post.id"
            class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h2 class="text-2xl font-semibold text-gray-900 mb-3">
              <NuxtLink 
                :to="`/test/blog/${post.slug}`" 
                class="hover:text-primary transition-colors"
              >
                {{ post.title }}
              </NuxtLink>
            </h2>
            <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
            <div class="flex items-center justify-between">
              <time class="text-sm text-gray-500">{{ post.date }}</time>
              <UButton 
                :to="`/test/blog/${post.slug}`" 
                variant="outline" 
                size="sm"
              >
                {{ locale === 'zh-CN' ? '阅读更多' : 'Read More' }}
              </UButton>
            </div>
          </article>
        </div>
      </div>
    </UContainer>
  </div>
</template>