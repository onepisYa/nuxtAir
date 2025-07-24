- [nuxt-lifecycle](https://nuxt.com/docs/4.x/guide/concepts/nuxt-lifecycle)

# Nuxt 4 生命周期概述
本文档主要介绍 Nuxt 4 应用的生命周期，包括服务器端和客户端的执行步骤、各部分执行顺序及协作方式，帮助理解框架在SSR（服务端渲染）和 CSR（客户端渲染）中的运行机制。

## 服务器端生命周期（针对初始请求）
1. **初始化Nitro服务器及插件（仅一次）**  
   - 基于Nitro服务器引擎，启动时执行`/server/plugins`目录下的插件，可处理全局错误、注册关闭/请求生命周期钩子。  
   - 仅在服务器启动时执行一次；serverless环境下，每次请求都会启动服务器及插件，但不等待插件执行。

2. **执行Nitro服务器中间件**  
   - 对每个请求，执行`server/middleware/`目录下的中间件，用于认证、日志、请求转换等。  
   - 中间件返回值会终止请求并作为响应，需谨慎使用。

3. **初始化Nuxt及执行应用插件**  
   - 创建 Vue 和 Nuxt 实例，执行内置插件（如Vue Router、unhead）及`plugins/`目录下的自定义插件（含`.server`后缀的插件）。  
   - 插件按特定顺序执行，可能存在依赖；执行后调用`app:created`钩子。

4. **路由验证**  
   - 执行`definePageMeta`中定义的`validate`方法，验证动态路由参数。  
   - 返回`true`表示验证通过；返回`false`或含`statusCode`/`statusMessage`的对象表示验证失败，终止请求。

5. **执行Nuxt应用中间件**  
   - 分全局、命名、匿名三种，全局中间件在首次进入应用及每次路由导航前执行；命名/匿名中间件仅在指定路由执行。  
   - 服务器端重定向会发送 `Location` 头，重置应用状态（除非通过cookie持久化状态）。

6. **渲染页面及组件**  
   - 渲染页面和组件，通过 `useFetch`/`useAsyncData` 获取数据。  
   - SSR 时，Vue的`onBeforeMount`/`onMounted`等钩子不执行，无响应式（因渲染为静态HTML）；避免根作用域中需清理的副作用代码（如`setInterval`）。

7. **生成HTML输出**  
   - 结合`unhead`设置生成完整 HTML，发送给客户端。  
   - 渲染后调用 `app:rendered` 钩子；发送 HTML 前，Nitro 调用 `render:html` 钩子，可修改生成的 HTML（如注入脚本、修改元标签）。


## 客户端生命周期（浏览器中执行）
1. **初始化Nuxt及执行应用插件**  
   - 类似服务器端步骤3，执行内置插件及`plugins/`目录下的自定义插件（含`.client`后缀的插件），执行后调用`app:created`钩子。

2. **路由验证**  
   - 同服务器端步骤4，执行`definePageMeta`中的`validate`方法验证路由参数。

3. **执行Nuxt应用中间件**  
   - 与服务器端逻辑类似，可通过`import.meta.client`/`import.meta.server`区分环境执行特定逻辑。

4. **挂载Vue应用及 hydration**  
   - 调用`app.mount('#__nuxt')`挂载应用；SSR/SSG模式下，Vue执行hydration（重建应用、匹配DOM节点、附加事件监听器）。  
   - 需保证服务端与客户端数据一致，建议用`useAsyncData`/`useFetch`复用服务端数据，避免重复请求；挂载前调用`app:beforeMount`钩子，挂载后调用`app:mounted`钩子。

5. **执行完整Vue生命周期**  
   - 浏览器中会执行完整的Vue生命周期（与服务器端不同，服务器端不执行部分Vue钩子）。