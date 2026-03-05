'use client'
import { useEffect, useState, useRef, memo } from 'react'
import { motion } from 'motion/react'

interface Firefly {
	id: number
	size: number
	duration: number
	delay: number
	left: number
	top: number
	opacity: number
	glowColor: string
	moveX: number
	moveY: number
}

interface MousePosition {
	x: number
	y: number
}

const GLOW_COLORS = ['#ADFF2F', '#FFFF00', '#7FFF00', '#00FF7F', '#FFD700', '#39FF14']

const FireflyItem = memo(function FireflyItem({ 
	firefly, 
	mousePos 
}: { 
	firefly: Firefly
	mousePos: MousePosition 
}) {
	// 计算萤火虫位置（百分比转像素）
	const fireflyX = (firefly.left / 100) * (typeof window !== 'undefined' ? window.innerWidth : 1000)
	const fireflyY = (firefly.top / 100) * (typeof window !== 'undefined' ? window.innerHeight : 800)
	
	// 计算与鼠标的距离
	const dx = fireflyX - mousePos.x
	const dy = fireflyY - mousePos.y
	const distance = Math.sqrt(dx * dx + dy * dy)
	
	// 避开的距离阈值
	const avoidRadius = 120
	
	// 计算避开偏移 - 力度更小，更柔和
	let avoidX = 0
	let avoidY = 0
	
	if (distance < avoidRadius && distance > 0) {
		const force = Math.pow((avoidRadius - distance) / avoidRadius, 2)
		avoidX = (dx / distance) * force * 30
		avoidY = (dy / distance) * force * 30
	}

	return (
		<motion.div
			className='absolute will-change-transform'
			style={{
				left: `${firefly.left}%`,
				top: `${firefly.top}%`,
				width: `${firefly.size}px`,
				height: `${firefly.size}px`,
			}}
			initial={{ 
				opacity: 0,
				x: 0,
				y: 0,
				scale: 0
			}}
			animate={{
				opacity: [0, 1, firefly.opacity, firefly.opacity * 0.4, firefly.opacity * 0.8, firefly.opacity * 0.3, firefly.opacity, 0],
				x: [
					0 + avoidX, 
					firefly.moveX * 0.2 + avoidX, 
					firefly.moveX * 0.5 + avoidX, 
					firefly.moveX * 0.8 + avoidX, 
					firefly.moveX + avoidX, 
					firefly.moveX * 0.6 + avoidX, 
					firefly.moveX * 0.3 + avoidX, 
					0 + avoidX
				],
				y: [
					0 + avoidY, 
					firefly.moveY * 0.1 + avoidY, 
					firefly.moveY * 0.3 + avoidY, 
					firefly.moveY * 0.6 + avoidY, 
					firefly.moveY * 0.9 + avoidY, 
					firefly.moveY + avoidY, 
					firefly.moveY * 0.5 + avoidY, 
					0 + avoidY
				],
				scale: [0, 1.2, 1, 0.7, 1.1, 0.8, 1, 0]
			}}
			transition={{
				duration: firefly.duration,
				delay: firefly.delay,
				repeat: Infinity,
				ease: 'easeInOut',
				x: { duration: 1.2, ease: 'easeOut' },
				y: { duration: 1.2, ease: 'easeOut' }
			}}
		>
			{/* 核心光点 */}
			<div 
				className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
				style={{
					width: `${firefly.size * 0.4}px`,
					height: `${firefly.size * 0.4}px`,
					backgroundColor: '#FFFFFF',
					boxShadow: `
						0 0 ${firefly.size}px ${firefly.size * 0.5}px ${firefly.glowColor},
						0 0 ${firefly.size * 2}px ${firefly.size}px ${firefly.glowColor}80,
						0 0 ${firefly.size * 4}px ${firefly.size * 2}px ${firefly.glowColor}40,
						0 0 ${firefly.size * 8}px ${firefly.size * 4}px ${firefly.glowColor}20
					`,
				}}
			/>
			{/* 外层光晕 */}
			<div 
				className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
				style={{
					width: `${firefly.size * 2}px`,
					height: `${firefly.size * 2}px`,
					background: `radial-gradient(circle, ${firefly.glowColor}60 0%, ${firefly.glowColor}30 30%, transparent 60%)`,
				}}
			/>
		</motion.div>
	)
})

const FirefliesBackground = memo(function FirefliesBackground({ 
	zIndex, 
	count = 20 
}: { 
	zIndex: number
	count?: number 
}) {
	const [fireflies, setFireflies] = useState<Firefly[]>([])
	const [mousePos, setMousePos] = useState<MousePosition>({ x: -1000, y: -1000 })
	const containerRef = useRef<HTMLDivElement>(null)

	// 监听鼠标移动
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY })
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [])

	useEffect(() => {
		const generateFireflies = () => {
			const newFireflies: Firefly[] = []
			for (let i = 0; i < count; i++) {
				const size = Math.random() * 4 + 4
				const duration = Math.random() * 12 + 10
				const delay = Math.random() * 20
				const left = Math.random() * 100
				const top = Math.random() * 70 + 15
				const opacity = Math.random() * 0.4 + 0.6
				const glowColor = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)]
				const moveX = (Math.random() - 0.5) * 200
				const moveY = (Math.random() - 0.5) * 120

				newFireflies.push({
					id: i,
					size,
					duration,
					delay,
					left,
					top,
					opacity,
					glowColor,
					moveX,
					moveY
				})
			}
			setFireflies(newFireflies)
		}

		generateFireflies()
	}, [count])

	return (
		<motion.div
			ref={containerRef}
			animate={{ opacity: 1 }}
			initial={{ opacity: 0 }}
			transition={{ duration: 2 }}
			className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
			style={{ zIndex }}
		>
			{fireflies.map(firefly => (
				<FireflyItem 
					key={firefly.id} 
					firefly={firefly} 
					mousePos={mousePos}
				/>
			))}
		</motion.div>
	)
})

export default FirefliesBackground
