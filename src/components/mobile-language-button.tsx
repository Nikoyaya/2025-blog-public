'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import LanguageSelector from './language-selector'
import { useSize } from '@/hooks/use-size'

type MobileLanguageButtonProps = {
	className?: string
	 delay?: number
}

export function MobileLanguageButton({ className, delay }: MobileLanguageButtonProps) {
	const [show, setShow] = useState(false)
	const [active, setActive] = useState(false)
	const { maxSM } = useSize()
	
	useEffect(() => {
		if (maxSM) {
			setTimeout(() => setShow(true), delay || 1000)
		} else {
			setShow(false)
		}
	}, [delay, maxSM])

	useEffect(() => {
		if (!maxSM) return
		
		let inactivityTimer: NodeJS.Timeout
		
		const handleScroll = () => {
			setActive(true)
			
			// 清除之前的定时器
			clearTimeout(inactivityTimer)
			
			// 设置新的定时器，3秒后隐藏按钮
			inactivityTimer = setTimeout(() => {
				setActive(false)
			}, 5000)
		}
		
		// 初始化时设置为可见
		setActive(true)
		
		// 设置初始定时器，3秒后隐藏按钮
		inactivityTimer = setTimeout(() => {
			setActive(false)
		}, 3000)
		
		// 添加滚动事件监听
		window.addEventListener('scroll', handleScroll, { passive: true })
		
		// 清理函数
		return () => {
			window.removeEventListener('scroll', handleScroll)
			clearTimeout(inactivityTimer)
		}
	}, [maxSM])

	if (!show || !active || !maxSM) return null

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.4 }}
			animate={{ opacity: 1, scale: 1 }}
			className={cn('z-50', className)}
		>
			<LanguageSelector direction="up" mobile={true} />
		</motion.div>
	)
}
