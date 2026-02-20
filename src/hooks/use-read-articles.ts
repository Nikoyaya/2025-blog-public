/**
 * 已读文章管理钩子
 * 用于跟踪用户已阅读的文章
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 已读文章哈希表类型
 * 使用对象哈希表实现O(1)时间复杂度的查找
 */
type ReadArticlesHash = Record<string, boolean>

/**
 * 已读文章存储接口
 */
interface ReadArticlesStore {
	readArticles: ReadArticlesHash // 已读文章哈希表
	markAsRead: (slug: string) => void // 标记文章为已读
	isRead: (slug: string) => boolean // 检查文章是否已读
	clearAll: () => void // 清除所有已读记录
}

/**
 * 已读文章管理钩子
 * @returns 已读文章管理方法和状态
 */
export const useReadArticles = create<ReadArticlesStore>()(
	persist(
		(set, get) => ({
			readArticles: {},

			/**
			 * 标记文章为已读
			 * @param slug 文章slug
			 */
			markAsRead: (slug: string) => {
				set(state => ({
					readArticles: {
						...state.readArticles,
						[slug]: true
					}
				}))
			},

			/**
			 * 检查文章是否已读
			 * @param slug 文章slug
			 * @returns 是否已读
			 */
			isRead: (slug: string) => {
				return get().readArticles[slug] === true
			},

			/**
			 * 清除所有已读记录
			 */
			clearAll: () => {
				set({ readArticles: {} })
			}
		}),
		{
			name: 'blog-read-articles' // 本地存储键名
		}
	)
)
