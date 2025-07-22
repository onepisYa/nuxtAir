
# Nuxt.js SEO 和 i18n 集成：一份全面的实施指南

> 📝 **文档说明**: 这是 NuxtAir 项目 SEO 实施的权威参考文档
> 
> **引用规范**: 当引用本文档内容时，请使用以下格式：
> - 引用来源：`权威指南 - Nuxt.js SEO 和 i18n 集成实施指南`
> - 具体章节：请注明对应的章节标题和内容位置
> - 示例："根据权威指南第X章节的配置说明..."
> 
> **文档版本**: 基于 @nuxtjs/seo v3.1.0 和 @nuxtjs/i18n v10.0.1

## 1. 引言：通过国际化增强 Nuxt.js SEO

在当今全球互联的数字环境中，构建能够触达世界各地用户的网站至关重要。这不仅涉及内容翻译，更需要确保搜索引擎能够准确理解并索引多语言内容，从而提升网站在全球范围内的可见性。Nuxt.js 生态系统提供了两个强大的模块来应对这一挑战：`@nuxtjs/seo` 和 `@nuxtjs/i18n`。

`@nuxtjs/seo` 是一个功能丰富的别名模块，旨在简化 Nuxt.js 应用程序中的技术 SEO 实施 1。它集成了多个专业的 SEO 功能，包括站点地图 (Sitemap)、机器人协议 (Robots)、开放图谱图像 (OG Image)、Schema.org 结构化数据、链接检查器 (Link Checker)、SEO 工具集 (SEO Utils) 和站点配置 (Site Config)。这种模块化设计不仅提供了开箱即用的全面解决方案，还允许开发者根据项目需求选择性地安装和配置单个子模块，从而实现更精细的控制或优化最终打包体积 2。这种设计理念兼顾了快速开发的便捷性与高级定制的需求，对于追求极致性能和可控性的技术团队而言，理解每个组成模块及其相互作用至关重要。

与此同时，`@nuxtjs/i18n` 是 Nuxt.js 国际化（i18n）领域的权威解决方案 4。它基于强大的 Vue I18n 库构建，并在此基础上扩展了 Nuxt 专有的功能，如本地化路由和高级 SEO 标签本地化功能，使其成为全球化应用程序不可或缺的工具。

国际化不仅仅是简单的语言转换。它关乎如何使网络内容对不同语言和地理区域的用户具有可发现性、相关性和可访问性。正确的 i18n 实施对于有效的全球 SEO 至关重要，因为它有助于避免常见的陷阱，如重复内容问题，并显著提升全球受众的用户体验。这两个模块之间的无缝集成是实现这一目标的关键。`@nuxtjs/i18n` 提供必要的区域设置特定数据和上下文，而 `@nuxtjs/seo` 则智能地利用这些信息来生成适当的元标签、构建准确的站点地图并制定精确的机器人规则，从而确保网站在全球范围内保持一致且优化的搜索引擎表现。这种紧密结合的架构意味着国际化不再是 SEO 的一个可选附加项，而是其不可或缺的组成部分。对 i18n 配置的任何疏忽或错误都可能对所有 SEO 方面产生连锁反应，可能导致重复内容惩罚、爬取预算效率低下或国际索引错误。因此，从项目伊始就对 i18n 进行细致准确的配置至关重要。

## 2. 模块设置和初始配置

### 模块安装

在 Nuxt.js 项目中集成 SEO 和国际化功能的第一步是安装所需的模块。

对于 `@nuxtjs/seo`，可以通过以下任一命令进行安装：

Bash

```
npx nuxi module add @nuxtjs/seo
# 或者
npm install @nuxtjs/seo
# 或者
yarn add @nuxtjs/seo
# 或者
pnpm install @nuxtjs/seo
```

执行此命令后，核心别名模块及其所有组成子模块都将安装到您的项目中 2。

对于 `@nuxtjs/i18n`，安装命令如下：

Bash

```
npx nuxi@latest module add @nuxtjs/i18n
# 或者
npm install @nuxtjs/i18n@next --save-dev
```

需要注意的是，`@next` 标签通常用于安装模块的测试版或预发布版本。在生产环境中，建议使用最新的稳定版本以确保最佳的兼容性和稳定性 6。

### `nuxt.config.ts` 基本配置

安装模块后，需要在项目的 `nuxt.config.ts` 文件中进行配置，以启用并初始化它们。

首先，将这两个模块添加到 `modules` 数组中：

TypeScript

```
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/seo', // 自动包含 sitemap、robots、schema-org 等
  ],
  //...其他配置
});
```

接下来，配置 `i18n` 模块。一个基本的 `i18n` 配置块需要定义 `locales` 数组和 `defaultLocale` 设置。`locales` 应该配置为对象数组，每个对象包含 `code`（语言代码，如 'en'）、`language`（IETF BCP 47 语言标签，如 'en-US'、'zh-CN'，这对于生成准确的 `hreflang` 属性至关重要）和可选的 `name` 属性 7。

另一个关键配置是 `baseUrl` 选项。这个属性必须设置为您的生产域名，对于生成完全限定的备用 URL 和规范链接至关重要，这有助于避免重复内容问题 8。如果没有正确设置

`baseUrl`，`hreflang` 链接可能会被渲染为相对路径，这可能导致搜索引擎混淆，从而误解语言定位并引发潜在的索引问题。此外，不正确的规范链接可能导致搜索引擎索引同一内容的多个版本，稀释链接权重，并可能触发重复内容惩罚。因此，这个设置直接影响搜索引擎如何理解您内容的权威版本及其国际化变体。它不仅仅是一个技术设置，而是一个战略性的 SEO 决策，如果在一个多语言设置中被忽视或配置错误，可能会严重损害全球搜索可见性并导致重大的 SEO 惩罚。

以下是一个包含这些基本设置的 `nuxt.config.ts` 示例：

TypeScript

```
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/seo', // 自动包含 sitemap、robots、schema-org 等
  ],
  i18n: {
    locales:,
    defaultLocale: 'en',
    baseUrl: 'https://www.your-domain.com', // 对 hreflang 和规范链接至关重要
    strategy: 'prefix_except_default', // 例如：除默认语言外，其他语言路径带前缀
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // 如果浏览器语言是 en，则重定向到 /en/
    },
    vueI18n: './i18n.config.ts', // 引用您的 Vue I18n 配置文件 [7, 9]
  },
  // 通过 'site' 模块进行基本 SEO 配置（将在第 3 节中扩展）
  site: {
    url: 'https://www.your-domain.com',
    name: '您的精彩网站',
    description: 'Nuxt.js SEO 和 i18n 的全面指南。',
    // defaultLocale: 'en', // 如果安装了 @nuxtjs/i18n，则可以省略，因为它会自动推断 [3]
  },
  // 健壮 Nuxt 项目的基本 TypeScript 配置 [10]
  typescript: {
    typeCheck: true, // 在开发过程中启用 TypeScript 类型检查
    build: true, // 启用 TypeScript 编译
    // loaders: { ts: { silent: true }, tsx: { silent: true } } // 可选：静默 TS loader 警告，使控制台输出更简洁
  },
  // 开发者应确保 tsconfig.json 和 vue-shim.d.ts 已根据 Nuxt TypeScript 文档正确设置 [10]。
});
```

`i18n.config.ts` 文件是专门用于 Vue I18n 特定设置的配置文件，例如翻译消息、自定义格式化程序和全局注入选项 7。以下是一个基本示例：

TypeScript

```
// i18n.config.ts
import { defineI18nConfig } from '#imports'; // 或者 'vue-i18n' 如果未自动导入

export default defineI18nConfig(() => ({
  legacy: false, // 推荐用于 Nuxt 3 (Composition API)
  locale: 'en', // Vue I18n 实例的默认区域设置
  messages: {
    en: {
      welcome: 'Welcome to our site!',
      pages: {
        title: {
          home: 'Home',
          about: 'About Us',
        },
        home: {
          description: 'This is the main landing page of our application.',
        },
        about: {
          description: 'Discover our mission and team.',
        },
      },
    },
    zh: {
      welcome: '欢迎来到我们的网站！',
      pages: {
        title: {
          home: '首页',
          about: '关于我们',
        },
        home: {
          description: '这是我们应用程序的主页。',
        },
        about: {
          description: '了解我们的使命和团队。',
        },
      },
    },
    es: {
      welcome: '¡Bienvenido a nuestro sitio!',
      pages: {
        title: {
          home: 'Inicio',
          about: 'Sobre Nosotros',
        },
        home: {
          description: 'Esta es la página de inicio principal de nuestra aplicación.',
        },
        about: {
          description: 'Descubre nuestra misión y equipo.',
        },
      },
    },
  },
}));
```

Nuxt 的 Head 管理系统（通过 `useHead` 和 `useSeoMeta` 等组合式函数）提供了一个统一的 SEO 层。`useLocaleHead()` 组合式函数与此系统无缝集成，它专门提供由 i18n 驱动的头部数据，例如 `lang` 属性、`hreflang` 链接和 `og:locale` 标签 8。这些由

`useLocaleHead()` 生成的数据可以智能地与使用 `useHead` 或 `useSeoMeta` 添加的其他自定义或模块生成的 SEO 元数据进行合并。这种设计模式避免了不同模块独立注入元标签可能导致的冲突，并确保所有相关的头部信息都存在并按正确的优先级进行处理。这种统一的头部管理方法对于防止不同 SEO 相关模块之间的冲突至关重要，并确保所有元数据（无论是通用还是区域设置特定）都得到整合并正确渲染，从而向搜索引擎提供一致且优化的信号。对于开发者而言，这意味着对 Nuxt 核心元数据管理组合式函数（`useHead`、`useSeoMeta`）的透彻理解是有效实施和故障排除高级 SEO 和 i18n 集成的基本前提。

### 关键 Nuxt.js SEO 与 i18n 模块版本兼容性

为了确保项目的稳定性和避免潜在的兼容性问题，了解 `@nuxtjs/seo` 和 `@nuxtjs/i18n` 及其相关依赖的推荐版本至关重要。以下表格总结了关键模块的兼容性信息和注意事项：

|模块名称|推荐版本范围|关键兼容性说明/重大变更|相关参考|
|---|---|---|---|
|Nuxt.js|`^3.x.x`|`@nuxtjs/seo` 和 `@nuxtjs/i18n` 模块主要为 Nuxt 3 设计。|4|
|`@nuxtjs/i18n`|`^10.x.x` (或更高稳定版)|**版本 9.x+:** 结构发生变化，`i18n.config.ts` 应位于项目根目录 9。|版本 11+ (未来): baseUrl 将只允许字符串值，不再支持函数配置；legacy: false 推荐用于 Composition API 11。|与 Vue I18n v11 兼容 11。|5|
|`@nuxtjs/seo`|`^3.x.x` (或更高稳定版)|作为别名模块，其兼容性取决于其内部子模块。确保 Nuxt 3.x 环境。|1|
|`@nuxtjs/robots`|`^8.x.x` (或更高稳定版)|要求 `@nuxtjs/i18n` 版本 8 或更高才能实现自动国际化 12。|12|
|`@nuxtjs/sitemap`|`^7.x.x` (或更高稳定版)|自动与 `@nuxtjs/i18n` 集成，无需额外配置，但可能需要根据 i18n 设置进行微调 13。|14|
|`@nuxtjs/og-image`|`^5.x.x` (或更高稳定版)|支持多语言，非英语字符需要配置字体 (如 Noto Typeface) 16。|16|
|`@nuxtjs/schema-org`|`^5.x.x` (或更高稳定版)|推荐与 SSR 结合使用。|18|

通过查阅此表，开发者可以快速识别并解决与模块版本相关的问题，从而节省大量的调试时间，并确保开发和生产环境的稳定性。

## 3. `nuxt.config.ts` 中的全局 SEO 配置

`nuxt.config.ts` 文件是 Nuxt.js 应用程序的中心配置枢纽，它允许开发者定义全局行为和设置。在 SEO 和国际化方面，此文件提供了强大的控制能力，可以影响整个网站在搜索引擎中的表现。

### 利用 `site` 属性进行全站元数据配置

`@nuxtjs/seo` 模块通过其 `Site Config` 子模块引入了 `nuxt.config.ts` 中的专用 `site` 属性 3。这个

`site` 对象是定义全局、全站 SEO 信息的推荐集中位置，确保了应用程序的一致性。

`site` 配置中最常见和最有影响力的属性包括：

- `url`: 网站的规范 URL。这对于避免重复内容问题和巩固页面排名至关重要，它告诉搜索引擎网站的首选版本 3。
    
- `name`: 网站的官方名称，通常用于标题标签、元描述和 Schema.org 标记中 3。
    
- `description`: 一个默认的全站描述，可以作为没有特定元描述页面的备用 3。
    
- `defaultLocale`: 虽然可以显式设置，但如果 `@nuxtjs/i18n` 已安装并配置，通常可以省略此项，因为 SEO 模块会智能地从您的 i18n 设置中推断出它 3。
    

以下是 `site` 配置的示例：

TypeScript

```
// nuxt.config.ts
export default defineNuxtConfig({
  site: {
    url: 'https://www.your-domain.com', // 整个网站的规范 URL
    name: '我的全球技术博客', // 网站的官方名称
    description: '关于现代 Web 开发和 Nuxt.js 的最新见解和全面指南。', // 默认网站描述
    // defaultLocale: 'en', // 从 @nuxtjs/i18n 配置中自动推断
  },
  //...其他配置
});
```

### 为多语言站点配置 `robots.txt`

`@nuxtjs/robots` 模块是 `@nuxtjs/seo` 包的关键组件，它与 `@nuxtjs/i18n` 实现了无缝集成。这种集成会自动本地化在 `robots.txt` 配置中定义的 `allow` 和 `disallow` 路径 12。这一功能是一个显著的优势，因为它消除了为每个区域设置手动复制机器人规则的需要，极大地简化了国际 SEO 管理。

以下是一个说明性示例，展示了 `nuxt.config.ts` 中一个简单的 `disallow` 规则如何被模块自动扩展，以包含不同区域设置的语言前缀：

TypeScript

```
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@nuxtjs/seo'],
  robots: {
    disallow: ['/secret', '/admin'], // 这些路径将自动本地化
  },
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    strategy: 'prefix', // 例如：/en/secret, /fr/secret
    //...其他 i18n 选项
  },
  //...其他配置
});
// 生成的 robots.txt 将自动包含以下条目：
// User-agent: *
// Disallow: /en/secret
// Disallow: /en/admin
// Disallow: /fr/secret
// Disallow: /fr/admin
```

此外，`@nuxtjs/robots` 模块还提供了高级选项，用于微调本地化行为。例如，可以使用 `_skipI18n: true` 选项为特定规则组选择退出本地化，或者通过设置 `autoI18n: false` 全局禁用所有 i18n 本地化拆分 12。这些选项为满足特定索引要求或复杂的网站结构提供了必要的灵活性。

### 为 i18n 设置 XML 站点地图

`@nuxtjs/sitemap` 模块是 `@nuxtjs/seo` 的另一个组成部分，它与 `@nuxtjs/i18n` 自动集成。默认情况下，当不使用 `no_prefix` 路由策略或为不同区域设置使用不同域名时，它会为每个配置的区域设置生成单独的站点地图 13。这将生成一个

`sitemap_index.xml` 文件，该文件链接到各个区域设置特定的站点地图（例如，`en-sitemap.xml`，`fr-sitemap.xml`），确保所有本地化内容都可被发现。

“自动 i18n 多站点地图”模式将自动包含应用程序源，并使用 `nuxt:pages` 源来确定本地化页面的正确替代方案 13。

当在 i18n 配置中启用 `i18n.pages` 时，将激活“i18n 页面模式”。在此模式下，站点地图模块将根据该特定配置生成单个站点地图，并且可以使用 `sources` 选项添加其他 URL 13。

处理站点地图中 i18n 上下文中的动态 URL 至关重要：

- `_i18nTransform: true`: 此选项根据给定的基本路径自动为所有配置的区域设置生成 URL。它智能地利用在 `i18n.pages` 配置中定义的任何自定义路径翻译 13。
    
- `_sitemap`: 此选项允许您将特定 URL 显式分配给特定区域设置的站点地图，这对于并非所有语言都可用的内容非常有用 13。
    

以下是在 `server/api/__sitemap__/urls.ts` 中定义动态 URL 的示例：

TypeScript

```
// server/api/__sitemap__/urls.ts
import { defineSitemapEventHandler } from '@nuxtjs/sitemap';

export default defineSitemapEventHandler(() => {
  return;
});
```

## 4. 页面级 SEO 和 i18n 实施

除了全局配置，Nuxt.js 还提供了强大的工具，可以在每个页面或组件级别上精细控制 SEO 元数据和国际化内容。这对于创建高度优化和用户友好的多语言网站至关重要。

### 使用 `useSeoMeta` 和 `useLocaleHead` 进行动态元标签设置

Nuxt 3 引入了 `useSeoMeta` 组合式函数，用于在页面级别设置 SEO 元标签 1。它提供了一种声明式的方式来管理标题、描述、开放图谱标签等。

`@nuxtjs/i18n` 模块提供了 `useLocaleHead()` 组合式函数，它专门用于生成与区域设置相关的头部元数据，例如 `<html>` 标签的 `lang` 属性、`hreflang` 备用链接和 OpenGraph 区域设置标签 8。这些标签对于搜索引擎理解页面的语言和目标受众至关重要，从而避免重复内容问题并确保正确的国际索引。

为了实现全面且本地化的元数据管理，通常会将 `useSeoMeta` 与 `useLocaleHead()` 结合使用。`useLocaleHead()` 返回一个响应式对象，其中包含 HTML 属性、链接和元标签，这些都是根据当前区域设置生成的。然后，这些属性可以传递给 Nuxt 的 `useHead` 组合式函数（`useSeoMeta` 是 `useHead` 的一个更高级别的封装），以将其与页面的其他自定义元数据合并。

以下是在 `app.vue` 和页面组件中结合使用这些函数的示例：

**`app.vue` (全局布局，处理 `<html>` 标签的 `lang` 和 `hreflang` 链接):**

代码段

```
<script setup>
import { computed } from 'vue';
import { useI18n, useLocaleHead } from '#imports'; // 或从 '@nuxtjs/i18n' 导入
import { useHead } from '#app'; // 或从 'nuxt/app' 导入

const route = useRoute();
const { t } = useI18n();
const i18nHead = useLocaleHead({
  addDirAttribute: true, // 添加 dir 属性
  addCanonicalLinks: true, // 添加规范链接
  addHreflangLinks: true, // 添加 hreflang 链接
});

// 计算页面标题，可以从路由元数据或 i18n 消息中获取
const title = computed(() => {
  // 假设路由元数据中定义了 titleKey
  const pageTitleKey = route.meta.titleKey |

| 'pages.title.home';
  return t(pageTitleKey);
});

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
    dir: i18nHead.value.htmlAttrs.dir,
  },
  link: [
   ...(i18nHead.value.link ||), // 合并 i18n 生成的链接 (hreflang, canonical)
  ],
  meta: [
   ...(i18nHead.value.meta ||), // 合并 i18n 生成的元标签 (og:locale)
    {
      name: 'description',
      content: t('pages.home.description'), // 全局默认描述
    },
    {
      property: 'og:title',
      content: title.value, // 全局默认 Open Graph 标题
    },
    {
      property: 'og:description',
      content: t('pages.home.description'), // 全局默认 Open Graph 描述
    },
    //...其他全局元标签
  ],
  title: title.value, // 设置页面标题
}));
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

8

**`pages/about/index.vue` (页面级覆盖):**

代码段

```
<script setup lang="ts">
import { useI18n } from '#imports'; // 或从 '@nuxtjs/i18n' 导入
import { useSeoMeta, definePageMeta } from '#app'; // 或从 'nuxt/app' 导入

const { t } = useI18n();

// 使用 definePageMeta 设置路由元数据，可用于布局或全局标题模板
definePageMeta({
  titleKey: 'pages.title.about', // 引用 i18n 消息键
});

// 使用 useSeoMeta 设置页面特定的 SEO 元数据
useSeoMeta({
  title: t('pages.title.about'), // 页面标题
  description: t('pages.about.description'), // 页面描述
  ogTitle: t('pages.title.about'), // Open Graph 标题
  ogDescription: t('pages.about.description'), // Open Graph 描述
  ogImage: 'https://www.your-domain.com/images/about-og.jpg', // 页面特定 OG 图像
  twitterCard: 'summary_large_image',
  //...其他页面特定元标签
});
</script>

<template>
  <div>
    <h2>{{ $t('pages.about.description') }}</h2>
    <p>{{ $t('pages.about.content') }}</p>
  </div>
</template>
```

8

这种组合式函数的使用模式确保了所有元数据，无论是通用还是区域设置特定，都得到整合并正确渲染，从而向搜索引擎提供一致且优化的信号。它利用了 Nuxt 强大的头部管理系统，避免了手动处理 `<head>` 标签的复杂性，并允许开发者以声明式和响应式的方式管理 SEO 属性。

### 使用 `@nuxtjs/og-image` 进行本地化开放图谱 (OG) 图像设置

开放图谱 (Open Graph) 图像在社交媒体分享中扮演着关键角色，能够显著提高点击率 22。

`@nuxtjs/og-image` 模块允许您使用 Vue 模板或页面截图动态生成这些图像 3。

为了实现多语言 OG 图像，需要考虑以下几点：

1. **字体支持非英语字符**: 默认情况下，`@nuxtjs/og-image` 使用 Inter 字体，该字体不支持非英语字符 16。要正确渲染包含中文、日文或其他非拉丁字符的 OG 图像，您需要在
    
    `nuxt.config.ts` 中配置支持多语言的字体，例如 Google Fonts 的 Noto Typeface 16。
    
    TypeScript
    
    ```
    // nuxt.config.ts
    export default defineNuxtConfig({
      ogImage: {
        fonts:,
      },
      //...其他配置
    });
    ```
    
    17
    
2. **动态翻译内容**: 在 OG 图像组件内部，您可以使用 `useI18n` 组合式函数来动态获取当前区域设置的翻译内容，从而确保 OG 图像的标题和描述与页面内容保持一致 8。
    
    代码段
    
    ```
    <script setup lang="ts">
    import { useI18n } from '#imports';
    
    const { t } = useI18n();
    
    // 定义组件接收的 props，例如 titleKey 和 descriptionKey
    const props = defineProps<{
      titleKey: string;
      descriptionKey: string;
    }>();
    
    // 使用 i18n 翻译动态内容
    const translatedTitle = t(props.titleKey);
    const translatedDescription = t(props.descriptionKey);
    </script>
    
    <template>
      <div class="w-full h-full flex flex-col justify-center items-center bg-white text-gray-900 p-10">
        <h1 class="text-6xl font-bold text-center">{{ translatedTitle }}</h1>
        <p class="text-3xl text-center mt-4">{{ translatedDescription }}</p>
      </div>
    </template>
    ```
    
    然后在页面中使用 `defineOgImageComponent` 来引用此组件并传递翻译键：
    
    代码段
    
    ```
    <script setup lang="ts">
    import { defineOgImageComponent } from '#imports'; // 或从 'nuxt-og-image' 导入
    
    defineOgImageComponent('OgImageTemplate', {
      titleKey: 'pages.title.home',
      descriptionKey: 'pages.home.description',
    });
    </script>
    
    <template>
      </template>
    ```
    
    23
    

通过这种方式，您可以为每个语言版本生成具有正确翻译文本的动态 OG 图像，从而在社交媒体上提供更相关的预览。

## 5. Schema.org 概念和实施

Schema.org 是一个由 Google、Microsoft、Yahoo 和 Yandex 等主要搜索引擎合作推出的开放社区项目，旨在为网站内容提供标准化的结构化数据标记词汇表 27。通过在网页中嵌入 Schema.org 标记（通常以 JSON-LD 格式，这是 Google 推荐的格式），网站可以向搜索引擎提供关于其内容的明确语义信息 28。

虽然结构化数据本身不是直接的排名因素，但它能够显著提升网站在搜索结果中的可见性。正确应用的 Schema.org 标记可以使您的页面有资格获得“富摘要”（Rich Snippets）和“知识面板”（Knowledge Panels），这些更具视觉吸引力的搜索结果可以提高点击率（CTR）并吸引更多有机流量 28。

`@nuxtjs/schema-org` 模块极大地简化了 Nuxt.js 应用程序中 Schema.org 结构化数据的实施 18。它提供了一个简单易用的 API，基于 Google 和 Yoast 的最佳实践，并支持 30 多种节点类型，能够自动处理关系、日期和 URL 解析，从而快速构建高质量的 Schema.org 图谱。

### Nuxt.js 应用程序中常用的 Schema.org 类型

Schema.org 词汇表包含一系列类型，每种类型都与一组属性相关联，并且这些类型以层次结构组织 27。以下是 Nuxt.js 应用程序中常用的一些 Schema.org 类型及其关键属性和用例：

#### 5.1. `Organization` (组织)

- **定义**: `Organization` 类型用于描述各种类型的组织，例如公司、非政府组织 (NGO)、俱乐部、教育机构等 27。
    
- **用例**: 适用于描述网站所属的公司、产品的制造商、作者的雇主等。它有助于搜索引擎理解您的公司信息，并在搜索结果中显示为富结果或知识面板，尤其对本地 SEO 有益 29。
    
- **关键属性**:
    
    - `name`: 组织的正式名称 29。
        
    - `url`: 组织的官方网站 URL 29。
        
    - `logo`: 组织的标志图像 URL 33。
        
    - `address`: 组织的实际地址 33。
        
    - `contactPoint`: 组织的联系方式，如电话、邮箱、客服类型 33。
        
    - `sameAs`: 指向组织在社交媒体平台或其他权威网站上的相同实体 URL，有助于建立实体之间的明确连接和提高可信度 29。
        
- **示例 (JSON-LD)**:
    
    JSON
    
    ```
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "您的公司名称",
      "url": "https://www.your-company.com",
      "logo": "https://www.your-company.com/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main St",
        "addressLocality": "Anytown",
        "addressRegion": "CA",
        "postalCode": "90210",
        "addressCountry": "US"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-555-1234",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://twitter.com/yourcompany",
        "https://linkedin.com/company/yourcompany"
      ]
    }
    ```
    

#### 5.2. `Person` (人物)

- **定义**: `Person` 类型用于描述一个人，无论是真实的、已故的还是虚构的人物 30。
    
- **用例**: 适用于个人网站或博客的所有者、公司“关于我们”页面上的团队成员、作者页面等 30。通过提供详细的结构化数据，可以提升个人资料在搜索结果中的可见性，并可能显示富摘要，如照片、职位和社交资料 30。
    
- **关键属性**:
    
    - `name`: 人物的全名 35。
        
    - `jobTitle`: 人物的职位或职业 35。
        
    - `url`: 人物的个人网站或相关页面 URL 35。
        
    - `image`: 人物的照片 URL 35。
        
    - `sameAs`: 指向人物在社交媒体或其他权威网站上的相同实体 URL 35。
        
    - `affiliation`: 人物所属的组织 35。
        
- **示例 (JSON-LD)**:
    
    JSON
    
    ```
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "张三",
      "jobTitle": "高级软件工程师",
      "url": "https://www.zhangsan.com",
      "image": "https://www.zhangsan.com/images/zhangsan.jpg",
      "sameAs": [
        "https://linkedin.com/in/zhangsan",
        "https://github.com/zhangsan"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "您的公司名称"
      }
    }
    ```
    

#### 5.3. `WebSite` (网站)

- **定义**: `WebSite` 类型表示一个相关网页和其他项目的集合，通常由单个网络域名提供并通过 URL 访问 27。
    
- **用例**: 通常用于网站的首页，帮助搜索引擎理解网站的整体结构和导航，并可能启用 Sitelinks Search Box 功能，让用户直接在 Google 搜索结果中搜索您的网站内容 38。
    
- **关键属性**:
    
    - `name`: 网站的名称 37。
        
    - `url`: 网站的根 URL 37。
        
    - `potentialAction`: 描述网站上可能发生的潜在操作，例如搜索功能 37。
        
- **示例 (JSON-LD)**:
    
    JSON
    
    ```
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://www.your-domain.com",
      "name": "您的精彩网站",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.your-domain.com/search?q={query}",
        "query-input": "required name=query"
      }
    }
    ```
    

#### 5.4. `WebPage` (网页)

- **定义**: `WebPage` 类型表示单个网页，它是 `CreativeWork` 的子类型 28。虽然默认情况下搜索引擎会假定任何网页都是
    
    `WebPage` 类型，但显式声明此类型并添加特定属性可以提供更丰富的上下文信息，从而增强搜索引擎对页面内容的理解 41。
    
- **用例**: 适用于网站上的任何单个页面。
    
- **关键属性**:
    
    - `name`: 网页的标题 40。
        
    - `description`: 网页的简短描述 40。
        
    - `breadcrumb`: 描述一组链接，帮助用户理解和导航网站层次结构 40。
        
    - `lastReviewed`: 网页内容最后一次审查的日期 40。
        
    - `reviewedBy`: 审查网页内容准确性或完整性的人员或组织 40。
        
    - `isPartOf`: 指示此网页是哪个 `WebSite` 的一部分 28。
        
- **示例 (JSON-LD)**:
    
    JSON
    
    ```
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "关于我们",
      "description": "了解我们的使命和团队。",
      "url": "https://www.your-domain.com/about",
      "isPartOf": {
        "@type": "WebSite",
        "url": "https://www.your-domain.com",
        "name": "您的精彩网站"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "首页",
            "item": "https://www.your-domain.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "关于我们",
            "item": "https://www.your-domain.com/about"
          }
        ]
      }
    }
    ```
    

#### 5.5. `Article` (文章)

- **定义**: `Article` 类型是 `CreativeWork` 的子类型，用于描述文章，如新闻文章、博客文章或学术报告 43。
    
- **用例**: 适用于博客文章、新闻报道、技术文章、研究论文等。添加 `Article` 结构化数据可以帮助 Google 更好地理解网页内容，并在搜索结果中显示更优化的标题、图像和日期信息 45。
    
- **关键属性**:
    
    - `headline`: 文章的标题 43。
        
    - `image`: 文章的主要图像 URL 43。
        
    - `datePublished`: 文章首次发布或广播的日期 43。
        
    - `author`: 文章的作者 (可以是 `Person` 或 `Organization`) 43。
        
    - `publisher`: 文章的发布者 (通常是 `Organization`) 43。
        
    - `articleBody`: 文章的实际正文内容 43。
        
    - `articleSection`: 文章所属的杂志或报纸的“部分”（如“体育”、“生活方式”） 43。
        
- **示例 (JSON-LD)**:
    
    JSON
    
    ```
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Nuxt.js SEO 和 i18n 集成指南",
      "image": [
        "https://www.your-domain.com/images/article-hero.jpg"
      ],
      "datePublished": "2024-07-20T08:00:00+08:00",
      "dateModified": "2024-07-20T09:30:00+08:00",
      "author": {
        "@type": "Person",
        "name": "李明",
        "url": "https://www.your-domain.com/authors/liming"
      },
      "publisher": {
        "@type": "Organization",
        "name": "您的公司名称",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.your-domain.com/images/logo.png"
        }
      },
      "description": "一份关于如何在 Nuxt.js 中集成 SEO 和 i18n 的全面指南。",
      "articleBody": "本文详细介绍了如何在 Nuxt.js 项目中有效地集成 @nuxtjs/seo 和 @nuxtjs/i18n 模块...",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.your-domain.com/zh/articles/seo-i18n-guide"
      }
    }
    ```
    

### 使用 `@nuxtjs/schema-org` 实现 Schema.org

`@nuxtjs/schema-org` 模块提供了 `useSchemaOrg` 组合式函数，允许您在 Vue 组件中声明式地添加 Schema.org 节点。

代码段

```
<script setup lang="ts">
import { useSchemaOrg, defineWebPage, defineArticle, definePerson } from '#imports'; // 或从 'nuxt-schema-org' 导入

// 假设从 API 获取文章数据
const { data: article } = await useAsyncData('article', () =>
  $fetch('/api/article/my-seo-guide')
);

// 定义作者信息
const author = definePerson({
  name: '李明',
  url: 'https://www.your-domain.com/authors/liming',
  image: 'https://www.your-domain.com/images/liming.jpg',
});

// 定义 Schema.org 结构
useSchemaOrg();
</script>

<template>
  <div>
    <h1>{{ article.title }}</h1>
    <p>{{ article.excerpt }}</p>
    </div>
</template>
```

此外，`@nuxtjs/schema-org` 还提供了 `setupIdentity` 函数，用于在全局范围内设置站点身份，这通常在 `nuxt.config.ts` 或插件中完成，以确保所有页面都继承基本的组织或个人信息 18。

## 6. 工具函数和最佳实践

为了在 Nuxt.js 多语言项目中实现高效且可维护的 SEO 集成，开发自定义工具函数和遵循最佳实践至关重要。

### 自定义工具函数（组合式函数）

创建自定义组合式函数（Composables）是 Nuxt 3 和 Vue 3 的推荐模式，用于封装可复用的逻辑。这有助于集中管理复杂的 SEO 和 i18n 逻辑，减少页面组件中的样板代码。

例如，可以创建一个 `useLocalizedMeta` 组合式函数来集中生成一组完整的本地化元标签（标题、描述、OG 标签、规范链接和 `hreflang` 链接）：

TypeScript

```
// composables/useLocalizedMeta.ts
import { computed } from 'vue';
import { useI18n, useLocaleHead } from '#imports';
import { useSeoMeta, useHead } from '#app'; // Nuxt 3 的头部管理

interface LocalizedMetaOptions {
  titleKey: string;
  descriptionKey: string;
  ogImage?: string;
  canonicalPath?: string;
  //... 其他自定义选项
}

export function useLocalizedMeta(options: LocalizedMetaOptions) {
  const { t, locale } = useI18n();
  const route = useRoute();

  // 获取 i18n 模块生成的头部信息 (lang, hreflang, og:locale)
  const i18nHead = useLocaleHead({
    addDirAttribute: true,
    addCanonicalLinks: true,
    addHreflangLinks: true,
    seo: {
      canonicalQueries:, // 根据需要配置是否包含查询参数
    },
  });

  // 动态计算标题和描述
  const pageTitle = computed(() => t(options.titleKey));
  const pageDescription = computed(() => t(options.descriptionKey));

  // 设置 SEO 元数据
  useSeoMeta({
    title: pageTitle.value,
    description: pageDescription.value,
    ogTitle: pageTitle.value,
    ogDescription: pageDescription.value,
    ogImage: options.ogImage |

| 'https://www.your-domain.com/default-og.jpg',
    ogUrl: computed(() => i18nHead.value.link?.find(l => l.rel === 'canonical')?.href |

| route.fullPath),
    twitterCard: 'summary_large_image',
    //... 其他通用 SEO 标签
  });

  // 将 i18n 生成的 HTML 属性和链接应用到 <head>
  useHead(() => ({
    htmlAttrs: {
      lang: i18nHead.value.htmlAttrs.lang,
      dir: i18nHead.value.htmlAttrs.dir,
    },
    link: [
     ...(i18nHead.value.link ||),
      // 如果有自定义的规范链接，可以在这里添加或覆盖
     ...(options.canonicalPath? [{ rel: 'canonical', href: options.canonicalPath }] :),
    ],
    meta: [
     ...(i18nHead.value.meta ||),
    ],
  }));
}
```

然后在任何页面或组件中简单地使用它：

代码段

```
<script setup lang="ts">
import { useLocalizedMeta } from '~/composables/useLocalizedMeta'; // 假设路径

// 假设产品数据
const productId = useRoute().params.id;
const { data: product } = await useAsyncData(`product-${productId}`, () =>
  $fetch(`/api/products/${productId}`)
);

useLocalizedMeta({
  titleKey: `products.${product.value.id}.title`, // 假设翻译键
  descriptionKey: `products.${product.value.id}.description`,
  ogImage: product.value.imageUrl,
  canonicalPath: `https://www.your-domain.com/products/${product.value.id}`,
});
</script>

<template>
  <div>
    <h1>{{ product.title }}</h1>
    <p>{{ product.description }}</p>
  </div>
</template>
```

### i18n 上下文中的 SEO 最佳实践

在多语言环境中实现 SEO 需要特别注意以下最佳实践：

- **规范 URL (Canonical URLs)**: 确保所有页面的规范 URL 设置正确。这对于处理默认语言的带前缀和不带前缀的 URL（例如 `/en/page` 和 `/page`）以及处理查询参数至关重要 8。规范标签应始终指向内容的权威版本，以避免搜索引擎将重复内容视为惩罚因素。
    
- **`hreflang` 实施**: `hreflang` 标签是告诉搜索引擎您的页面有哪些语言或区域变体的关键。确保 `hreflang` 属性准确且完整，包括 `x-default` 标签，它指定了当没有其他语言或区域匹配时应显示的默认页面 8。
    
    `@nuxtjs/i18n` 的 `useLocaleHead` 组合式函数会自动生成这些标签，但验证其输出至关重要。
    
- **本地化内容质量**: 除了元标签，高质量且完全翻译的内容本身就是最重要的 SEO 因素。确保翻译自然、准确，并针对目标区域的文化和搜索习惯进行优化。避免使用机器翻译而未经人工审核。
    
- **性能优化**: SEO 和 i18n 都可能影响网站性能。多语言内容意味着更多的资源和潜在的加载时间。利用 Nuxt.js 的服务器端渲染 (SSR) 或静态站点生成 (SSG) 功能，可以显著提高初始页面加载速度和搜索引擎爬取效率。同时，优化图像、精简代码和利用 CDN 也是关键。
    
- **测试和验证**: 定期使用 Google Search Console、Google 富结果测试工具和 Schema.org 标记验证器等工具来测试和验证您的 SEO 和结构化数据实施 27。这些工具可以帮助您识别错误、警告和潜在的改进点，确保搜索引擎能够正确理解和展示您的内容。
    

## 7. 结论与建议

将 `@nuxtjs/seo` 和 `@nuxtjs/i18n` 模块集成到 Nuxt.js 应用程序中，是构建在全球范围内具有高可见性和用户参与度的网站的关键策略。这种集成不仅简化了复杂的国际化和 SEO 任务，还通过自动化和标准化流程，确保了搜索引擎能够准确理解和索引多语言内容。

**主要结论包括：**

- **模块化与集成优势：** `@nuxtjs/seo` 作为别名模块，通过整合 Sitemap、Robots、OG Image 和 Schema.org 等功能，大大简化了技术 SEO 的实施。它与 `@nuxtjs/i18n` 的无缝集成，使得语言和区域设置信息能够智能地应用于所有 SEO 元素，从而避免了手动配置的复杂性和潜在错误。
    
- **配置的战略重要性：** `nuxt.config.ts` 中的 `baseUrl` 设置对于生成正确的 `hreflang` 链接和规范 URL 至关重要，它直接影响搜索引擎对内容权威性和国际化版本的理解。`i18n` 模块的 `locales` 和 `defaultLocale` 配置是所有本地化 SEO 策略的基础。
    
- **动态元数据管理：** Nuxt 3 的头部管理系统与 `useLocaleHead()` 和 `useSeoMeta` 组合式函数的结合，提供了一个强大且灵活的机制，用于在页面级别动态生成和合并本地化元数据，确保了所有 SEO 信号的一致性和优化。
    
- **结构化数据的价值：** Schema.org 标记虽然不是直接的排名因素，但通过提供明确的语义上下文，能够显著提升搜索结果的视觉吸引力（富摘要、知识面板），从而提高点击率和用户体验。`@nuxtjs/schema-org` 模块简化了这些关键结构化数据的实施。
    
- **版本兼容性的挑战：** 模块和依赖项之间的版本兼容性是一个持续存在的挑战。开发者必须密切关注模块的推荐版本和迁移指南，以避免因版本不匹配而导致的运行时错误和功能异常。
    

**基于这些结论，我们提出以下可操作的建议：**

1. **优先进行基础配置：** 在项目初期，务必准确配置 `nuxt.config.ts` 中的 `i18n.locales`、`i18n.defaultLocale` 和 `i18n.baseUrl`。这些是所有后续本地化 SEO 工作的基础，任何错误都可能导致严重的索引问题。
    
2. **定期审查模块兼容性：** 随着 Nuxt.js 和相关模块的不断更新，定期检查 `package.json` 中的依赖版本，并参考官方文档或社区资源，确保所有模块都处于兼容的工作状态。在进行重大版本升级前，务必查阅迁移指南。
    
3. **充分利用 Nuxt 组合式函数：** 拥抱 `useLocaleHead()`、`useSeoMeta` 和 `useSchemaOrg` 等组合式函数。通过创建自定义工具函数来封装通用逻辑，可以提高代码的可维护性和复用性，同时确保所有页面都遵循一致的 SEO 最佳实践。
    
4. **战略性实施 Schema.org：** 识别您网站的关键实体（例如，组织、人物、产品、文章）并有策略地应用相应的 Schema.org 标记。优先考虑那些能够生成富摘要的类型，以最大化搜索结果的可见性和吸引力。
    
5. **持续测试和验证：** SEO 是一个持续优化的过程。定期使用 Google Search Console、富结果测试工具和站点地图验证器等工具来监控网站的 SEO 表现，及时发现并解决潜在问题。确保所有本地化页面都能被正确爬取、索引和呈现。
    

通过遵循这些指南，开发者可以构建出不仅功能强大、用户体验卓越，而且在搜索引擎中表现出色的 Nuxt.js 多语言应用程序。



#### 引用的著作

1. Nuxt SEO · All-in-one Technical SEO for Nuxt, 访问时间为 七月 22, 2025， [https://nuxtseo.com/](https://nuxtseo.com/)
    
2. Install Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/nuxt-seo/getting-started/installation](https://nuxtseo.com/docs/nuxt-seo/getting-started/installation)
    
3. Quick Module Setup Guide · Nuxt Nuxt SEO · Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/nuxt-seo/guides/using-the-modules](https://nuxtseo.com/docs/nuxt-seo/guides/using-the-modules)
    
4. Nuxt 3 integration - Vue I18n, 访问时间为 七月 22, 2025， [https://vue-i18n.intlify.dev/guide/integrations/nuxt3](https://vue-i18n.intlify.dev/guide/integrations/nuxt3)
    
5. @nuxtjs/i18n - npm, 访问时间为 七月 22, 2025， [https://www.npmjs.com/package/@nuxtjs/i18n](https://www.npmjs.com/package/@nuxtjs/i18n)
    
6. Installation - @nuxtjs/i18n, 访问时间为 七月 22, 2025， [https://i18n.nuxtjs.org/docs/getting-started](https://i18n.nuxtjs.org/docs/getting-started)
    
7. The Complete Guide to Nuxt Localization - Phrase, 访问时间为 七月 22, 2025， [https://phrase.com/blog/posts/nuxt-js-tutorial-i18n/](https://phrase.com/blog/posts/nuxt-js-tutorial-i18n/)
    
8. SEO - @nuxtjs/i18n, 访问时间为 七月 22, 2025， [https://i18n.nuxtjs.org/docs/guide/seo](https://i18n.nuxtjs.org/docs/guide/seo)
    
9. i18n [plugin:nuxtjs:i18n-resource] Cannot read properties of undefined (reading 'options') - Nuxt - Answer Overflow, 访问时间为 七月 22, 2025， [https://www.answeroverflow.com/m/1354172440376512663](https://www.answeroverflow.com/m/1354172440376512663)
    
10. Setup - Nuxt TypeScript, 访问时间为 七月 22, 2025， [https://typescript.nuxtjs.org/guide/setup](https://typescript.nuxtjs.org/guide/setup)
    
11. Migration Guide - @nuxtjs/i18n, 访问时间为 七月 22, 2025， [https://i18n.nuxtjs.org/docs/guide/migrating](https://i18n.nuxtjs.org/docs/guide/migrating)
    
12. Nuxt I18n · Nuxt Robots, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/robots/guides/i18n](https://nuxtseo.com/docs/robots/guides/i18n)
    
13. Install Nuxt Sitemap - Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/sitemap/getting-started/installation](https://nuxtseo.com/docs/sitemap/getting-started/installation)
    
14. I18n · Nuxt Sitemap, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/sitemap/guides/i18n](https://nuxtseo.com/docs/sitemap/guides/i18n)
    
15. @nuxtjs/sitemap · Nuxt Modules, 访问时间为 七月 22, 2025， [https://nuxt.com/modules/sitemap](https://nuxt.com/modules/sitemap)
    
16. Install Nuxt OG Image - Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/og-image/getting-started/installation](https://nuxtseo.com/docs/og-image/getting-started/installation)
    
17. Non-English Locales · Nuxt OG Image · Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/og-image/guides/non-english-locales](https://nuxtseo.com/docs/og-image/guides/non-english-locales)
    
18. Install Nuxt Schema.org - Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/schema-org/getting-started/installation](https://nuxtseo.com/docs/schema-org/getting-started/installation)
    
19. Install Nuxt Robots - Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/robots/getting-started/installation](https://nuxtseo.com/docs/robots/getting-started/installation)
    
20. Mastering Meta in Vue & Nuxt · Nuxt SEO, 访问时间为 七月 22, 2025， [https://nuxtseo.com/learn/mastering-meta](https://nuxtseo.com/learn/mastering-meta)
    
21. useLocaleHead - @nuxtjs/i18n, 访问时间为 七月 22, 2025， [https://i18n.nuxtjs.org/docs/composables/use-locale-head](https://i18n.nuxtjs.org/docs/composables/use-locale-head)
    
22. nuxt-og-image · Nuxt Modules, 访问时间为 七月 22, 2025， [https://nuxt.com/modules/og-image](https://nuxt.com/modules/og-image)
    
23. How to Create Dynamic OG Images in Nuxt - DEV Community, 访问时间为 七月 22, 2025， [https://dev.to/jacobandrewsky/how-to-create-dynamic-og-images-in-nuxt-1ehf](https://dev.to/jacobandrewsky/how-to-create-dynamic-og-images-in-nuxt-1ehf)
    
24. How to properly set multi-language `title` and open graph meta tags in Nuxt 3?, 访问时间为 七月 22, 2025， [https://stackoverflow.com/questions/79411044/how-to-properly-set-multi-language-title-and-open-graph-meta-tags-in-nuxt-3](https://stackoverflow.com/questions/79411044/how-to-properly-set-multi-language-title-and-open-graph-meta-tags-in-nuxt-3)
    
25. useSeoMeta with i18n - Nuxt - Answer Overflow, 访问时间为 七月 22, 2025， [https://www.answeroverflow.com/m/1344243149639254058](https://www.answeroverflow.com/m/1344243149639254058)
    
26. defineOgImage() · Nuxt OG Image, 访问时间为 七月 22, 2025， [https://nuxtseo.com/docs/og-image/api/define-og-image](https://nuxtseo.com/docs/og-image/api/define-og-image)
    
27. Schema.org - Wikipedia, 访问时间为 七月 22, 2025， [https://en.wikipedia.org/wiki/Schema.org](https://en.wikipedia.org/wiki/Schema.org)
    
28. What Is Schema Markup & Why Is It Important For SEO? - Search Engine Journal, 访问时间为 七月 22, 2025， [https://www.searchenginejournal.com/technical-seo/schema/](https://www.searchenginejournal.com/technical-seo/schema/)
    
29. Organization Schema: What It Is & How to Implement It, 访问时间为 七月 22, 2025， [https://www.semrush.com/blog/schema-markup-for-company-corporations/](https://www.semrush.com/blog/schema-markup-for-company-corporations/)
    
30. What is Person Schema? Definition, Example & Implementation Guide - Infidigit, 访问时间为 七月 22, 2025， [https://www.infidigit.com/blog/what-is-person-schema/](https://www.infidigit.com/blog/what-is-person-schema/)
    
31. schema-org - Nuxt Modules, 访问时间为 七月 22, 2025， [https://nuxt.com/modules/schema-org](https://nuxt.com/modules/schema-org)
    
32. Organization of Schemas, 访问时间为 七月 22, 2025， [https://schema.org/docs/schemas.html](https://schema.org/docs/schemas.html)
    
33. Organization - Schema.org Type, 访问时间为 七月 22, 2025， [https://schema.org/Organization](https://schema.org/Organization)
    
34. How to use Organization Schema - Hill Web Creations, 访问时间为 七月 22, 2025， [https://www.hillwebcreations.com/organization-schema/](https://www.hillwebcreations.com/organization-schema/)
    
35. Person - Schema.org Type, 访问时间为 七月 22, 2025， [https://schema.org/Person](https://schema.org/Person)
    
36. Person Schema Markup - AIOSEO, 访问时间为 七月 22, 2025， [https://aioseo.com/seo-glossary/person-schema-markup/](https://aioseo.com/seo-glossary/person-schema-markup/)
    
37. WebSite - Schema.org Type, 访问时间为 七月 22, 2025， [https://schema.org/WebSite](https://schema.org/WebSite)
    
38. What is WebSite Schema and How Do You Implement It? - Rank Math, 访问时间为 七月 22, 2025， [https://rankmath.com/kb/website-schema/](https://rankmath.com/kb/website-schema/)
    
39. What is Schema.org? - IONOS, 访问时间为 七月 22, 2025， [https://www.ionos.com/digitalguide/websites/website-creation/overview-of-schemaorg/](https://www.ionos.com/digitalguide/websites/website-creation/overview-of-schemaorg/)
    
40. WebPage - Schema.org Type, 访问时间为 七月 22, 2025， [https://schema.org/WebPage](https://schema.org/WebPage)
    
41. Webpage schema - InLinks, 访问时间为 七月 22, 2025， [https://inlinks.com/help/webpage-schema/](https://inlinks.com/help/webpage-schema/)
    
42. SCHEMA.ORG – Structured Data – Basic Markup - SEO Agency Serpact, 访问时间为 七月 22, 2025， [https://serpact.com/schema-org-structured-data-basic-markup/](https://serpact.com/schema-org-structured-data-basic-markup/)
    
43. Article - Schema.org Type, 访问时间为 七月 22, 2025， [https://schema.org/Article](https://schema.org/Article)
    
44. Schema.org Article > BlogPosting, NewsArticle, ScholarlyArticle Types tutorial - w3resource, 访问时间为 七月 22, 2025， [https://www.w3resource.com/schema.org/Article.php](https://www.w3resource.com/schema.org/Article.php)
    
45. Learn About Article Schema Markup | Google Search Central | Documentation, 访问时间为 七月 22, 2025， [https://developers.google.com/search/docs/appearance/structured-data/article](https://developers.google.com/search/docs/appearance/structured-data/article)
    