Nuxt UI 将自动为您安装 @nuxt/icon、@nuxtjs/tailwindcss 和 @nuxtjs/color-mode 模块。


- [Nuxt UI 模块](https://ui.nuxtjs.org.cn/getting-started/installation#modules)

- [Nuxt Icon 模块](https://github.com/nuxt/icon)
- [Nuxt Color Mode 模块](https://color-mode.nuxtjs.org/)
- [@nuxt/tailwindcss](https://tailwindcss.nuxtjs.org/)


如果您之前已安装这些模块，则应将其从您的 modules 和 dependencies 中删除。

@nuxtjs/tailwindcss 此模块已预先配置，并将自动加载以下插件

@tailwindcss/forms
@tailwindcss/typography
@tailwindcss/aspect-ratio
@tailwindcss/container-queries
@headlessui/tailwindcss

请注意，@tailwindcss/aspect-ratio 插件会禁用默认的纵横比实用程序

aspect-auto
aspect-square
aspect-video

您可以通过将以下内容添加到您的 tailwind.config.ts 文件中重新启用它们


```ts
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9'
      }
    }
  }
}
```

