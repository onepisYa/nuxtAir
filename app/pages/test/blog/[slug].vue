<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()

// 模拟根据 slug 和语言获取文章数据
const getPostData = (slug: string, locale: string) => {
  const posts: Record<string, any> = {
    'nuxtjs-modern-websites': {
      'en-US': {
        title: 'How to Build Modern Websites with Nuxt.js',
        excerpt: 'Learn how to create fast, SEO-friendly modern websites using the Nuxt.js framework.',
        content: 'Nuxt.js is a powerful framework built on top of Vue.js that makes it easy to create modern, fast, and SEO-friendly websites. In this article, we will explore the key features and benefits of using Nuxt.js for your next project.',
        author: 'John Doe',
        date: '2024-01-15',
        tags: ['nuxt', 'vue', 'web development', 'seo']
      },
      'zh-CN': {
        title: '如何使用 Nuxt.js 构建现代网站',
        excerpt: '学习如何使用 Nuxt.js 框架创建快速、SEO 友好的现代网站。',
        content: 'Nuxt.js 是一个基于 Vue.js 构建的强大框架，它使创建现代、快速且 SEO 友好的网站变得容易。在本文中，我们将探索使用 Nuxt.js 进行下一个项目的关键特性和优势。',
        author: '张三',
        date: '2024-01-15',
        tags: ['nuxt', 'vue', '网站开发', 'seo']
      }
    },
    'i18n-best-practices': {
      'en-US': {
        title: 'Internationalization Best Practices',
        excerpt: 'Explore best practices and common pitfalls in website internationalization.',
        content: 'Internationalization (i18n) is crucial for reaching a global audience. This article covers best practices, common mistakes to avoid, and practical tips for implementing i18n in your web applications.',
        author: 'Jane Smith',
        date: '2024-01-10',
        tags: ['i18n', 'internationalization', 'localization', 'best practices']
      },
      'zh-CN': {
        title: '国际化最佳实践',
        excerpt: '探索网站国际化的最佳实践和常见陷阱。',
        content: '国际化（i18n）对于触达全球受众至关重要。本文涵盖了最佳实践、需要避免的常见错误，以及在 Web 应用程序中实施 i18n 的实用技巧。',
        author: '李四',
        date: '2024-01-10',
        tags: ['i18n', '国际化', '本地化', '最佳实践']
      }
    }
  }
  
  return posts[slug]?.[locale] || null
}

const post = computed(() => getPostData(route.params.slug as string, locale.value))

// 如果文章不存在，抛出 404 错误
if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found'
  })
}

// 页面级 SEO 配置
useSeoMeta({
  title: () => `${post.value?.title} | ${t('pages.blog.title')}`,
  description: () => post.value?.excerpt,
  keywords: () => post.value?.tags.join(', '),
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.excerpt,
  ogType: 'article',
  articleAuthor: () => post.value?.author,
  articlePublishedTime: () => post.value?.date,
  articleSection: () => 'Technology',
  articleTag: () => post.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title,
  twitterDescription: () => post.value?.excerpt
})

// 博客文章专用 OG Image
defineOgImage({
  component: 'OgImageBlog',
  props: {
    title: () => post.value?.title,
    description: () => post.value?.excerpt,
    author: () => post.value?.author,
    publishDate: () => post.value?.date,
    siteName: 'NuxtAir',
    locale: () => locale.value
  }
})

// 文章级结构化数据
useSchemaOrg([
  defineArticle({
    headline: () => post.value?.title,
    description: () => post.value?.excerpt,
    image: () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}/api/__og-image__/image/blog/${route.params.slug}/og.png`,
    datePublished: () => post.value?.date,
    dateModified: () => post.value?.date,
    author: {
      '@type': 'Person',
      name: () => post.value?.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'NuxtAir',
      url: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}${route.path}`
    },
    articleSection: ['Technology'],
    keywords: () => post.value?.tags?.join(', '),
    wordCount: () => post.value?.content?.split(' ').length || 0,
    inLanguage: locale.value
  })
])

const breadItems  = computed(() => [
  { label: t('pages.home.title'), to: '/' },
  { label: t('pages.blog.title'), to: '/test/blog' },
  { label: post.value?.title, to: route.path },
])
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <UContainer>
      <div class="flex items-center gap-x-4 py-6">
        <UIcon name="lucide:file-text" class="text-2xl text-primary"/>
        <UBreadcrumb :items="breadItems" class="text-lg"/>
      </div>
      
      <article class="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
        <header class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>
          <div class="flex items-center gap-4 text-gray-600 mb-4">
            <span>{{ locale === 'zh-CN' ? '作者：' : 'By ' }}{{ post.author }}</span>
            <span>•</span>
            <time>{{ post.date }}</time>
          </div>
          <div class="flex flex-wrap gap-2">
            <UBadge 
              v-for="tag in post.tags" 
              :key="tag"
              variant="soft"
              size="sm"
            >
              {{ tag }}
            </UBadge>
          </div>
        </header>
        
        <div class="prose max-w-none">
          <p class="text-xl text-gray-700 mb-6 font-medium">{{ post.excerpt }}</p>
          <div class="text-gray-800 leading-relaxed">
            {{ post.content }}
          </div>
        </div>
        
        <footer class="mt-12 pt-8 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <UButton to="/test/blog" variant="outline">
              ← {{ locale === 'zh-CN' ? '返回博客' : 'Back to Blog' }}
            </UButton>
            <div class="flex gap-2">
              <UButton variant="ghost" size="sm">
                {{ locale === 'zh-CN' ? '分享' : 'Share' }}
              </UButton>
            </div>
          </div>
        </footer>
      </article>
    </UContainer>
  </div>
</template>