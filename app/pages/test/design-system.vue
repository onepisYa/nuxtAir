<script setup lang="ts">
const { t } = useI18n()

// 页面级 SEO 配置
useSeoMeta({
  title: '设计系统颜色 - NuxtAir',
  description: '展示设计系统中使用的颜色变量和色彩规范',
  keywords: 'design system, colors, ui, css variables, nuxt'
})

// 颜色系统配置
const colorSystem = computed(() => [
  {
    name: 'Primary',
    description: '主要颜色，用于主要操作按钮、链接等关键元素',
    cssVar: '--color-primary',
    actualVar: '--color-senix-blue',
    hexValue: '#44687D',
    usage: ['按钮', '链接', '导航', '重要标识'],
    className: 'bg-primary'
  },
  {
    name: 'Success',
    description: '成功状态颜色，用于成功提示、确认操作等',
    cssVar: '--color-success',
    actualVar: null,
    hexValue: '#007c4d',
    usage: ['成功提示', '确认按钮', '完成状态', '正向反馈'],
    className: 'bg-success'
  },
  {
    name: 'Info',
    description: '信息颜色，用于信息提示、通知等',
    cssVar: '--color-info',
    actualVar: '--color-senix-orange',
    hexValue: '#E24912',
    usage: ['信息提示', '通知', '警告', '重要信息'],
    className: 'bg-info'
  },
  {
    name: 'Secondary',
    description: '次要颜色，用于次要按钮、辅助文本等',
    cssVar: '--color-secondary',
    actualVar: '--color-senix-grey',
    hexValue: '#575A5D',
    usage: ['次要按钮', '辅助文本', '边框', '背景'],
    className: 'bg-secondary'
  },
  {
    name: 'Black',
    description: '黑色，用于文本、图标等基础元素',
    cssVar: '--ui-text',
    actualVar: null,
    hexValue: '#000000',
    usage: ['正文文本', '图标', '边框', '分割线'],
    className: 'bg-black'
  }
])

// Senix 品牌颜色
const brandColors = computed(() => [
  {
    name: 'Senix Blue',
    description: 'Senix 品牌主色调，专业可靠',
    cssVar: '--color-senix-blue',
    hexValue: '#44687D',
    usage: '品牌标识、主要界面元素'
  },
  {
    name: 'Senix Orange',
    description: 'Senix 品牌辅助色，突出重要信息',
    cssVar: '--color-senix-orange',
    hexValue: '#E24912',
    usage: '强调元素、行动召唤'
  },
  {
    name: 'Senix Grey',
    description: 'Senix 品牌中性色，平衡视觉',
    cssVar: '--color-senix-grey',
    hexValue: '#575A5D',
    usage: '辅助文本、次要元素'
  }
])

const breadItems = computed(() => [
  { label: '首页', to: '/' },
  { label: '测试页面', to: '/test' },
  { label: '设计系统颜色', to: '/test/design-system' },
])

// 复制颜色值到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 这里可以添加 toast 提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <UContainer>
      <div class="flex items-center gap-x-4 py-6">
        <UIcon name="lucide:palette" class="text-2xl text-primary"/>
        <UBreadcrumb :items="breadItems" class="text-lg"/>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">设计系统颜色</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            展示项目中使用的颜色系统，包括主要颜色变量、品牌色彩和使用规范。
          </p>
        </div>

        <!-- 主要颜色系统 -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <UIcon name="lucide:palette" class="text-primary"/>
            主要颜色系统
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard 
              v-for="color in colorSystem" 
              :key="color.name"
              class="hover:shadow-lg transition-shadow"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ color.name }}
                  </h3>
                  <UBadge variant="soft" color="primary">{{ color.hexValue }}</UBadge>
                </div>
              </template>
              
              <!-- 颜色展示 -->
              <div class="space-y-4">
                <div 
                  :class="color.className"
                  class="w-full h-20 rounded-lg shadow-inner flex items-center justify-center"
                >
                  <span class="text-white font-medium text-sm drop-shadow">
                    {{ color.name }}
                  </span>
                </div>
                
                <p class="text-gray-600 text-sm leading-relaxed">
                  {{ color.description }}
                </p>
                
                <!-- CSS 变量信息 -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">CSS 变量:</span>
                    <UButton 
                      variant="ghost" 
                      size="xs"
                      @click="copyToClipboard(color.cssVar)"
                      class="font-mono"
                    >
                      {{ color.cssVar }}
                    </UButton>
                  </div>
                  
                  <div v-if="color.actualVar" class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">实际变量:</span>
                    <UButton 
                      variant="ghost" 
                      size="xs"
                      @click="copyToClipboard(color.actualVar)"
                      class="font-mono"
                    >
                      {{ color.actualVar }}
                    </UButton>
                  </div>
                  
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">十六进制:</span>
                    <UButton 
                      variant="ghost" 
                      size="xs"
                      @click="copyToClipboard(color.hexValue)"
                      class="font-mono"
                    >
                      {{ color.hexValue }}
                    </UButton>
                  </div>
                </div>
                
                <!-- 使用场景 -->
                <div>
                  <p class="text-xs text-gray-500 mb-2">使用场景:</p>
                  <div class="flex flex-wrap gap-1">
                    <UBadge 
                      v-for="usage in color.usage" 
                      :key="usage"
                      variant="outline" 
                      size="xs"
                    >
                      {{ usage }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Senix 品牌颜色 -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <UIcon name="lucide:star" class="text-primary"/>
            Senix 品牌颜色
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UCard 
              v-for="brand in brandColors" 
              :key="brand.name"
              class="hover:shadow-lg transition-shadow"
            >
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ brand.name }}
                </h3>
              </template>
              
              <div class="space-y-4">
                <div 
                  :style="{ backgroundColor: brand.hexValue }"
                  class="w-full h-16 rounded-lg shadow-inner flex items-center justify-center"
                >
                  <span class="text-white font-medium text-sm drop-shadow">
                    {{ brand.hexValue }}
                  </span>
                </div>
                
                <p class="text-gray-600 text-sm">
                  {{ brand.description }}
                </p>
                
                <div class="space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">CSS 变量:</span>
                    <UButton 
                      variant="ghost" 
                      size="xs"
                      @click="copyToClipboard(brand.cssVar)"
                      class="font-mono"
                    >
                      {{ brand.cssVar }}
                    </UButton>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500">使用场景:</span>
                    <span class="text-gray-700">{{ brand.usage }}</span>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- 颜色使用指南 -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <UIcon name="lucide:book-open" class="text-primary"/>
            使用指南
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">CSS 变量使用</h3>
              </template>
              
              <div class="space-y-3">
                <p class="text-gray-600 text-sm">
                  在 CSS 中使用颜色变量，确保主题一致性：
                </p>
                <pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto"><code>.my-element {
  color: var(--color-primary);
  background-color: var(--color-success);
  border-color: var(--color-secondary);
}</code></pre>
              </div>
            </UCard>
            
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Tailwind 类名</h3>
              </template>
              
              <div class="space-y-3">
                <p class="text-gray-600 text-sm">
                  使用 Nuxt UI 提供的颜色类名：
                </p>
                <pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto"><code>&lt;UButton color="primary"&gt;主要按钮&lt;/UButton&gt;
&lt;UAlert color="success"&gt;成功提示&lt;/UAlert&gt;
&lt;UBadge color="info"&gt;信息标签&lt;/UBadge&gt;</code></pre>
              </div>
            </UCard>
          </div>
        </div>

        <!-- 实际应用示例 -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <UIcon name="lucide:layout" class="text-primary"/>
            实际应用示例
          </h2>

          <!-- 按钮示例 -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">按钮组件</h3>
            <UCard>
              <div class="space-y-4">
                <div class="flex flex-wrap gap-3">
                  <UButton color="primary" size="md">主要按钮</UButton>
                  <UButton color="secondary" size="md">次要按钮</UButton>
                  <UButton color="success" size="md">成功按钮</UButton>
                  <UButton color="info" size="md">信息按钮</UButton>
                  <UButton  size="md">默认按钮</UButton>
                </div>
                <div class="flex flex-wrap gap-3">
                  <UButton color="primary" variant="outline" size="md">主要轮廓</UButton>
                  <UButton color="secondary" variant="outline" size="md">次要轮廓</UButton>
                  <UButton color="success" variant="outline" size="md">成功轮廓</UButton>
                  <UButton color="info" variant="outline" size="md">信息轮廓</UButton>
                </div>
                <div class="flex flex-wrap gap-3">
                  <UButton color="primary" variant="ghost" size="md">主要幽灵</UButton>
                  <UButton color="secondary" variant="ghost" size="md">次要幽灵</UButton>
                  <UButton color="success" variant="ghost" size="md">成功幽灵</UButton>
                  <UButton color="info" variant="ghost" size="md">信息幽灵</UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- 文本和排版示例 -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">文本和排版</h3>
            <UCard>
              <div class="space-y-4">
                <div class="space-y-2">
                  <h1 class="text-3xl font-bold text-primary">主标题 - Primary Color</h1>
                  <h2 class="text-2xl font-semibold text-secondary">副标题 - Secondary Color</h2>
                  <h3 class="text-xl font-medium text-info">三级标题 - Info Color</h3>
                  <p class="text-success font-medium">成功状态文本 - Success Color</p>
                  <p class="text-gray-600">正文内容使用灰色，确保良好的可读性和层次感。</p>
                </div>
                <div class="border-l-4 border-primary bg-primary/5 p-4 rounded-r">
                  <p class="text-primary font-medium">这是一个使用主色调的引用块示例</p>
                  <p class="text-gray-600 text-sm mt-1">展示了如何在排版中有效使用品牌颜色</p>
                </div>
              </div>
            </UCard>
          </div>

          <!-- 卡片和组件示例 -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">卡片和组件</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UCard class="border-l-4 border-primary">
                <template #header>
                  <div class="flex items-center gap-2">
                    <UIcon name="lucide:check-circle" class="text-primary"/>
                    <span class="text-primary font-semibold">主要功能</span>
                  </div>
                </template>
                <p class="text-gray-600 text-sm">使用主色调突出重要功能和核心内容</p>
              </UCard>
              
              <UCard>
                <template #header>
                  <h4 class="text-md font-semibold text-gray-900">方案3: 黑色Logo + 黑色文字 + 白色背景</h4>
                </template>
                <div class="space-y-4">
                  <div class="bg-white p-6 rounded-lg border-2 border-gray-200 text-center">
                    <div class="inline-flex items-center gap-3">
                      <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <UIcon name="lucide:hexagon" class="text-white text-xl" />
                      </div>
                      <span class="text-2xl font-bold text-black">SENIX</span>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">简约风格：黑色Logo图标 + 黑色品牌名称 + 白色背景</p>
                </div>
              </UCard>
              
              <UCard>
                <template #header>
                  <h4 class="text-md font-semibold text-gray-900">方案4: 白色Logo + 白色文字 + 黑色背景</h4>
                </template>
                <div class="space-y-4">
                  <div class="bg-black p-6 rounded-lg text-center">
                    <div class="inline-flex items-center gap-3">
                      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <UIcon name="lucide:hexagon" class="text-black text-xl" />
                      </div>
                      <span class="text-2xl font-bold text-white">SENIX</span>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">反转风格：白色Logo图标 + 白色品牌名称 + 黑色背景</p>
                </div>
              </UCard>
            </div>
          </div>

          <!-- 徽章和标签示例 -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">徽章和标签</h3>
            <UCard>
              <div class="space-y-4">
                <div class="flex flex-wrap gap-2">
                  <UBadge color="primary" variant="solid">主要</UBadge>
                  <UBadge color="secondary" variant="solid">次要</UBadge>
                  <UBadge color="success" variant="solid">成功</UBadge>
                  <UBadge color="info" variant="solid">信息</UBadge>
                  <UBadge variant="solid">默认</UBadge>
                </div>
                <div class="flex flex-wrap gap-2">
                  <UBadge color="primary" variant="soft">主要软</UBadge>
                  <UBadge color="secondary" variant="soft">次要软</UBadge>
                  <UBadge color="success" variant="soft">成功软</UBadge>
                  <UBadge color="info" variant="soft">信息软</UBadge>
                  <UBadge variant="soft">默认软</UBadge>
                </div>
                <div class="flex flex-wrap gap-2">
                  <UBadge color="primary" variant="outline">主要轮廓</UBadge>
                  <UBadge color="secondary" variant="outline">次要轮廓</UBadge>
                  <UBadge color="success" variant="outline">成功轮廓</UBadge>
                  <UBadge color="info" variant="outline">信息轮廓</UBadge>
                  <UBadge variant="outline">默认轮廓</UBadge>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Logo 配色示例 -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Logo 配色方案</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 配色方案1: Logo橙 + 名字蓝 + 背景白 -->
              <UCard>
                <template #header>
                  <h4 class="text-md font-semibold text-gray-900">方案1: 橙色Logo + 蓝色文字 + 白色背景</h4>
                </template>
                <div class="space-y-4">
                  <div class="bg-white p-6 rounded-lg border-2 border-gray-200 w-64">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-snow rounded-full flex items-center justify-center">
                        <UIcon name="lucide:hexagon" class="text-info text-xl" />
                      </div>
                      <span class="text-2xl font-bold text-primary">SENIX</span>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">经典配色：橙色Logo图标 + 蓝色品牌名称 + 白色背景</p>
                </div>
              </UCard>
              
              <!-- 配色方案2: Logo橙 + 名字白 + 背景灰 -->
              <UCard>
                <template #header>
                  <h4 class="text-md font-semibold text-gray-900">方案2: 橙色Logo + 白色文字 + 灰色背景</h4>
                </template>
                <div class="space-y-4">
                  <div class="bg-secondary p-6 rounded-lg w-64">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-info rounded-full flex items-center justify-center">
                        <UIcon name="lucide:hexagon" class="text-white text-xl" />
                      </div>
                      <span class="text-2xl font-bold text-white">SENIX</span>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">深色主题：橙色Logo图标 + 白色品牌名称 + 灰色背景</p>
                </div>
              </UCard>
              
              <!-- 配色方案3: Logo文字都黑 + 背景白 -->
              <UCard>
                <template #header>
                  <h4 class="text-md font-semibold text-gray-900">方案3: 黑色Logo和文字 + 白色背景</h4>
                </template>
                <div class="space-y-4">
                  <div class="bg-white p-6 rounded-lg border-2 border-gray-200 w-64">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <UIcon name="lucide:hexagon" class="text-white text-xl" />
                      </div>
                      <span class="text-2xl font-bold text-black">SENIX</span>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">简约风格：黑色Logo图标 + 黑色品牌名称 + 白色背景</p>
                </div>
              </UCard>
              
              <!-- 配色方案4: Logo文字都白 + 背景黑 -->
              <UCard>
                <template #header>
                  <h4 class="text-md font-semibold text-gray-900">方案4: 白色Logo和文字 + 黑色背景</h4>
                </template>
                <div class="space-y-4">
                  <div class="bg-black p-6 rounded-lg w-64">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <UIcon name="lucide:hexagon" class="text-black text-xl" />
                      </div>
                      <span class="text-2xl font-bold text-white">SENIX</span>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm">反转风格：白色Logo图标 + 白色品牌名称 + 黑色背景</p>
                </div>
              </UCard>
            </div>
          </div>

          <!-- 配色组合建议 -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">配色组合建议</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UCard class="bg-gradient-to-br from-primary/10 to-white/10">
                <template #header>
                  <h4 class="text-md font-semibold text-primary">蓝色主色调</h4>
                </template>
                <div class="space-y-2">
                  <div class="flex gap-2">
                    <div class="w-6 h-6 bg-primary rounded"></div>
                    <div class="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                  </div>
                  <p class="text-gray-600 text-sm">导航背景色 + 白色文字，保存按钮首选</p>
                </div>
              </UCard>
              
              <UCard class="bg-gradient-to-br from-info/10 to-white/10">
                <template #header>
                  <h4 class="text-md font-semibold text-info">橙色强调色</h4>
                </template>
                <div class="space-y-2">
                  <div class="flex gap-2">
                    <div class="w-6 h-6 bg-info rounded"></div>
                    <div class="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                  </div>
                  <p class="text-gray-600 text-sm">提交按钮、常用按钮的首选配色</p>
                </div>
              </UCard>
              
              <UCard class="bg-gradient-to-br from-primary/10 to-info/10">
                <template #header>
                  <h4 class="text-md font-semibold text-primary">蓝橙组合</h4>
                </template>
                <div class="space-y-2">
                  <div class="flex gap-2">
                    <div class="w-6 h-6 bg-primary rounded"></div>
                    <div class="w-6 h-6 bg-info rounded"></div>
                  </div>
                  <p class="text-gray-600 text-sm">主要操作(蓝) + 次要操作(橙)的经典搭配</p>
                </div>
              </UCard>
            </div>
            
            <!-- 三色配色方案 -->
            <h4 class="text-md font-semibold text-gray-700 mt-6 mb-4">三色配色方案</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Logo 风格配色 -->
              <UCard class="bg-gradient-to-br from-info/5 via-primary/5 to-white">
                <template #header>
                  <h5 class="text-sm font-semibold text-gray-700">Logo 风格配色</h5>
                </template>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="w-5 h-5 bg-info rounded"></div>
                    <div class="w-5 h-5 bg-primary rounded"></div>
                    <div class="w-5 h-5 bg-white border border-gray-300 rounded"></div>
                  </div>
                  <p class="text-gray-600 text-xs">橙色 Logo + 蓝色文字 + 白色背景</p>
                  <p class="text-gray-500 text-xs">适用于品牌展示和主页设计</p>
                </div>
              </UCard>

              <!-- 白底经典配色 -->
              <UCard class="bg-gradient-to-br from-white to-gray-50">
                <template #header>
                  <h5 class="text-sm font-semibold text-gray-700">白底经典配色</h5>
                </template>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="w-5 h-5 bg-white border border-gray-300 rounded"></div>
                    <div class="w-5 h-5 bg-info rounded"></div>
                    <div class="w-5 h-5 bg-primary rounded"></div>
                  </div>
                  <p class="text-gray-600 text-xs">白色背景 + 橙色按钮 + 蓝色文本</p>
                  <p class="text-gray-500 text-xs">适用于表单页面和内容展示</p>
                </div>
              </UCard>

              <!-- 深色主题配色 -->
              <UCard class="bg-gradient-to-br from-gray-800/10 to-gray-600/10">
                <template #header>
                  <h5 class="text-sm font-semibold text-gray-700">深色主题配色</h5>
                </template>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="w-5 h-5 bg-gray-800 rounded"></div>
                    <div class="w-5 h-5 bg-info rounded"></div>
                    <div class="w-5 h-5 bg-white border border-gray-300 rounded"></div>
                  </div>
                  <p class="text-gray-600 text-xs">深色背景 + 橙色强调 + 白色文字</p>
                  <p class="text-gray-500 text-xs">适用于夜间模式和专业界面</p>
                </div>
              </UCard>

              <!-- 卡片界面配色 -->
              <UCard class="bg-gradient-to-br from-gray-50 to-primary/5">
                <template #header>
                  <h5 class="text-sm font-semibold text-gray-700">卡片界面配色</h5>
                </template>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="w-5 h-5 bg-gray-50 border border-gray-200 rounded"></div>
                    <div class="w-5 h-5 bg-primary rounded"></div>
                    <div class="w-5 h-5 bg-info rounded"></div>
                  </div>
                  <p class="text-gray-600 text-xs">浅灰背景 + 蓝色标题 + 橙色操作</p>
                  <p class="text-gray-500 text-xs">适用于仪表板和数据展示</p>
                </div>
              </UCard>

              <!-- 状态指示配色 -->
              <UCard class="bg-gradient-to-br from-success/5 to-info/5">
                <template #header>
                  <h5 class="text-sm font-semibold text-gray-700">状态指示配色</h5>
                </template>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="w-5 h-5 bg-success rounded"></div>
                    <div class="w-5 h-5 bg-info rounded"></div>
                    <div class="w-5 h-5 bg-primary rounded"></div>
                  </div>
                  <p class="text-gray-600 text-xs">成功绿 + 警告橙 + 信息蓝</p>
                  <p class="text-gray-500 text-xs">适用于通知和状态反馈</p>
                </div>
              </UCard>

              <!-- 渐变主题配色 -->
              <UCard class="bg-gradient-to-br from-primary/10 via-info/10 to-secondary/10">
                <template #header>
                  <h5 class="text-sm font-semibold text-gray-700">渐变主题配色</h5>
                </template>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <div class="w-5 h-5 bg-gradient-to-r from-primary to-info rounded"></div>
                    <div class="w-5 h-5 bg-secondary rounded"></div>
                    <div class="w-5 h-5 bg-white border border-gray-300 rounded"></div>
                  </div>
                  <p class="text-gray-600 text-xs">蓝橙渐变 + 次要色 + 白色文字</p>
                  <p class="text-gray-500 text-xs">适用于现代化界面和特效</p>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- 返回导航 -->
        <div class="text-center">
          <UButton 
            to="/test"
            variant="soft"
            size="lg"
            icon="lucide:arrow-left"
          >
            返回测试页面
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* 确保颜色展示正确 */
.bg-primary-500 {
  background-color: var(--color-primary);
}
</style>