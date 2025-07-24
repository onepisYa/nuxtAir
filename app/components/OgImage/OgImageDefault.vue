<template>
  <div class="og-container">
    <!-- 渐变背景 -->
    <div class="bg-gradient" />
    
    <!-- 装饰性几何图形 -->
    <div class="decorative-shapes">
      <div class="shape shape-1" />
      <div class="shape shape-2" />
      <div class="shape shape-3" />
    </div>
    
    <!-- Logo 区域 -->
    <div class="logo-container">
      <div class="logo-icon">🚀</div>
    </div>
    
    <!-- 文本内容 -->
    <div class="content">
      <h1 class="title">{{ title || defaultTitle }}</h1>
      <p class="description">{{ description }}</p>
      <div class="site-info">
        <span class="site-name">{{ siteName || defaultSiteName }}</span>
        <span class="tagline">{{ tagline }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name:'OgImageDefault'
})
const props = defineProps({
  title: String,
  description: String,
  siteName: String,
  locale: String
})

const currentLocale = computed(() => props.locale || 'en-US')
const isChinese = computed(() => currentLocale.value === 'zh-CN')

const defaultTitle = computed(() => 
  isChinese.value ? 'NuxtAir - 现代化网络应用' : 'NuxtAir - Modern Web Application'
)

const defaultSiteName = computed(() => 
  isChinese.value ? 'NuxtAir 官网' : 'NuxtAir Official'
)

const tagline = computed(() => 
  isChinese.value ? '体验网络的未来' : 'Experience the Future of Web'
)
</script>

<style scoped>
.og-container {
  position: relative;
  width: 1200px;
  height: 630px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* 优化字体配置，确保中文字体正确显示 */
  font-family: 'Noto Sans SC', 'Noto Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  /* 确保字体渲染质量 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.9;
}

.decorative-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
  background: rgba(255, 255, 255, 0.05);
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -75px;
  background: rgba(255, 255, 255, 0.08);
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.06);
}

.logo-container {
  position: absolute;
  top: 60px;
  left: 60px;
  z-index: 10;
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 900px;
  padding: 0 60px;
}

.title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 24px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 24px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 40px 0;
  opacity: 0.95;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.site-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.site-name {
  font-size: 20px;
  font-weight: 600;
  opacity: 0.9;
}

.tagline {
  font-size: 16px;
  font-weight: 400;
  opacity: 0.8;
  font-style: italic;
}
</style>