/**
 * 发布表单类型
 */
export type PublishForm = {
	slug: string // 博客唯一标识符
	title: string // 博客标题
	md: string // Markdown 内容
	tags: string[] // 标签列表
	date: string // 发布日期
	summary: string // 摘要
	hidden?: boolean // 是否隐藏
	category?: string // 分类
}

/**
 * 图片项类型
 */
export type ImageItem = 
	/** URL 图片 */
	{ id: string; type: 'url'; url: string } | 
	/** 文件图片 */
	{ id: string; type: 'file'; file: File; previewUrl: string; filename: string; hash?: string }
