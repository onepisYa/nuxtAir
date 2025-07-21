// 动态翻译文件示例 - 支持参数传递和动态内容
// 使用 defineI18nLocale 确保正确的类型推断和异步支持
export default defineI18nLocale(() => {
  return {
    // 带参数的翻译
    greeting: '你好，{name}！',
    userProfile: '用户 {username} 的个人资料',
    
    // 复数形式翻译
    itemCount: '没有项目 | 1个项目 | {count}个项目',
    messageCount: '没有消息 | 1条消息 | {n}条消息',
    
    // 嵌套对象翻译
    navigation: {
      home: '首页',
      about: '关于我们',
      contact: '联系我们',
      products: '产品'
    },
    
    // 表单相关翻译
    form: {
      submit: '提交',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      validation: {
        required: '此字段为必填项',
        email: '请输入有效的邮箱地址',
        minLength: '最少需要 {min} 个字符',
        maxLength: '最多允许 {max} 个字符'
      }
    },

    // 状态消息
    status: {
      loading: '加载中...',
      success: '操作成功！',
      error: '操作失败，请重试',
      noData: '暂无数据'
    },
    
    // 时间相关翻译（可以结合 datetimeFormats 使用）
    time: {
      now: '刚刚',
      minutesAgo: '{minutes} 分钟前',
      hoursAgo: '{hours} 小时前',
      daysAgo: '{days} 天前',
      yesterday: '昨天',
      today: '今天',
      tomorrow: '明天'
    },
    
    // 动态内容示例 - 根据时间返回不同问候语
    dynamicGreeting: () => {
      const hour = new Date().getHours()
      if (hour < 6) return '夜深了，注意休息'
      if (hour < 12) return '早上好'
      if (hour < 14) return '中午好'
      if (hour < 18) return '下午好'
      if (hour < 22) return '晚上好'
      return '夜深了，注意休息'
    },
    
    // 季节性问候
    seasonalGreeting: () => {
      const month = new Date().getMonth() + 1
      if (month >= 3 && month <= 5) return '春天好！'
      if (month >= 6 && month <= 8) return '夏天好！'
      if (month >= 9 && month <= 11) return '秋天好！'
      return '冬天好！'
    },
    
    // 页面特定翻译
    pages: {
      home: {
        title: '欢迎来到我们的网站',
        subtitle: '探索无限可能',
        cta: '立即开始'
      },
      about: {
        title: '关于我们',
        description: '我们致力于提供最优质的服务'
      },
      contact: {
        title: '联系我们',
        phone: '电话',
        email: '邮箱',
        address: '地址'
      }
    },
    
    // 错误消息
    errors: {
      404: '页面未找到',
      500: '服务器内部错误',
      network: '网络连接失败',
      timeout: '请求超时',
      unauthorized: '未授权访问',
      forbidden: '禁止访问'
    },
    
    // 确认对话框
    confirm: {
      delete: '确定要删除这个项目吗？',
      save: '确定要保存更改吗？',
      cancel: '确定要取消操作吗？',
      logout: '确定要退出登录吗？'
    }
  }
})