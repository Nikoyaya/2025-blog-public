import { useCallback, useEffect } from 'react'
import { readFileAsText } from '@/lib/file-utils'
import { toast } from 'sonner'
import { pushBlog } from '../services/push-blog'
import { deleteBlog } from '../services/delete-blog'
import { useWriteStore } from '../stores/write-store'
import { useAuthStore } from '@/hooks/use-auth'
import { useLanguage } from '@/i18n/context'

export function usePublish() {
	const { loading, setLoading, form, cover, images, mode, originalSlug } = useWriteStore()
	const { isAuth, setPrivateKey, refreshAuthState } = useAuthStore()
	const { t } = useLanguage()

	// 组件挂载时刷新认证状态
	useEffect(() => {
		refreshAuthState()
	}, [refreshAuthState])

	const onChoosePrivateKey = useCallback(
		async (file: File) => {
			const pem = await readFileAsText(file)
			setPrivateKey(pem)
		},
		[setPrivateKey]
	)

	const onPublish = useCallback(async () => {
		try {
			setLoading(true)
			await pushBlog({
				form,
				cover,
				images,
				mode,
				originalSlug
			})

			toast.success(t('toast.publishSuccess'))
		} catch (err: any) {
			console.error(err)
			toast.error(err?.message || t('toast.error'))
		} finally {
			setLoading(false)
		}
	}, [form, cover, images, mode, originalSlug, setLoading, t])

	const onDelete = useCallback(async () => {
		const targetSlug = originalSlug || form.slug
		if (!targetSlug) {
			toast.error('缺少 slug，无法删除')
			return
		}
		try {
			setLoading(true)
			await deleteBlog(targetSlug)
			toast.success(t('toast.deleteSuccess'))
		} catch (err: any) {
			console.error(err)
			toast.error(err?.message || t('toast.error'))
		} finally {
			setLoading(false)
		}
	}, [form.slug, originalSlug, setLoading, t])

	return {
		isAuth,
		loading,
		onChoosePrivateKey,
		onPublish,
		onDelete
	}
}
