/**
 * 本地认证状态管理钩子
 * 用于管理本地登录状态和过期检查
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 本地认证状态接口
 */
interface LocalAuthStore {
	// 状态
	isLoggedIn: boolean // 是否已登录
	loginTimestamp: number | null // 登录时间戳

	// 操作
	login: () => void // 登录
	logout: () => void // 登出
	checkExpiration: () => boolean // 检查登录是否过期
}

/**
 * 登录过期时间（毫秒），默认6小时
 */
const LOGIN_EXPIRATION_TIME = 6 * 60 * 60 * 1000

/**
 * 本地认证状态存储
 * 使用persist中间件持久化到localStorage
 */
export const useLocalAuthStore = create<LocalAuthStore>()(
	persist(
		(set, get) => ({
			isLoggedIn: false,
			loginTimestamp: null,

			/**
			 * 登录操作
			 * 设置登录状态为true并记录登录时间戳
			 */
			login: () => set({ 
				isLoggedIn: true, 
				loginTimestamp: Date.now() 
			}),
			
			/**
			 * 登出操作
			 * 设置登录状态为false并清空登录时间戳
			 */
			logout: () => set({ 
				isLoggedIn: false, 
				loginTimestamp: null 
			}),
			
			/**
			 * 检查登录是否过期
			 * @returns 是否过期
			 */
			checkExpiration: () => {
				const { isLoggedIn, loginTimestamp } = get()
				if (!isLoggedIn || !loginTimestamp) {
					return false
				}
				// 检查是否过期
				const isExpired = Date.now() - loginTimestamp > LOGIN_EXPIRATION_TIME
				if (isExpired) {
					// 过期后自动登出
					get().logout()
					return true
				}
				return false
			},
		}),
		{
			name: 'local-auth-storage', // localStorage 键名
			// 在从存储中加载状态后检查是否过期
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.checkExpiration()
				}
			},
		}
	)
)
