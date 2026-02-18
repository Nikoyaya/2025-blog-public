'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useMarkdownRender } from '@/hooks/use-markdown-render'
import { pushAbout, type AboutData } from './services/push-about'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import LikeButton from '@/components/like-button'
import GithubSVG from '@/svgs/github.svg'
import initialData from './list.json'
import { useLanguage } from '@/i18n/context'
import { useLocalAuthStore } from '@/hooks/use-local-auth'

export default function Page() {
	const [data, setData] = useState<AboutData>(initialData as AboutData)
	const [originalData, setOriginalData] = useState<AboutData>(initialData as AboutData)
	const [isEditMode, setIsEditMode] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [isPreviewMode, setIsPreviewMode] = useState(false)
	const keyInputRef = useRef<HTMLInputElement>(null)

	const { isAuth, setPrivateKey } = useAuthStore()
	const { siteContent } = useConfigStore()
	const { content, loading } = useMarkdownRender(data.content)
	const hideEditButton = siteContent.hideEditButton ?? false
	const { t } = useLanguage()
	const { isLoggedIn } = useLocalAuthStore()

	const handleChoosePrivateKey = async (file: File) => {
		try {
			const text = await file.text()
			setPrivateKey(text)
			await handleSave()
		} catch (error) {
			console.error('Failed to read private key:', error)
			toast.error(t('toast.readKeyFileError'))
		}
	}

	const handleSaveClick = () => {
		if (!isAuth) {
			keyInputRef.current?.click()
		} else {
			handleSave()
		}
	}

	const handleEnterEditMode = () => {
		setIsEditMode(true)
		setIsPreviewMode(false)
	}

	const handleSave = async () => {
		setIsSaving(true)

		try {
			await pushAbout(data)

			setOriginalData(data)
			setIsEditMode(false)
			setIsPreviewMode(false)
			toast.success(t('toast.saveSuccess'))
		} catch (error: any) {
			console.error('Failed to save:', error)
			toast.error(`${t('toast.saveFailed')}: ${error?.message || t('toast.error')}`)
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		setData(originalData)
		setIsEditMode(false)
		setIsPreviewMode(false)
	}

	const buttonText = isAuth ? t('toast.saveSuccess') : t('config.importKey')

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isEditMode && (e.ctrlKey || e.metaKey) && e.key === ',') {
				e.preventDefault()
				setIsEditMode(true)
				setIsPreviewMode(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isEditMode])

	return (
		<>
			<input
				ref={keyInputRef}
				type='file'
				accept='.pem'
				className='hidden'
				onChange={async e => {
					const f = e.target.files?.[0]
					if (f) await handleChoosePrivateKey(f)
					if (e.currentTarget) e.currentTarget.value = ''
				}}
			/>

			<div className='flex flex-col items-center justify-center px-6 pt-32 pb-12 max-sm:px-0'>
				<div className='w-full max-w-[800px]'>
					{isEditMode ? (
							isPreviewMode ? (
								<div className='space-y-6'>
									<div className='text-center'>
										<h1 className='mb-4 text-4xl font-bold'>{data.title || t('about.titlePreview')}</h1>
										<p className='text-secondary text-lg'>{data.description || t('about.descriptionPreview')}</p>
									</div>

									{loading ? (
										<div className='text-secondary text-center'>{t('about.renderingPreview')}</div>
									) : (
										<div className='card relative p-6'>
											<div className='prose prose-sm max-w-none'>{content}</div>
										</div>
									)}
								</div>
							) : (
								<div className='space-y-6'>
									<div className='space-y-4'>
										<input
											type='text'
											placeholder={t('about.title')}
											className='w-full px-4 py-3 text-center text-2xl font-bold'
											value={data.title}
											onChange={e => setData({ ...data, title: e.target.value })}
										/>
										<input
											type='text'
											placeholder={t('about.description')}
											className='w-full px-4 py-3 text-center text-lg'
											value={data.description}
											onChange={e => setData({ ...data, description: e.target.value })}
										/>
									</div>

									<div className='card relative'>
										<textarea
											placeholder={t('about.markdownContent')}
											className='min-h-[400px] w-full resize-none text-sm'
											value={data.content}
											onChange={e => setData({ ...data, content: e.target.value })}
										/>
									</div>
								</div>
							)
						) : (
							<>
								<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-12 text-center'>
									<h1 className='mb-4 text-4xl font-bold'>{data.title}</h1>
									<p className='text-secondary text-lg'>{data.description}</p>
								</motion.div>

								{loading ? (
									<div className='text-secondary text-center'>{t('about.loading')}</div>
								) : (
									<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className='card relative p-6'>
										<div className='prose prose-sm max-w-none'>{content}</div>
									</motion.div>
								)}
							</>
						)}
					</div>
				</div>

				<motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className='fixed top-4 right-6 z-10 flex gap-3 max-sm:hidden'>
					{isEditMode ? (
						<>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleCancel}
								disabled={isSaving}
								className='rounded-xl border bg-white/60 px-6 py-2 text-sm'>
								{t('config.cancel')}
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsPreviewMode(prev => !prev)}
								disabled={isSaving}
								className={`rounded-xl border bg-white/60 px-6 py-2 text-sm`}>
								{isPreviewMode ? t('about.continueEditing') : t('config.preview')}
							</motion.button>
							<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSaveClick} disabled={isSaving} className='brand-btn px-6'>
								{isSaving ? t('config.saving') : buttonText}
							</motion.button>
						</>
					) : (
						!hideEditButton && isLoggedIn && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={handleEnterEditMode}
										className='rounded-xl border bg-white/60 px-6 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-white/80'>
										{t('about.edit')}
									</motion.button>
								)
					)}
				</motion.div>
		</>
	)
}
