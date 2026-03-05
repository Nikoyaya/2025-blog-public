'use client'
import { useEffect, useState, memo } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface Petal {
	id: number
	size: number
	duration: number
	delay: number
	left: number
	rotate: number
	swayAmount: number
}

const PetalItem = memo(function PetalItem({ petal }: { petal: Petal }) {
	return (
		<motion.div
			className='absolute will-change-transform'
			style={{
				top: -50,
				left: `${petal.left}%`,
				width: `${petal.size}px`,
				height: `${petal.size}px`,
			}}
			initial={{ 
				y: 0, 
				x: 0, 
				rotate: petal.rotate,
				opacity: 0.8 
			}}
			animate={{
				y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
				x: [
					0,
					Math.sin(petal.swayAmount) * petal.swayAmount * 30,
					Math.sin(petal.swayAmount * 2) * petal.swayAmount * 30,
					Math.sin(petal.swayAmount * 3) * petal.swayAmount * 30,
					0
				],
				rotate: petal.rotate + 360,
				opacity: [0.8, 0.9, 0.7, 0.9, 0.6]
			}}
			transition={{
				duration: petal.duration,
				delay: petal.delay,
				repeat: Infinity,
				ease: 'linear',
				x: {
					duration: petal.duration,
					ease: 'easeInOut'
				}
			}}
		>
			<Image
				src='/images/cherryblossom/CherryBlossom.png'
				alt=''
				width={petal.size}
				height={petal.size}
				className='h-full w-full object-contain'
				draggable={false}
				style={{
					filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
				}}
			/>
		</motion.div>
	)
})

const CherryBlossomBackground = memo(function CherryBlossomBackground({ 
	zIndex, 
	count = 40 
}: { 
	zIndex: number
	count?: number 
}) {
	const [petals, setPetals] = useState<Petal[]>([])

	useEffect(() => {
		const generatePetals = () => {
			const newPetals: Petal[] = []
			for (let i = 0; i < count; i++) {
				const size = Math.random() * 15 + 15
				const duration = Math.random() * 15 + 15
				const delay = Math.random() * 30
				const left = Math.random() * 110 - 5
				const rotate = Math.random() * 360
				const swayAmount = Math.random() * 2 + 1

				newPetals.push({
					id: i,
					size,
					duration,
					delay,
					left,
					rotate,
					swayAmount
				})
			}
			setPetals(newPetals)
		}

		generatePetals()
	}, [count])

	return (
		<motion.div
			animate={{ opacity: 1 }}
			initial={{ opacity: 0 }}
			transition={{ duration: 1 }}
			className='pointer-events-none fixed inset-0 z-0 overflow-hidden'
			style={{ zIndex }}
		>
			{petals.map(petal => (
				<PetalItem key={petal.id} petal={petal} />
			))}
		</motion.div>
	)
})

export default CherryBlossomBackground
