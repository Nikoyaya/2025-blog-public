/**
 * 分类管理钩子
 * 用于获取博客分类数据
 */
'use client'

import useSWR from 'swr'

/**
 * 分类配置接口
 */
export type CategoriesConfig = {
	categories: string[] // 分类数组
}

/**
 * 数据获取函数
 * 从服务器获取分类数据，处理不同格式的响应
 * @param url 请求URL
 * @returns 分类配置对象
 */
const fetcher = async (url: string): Promise<CategoriesConfig> => {
	const res = await fetch(url, { cache: 'no-store' })
	if (!res.ok) {
		return { categories: [] }
	}
	const data = await res.json()
	if (Array.isArray(data)) {
		return { categories: data.filter((item): item is string => typeof item === 'string') }
	}
	if (Array.isArray((data as any)?.categories)) {
		return { categories: (data as any).categories.filter((item: unknown): item is string => typeof item === 'string') }
	}
	return { categories: [] }
}

/**
 * 获取分类数据钩子
 * @returns 分类数据、加载状态和错误信息
 */
export function useCategories() {
	const { data, error, isLoading } = useSWR<CategoriesConfig>('/blogs/categories.json', fetcher, {
		revalidateOnFocus: false, // 聚焦时不重新验证
		revalidateOnReconnect: true // 重新连接时重新验证
	})

	return {
		categories: data?.categories ?? [],
		loading: isLoading,
		error
	}
}

