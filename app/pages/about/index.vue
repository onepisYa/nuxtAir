<script setup lang='ts'>
import { useBaseUrl } from '~/composables/useBaseUrl'

const { t, locale } = useI18n()
const route = useRoute()
const { getBaseUrl, getCurrentUrl } = useBaseUrl()

// 可以为不同语言定义自定义路径
defineI18nRoute({
  paths: {
    // 'en-US': '/about-us',
    // 'zh-CN': '/guan-yu-wo-men'
    'en-US': '/about',
    'zh-CN': '/about'
  }
})

// 页面级 SEO 配置
useSeoMeta({
  title: () => t('pages.about.title'),
  description: () => t('pages.about.description'),
  keywords: () => 'about us, company, mission, values, team, NuxtAir',
  ogTitle: () => t('pages.about.ogTitle'),
  ogDescription: () => t('pages.about.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('pages.about.ogTitle'),
  twitterDescription: () => t('pages.about.ogDescription')
})

// 页面级 OG Image
defineOgImage({
  component: 'OgImageDefault',
  props: {
    title: () => t('pages.about.ogTitle'),
    description: () => t('pages.about.ogDescription'),
    siteName: () => locale.value === 'zh-CN' ? 'NuxtAir 官网' : 'NuxtAir',
    locale: () => locale.value
  }
})

// 页面级结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: () => t('pages.about.title'),
    description: () => t('pages.about.description'),
    inLanguage: locale.value,
    url: () => getCurrentUrl(),
    mainEntity: {
      '@type': 'Organization',
      name: 'NuxtAir',
      description: () => t('pages.about.description'),
      url: getBaseUrl()
    }
  })
])

const breadItems = computed(() => [
  { label: t('pages.home.title'), to: '/' },
  { label: t('pages.about.title'), to: useRoute().path },
])
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer>
      <!-- 面包屑导航 -->
      <div class="flex items-center gap-x-4 py-6">
        <UIcon name="ep:location" class="text-2xl text-primary"/>
        <UBreadcrumb :items="breadItems" class="text-lg"/>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- 页面标题区域 -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 md:p-12">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              {{ t('pages.about.title') }}
            </h1>
            <p class="text-xl text-blue-100 max-w-3xl mx-auto">
              {{ t('pages.about.description') }}
            </p>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-8 md:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <!-- 文本内容 -->
            <div class="space-y-8">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">
                  {{ locale === 'zh-CN' ? '我们的使命' : 'Our Mission' }}
                </h2>
                <p class="text-lg text-gray-600 leading-relaxed">
                  {{ t('pages.about.content') }}
                </p>
              </div>
              
              <div>
                <h3 class="text-2xl font-semibold text-gray-900 mb-4">
                  {{ locale === 'zh-CN' ? '核心价值' : 'Core Values' }}
                </h3>
                <ul class="space-y-3 text-gray-600">
                  <li class="flex items-start gap-3">
                    <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{{ locale === 'zh-CN' ? '创新驱动的技术解决方案' : 'Innovation-driven technology solutions' }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{{ locale === 'zh-CN' ? '用户体验至上的设计理念' : 'User-centric design philosophy' }}</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{{ locale === 'zh-CN' ? '可持续发展的业务模式' : 'Sustainable business practices' }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 视觉内容 -->
            <div class="relative">
              <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div class="text-center">
                  <UIcon name="i-heroicons-rocket-launch" class="w-16 h-16 mx-auto mb-6" />
                  <h4 class="text-2xl font-bold mb-4">
                    {{ locale === 'zh-CN' ? '现代化网络应用' : 'Modern Web Applications' }}
                  </h4>
                  <p class="text-blue-100">
                    {{ locale === 'zh-CN' 
                      ? '基于最新技术栈构建的高性能、可扩展的网络应用解决方案' 
                      : 'High-performance, scalable web application solutions built with cutting-edge technology stack' 
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 bg-gray-50 rounded-xl">
              <div class="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div class="text-gray-600">
                {{ locale === 'zh-CN' ? '成功项目' : 'Successful Projects' }}
              </div>
            </div>
            <div class="text-center p-6 bg-gray-50 rounded-xl">
              <div class="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div class="text-gray-600">
                {{ locale === 'zh-CN' ? '合作伙伴' : 'Partners' }}
              </div>
            </div>
            <div class="text-center p-6 bg-gray-50 rounded-xl">
              <div class="text-3xl font-bold text-purple-600 mb-2">5+</div>
              <div class="text-gray-600">
                {{ locale === 'zh-CN' ? '年经验' : 'Years Experience' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
