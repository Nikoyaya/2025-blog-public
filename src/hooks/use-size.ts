/**
 * 响应式尺寸检测钩子
 * 用于检测当前窗口尺寸并提供响应式断点信息
 */
'use client'

import { useEffect } from 'react'
import { create } from 'zustand'

/**
 * 尺寸状态类型
 */
type SizeState = {
	init: boolean // 初始化状态
	maxXL: boolean // 是否小于 XL 断点 (1280px)
	maxLG: boolean // 是否小于 LG 断点 (1024px)
	maxMD: boolean // 是否小于 MD 断点 (768px)
	maxSM: boolean // 是否小于 SM 断点 (640px)
	maxXS: boolean // 是否小于 XS 断点 (360px)
	recalc: () => void // 重新计算尺寸的方法
}

/**
 * 初始状态
 */
const initState = {
	init: false,
	maxXL: false,
	maxLG: false,
	maxMD: false,
	maxSM: false,
	maxXS: false
}

/**
 * 计算当前尺寸状态
 * @returns 尺寸状态对象（不包含recalc方法）
 */
const computeSize = (): Omit<SizeState, 'recalc'> => {
	if (typeof window !== 'undefined') {
		const width = window.innerWidth

		return {
			init: true,
			maxXL: width < 1280,
			maxLG: width < 1024,
			maxMD: width < 768,
			maxSM: width < 640,
			maxXS: width < 360
		}
	}

	return initState
}

/**
 * 尺寸状态存储
 */
export const useSizeStore = create<SizeState>(set => ({
	...initState,
	recalc: () => {
		set(computeSize())
	}
}))

/**
 * 尺寸初始化钩子
 * 在组件挂载时初始化尺寸检测并监听窗口 resize 事件
 */
export function useSizeInit() {
	useEffect(() => {
		const update = () => useSizeStore.getState().recalc()
		update()
		window.addEventListener('resize', update)
		return () => window.removeEventListener('resize', update)
	}, [])
}

/**
 * 尺寸检测钩子
 * 导出为 useSize 供其他组件使用
 */
export const useSize = useSizeStore
