
# 工作原理

1. composables 目录 : 在 Nuxt 3 项目中， composables/ 是一个特殊的目录。您在这个目录的顶层文件中导出的任何变量或函数，都会被自动注册为全局可用的组合式函数或变量。因此，您无需在 app.vue 中手动导入 sitename 。
2. 类型定义生成 : 正如您指出的，Nuxt 在后台会为您生成类型定义，并存放在 .nuxt/ 目录中，例如 `imports.d.ts` 。这个文件让 TypeScript 和您的 IDE（如 VS Code）能够理解这些全局可用的变量的类型，从而提供准确的类型检查和代码自动补全，但这并不是 sitename 的定义源头，而是对源头的类型映射。

# 文档说明
Nuxt 的官方文档明确指出，它会利用其约定的目录结构自动导入 composables/ 目录中的文件  。这意味着您在 app/composables/index.ts 中定义的任何导出的变量或函数（如 sitename ），都可以在您的应用程序（ .vue , .ts 文件等）中直接使用，而无需手动 import 。

这个特性的主要优点是：

- 简化开发 ：减少了重复的导入语句。
- 类型安全 ：Nuxt 会在后台自动生成类型定义文件（ .nuxt/imports.d.ts ），为您的 IDE 提供完整的类型推断和自动补全 1 。
- 代码分割 ：仅在生产代码中包含实际使用到的部分，不会造成不必要的打包体积增大  。

- [auto-imports 约定](https://nuxt.com/docs/4.x/guide/concepts/auto-imports)
- [auto-import 游乐场](https://learn.nuxt.com/en/concepts/auto-imports)
- [nuxt 项目结构](https://nuxt.com/docs/guide/directory-structure/composables)

```ts
// nuxt.config.ts
// ... existing code ...
  imports: {
    presets: [
      {
        from: 'alova/client',
        imports: ['useRequest', 'usePagination', 'useForm'],
      },
    ],
  },
// ... existing code ...
```
此配置的作用是 增加 了来自第三方库 alova/client 的自动导入，而不是修改或禁用 Nuxt 对 composables 目录的默认扫描行为。如果要禁用，需要显式设置 `imports: { autoImport: false }`  ，但我的配置中没有这样做。

