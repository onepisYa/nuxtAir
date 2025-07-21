<script setup lang="ts">
import faviconUrl from '~/assets/favicon.ico'
import { useMyRuntimeConfig, usePhoneNumber, useSiteName } from '~/composables/config'
const route = useRoute()

const sitename = useSiteName()

useHead({
  titleTemplate: (titleChunk?:string):string => {
    return titleChunk ? `${titleChunk} - ${unref(sitename)}` : unref(sitename) as string
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: faviconUrl },
  ],
  meta: [
    { name: 'description', content: 'desc' },
    { name: 'keywords', content: 'keywords' },
  ]
})
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
