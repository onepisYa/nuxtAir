#!/usr/bin/env node

/**
 * 局域网访问配置测试脚本
 * 用于验证 NUXT_DEV_NETWORK_HOST 环境变量的效果
 */

const { execSync } = require('child_process')
const os = require('os')
const fs = require('fs')
const path = require('path')

// 加载 .env 文件
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envLines = envContent.split('\n')
    
    for (const line of envLines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        const value = valueParts.join('=')
        if (key && value) {
          process.env[key] = value
        }
      }
    }
  }
}

// 在脚本开始时加载环境变量
loadEnvFile()

// 获取本机局域网 IP 地址
function getLocalNetworkIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const networkInterface of interfaces[name]) {
      // 跳过内部地址和非 IPv4 地址
      if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
        return networkInterface.address
      }
    }
  }
  return null
}

// 测试不同的网络配置
function testNetworkConfig() {
  console.log('🌐 NuxtAir 局域网访问配置测试')
  console.log('================================\n')
  
  // 获取当前网络信息
  const localIP = getLocalNetworkIP()
  console.log('📍 网络信息:')
  console.log(`   本机局域网 IP: ${localIP || '未检测到'}`)
  
  // 读取当前环境变量配置
  const currentNetworkHost = process.env.NUXT_DEV_NETWORK_HOST
  const currentDevHost = process.env.NUXT_DEV_HOST
  const currentDevPort = process.env.NUXT_DEV_PORT || '4000'
  
  console.log('\n⚙️  当前配置:')
  console.log(`   NUXT_DEV_NETWORK_HOST: ${currentNetworkHost || '未设置'}`)
  console.log(`   NUXT_DEV_HOST: ${currentDevHost || '未设置'}`)
  console.log(`   NUXT_DEV_PORT: ${currentDevPort}`)
  
  // 模拟 baseUrl 生成逻辑
  const networkHost = currentNetworkHost
  const devHost = networkHost || (currentDevHost === 'localhost' ? 'localhost' : currentDevHost || 'localhost')
  const generatedBaseUrl = `http://${devHost}:${currentDevPort}`
  
  console.log('\n🔗 生成的 baseUrl:')
  console.log(`   ${generatedBaseUrl}`)
  
  // 提供配置建议
  console.log('\n💡 配置建议:')
  if (!currentNetworkHost && localIP) {
    console.log(`   建议在 .env 文件中设置:`)
    console.log(`   NUXT_DEV_NETWORK_HOST=${localIP}`)
    console.log(`   这样同事就可以通过 http://${localIP}:${currentDevPort} 访问`)
  } else if (currentNetworkHost) {
    console.log(`   ✅ 已配置局域网访问地址: ${currentNetworkHost}`)
    console.log(`   同事可以通过以下地址访问:`)
    console.log(`   - 局域网: http://${currentNetworkHost}:${currentDevPort}`)
    console.log(`   - 本地: http://localhost:${currentDevPort}`)
  }
  
  // 安全提醒
  console.log('\n🔒 安全提醒:')
  console.log('   - 确保防火墙允许对应端口的访问')
  console.log('   - 仅在受信任的网络环境中启用局域网访问')
  console.log('   - 局域网 IP 可能会变化，需要定期检查更新')
  
  console.log('\n🎯 测试完成！')
}

// 如果直接运行此脚本
if (require.main === module) {
  testNetworkConfig()
}

module.exports = { getLocalNetworkIP, testNetworkConfig }