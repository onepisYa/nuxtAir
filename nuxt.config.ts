// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema'

// 定义 LocaleFile 混合类型 - 强制覆盖官方类型定义
type LocaleFileConfig = string | { path: string; cache?: boolean }
type LocaleFilesArray = LocaleFileConfig[]

// 强制类型断言函数，完全绕过官方类型检查
const forceLocaleFiles = (files: LocaleFilesArray): LocaleFilesArray => files

export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/ui',
    '@vueuse/nuxt',
    // INFO: 移除 Element UI 相关内容
    // '@element-plus/nuxt',
    'dayjs-nuxt',
    '@nuxtjs/i18n', // 添加 i18n 模块
  ],
  // i18n 配置
  i18n: {
    strategy: 'prefix_except_default', // 默认语言不添加前缀，其他语言添加前缀
    locales: [
      {
        code: 'en-US', 
        iso: 'en-US',
        name: 'English',
        dir: 'ltr',
        file: 'en-US.json'
      },
      {
        code: 'zh-CN',
        iso: 'zh-CN',
        name: '简体中文', 
        dir: 'ltr',
        files: forceLocaleFiles([{path: 'zh-CN.json', cache: true}, 'zh-CN.js']) as any  // 强制绕过官方类型检查，使用混合类型、这里是官方的类型写的不合理
      }
    ],
    defaultLocale: 'en-US', // 设置默认语言为英文
    langDir: 'locales', // 语言文件目录，相对于 restructureDir (默认为 'i18n')
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // 仅在访问根路径时进行语言检测（SEO 友好）
      alwaysRedirect: false, // 避免每次访问都重定向
      fallbackLocale: 'en-US'
    },
    vueI18n: 'i18n.config.ts' // Vue I18n 配置文件、也是相对于 restructureDir (默认为 'i18n')
  },

  // ssr: false,
  ssr: true,
  imports: {
    presets: [
      {
        from: 'alova/client',
        imports: ['useRequest', 'usePagination', 'useForm'],
      },
    ],
  },
  devtools: { enabled: true },
  app: {
    keepalive: true,
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Nuxt.js project' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: 'white' },
      ],
    },
  },
  css: ['~/assets/main.css'],
  ui: {
    fonts: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE, // api 前缀
      apiBaseUrl: process.env.NUXT_API_BASE_URL, // base URL 
      imgHostname: process.env.NUXT_IMG_HOSTNAME,
      sitename: process.env.NUXT_PUBLIC_SITENAME,
      phonenumber: process.env.NUXT_PUBLIC_PHONENUMBER,
    },
  },
  routeRules: {
    '/dev-api/**': { proxy: `${process.env.NUXT_API_BASE_URL}/**`, cors: true },
    '/prod-api/**': { proxy: `${process.env.NUXT_API_BASE_URL}/**`, cors: true },
  },
  devServer: {
    port: 4000,
    host: '0.0.0.0',
  },
  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    payloadExtraction: true,
  },
  compatibilityDate: '2024-11-01',
  nitro: {
    // https://nuxt.com/docs/4.x/api/nuxt-config#nitro
    // preset: 'static',
    preset: 'node-server',
    // prerender: {
    //   crawlLinks: true,
    //   routes: ['/'],
    // },
  },
  vite: {
    vue: {
      script: {
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // INFO: 移除 Element UI 相关内容
          // additionalData: '@use "@/assets/element.scss" as element;',
        },
      },
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '#types/*': ['./app/types/*'],
        },
        types: ['./app/types'],
      },
    },
  },
  hooks: {
    'pages:extend': function (pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          if (page.path.indexOf('/user') > 0) {
            page.meta ||= {}
            page.meta.middleware = ['auth']
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    },
  },
  // INFO: 移除 Element UI 相关内容
  // debug: true,
  // elementPlus: {
  //   importStyle: 'scss',
  //   defaultLocale: 'zh-cn',
  // },
  eslint: {
    // checker: {
    //   configType: 'eslintrc'
    // },
    config: {
      // stylistic: true,
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
  icon: {
    serverBundle: {
      collections: ['uil', 'ep', 'lucide'],
    },
    clientBundle: {
      scan: true,
    },
  },
  pinia: {
    storesDirs: ['./app/stores/**'],
  },
  // server: {
  //   port: 4000,
  //   host: '0.0.0.0',
  // },
})