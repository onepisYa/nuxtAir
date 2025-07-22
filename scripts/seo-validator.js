#!/usr/bin/env node

/**
 * SEO 验证工具
 * 用于检查 NuxtAir 项目的 SEO 配置是否正确
 */

import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class SEOValidator {
  constructor() {
    this.errors = []
    this.warnings = []
    this.success = []
    this.projectRoot = process.cwd()
  }

  log(type, message) {
    const timestamp = new Date().toISOString()
    const prefix = {
      error: '❌',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    }[type] || 'ℹ️'
    
    console.log(`${prefix} [${timestamp}] ${message}`)
    
    if (type === 'error') this.errors.push(message)
    if (type === 'warning') this.warnings.push(message)
    if (type === 'success') this.success.push(message)
  }

  // 检查文件是否存在
  checkFileExists(filePath, description) {
    const fullPath = path.join(this.projectRoot, filePath)
    if (fs.existsSync(fullPath)) {
      this.log('success', `${description} 存在: ${filePath}`)
      return true
    } else {
      this.log('error', `${description} 缺失: ${filePath}`)
      return false
    }
  }

  // 检查 JSON 文件格式
  checkJSONFile(filePath, description) {
    const fullPath = path.join(this.projectRoot, filePath)
    try {
      const content = fs.readFileSync(fullPath, 'utf8')
      JSON.parse(content)
      this.log('success', `${description} JSON 格式正确: ${filePath}`)
      return true
    } catch (error) {
      this.log('error', `${description} JSON 格式错误: ${filePath} - ${error.message}`)
      return false
    }
  }

  // 检查语言文件 SEO 内容
  checkLanguageFileSEO(filePath, locale) {
    const fullPath = path.join(this.projectRoot, filePath)
    try {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
      
      // 检查必需的 SEO 字段
      const requiredSEOFields = ['title', 'description', 'ogTitle', 'ogDescription', 'keywords']
      const seoSection = content.seo || {}
      
      let missingFields = []
      requiredSEOFields.forEach(field => {
        if (!seoSection[field]) {
          missingFields.push(field)
        }
      })
      
      if (missingFields.length === 0) {
        this.log('success', `${locale} 语言文件 SEO 配置完整`)
      } else {
        this.log('error', `${locale} 语言文件缺少 SEO 字段: ${missingFields.join(', ')}`)
      }
      
      // 检查页面级 SEO 内容
      const pages = content.pages || {}
      const requiredPages = ['home', 'about', 'blog']
      const requiredPageFields = ['title', 'description', 'ogTitle', 'ogDescription']
      
      requiredPages.forEach(page => {
        if (pages[page]) {
          let missingPageFields = []
          requiredPageFields.forEach(field => {
            if (!pages[page][field]) {
              missingPageFields.push(field)
            }
          })
          
          if (missingPageFields.length === 0) {
            this.log('success', `${locale} ${page} 页面 SEO 配置完整`)
          } else {
            this.log('warning', `${locale} ${page} 页面缺少字段: ${missingPageFields.join(', ')}`)
          }
        } else {
          this.log('warning', `${locale} 语言文件缺少 ${page} 页面配置`)
        }
      })
      
    } catch (error) {
      this.log('error', `读取 ${locale} 语言文件失败: ${error.message}`)
    }
  }

  // 检查 Nuxt 配置
  checkNuxtConfig() {
    const configPath = path.join(this.projectRoot, 'nuxt.config.ts')
    if (!fs.existsSync(configPath)) {
      this.log('error', 'nuxt.config.ts 文件不存在')
      return
    }
    
    try {
      const content = fs.readFileSync(configPath, 'utf8')
      
      // 检查必需的模块
      const requiredModules = ['@nuxtjs/seo', '@nuxtjs/i18n', 'nuxt-schema-org']
      requiredModules.forEach(module => {
        if (content.includes(module)) {
          this.log('success', `检测到模块: ${module}`)
        } else {
          this.log('warning', `可能缺少模块: ${module}`)
        }
      })
      
      // 检查 SEO 相关配置
      const seoConfigs = ['site:', 'ogImage:', 'sitemap:', 'robots:']
      seoConfigs.forEach(config => {
        if (content.includes(config)) {
          this.log('success', `检测到 SEO 配置: ${config}`)
        } else {
          this.log('warning', `可能缺少 SEO 配置: ${config}`)
        }
      })
      
    } catch (error) {
      this.log('error', `读取 nuxt.config.ts 失败: ${error.message}`)
    }
  }

  // 检查 OG Image 组件
  checkOGImageComponents() {
    const ogImageComponents = [
      'app/components/OgImage/OgImageDefault.vue',
      'app/components/OgImage/OgImageBlog.vue'
    ]
    
    ogImageComponents.forEach(component => {
      if (this.checkFileExists(component, 'OG Image 组件')) {
        // 检查组件内容
        const fullPath = path.join(this.projectRoot, component)
        const content = fs.readFileSync(fullPath, 'utf8')
        
        if (content.includes('defineProps') && content.includes('template')) {
          this.log('success', `${component} 组件结构正确`)
        } else {
          this.log('warning', `${component} 组件可能结构不完整`)
        }
      }
    })
  }

  // 检查页面 SEO 实现
  checkPageSEOImplementation() {
    const pages = [
      'app/pages/index.vue',
      'app/pages/about/index.vue',
      'app/pages/blog/index.vue',
      'app/pages/blog/[slug].vue'
    ]
    
    pages.forEach(page => {
      if (this.checkFileExists(page, '页面文件')) {
        const fullPath = path.join(this.projectRoot, page)
        const content = fs.readFileSync(fullPath, 'utf8')
        
        // 检查 SEO 相关函数
        const seoFunctions = ['useSeoMeta', 'defineOgImage', 'useSchemaOrg']
        let implementedFunctions = []
        
        seoFunctions.forEach(func => {
          if (content.includes(func)) {
            implementedFunctions.push(func)
          }
        })
        
        if (implementedFunctions.length === seoFunctions.length) {
          this.log('success', `${page} SEO 实现完整`)
        } else {
          const missing = seoFunctions.filter(f => !implementedFunctions.includes(f))
          this.log('warning', `${page} 缺少 SEO 函数: ${missing.join(', ')}`)
        }
      }
    })
  }

  // 检查环境配置
  checkEnvironmentConfig() {
    const envExample = '.env.example'
    if (this.checkFileExists(envExample, '环境配置示例')) {
      const fullPath = path.join(this.projectRoot, envExample)
      const content = fs.readFileSync(fullPath, 'utf8')
      
      const requiredEnvVars = [
        'NUXT_PUBLIC_BASE_URL',
        'NUXT_PUBLIC_SITENAME'
      ]
      
      requiredEnvVars.forEach(envVar => {
        if (content.includes(envVar)) {
          this.log('success', `环境变量配置存在: ${envVar}`)
        } else {
          this.log('error', `环境变量配置缺失: ${envVar}`)
        }
      })
    }
  }

  // 检查依赖包
  checkDependencies() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      this.log('error', 'package.json 文件不存在')
      return
    }
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      const requiredPackages = [
        '@nuxtjs/seo',
        '@nuxtjs/i18n',
        'nuxt-schema-org'
      ]
      
      requiredPackages.forEach(pkg => {
        if (dependencies[pkg]) {
          this.log('success', `依赖包已安装: ${pkg}@${dependencies[pkg]}`)
        } else {
          this.log('error', `依赖包缺失: ${pkg}`)
        }
      })
      
    } catch (error) {
      this.log('error', `读取 package.json 失败: ${error.message}`)
    }
  }

  // 运行所有检查
  async runAllChecks() {
    console.log('🔍 开始 SEO 配置验证...\n')
    
    this.log('info', '检查项目依赖...')
    this.checkDependencies()
    
    this.log('info', '检查 Nuxt 配置...')
    this.checkNuxtConfig()
    
    this.log('info', '检查环境配置...')
    this.checkEnvironmentConfig()
    
    this.log('info', '检查语言文件...')
    this.checkFileExists('i18n/locales/en-US.json', '英文语言文件')
    this.checkFileExists('i18n/locales/zh-CN.json', '中文语言文件')
    this.checkJSONFile('i18n/locales/en-US.json', '英文语言文件')
    this.checkJSONFile('i18n/locales/zh-CN.json', '中文语言文件')
    
    this.log('info', '检查语言文件 SEO 内容...')
    this.checkLanguageFileSEO('i18n/locales/en-US.json', 'en-US')
    this.checkLanguageFileSEO('i18n/locales/zh-CN.json', 'zh-CN')
    
    this.log('info', '检查 OG Image 组件...')
    this.checkOGImageComponents()
    
    this.log('info', '检查页面 SEO 实现...')
    this.checkPageSEOImplementation()
    
    this.log('info', '检查核心文件...')
    this.checkFileExists('app/app.vue', 'App 根组件')
    
    // 生成报告
    this.generateReport()
  }

  // 生成验证报告
  generateReport() {
    console.log('\n📊 SEO 验证报告')
    console.log('=' .repeat(50))
    
    console.log(`✅ 成功项目: ${this.success.length}`)
    console.log(`⚠️  警告项目: ${this.warnings.length}`)
    console.log(`❌ 错误项目: ${this.errors.length}`)
    
    if (this.errors.length > 0) {
      console.log('\n❌ 需要修复的错误:')
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  建议改进的项目:')
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`)
      })
    }
    
    // 计算总体评分
    const totalChecks = this.success.length + this.warnings.length + this.errors.length
    const score = totalChecks > 0 ? Math.round((this.success.length / totalChecks) * 100) : 0
    
    console.log(`\n🎯 SEO 配置完成度: ${score}%`)
    
    if (score >= 90) {
      console.log('🎉 SEO 配置优秀！')
    } else if (score >= 70) {
      console.log('👍 SEO 配置良好，还有改进空间')
    } else if (score >= 50) {
      console.log('⚠️  SEO 配置需要改进')
    } else {
      console.log('❌ SEO 配置需要大量改进')
    }
    
    console.log('\n💡 建议:')
    console.log('   1. 修复所有错误项目')
    console.log('   2. 改进警告项目')
    console.log('   3. 使用 npm run build 测试生产构建')
    console.log('   4. 使用在线工具验证 OG 图片和结构化数据')
    console.log('   5. 定期监控 SEO 性能指标')
  }
}

// 运行验证器
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new SEOValidator()
  validator.runAllChecks().catch(error => {
    console.error('验证过程中发生错误:', error)
    process.exit(1)
  })
}

export default SEOValidator