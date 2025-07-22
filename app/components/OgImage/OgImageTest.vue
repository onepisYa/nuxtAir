<template>
  <div class="test-og-container">
    <!-- 简单的背景 -->
    <div class="test-bg" />
    
    <!-- 内容区域 -->
    <div class="test-content">
      <h1 class="test-title">{{ title || 'Test Title' }}</h1>
      <p class="test-description">{{ description || 'Test Description' }}</p>
      <div class="test-meta">
        <span class="test-author">{{ author || 'Test Author' }}</span>
        <span class="test-locale">{{ locale || 'en-US' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'OgImageTest'
})

const props = defineProps({
  title: String,
  description: String,
  author: String,
  locale: String
})
</script>

<style scoped>
.test-og-container {
  position: relative;
  width: 1200px;
  height: 630px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* 使用支持中文的字体 */
  font-family: 'Noto Sans SC', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.test-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.test-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 900px;
  padding: 60px;
}

.test-title {
  font-size: 48px;
  font-weight: bold;
  line-height: 1.2;
  margin: 0 0 24px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.test-description {
  font-size: 20px;
  line-height: 1.4;
  margin: 0 0 32px 0;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.test-meta {
  display: flex;
  justify-content: center;
  gap: 32px;
  font-size: 16px;
  opacity: 0.8;
}

.test-author,
.test-locale {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}
</style>