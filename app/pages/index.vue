<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()

// 设置首页的 SEO 元数据
useSeoMeta({
  title: () => t('pages.home.title'),
  description: () => t('pages.home.description'),
  keywords: () => 'nuxt, vue, web application, modern, fast, SEO, home',
  ogTitle: () => t('pages.home.ogTitle'),
  ogDescription: () => t('pages.home.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('pages.home.ogTitle'),
  twitterDescription: () => t('pages.home.ogDescription')
})

// 首页 OG Image
defineOgImage({
  component: 'OgImageDefault',
  props: {
    title: () => t('pages.home.ogTitle'),
    description: () => t('pages.home.ogDescription'),
    siteName: 'NuxtAir',
    locale: () => locale.value
  }
})

// 首页结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: () => t('pages.home.title'),
    description: () => t('pages.home.description'),
    inLanguage: locale.value,
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}${route.path}`,
    mainEntity: {
      '@type': 'WebSite',
      name: 'NuxtAir',
      description: () => t('pages.home.description'),
      url: process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'
    }
  })
])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <UContainer class="py-20">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          {{ t('pages.home.title') }}
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {{ t('pages.home.description') }}
        </p>
        <div class="flex justify-center gap-4">
          <UButton to="/about" size="lg" class="px-8">
            {{ t('pages.about.title') }}
          </UButton>
          <UButton to="/test/blog" variant="outline" size="lg" class="px-8">
            {{ t('pages.blog.title') }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>