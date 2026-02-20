/**
 * 预览状态管理
 * 用于管理博客写作页面的预览模式状态
 */
import { create } from 'zustand'

/**
 * 预览状态接口
 */
type PreviewStore = {
	isPreview: boolean // 是否处于预览模式
	openPreview: () => void // 打开预览
	closePreview: () => void // 关闭预览
	togglePreview: () => void // 切换预览状态
}

/**
 * 预览状态管理钩子
 */
export const usePreviewStore = create<PreviewStore>(set => ({
	isPreview: false, // 默认关闭预览
	/**
	 * 打开预览模式
	 */
	openPreview: () => set({ isPreview: true }),
	/**
	 * 关闭预览模式
	 */
	closePreview: () => set({ isPreview: false }),
	/**
	 * 切换预览模式状态
	 */
	togglePreview: () => set(state => ({ isPreview: !state.isPreview }))
}))
