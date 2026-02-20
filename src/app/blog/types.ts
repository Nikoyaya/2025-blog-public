/**
 * 博客索引项类型
 */
export type BlogIndexItem = {
	slug: string // 博客唯一标识符
	title: string // 博客标题
	tags: string[] // 标签列表
	date: string // 发布日期
	summary?: string // 摘要
	cover?: string // 封面图片
	hidden?: boolean // 是否隐藏
	category?: string // 分类
}

/**
 * 博客配置类型
 */
export type BlogConfig = {
	title?: string // 博客标题
	tags?: string[] // 标签列表
	date?: string // 发布日期
	summary?: string // 摘要
	cover?: string // 封面图片
	hidden?: boolean // 是否隐藏
	category?: string // 分类
}

