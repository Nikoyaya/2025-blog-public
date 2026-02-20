/**
 * 动画卡片组件
 * 用于创建带有入场动画和交互效果的卡片
 */
'use client'

import { ANIMATION_DELAY } from '@/consts'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useSize } from '@/hooks/use-size'

/**
 * 卡片组件属性接口
 */
interface Props {
  className?: string // 自定义类名
  order: number // 动画顺序
  width: number // 卡片宽度
  height?: number // 卡片高度
  x: number // 卡片X坐标
  y: number // 卡片Y坐标
  children: React.ReactNode // 子组件
  onClick?: () => void // 点击事件处理函数
  disableHover?: boolean // 是否禁用悬停效果
  disableTap?: boolean // 是否禁用点击效果
}

/**
 * 动画卡片组件
 * @param children 子组件
 * @param order 动画顺序
 * @param width 卡片宽度
 * @param height 卡片高度
 * @param x 卡片X坐标
 * @param y 卡片Y坐标
 * @param className 自定义类名
 * @param onClick 点击事件处理函数
 * @param disableHover 是否禁用悬停效果
 * @param disableTap 是否禁用点击效果
 * @returns 动画卡片组件
 */
export default function Card({ children, order, width, height, x, y, className, onClick, disableHover, disableTap }: Props) {
	const { maxSM, init } = useSize()
	let [show, setShow] = useState(false)
	// 在小屏幕上重置动画顺序
	if (maxSM && init) order = 0

	useEffect(() => {
		if (show) return
		if (x === 0 && y === 0) return
		// 根据顺序设置动画延迟
		setTimeout(
			() => {
				setShow(true)
			},
			order * ANIMATION_DELAY * 1000
		)
	}, [x, y, show])

	if (show)
		return (
			<motion.div
			className={cn('card squircle', className)}
			initial={{ opacity: 0, scale: 0.6, left: x, top: y, width, height }} // 初始状态
			animate={{ opacity: 1, scale: 1, left: x, top: y, width, height }} // 动画状态
			whileHover={disableHover ? {} : { scale: 1.05 }} // 悬停效果
			whileTap={disableTap ? {} : { scale: 0.95 }} // 点击效果
			onClick={onClick}>
			{children}
		</motion.div>
		)

	return null
}