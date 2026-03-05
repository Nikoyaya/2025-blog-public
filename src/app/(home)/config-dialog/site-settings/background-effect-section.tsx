'use client'

import type { SiteContent } from '../../stores/config-store'
import { useLanguage } from '@/i18n/context'

type BackgroundEffectType = 'none' | 'snow' | 'fireflies' | 'cherry-blossom'

interface BackgroundEffectSectionProps {
	formData: SiteContent
	setFormData: React.Dispatch<React.SetStateAction<SiteContent>>
}

const EFFECT_OPTIONS: { value: BackgroundEffectType; labelKey: string; description: string }[] = [
	{ value: 'none', labelKey: 'siteSettings.backgroundEffect.none', description: '不显示任何背景效果' },
	{ value: 'snow', labelKey: 'siteSettings.backgroundEffect.snow', description: '雪花飘落效果，适合冬季氛围' },
	{ value: 'fireflies', labelKey: 'siteSettings.backgroundEffect.fireflies', description: '萤火虫飞舞效果，营造夏夜浪漫氛围' },
	{ value: 'cherry-blossom', labelKey: 'siteSettings.backgroundEffect.cherryBlossom', description: '樱花飘落效果，营造春日浪漫氛围' }
]

export function BackgroundEffectSection({ formData, setFormData }: BackgroundEffectSectionProps) {
	const { t } = useLanguage()

	// 获取当前选中的效果类型
	const getCurrentEffect = (): BackgroundEffectType => {
		if (formData.enableSnow) return 'snow'
		if (formData.enableFireflies) return 'fireflies'
		if (formData.enableCherryBlossom) return 'cherry-blossom'
		return 'none'
	}

	// 处理效果切换 - 单选逻辑
	const handleEffectChange = (effect: BackgroundEffectType) => {
		setFormData(prev => ({
			...prev,
			enableSnow: effect === 'snow',
			enableFireflies: effect === 'fireflies',
			enableCherryBlossom: effect === 'cherry-blossom'
		}))
	}

	const currentEffect = getCurrentEffect()

	return (
		<div className='rounded-2xl border bg-card p-4'>
			<h3 className='mb-4 text-sm font-medium'>{t('siteSettings.backgroundEffect.title')}</h3>
			<div className='space-y-3'>
				{EFFECT_OPTIONS.map(option => (
					<label
						key={option.value}
						className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all hover:bg-secondary/5 ${
							currentEffect === option.value
								? 'border-brand bg-brand/5'
								: 'border-border'
						}`}
					>
						<input
							type='radio'
							name='backgroundEffect'
							value={option.value}
							checked={currentEffect === option.value}
							onChange={() => handleEffectChange(option.value)}
							className='accent-brand mt-1 h-4 w-4'
						/>
						<div className='flex-1'>
							<span className='block text-sm font-medium'>{t(option.labelKey)}</span>
							<span className='block text-xs text-gray-500'>{option.description}</span>
						</div>
					</label>
				))}
			</div>
			<p className='mt-3 text-xs text-gray-400'>
				{t('siteSettings.backgroundEffect.tip')}
			</p>
		</div>
	)
}
