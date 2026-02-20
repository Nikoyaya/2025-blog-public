/**
 * 博客写作状态管理
 * 用于管理博客写作页面的所有状态，包括表单、图片、封面和发布状态
 */
import { create } from 'zustand'
import { toast } from 'sonner'
import { hashFileSHA256 } from '@/lib/file-utils'
import { loadBlog } from '@/lib/load-blog'
import type { PublishForm, ImageItem } from '../types'

/**
 * 格式化日期时间为本地格式
 * @param date 日期对象，默认为当前时间
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTimeLocal = (date: Date = new Date()): string => {
	const pad = (n: number) => String(n).padStart(2, '0')
	const year = date.getFullYear()
	const month = pad(date.getMonth() + 1)
	const day = pad(date.getDate())
	const hours = pad(date.getHours())
	const minutes = pad(date.getMinutes())
	return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * 写作状态接口
 */
type WriteStore = {
	// 模式状态
	mode: 'create' | 'edit' // 写作模式：创建或编辑
	originalSlug: string | null // 原始 slug（编辑模式下使用）
	setMode: (mode: 'create' | 'edit', originalSlug?: string) => void // 设置模式

	// 表单状态
	form: PublishForm // 发布表单
	updateForm: (updates: Partial<PublishForm>) => void // 更新表单
	setForm: (form: PublishForm) => void // 设置表单

	// 图片状态
	images: ImageItem[] // 图片列表
	addUrlImage: (url: string) => void // 添加 URL 图片
	addFiles: (files: FileList | File[]) => Promise<ImageItem[]> // 添加文件图片
	deleteImage: (id: string) => void // 删除图片

	// 封面状态
	cover: ImageItem | null // 封面图片
	setCover: (cover: ImageItem | null) => void // 设置封面

	// 发布状态
	loading: boolean // 加载状态
	setLoading: (loading: boolean) => void // 设置加载状态

	// 编辑功能
	loadBlogForEdit: (slug: string) => Promise<void> // 加载博客用于编辑

	// 重置功能
	reset: () => void // 重置到创建模式
}

/**
 * 初始表单数据
 */
const initialForm: PublishForm = {
	slug: '', // 博客唯一标识符
	title: '', // 博客标题
	md: '', // Markdown 内容
	tags: [], // 标签列表
	date: formatDateTimeLocal(), // 发布日期
	summary: '', // 摘要
	hidden: false, // 是否隐藏
	category: '' // 分类
}

export const useWriteStore = create<WriteStore>((set, get) => ({
	// 模式状态
	mode: 'create', // 默认创建模式
	originalSlug: null, // 原始 slug，编辑模式下使用
	/**
	 * 设置写作模式
	 * @param mode 模式：创建或编辑
	 * @param originalSlug 原始 slug，编辑模式下必需
	 */
	setMode: (mode, originalSlug) => set({ mode, originalSlug: originalSlug || null }),

	// 表单状态
	form: { ...initialForm }, // 表单数据
	/**
	 * 更新表单数据
	 * @param updates 要更新的表单字段
	 */
	updateForm: updates => set(state => ({ form: { ...state.form, ...updates } })),
	/**
	 * 设置完整的表单数据
	 * @param form 完整的表单数据
	 */
	setForm: form => set({ form }),

	// 图片状态
	images: [], // 图片列表
	/**
	 * 添加 URL 图片
	 * @param url 图片 URL
	 */
	addUrlImage: url => {
		const { images } = get()
		// 检查图片是否已存在
		const exists = images.some(it => it.type === 'url' && it.url === url)
		if (exists) {
			toast.info('该图片已在列表中')
			return
		}
		// 生成唯一 ID 并添加图片
		const id = Math.random().toString(36).slice(2, 10)
		set(state => ({ images: [{ id, type: 'url', url }, ...state.images] }))
	},
	/**
	 * 添加文件图片
	 * @param files 文件列表
	 * @returns 添加的图片列表
	 */
	addFiles: async (files: FileList | File[]) => {
		const { images } = get()
		// 过滤出图片文件
		const arr = Array.from(files).filter(f => f.type.startsWith('image/'))
		if (arr.length === 0) return []

		// 收集已存在的文件哈希
		const existingHashes = new Map<string, ImageItem>(
			images
				.filter((it): it is Extract<ImageItem, { type: 'file'; hash?: string }> => it.type === 'file' && (it as any).hash)
				.map(it => [(it as any).hash as string, it])
		)

		// 计算每个文件的哈希
		const computed = await Promise.all(
			arr.map(async file => {
				const hash = await hashFileSHA256(file)
				return { file, hash }
			})
		)

		// 过滤出唯一的新文件
		const seen = new Set<string>()
		const unique = computed.filter(({ hash }) => {
			if (existingHashes.has(hash)) return false
			if (seen.has(hash)) return false
			seen.add(hash)
			return true
		})

		const resultImages: ImageItem[] = []

		// 处理已存在的图片
		for (const { hash } of computed) {
			if (existingHashes.has(hash)) {
				resultImages.push(existingHashes.get(hash)!)
			}
		}

		// 处理新图片
		if (unique.length > 0) {
			const newItems: ImageItem[] = unique.map(({ file, hash }) => {
				const id = Math.random().toString(36).slice(2, 10)
				const previewUrl = URL.createObjectURL(file)
				const filename = file.name
				return { id, type: 'file', file, previewUrl, filename, hash }
			})

			set(state => ({ images: [...newItems, ...state.images] }))
			resultImages.push(...newItems)
		} else if (resultImages.length === 0) {
			toast.info('图片已存在，不重复添加')
		}

		return resultImages
	},
	/**
	 * 删除图片
	 * @param id 图片 ID
	 */
	deleteImage: id =>
		set(state => {
			for (const it of state.images) {
				if (it.type === 'file' && it.id === id) {
					// 释放对象 URL
					URL.revokeObjectURL(it.previewUrl)

					// 如果删除的是封面图片，同时清除封面
					if (it.id === state.cover?.id) {
						set({ cover: null })
					}
				}
			}
			return { images: state.images.filter(it => it.id !== id) }
		}),

	// 封面状态
	cover: null, // 封面图片
	/**
	 * 设置封面图片
	 * @param cover 封面图片或 null
	 */
	setCover: cover => set({ cover }),

	// 发布状态
	loading: false, // 加载状态
	/**
	 * 设置加载状态
	 * @param loading 加载状态
	 */
	setLoading: loading => set({ loading }),

	/**
	 * 加载博客用于编辑
	 * @param slug 博客 slug
	 */
	loadBlogForEdit: async (slug: string) => {
		try {
			set({ loading: true })
			const blog = await loadBlog(slug)

			// 从 markdown 中解析图片
			const images: ImageItem[] = []
			const imageRegex = /!\[.*?\]\((.*?)\)/g
			let match
			while ((match = imageRegex.exec(blog.markdown)) !== null) {
				const url = match[1]
				// 跳过封面图片，只收集内容图片
				if (url && url !== blog.cover && !url.startsWith('local-image:')) {
					// 检查是否已添加
					if (!images.some(img => img.type === 'url' && img.url === url)) {
						const id = Math.random().toString(36).slice(2, 10)
						images.push({ id, type: 'url', url })
					}
				}
			}

			// 设置封面
			let cover: ImageItem | null = null
			if (blog.cover) {
				const coverId = Math.random().toString(36).slice(2, 10)
				cover = { id: coverId, type: 'url', url: blog.cover }
			}

			// 设置表单
			set({
				mode: 'edit',
				originalSlug: slug,
				form: {
					slug,
					title: blog.config.title || '',
					md: blog.markdown,
					tags: blog.config.tags || [],
					date: blog.config.date ? formatDateTimeLocal(new Date(blog.config.date)) : formatDateTimeLocal(),
					summary: blog.config.summary || '',
					hidden: blog.config.hidden || false,
					category: blog.config.category || ''
				},
				images,
				cover,
				loading: false
			})

			toast.success('博客加载成功')
		} catch (err: any) {
			console.error('Failed to load blog:', err)
			toast.error(err?.message || '加载博客失败')
			set({ loading: false })
			throw err
		}
	},

	/**
	 * 重置到创建模式
	 */
	reset: () => {
		// 释放对象 URL
		const { images, cover } = get()
		for (const img of images) {
			if (img.type === 'file') {
				URL.revokeObjectURL(img.previewUrl)
			}
		}
		if (cover?.type === 'file') {
			URL.revokeObjectURL(cover.previewUrl)
		}

		set({
			mode: 'create',
			originalSlug: null,
			form: { ...initialForm, date: formatDateTimeLocal() },
			images: [],
			cover: null
		})
	}
}))
