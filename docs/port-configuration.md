# 端口配置指南

本项目支持通过环境变量灵活配置开发和生产环境的端口，解决端口冲突和部署灵活性问题。

## 配置说明

### 开发环境端口配置

#### 1. 开发服务器端口 (NUXT_DEV_PORT)

```bash
# .env 文件中设置
NUXT_DEV_PORT=4000
```

- **默认值**: 4000
- **作用**: 控制 `npm run dev` 时的服务器端口
- **自动递增**: 如果指定端口被占用，Nuxt 会自动尝试下一个可用端口

#### 2. 开发服务器主机 (NUXT_DEV_HOST)

```bash
# .env 文件中设置
NUXT_DEV_HOST=0.0.0.0
```

- **默认值**: 0.0.0.0
- **可选值**:
  - `localhost` 或 `127.0.0.1`: 仅本机访问
  - `0.0.0.0`: 允许局域网内其他设备访问

#### 3. 局域网访问地址 (NUXT_DEV_NETWORK_HOST)

```bash
# .env 文件中设置
NUXT_DEV_NETWORK_HOST=192.168.1.100
```

- **默认值**: 自动检测本机局域网 IP
- **作用**: 用于生成局域网 baseUrl，方便同事访问
- **使用场景**: 团队开发时，其他设备需要访问开发服务器

### 生产环境端口配置

生产环境的端口由标准的 `PORT` 环境变量控制，系统会智能处理 BASE_URL 和端口的组合：

```bash
# 生产环境端口配置
PORT=8080
NUXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 智能端口处理

系统会自动处理以下情况：

1. **标准端口自动忽略**：
   - HTTP 协议的 80 端口
   - HTTPS 协议的 443 端口

2. **非标准端口自动添加**：
   - 其他端口会自动添加到 BASE_URL 中

### 示例场景

```bash
# 场景 1：标准 HTTPS 端口（443 端口会被忽略）
NUXT_PUBLIC_BASE_URL=https://your-domain.com
PORT=443
# 结果：https://your-domain.com

# 场景 2：非标准端口（8080 端口会被添加）
NUXT_PUBLIC_BASE_URL=https://your-domain.com
PORT=8080
# 结果：https://your-domain.com:8080

# 场景 3：HTTP 标准端口（80 端口会被忽略）
NUXT_PUBLIC_BASE_URL=http://your-domain.com
PORT=80
# 结果：http://your-domain.com
```

```bash
# 生产环境或本地测试生产构建时
PORT=3000 npm run start
```

- **默认值**: 3000
- **控制方式**: 由部署平台或进程管理器自动设置
- **部署平台**: Vercel、Netlify、Railway 等会自动设置 PORT 变量

## 使用示例

### 场景 1: 开发环境端口冲突

当默认的 4000 端口被占用时：

```bash
# 方法 1: 修改 .env 文件
NUXT_DEV_PORT=4000

# 方法 2: 临时使用命令行参数
npm run dev -- --port 5000

# 方法 3: 临时设置环境变量
NUXT_DEV_PORT=5000 npm run dev
```

### 场景 2: 局域网访问开发服务器

为了方便同事访问开发服务器，需要进行完整的局域网访问配置：

```bash
# 1. 获取本机局域网 IP 地址
ifconfig | grep "inet " | grep -v 127.0.0.1

# 2. 在 .env 文件中配置
NUXT_DEV_HOST=0.0.0.0
NUXT_DEV_PORT=4000
NUXT_DEV_NETWORK_HOST=192.168.1.100

# 3. 启动开发服务器
npm run dev
```

配置完成后，可以通过以下地址访问：
- **本地访问**: `http://localhost:4000`
- **局域网访问**: `http://192.168.1.100:4000`
- **自动生成的 baseUrl**: `http://192.168.1.100:4000`

**注意事项**：
- 确保防火墙允许对应端口的访问
- 局域网 IP 地址可能会变化，需要定期更新
- 同事的设备需要在同一局域网内

### 场景 3: 生产环境部署

```bash
# 本地测试生产构建
npm run build
PORT=8080 npm run start

# PM2 部署
PORT=8080 pm2 start ecosystem.config.js

# Docker 部署
docker run -e PORT=8080 -p 8080:8080 your-app
```

## 动态 BASE_URL 生成

项目会根据当前环境和端口配置自动生成正确的 BASE_URL：

### 开发环境

```javascript
// 自动根据 NUXT_DEV_PORT 生成
// 如果 NUXT_DEV_PORT=4000，则生成：
// http://localhost:4000
```

### 生产环境

```javascript
// 使用 .env 中配置的 NUXT_PUBLIC_BASE_URL
// 例如：https://your-domain.com
```

### 在代码中使用

推荐使用 `useBaseUrl` composable（统一 URL 管理）：

```vue
<script setup>
// 推荐方式：使用 useBaseUrl composable
const { getBaseUrl, getFullUrl, getCurrentUrl } = useBaseUrl()

// 获取基础 URL
const baseUrl = getBaseUrl()

// 生成完整的 API 地址
const apiUrl = getFullUrl('/api/users')

// 获取当前页面 URL（SSR 安全）
const currentUrl = getCurrentUrl()
</script>
```

传统方式（仍然支持）：

```vue
<script setup>
const { $config } = useNuxtApp()

// 获取动态生成的 BASE_URL
const baseUrl = $config.public.baseUrl

// 生成完整的 API 地址
const apiUrl = `${baseUrl}/api/users`
</script>
```

## 配置优先级

1. **命令行参数** (最高优先级)
   ```bash
   npm run dev -- --port 5000
   ```

2. **环境变量**
   ```bash
   NUXT_DEV_PORT=4000 npm run dev
   ```

3. **.env 文件配置**
   ```bash
   NUXT_DEV_PORT=3000
   ```

4. **默认值** (最低优先级)
   - 开发环境: 4000
   - 生产环境: 4000

## 常见问题

### Q: 为什么修改了端口但 BASE_URL 没有更新？

A: 确保重启开发服务器，BASE_URL 在启动时生成。如果使用命令行参数修改端口，BASE_URL 可能不会自动更新，建议通过 .env 文件配置。

### Q: 生产环境如何设置端口？

A: 生产环境使用标准的 `PORT` 环境变量，不要使用 `NUXT_DEV_PORT`。大多数部署平台会自动设置这个变量。

### Q: 如何在不同环境使用不同的端口配置？

A: 创建不同的环境文件：

```bash
# .env.development
NUXT_DEV_PORT=3000

# .env.staging
NUXT_DEV_PORT=4000

# .env.production
NUXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 相关文件

- `.env` - 环境变量配置
- `.env.example` - 环境变量配置示例
- `nuxt.config.ts` - Nuxt 配置文件
- `app/composables/useBaseUrl.ts` - URL 管理 composable
- `docs/port-configuration.md` - 本文档
- `docs/url-management.md` - URL 管理系统文档