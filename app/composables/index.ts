import { useDayjs } from '#dayjs'
import he from 'he'

// 处理HTML实体字符的函数
// 使用 he 库确保SSR和CSR行为完全一致
export function decodeHtmlEntities(text: string): string {
  // 统一使用 he 库进行HTML实体解码
  // 确保服务端和客户端行为完全一致、无需判断后分别处理
  return he.decode(text)
}

export const user = useUserStore
export const delHtmlTag = (html: string) => decodeHtmlEntities(html.replace(/<[^>]+>/g, ''))
export const dayjs = useDayjs()
export const parseDate = (date: string) => dayjs(date).format('YYYY-MM-DD')

// 检查是否在客户端环境
export const isClient = import.meta.client
