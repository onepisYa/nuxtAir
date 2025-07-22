# 已完成

- [x] 移除 Element-UI
  - [x] 移除 package.json 中的依赖
  - [x] 更新 nuxt.config.ts 中的模块配置
  - [x] 删除 element.scss、暂时不管也没有关系
  - [x] 更新 README.md README.md 文件中仍然提到了 Element Plus 图标库，这与移除 Element-UI 的目标不符。建议更新此文件，移除相关描述。
  - [x] 移除 user.ts 中残留的 Element-UI 代码 在 `user.ts` 的 logout 函数中，错误处理部分仍在使用 ElMessage ，这应该是 Element-UI 的组件。建议替换为 Nuxt UI 提供的 useToast 。
  - [x] 删除 upload.vue

---


- [x] `app/composables/dicts.ts` 中的 `dict` 函数在缓存未命中时，会立即返回一个空数组，然后异步获取数据。这可能导致在数据加载完成前，组件渲染出空状态，并在数据到达后再次更新，引发不必要的重绘和潜在的逻辑错误。 已改进为状态管理模式，添加loading和error状态。
- [x] `_dict` 函数在处理字典数据时，依赖于 `dict()` 返回的是一个数组。然而，`Dicts` 类型定义允许非数组类型，这在理论上可能导致运行时错误。虽然当前实现总是返回数组，但从类型安全的角度来看，这是一个潜在的风险。已修正类型定义，确保类型安全。
- [x]  nuxt.config.ts 中 head.link 配置不生效、不确定我们应该用什么方案加载 icon 和静态资源 svg 之类的。现在我们是开启了 ssr 的状态。
  - 响应头 看起来像是路由问题?无论我是开着还是关着 ssr 和 nitro 的 preset 都是这个结果。现在 public 中的可以使用了、 但是在 `~/assets` 中的还是无法使用。

- [x] `app/composables/index.ts` 中硬编码了 `phonenumber` 和 `sitename` 等变量。这种做法不利于配置管理和在不同环境（如开发、测试、生产）中进行部署。已移至runtimeConfig配置。
  - [x] 这样会报错、因为获取不到 nuxt 实例、实际上我们使用这中 useXXX 这样的 composables function 的时候、就有这样的限制。

---

已删除的 Element-UI 依赖

```json
"@element-plus/icons-vue": ">=2.3.1",
"@element-plus/nuxt": "1.1.3",
"element-plus": "^2.10.2",
```

- [x]  `app/composables/index.ts` 中的 `decodeHtmlEntities` 函数在客户端使用 DOM API 解码，但在服务端则通过正则表达式进行手动替换。这种不一致可能导致在服务端渲染（SSR）和客户端渲染（CSR）之间出现内容差异，特别是在处理未被正则表达式覆盖的 HTML 实体时。 已改进服务端正则表达式处理，增加更多HTML实体支持，确保解码行为的一致性。
  - 已使用 he 库的 `decode` 函数替换原有的客户端/服务端分离逻辑，确保 SSR 和 CSR 完全一致的 HTML 实体解码行为。
- [x] 修改 env 文件和 nuxt.config.ts 中的 runtimeConfig 映射配置、确保 env 文件中的变量名称与 runtimeConfig 映射配置一致。
- [x] 网络测试 使用 https://jsonplaceholder.typicode.com 测试网络请求，并确保请求成功。
- [x] useAlova 中使用的 runtimeConfig 映射确认。
- [x] useAlova.ts 错误处理和相关配置
- [x] runtimeConfig 配置处理 nuxt.config.ts
- [x] 网络相关环境变量处理
- [x] eslint.config 注释 unocss 配置。
- [x] tailwind.config 配置处理
- [x] ssr 需要开启、在 nuxt.config.ts 中、还有 nitro 配置、现在是 'static'、我们需要了解
  - 后续需要将 ssr 设置为 true 并可能需要更改 nitro.preset 为 'node-server' ，届时需要仔细测试所有组件和数据获取在服务端的兼容性。
  - https://nuxt.com/docs/4.x/api/nuxt-config#nitro 中提到了 ssr 相关配置、需要了解。

# 可选项

- [ ] 添加相关依赖 比如 headless ui
- [ ] 添加相关文档到上下文
  - [x] nuxt 文档
  - [x] nuxt/ui 文档
  - [ ] headless ui
  - [ ] shadcn/vue
- [ ] 配置 alova 自动提取 swagger api 生成接口客户端
- [ ] 编写项目规则
- [ ] 修复常见的类型错误
- [ ] 动态显示用户名 在 `Header.vue line:31` 组件中，登录后显示的按钮文本是静态的“用户名”。建议修改为动态显示用户的实际名称，例如从 user store 中获取。 可能也不需要、因为业务还没有确定、所以暂时不用管。 

```html
{{ user().info.contactName || '用户名' }}
```

- [ ] `app/stores/user.ts` 中的 `info_template` 对象结构庞大，且大量字段被初始化为 `null`。这不仅使状态难以管理，还可能在访问属性时引发 `null` 异常，增加了类型风险。 目前业务还不清楚、所以暂时搁置
- [ ] 在 `getUserInfo` 函数的 `catch` 块中，`info` 状态被设置为空对象 `{}`，这与 `info_template` 的结构不匹配。这种不一致可能导致应用在渲染用户信息时出现错误。目前业务还不清楚、所以暂时搁置
- [ ] `user.ts` 中，`token` 的管理从 `useCookie`（已注释）改为了 `ref`，但整个 store 却开启了持久化（`persist: true`）。这种混合使用的方式可能会导致状态管理的混乱，因为 `ref` 默认是内存状态，而 `persist` 会将其存入本地存储，功能上与 `useCookie` 重叠。  目前登录方案也不确定、暂时搁置。
- [ ] 上传组件相关内容暂时都不用处理、也许本项目、根本没有上传需求、暂时搁置。
- [x] nuxt 自定义路由配置文件创建
- [ ] 考虑响应式设计、网站多端适配。先完成 pc 端适配、其次是移动端。不过前面需要考虑好 是断点的方式、还是其他实现方式。

## element.scss 备份

```scss
// - @forward : 这是 Sass 的一个功能，用于将其模块中的变量、混合（mixin）等内容暴露给引用了 element.scss 的文件。
// - with (...) : 这部分代码的作用是覆盖 element-plus/theme-chalk/src/common/var.scss 文件中定义的默认变量。
// - 具体来说，它修改了 Element Plus 的全局颜色配置：
// - 将 主色调 ( primary ) 的基础色 ( base ) 修改为 #57B878 (一种绿色)。
// - 将 警告色 ( warning ) 的基础色 ( base ) 修改为 #EC8200 (一种橙色)。

// @forward 'element-plus/theme-chalk/src/common/var.scss' with ($colors: ('primary': ('base': #57B878,
//     ),
//     'warning': ('base': #EC8200,
//     ),
//   ));

.el-pagination {
  &.is-background {

    & .el-pager li,
    & .btn-next,
    & .btn-prev {
      background-color: #fff;
      border: 1px solid #E4E4E4;
    }
  }
}
```

# 暂时仅处理以下待
- [x] 国际化处理 nuxt i18 方案探索
  - [x] 创建完整的国际化实施方案文档 `todo/i18n-implementation-guide.md`
  - [x] 包含 @nuxtjs/i18n 模块配置、语言文件结构、组件改造指南
  - [x] 提供中英文翻译文件模板和最佳实践建议
- [x] 实现 i18n 与 seo 方案的整合
- [x] 整理相关文档和实施步骤、沉淀技术文档。

- [ ] 网络的 便捷、快捷方法测试。
- [ ] composables 集中导出、这样就不用在使用的时候导入了。
- [ ] 了解 https://nuxt.com/docs/4.x/api/nuxt-config#nitro 中提到了 ssr 相关配置、需要了解。比如部署到自己的服务器上的时候、需要怎么做。
