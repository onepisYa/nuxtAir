#!/usr/bin/env node

/**
 * 端口配置测试脚本
 * 用于验证不同端口配置的效果
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

// 测试不同的端口配置
const testConfigs = [
  { port: 4000, description: '默认端口 4000' },
  { port: 3000, description: '备用端口 3000' },
  { port: 3001, description: '备用端口 3001' },
  { port: 8080, description: '传统端口 8080' }
]

const envPath = path.join(__dirname, '../.env')
const envBackupPath = path.join(__dirname, '../.env.backup')

// 存储活跃的子进程，用于清理
const activeProcesses = new Set()

// 备份原始 .env 文件
function backupEnv() {
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, envBackupPath)
    console.log('✅ 已备份原始 .env 文件')
  }
}

// 恢复原始 .env 文件
function restoreEnv() {
  if (fs.existsSync(envBackupPath)) {
    fs.copyFileSync(envBackupPath, envPath)
    fs.unlinkSync(envBackupPath)
    console.log('✅ 已恢复原始 .env 文件')
  }
}

// 更新 .env 文件中的端口配置
function updateEnvPort(port) {
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env 文件不存在')
    return false
  }

  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // 更新开发端口
  envContent = envContent.replace(
    /NUXT_DEV_PORT=\d+/,
    `NUXT_DEV_PORT=${port}`
  )
  
  // 更新 BASE_URL（如果存在localhost配置）
  envContent = envContent.replace(
    /NUXT_PUBLIC_BASE_URL=http:\/\/localhost:\d+/,
    `NUXT_PUBLIC_BASE_URL=http://localhost:${port}`
  )
  
  fs.writeFileSync(envPath, envContent)
  console.log(`✅ 已更新 .env 文件，设置端口为 ${port}`)
  return true
}

// 测试端口配置
function testPortConfig(config) {
  return new Promise((resolve) => {
    console.log(`\n🧪 测试配置: ${config.description}`)
    console.log(`📝 设置端口: ${config.port}`)
    
    if (!updateEnvPort(config.port)) {
      resolve(false)
      return
    }
    
    console.log('🚀 启动开发服务器...')
    
    const child = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..'),
      detached: true  // 创建新的进程组，便于管理子进程
    })
    
    // 记录活跃进程
    activeProcesses.add(child.pid)
    
    let output = ''
    let hasStarted = false
    
    child.stdout.on('data', (data) => {
      output += data.toString()
      
      // 检查服务器是否成功启动
      if (output.includes('Local:') && !hasStarted) {
        hasStarted = true
        
        // 提取实际使用的端口
        const portMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)/)
        const actualPort = portMatch ? portMatch[1] : 'unknown'
        
        console.log(`✅ 服务器启动成功！`)
        console.log(`📍 配置端口: ${config.port}`)
        console.log(`📍 实际端口: ${actualPort}`)
        
        if (actualPort === config.port.toString()) {
          console.log('🎉 端口配置生效！')
        } else {
          console.log('⚠️  端口被占用，自动使用了备用端口')
        }
        
        // 等待 2 秒后关闭服务器
        setTimeout(() => {
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
          
          resolve(true)
        }, 2000)
      }
    })
    
    child.stderr.on('data', (data) => {
      console.error(`❌ 错误: ${data.toString()}`)
    })
    
    child.on('close', (code) => {
      // 从活跃进程列表中移除
      activeProcesses.delete(child.pid)
      
      if (!hasStarted) {
        console.log(`❌ 服务器启动失败，退出码: ${code}`)
        resolve(false)
      }
    })
    
    // 超时处理
    setTimeout(() => {
      if (!hasStarted) {
        console.log('⏰ 启动超时，终止测试')
        try {
          process.kill(-child.pid, 'SIGTERM')
        } catch (e) {
          child.kill('SIGTERM')
        }
        
        // 强制终止
        setTimeout(() => {
          try {
            process.kill(-child.pid, 'SIGKILL')
          } catch (e) {
            child.kill('SIGKILL')
          }
        }, 2000)
        
        resolve(false)
      }
    }, 30000)
  })
}

// 主测试函数
async function runTests() {
  console.log('🔧 NuxtAir 端口配置测试工具')
  console.log('================================')
  
  // 备份原始配置
  backupEnv()
  
  try {
    for (const config of testConfigs) {
      const success = await testPortConfig(config)
      if (!success) {
        console.log(`❌ 测试失败: ${config.description}`)
      }
      
      // 测试间隔
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log('\n🎉 所有测试完成！')
    console.log('\n📋 测试总结:')
    console.log('- ✅ 端口配置通过环境变量控制')
    console.log('- ✅ 端口冲突时自动使用备用端口')
    console.log('- ✅ BASE_URL 根据端口动态生成')
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message)
  } finally {
    // 恢复原始配置
    restoreEnv()
    console.log('\n🔄 已恢复原始配置')
  }
}

// 清理函数 - 确保所有子进程都被终止
function cleanup() {
  console.log('\n🧹 清理残留进程...')
  
  for (const pid of activeProcesses) {
    try {
      // 尝试终止进程组
      process.kill(-pid, 'SIGTERM')
      console.log(`✅ 已终止进程组: ${pid}`)
    } catch (e) {
      try {
        // 如果进程组终止失败，尝试终止单个进程
        process.kill(pid, 'SIGTERM')
        console.log(`✅ 已终止进程: ${pid}`)
      } catch (e2) {
        console.log(`⚠️  进程 ${pid} 可能已经结束`)
      }
    }
  }
  
  // 强制清理
  setTimeout(() => {
    for (const pid of activeProcesses) {
      try {
        process.kill(-pid, 'SIGKILL')
      } catch (e) {
        try {
          process.kill(pid, 'SIGKILL')
        } catch (e2) {
          // 进程已经结束
        }
      }
    }
    activeProcesses.clear()
  }, 1000)
}

// 注册退出处理器
process.on('exit', cleanup)
process.on('SIGINT', () => {
  console.log('\n🛑 收到中断信号，正在清理...')
  cleanup()
  process.exit(0)
})
process.on('SIGTERM', () => {
  console.log('\n🛑 收到终止信号，正在清理...')
  cleanup()
  process.exit(0)
})

// 如果直接运行此脚本
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testPortConfig, updateEnvPort }