<script setup lang="ts">
import faviconUrl from '~/assets/favicon.ico'
import { useMyRuntimeConfig, usePhoneNumber, useSiteName } from '~/composables/config'

const route = useRoute()
const { t, locale } = useI18n()
const sitename = useSiteName()

// 使用 useSeoMeta 设置动态 SEO 元数据
useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  keywords: () => t('seo.keywords'),
  ogTitle: () => t('seo.ogTitle'),
  ogDescription: () => t('seo.ogDescription'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.title'),
  twitterDescription: () => t('seo.description')
})

// 配置 OG Image
defineOgImage({
  component: 'OgImageDefault',
  props: {
    title: () => t('seo.ogTitle'),
    description: () => t('seo.ogDescription'),
    siteName: () => unref(sitename) as string,
    locale: () => locale.value
  }
})

// 使用 useLocaleHead 获取正确的 i18n 头部信息
const i18nHead = useLocaleHead({
  dir: true, // 添加 dir 属性到 HTML 元素
  lang: true, // 添加 lang 属性到 HTML 元素
  seo: true // 添加各种 SEO 属性（hreflang, canonical, og:locale 等）
})

// 使用 useHead 设置更复杂的头部信息
useHead(() => {
  const htmlAttrs = i18nHead.value.htmlAttrs || {}
  return {
    titleTemplate: (titleChunk?: string): string => {
      const baseTitle = unref(sitename) as string
      return titleChunk ? `${titleChunk} - ${baseTitle}` : baseTitle
    },
    htmlAttrs: {
      lang: htmlAttrs.lang || locale.value,
      dir: (htmlAttrs.dir as 'ltr' | 'rtl' | 'auto') || 'ltr'
    },
    link: [
      ...i18nHead.value.link || [],
      { rel: 'icon', type: 'image/x-icon', href: faviconUrl }
    ],
    meta: [
      ...i18nHead.value.meta || []
    ]
  }
})

// 使用 useSchemaOrg 添加结构化数据
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: () => t('seo.title'),
    description: () => t('seo.description'),
    inLanguage: locale.value,
    url: () => `${process.env.NUXT_PUBLIC_BASE_URL || 'https://example.com'}${route.path}`
  })
])
</script>

<template>
  <div class="">
    <UApp>
      <NuxtLayout>
        <NuxtPage :page-key="route => route.fullPath"/>
      </NuxtLayout>
    </UApp>
  </div>
</template>
