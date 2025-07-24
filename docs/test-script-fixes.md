# 测试脚本进程管理修复

## 问题描述

`scripts/test-port-config.cjs` 脚本在运行完成后会有挂起的进程，导致脚本无法正常退出。

## 问题原因

1. **不完整的进程终止**：原始代码只使用 `child.kill('SIGTERM')` 终止主进程，但没有处理子进程组
2. **缺少强制清理**：没有 SIGKILL 作为备用终止方案
3. **缺少退出处理器**：脚本被中断时没有清理机制

## 解决方案

### 1. 进程组管理

```javascript
// 创建独立的进程组
const child = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  cwd: path.join(__dirname, '..'),
  detached: true  // 创建新的进程组，便于管理子进程
})
```

### 2. 增强的进程终止

```javascript
// 强制终止进程组，确保所有子进程都被清理
try {
  process.kill(-child.pid, 'SIGTERM')
} catch (e) {
  // 如果进程组终止失败，尝试直接终止主进程
  child.kill('SIGTERM')
}

// 如果 SIGTERM 无效，2秒后使用 SIGKILL 强制终止
setTimeout(() => {
  try {
    process.kill(-child.pid, 'SIGKILL')
  } catch (e) {
    child.kill('SIGKILL')
  }
}, 2000)
```

### 3. 活跃进程跟踪

```javascript
// 存储活跃的子进程，用于清理
const activeProcesses = new Set()

// 记录活跃进程
activeProcesses.add(child.pid)

// 进程结束时移除
child.on('close', (code) => {
  activeProcesses.delete(child.pid)
  // ...
})
```

### 4. 退出处理器

```javascript
// 清理函数 - 确保所有子进程都被终止
function cleanup() {
  console.log('\n🧹 清理残留进程...')
  
  for (const pid of activeProcesses) {
    try {
      process.kill(-pid, 'SIGTERM')
    } catch (e) {
      try {
        process.kill(pid, 'SIGTERM')
      } catch (e2) {
        // 进程可能已经结束
      }
    }
  }
  
  // 强制清理
  setTimeout(() => {
    for (const pid of activeProcesses) {
      try {
        process.kill(-pid, 'SIGKILL')
      } catch (e) {
        // 忽略错误
      }
    }
    activeProcesses.clear()
  }, 1000)
}

// 注册退出处理器
process.on('exit', cleanup)
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
```

## 修复效果

✅ **脚本正常退出**：测试完成后脚本能够正常退出，不再挂起
✅ **进程完全清理**：所有子进程都被正确终止
✅ **中断处理**：Ctrl+C 等中断信号能够正确清理进程
✅ **强制终止**：SIGTERM 无效时自动使用 SIGKILL

## 测试验证

```bash
# 运行测试脚本
node scripts/test-port-config.cjs

# 检查是否有残留进程
ps aux | grep -E '(nuxt|node.*dev)' | grep -v grep
```

## 技术要点

1. **进程组管理**：使用 `detached: true` 创建独立进程组
2. **负PID终止**：`process.kill(-pid, signal)` 终止整个进程组
3. **分层终止**：先 SIGTERM 再 SIGKILL，确保优雅退出
4. **异常处理**：捕获进程终止异常，避免脚本崩溃
5. **退出钩子**：注册多种退出信号处理器

## 相关文件

- <mcfile name="test-port-config.cjs" path="scripts/test-port-config.cjs"></mcfile>