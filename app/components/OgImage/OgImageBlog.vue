<template>
  <div class="blog-og-container">
    <!-- 博客专用渐变背景 -->
    <div class="blog-bg-gradient" />
    
    <!-- 装饰性图案 -->
    <div class="blog-patterns">
      <div class="pattern pattern-1" />
      <div class="pattern pattern-2" />
    </div>
    
    <!-- 内容区域 -->
    <div class="blog-content">
      <div class="blog-header">
        <div class="blog-icon">📝</div>
        <span class="blog-label">{{ blogLabel }}</span>
      </div>
      
      <h1 class="blog-title">{{ title }}</h1>
      <p class="blog-description">{{ description }}</p>
      
      <div class="blog-meta">
        <div class="author-info">
          <span class="author-label">{{ authorLabel }}</span>
          <span class="author-name">{{ author }}</span>
        </div>
        <div class="publish-info">
          <span class="date-label">{{ dateLabel }}</span>
          <span class="publish-date">{{ formattedDate }}</span>
        </div>
      </div>
      
      <div class="blog-footer">
        <span class="site-name">{{ siteName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name:'OgImageBlog'
})

const props = defineProps({
  title: String,
  description: String,
  author: String,
  publishDate: String,
  siteName: String,
  locale: String
})

const currentLocale = computed(() => props.locale || 'en-US')
const isChinese = computed(() => currentLocale.value === 'zh-CN')

const blogLabel = computed(() => isChinese.value ? '博客文章' : 'Blog Post')
const authorLabel = computed(() => isChinese.value ? '作者:' : 'By')
const dateLabel = computed(() => isChinese.value ? '发布:' : 'Published')

const formattedDate = computed(() => {
  if (!props.publishDate) return ''
  const date = new Date(props.publishDate)
  return date.toLocaleDateString(currentLocale.value)
})
</script>

<style scoped>
.blog-og-container {
  position: relative;
  width: 1200px;
  height: 630px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.blog-bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #2d3748 100%);
  opacity: 0.95;
}

.blog-patterns {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.pattern {
  position: absolute;
  background: rgba(255, 255, 255, 0.03);
}

.pattern-1 {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  top: -150px;
  right: -150px;
}

.pattern-2 {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  bottom: -100px;
  left: -100px;
  transform: rotate(45deg);
}

.blog-content {
  position: relative;
  z-index: 10;
  color: white;
  max-width: 1000px;
  padding: 60px;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}

.blog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.blog-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.blog-label {
  font-size: 18px;
  font-weight: 600;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.blog-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 24px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-description {
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 40px 0;
  color: #cbd5e0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.blog-meta {
  display: flex;
  gap: 40px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.author-info,
.publish-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-label,
.date-label {
  font-size: 14px;
  font-weight: 500;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.author-name,
.publish-date {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
}

.blog-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
}

.site-name {
  font-size: 18px;
  font-weight: 600;
  color: #a0aec0;
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .blog-title {
    font-size: 40px;
  }
  
  .blog-description {
    font-size: 18px;
  }
  
  .blog-content {
    padding: 40px;
  }
}
</style>