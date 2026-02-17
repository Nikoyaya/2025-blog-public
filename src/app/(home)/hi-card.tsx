import { useCenterStore } from '@/hooks/use-center'
import Card from '@/components/card'
import { useConfigStore } from './stores/config-store'
import { HomeDraggableLayer } from './home-draggable-layer'
import { useLanguage } from '@/i18n/context'

export default function HiCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const { t, language } = useLanguage()
	const styles = cardStyles.hiCard
	const username = siteContent.meta.username || 'Amis'

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x - styles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - styles.height / 2

	// 获取当前时间对应的问候语
	const getGreeting = () => {
		const hour = new Date().getHours()

		if (hour >= 6 && hour < 12) {
			return t('siteSettings.hiCard.greeting.morning')
		} else if (hour >= 12 && hour < 18) {
			return t('siteSettings.hiCard.greeting.afternoon')
		} else if (hour >= 18 && hour < 22) {
			return t('siteSettings.hiCard.greeting.evening')
		} else {
			return t('siteSettings.hiCard.greeting.night')
		}
	}

	const greeting = getGreeting()

	return (
		<HomeDraggableLayer cardKey='hiCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='relative text-center max-sm:static max-sm:translate-0'>
				{siteContent.enableChristmas && (
					<>
						<img
							src='/images/christmas/snow-1.webp'
							alt='Christmas decoration'
							className='pointer-events-none absolute'
							style={{ width: 180, left: -20, top: -25, opacity: 0.9 }}
						/>
						<img
							src='/images/christmas/snow-2.webp'
							alt='Christmas decoration'
							className='pointer-events-none absolute'
							style={{ width: 160, bottom: -12, right: -8, opacity: 0.9 }}
						/>
					</>
				)}
				<img src='/images/avatar.png' className='mx-auto rounded-full' style={{ width: 120, height: 120, boxShadow: ' 0 16px 32px -5px #E2D9CE' }} />
				<h1 className='font-averia mt-3 text-2xl'>
					{greeting} <br />
					{language === 'zh-CN' && (
						<>我是 <span className='text-linear text-[32px]'>{username}</span>，很高兴认识你！</>
					)}
					{language === 'en' && (
						<>I'm <span className='text-linear text-[32px]'>{username}</span>, Nice to meet you!</>
					)}
					{language === 'zh-TW' && (
						<>我是 <span className='text-linear text-[32px]'>{username}</span>，很高興認識你！</>
					)}
				</h1>
			</Card>
		</HomeDraggableLayer>
	)
}
