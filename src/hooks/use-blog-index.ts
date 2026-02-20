/**
 * 博客索引管理钩子
 * 用于获取博客索引和最新博客信息
 */
import useSWR from 'swr'
import { useAuthStore } from '@/hooks/use-auth'
import type { BlogIndexItem } from '@/app/blog/types'

export type { BlogIndexItem } from '@/app/blog/types'

/**
 * 数据获取函数
 * 改进的fetcher，抛出状态码以便处理404等错误
 * @param url 请求URL
 * @returns 博客索引数据数组
 */
const fetcher = async (url: string) => {
	const res = await fetch(url, { cache: 'no-store' })
	if (!res.ok) {
		const error: any = new Error('Fetch failed')
		error.status = res.status
		throw error
	}
	const data = await res.json()
	return Array.isArray(data) ? data : []
}

/**
 * 获取博客索引钩子
 * @returns 博客索引数据、加载状态和错误信息
 */
export function useBlogIndex() {
	const { isAuth } = useAuthStore()
	const { data, error, isLoading } = useSWR<BlogIndexItem[]>('/blogs/index.json', fetcher, {
		revalidateOnFocus: false, // 聚焦时不重新验证
		revalidateOnReconnect: true // 重新连接时重新验证
	})

	let result = data || []
	// 未认证用户过滤掉隐藏的博客
	if (!isAuth) {
		result = result.filter(item => !item.hidden)
	}

	return {
		items: result,
		loading: isLoading,
		error
	}
}

/**
 * 获取最新博客钩子
 * @returns 最新博客数据、加载状态和错误信息
 */
export function useLatestBlog() {
	const { items, loading, error } = useBlogIndex()

	// 按日期排序获取最新博客
	const latestBlog = items.length > 0 ? items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null

	return {
		blog: latestBlog,
		loading,
		error
	}
}
