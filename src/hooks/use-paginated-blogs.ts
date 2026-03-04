/**
 * 分页博客钩子
 * 用于按需获取博客数据，减少内存占用
 */
import useSWR from 'swr'
import type { BlogIndexItem } from '@/app/blog/types'

interface PaginatedBlogsResponse {
  items: BlogIndexItem[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch blogs')
  }
  return res.json() as Promise<PaginatedBlogsResponse>
}

export function usePaginatedBlogs(page = 1, limit = 10, options?: {
  category?: string
  tag?: string
  displayMode?: 'day' | 'week' | 'month' | 'year' | 'category'
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(options?.category && { category: options.category }),
    ...(options?.tag && { tag: options.tag }),
    ...(options?.displayMode && { displayMode: options.displayMode })
  })

  const { data, error, isLoading, mutate } = useSWR(
    `/api/blogs?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      keepPreviousData: true
    }
  )

  return {
    items: data?.items || [],
    total: data?.total || 0,
    page: data?.page || page,
    limit: data?.limit || limit,
    totalPages: data?.totalPages || 0,
    hasMore: data?.hasMore || false,
    loading: isLoading,
    error,
    mutate
  }
}
