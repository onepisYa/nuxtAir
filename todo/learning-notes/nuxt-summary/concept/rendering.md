- [rendering](https://nuxt.com/docs/4.x/guide/concepts/rendering)

[中间件（Middlewares）](https://nuxt.com/docs/4.x/guide/directory-structure/middleware) 和 [页面（Pages）](https://nuxt.com/docs/4.x/guide/directory-structure/pages) 在服务器端和客户端激活期间（hydration）运行。

[插件（Plugins）](https://nuxt.com/docs/4.x/guide/directory-structure/plugins) 可以在服务器端、客户端或 **两者** 上运行。

[组件（Components）](https://nuxt.com/docs/4.x/guide/directory-structure/components) 也可以强制仅在客户端运行。

[组合函数（Composables）](https://nuxt.com/docs/4.x/guide/directory-structure/composables) 和 [工具函数（Utilities）](https://nuxt.com/docs/4.x/guide/directory-structure/utils) 的运行上下文取决于其使用场景。

# Nuxt 4.0 渲染模式总结(Rendering Modes)

Nuxt 4.0 支持多种渲染模式，可根据应用需求灵活选择，核心模式及特点如下：

## 1. 通用渲染（Universal Rendering）
- **核心机制**：服务器运行 Vue 代码生成完整 HTML 并返回浏览器，随后浏览器通过"水合（Hydration）"过程绑定交互逻辑，实现服务器与客户端协同渲染。
- **优缺点**：
  - 优点：首屏加载快（浏览器直接展示静态 HTML）、SEO 友好（内容直接在 HTML 中，便于爬虫索引）、保留客户端交互性。
  - 缺点：需考虑服务器与客户端环境差异（如部分 API 仅浏览器支持）、服务器运行有成本（可通过边缘渲染优化）。
- **适用场景**：内容导向型网站（博客、营销页、电商平台、作品集等）。
- **代码执行差异**：初始化逻辑（如变量定义）可能在服务器和客户端均执行，交互逻辑（如点击事件）仅在客户端运行。


## 2. 客户端渲染（Client-Side Rendering）
- **核心机制**：浏览器下载并解析 JavaScript 后，动态生成 HTML，与传统 Vue 应用一致。
- **优缺点**：
  - 优点：开发简单（无需兼容服务器环境）、成本低（可静态托管）、支持离线运行。
  - 缺点：首屏加载慢（依赖 JS 解析）、SEO 差（爬虫难索引动态生成内容）。
- **适用场景**：高交互性应用（SaaS 系统、后台管理工具、在线游戏等）。
- **配置方式**：在 `nuxt.config.ts` 中设置 `ssr: false`，可生成 `index.html`、`200.html`、`404.html` 等静态文件，通过 `nuxt generate` 或 `nuxt build --prerender` 部署。


## 3. 混合渲染（Hybrid Rendering）
- **核心机制**：通过"路由规则（Route Rules）"为不同路由配置差异化渲染模式和缓存策略，支持同一应用中混合使用多种模式。
- **关键路由规则**：
  - `ssr: false`：强制客户端渲染。
  - `prerender: true`：构建时预渲染为静态文件。
  - `swr`：服务器/反向代理缓存（可设置过期时间，过期后后台更新）。
  - `isr`：CDN 缓存（支持 Netlify/Vercel 等平台，内容可保留至下次部署）。
- **示例场景**：首页预渲染、产品页按需生成并缓存1小时、管理页客户端渲染。


## 4. 边缘端渲染（Edge-Side Rendering, ESR）
- **核心机制**：在 CDN 边缘服务器执行渲染，减少数据传输距离，降低延迟。
- **支持平台**：Cloudflare Pages、Vercel Edge Functions、Netlify Edge Functions 等（依赖 Nitro 引擎）。
- **特点**：可与混合渲染结合，通过路由规则实现更精细的性能优化。


## 总结
Nuxt 4.0 渲染模式覆盖了从全服务器渲染到全客户端渲染的全场景，通过混合渲染和边缘渲染进一步优化性能与成本，可根据应用的内容特性、交互需求、部署环境灵活选择。