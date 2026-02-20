/**
 * 动画配置常量
 */
export const INIT_DELAY = 0.3 // 初始延迟时间（秒）
export const ANIMATION_DELAY = 0.1 // 动画延迟间隔（秒）

/**
 * 卡片间距常量
 */
export const CARD_SPACING = 36 // 卡片间距（像素）
export const CARD_SPACING_SM = 24 // 小屏幕卡片间距（像素）

/**
 * 博客配置常量
 */
export const BLOG_SLUG_KEY = process.env.BLOG_SLUG_KEY || '' // 博客 slug 加密密钥

/**
 * GitHub 仓库配置
 */
export const GITHUB_CONFIG = {
	OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'AmisKwok', // GitHub 仓库所有者
	REPO: process.env.NEXT_PUBLIC_GITHUB_REPO || '2025-blog-public', // GitHub 仓库名称
	BRANCH: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main', // GitHub 分支名称
	APP_ID: process.env.NEXT_PUBLIC_GITHUB_APP_ID || '2837611', // GitHub App ID
	ENCRYPT_KEY: process.env.NEXT_PUBLIC_GITHUB_ENCRYPT_KEY || 'wudishiduomejimo', // 加密密钥
	BLOGGERS_PASSWORD: process.env.NEXT_PUBLIC_BLOGGERS_PASSWORD || 'zhegeshimima', // 博主密码
} as const

/**
 * 登录配置
 */
export const LOGIN_CONFIG = {
	// 默认登录账号密码
	USERNAME: process.env.NEXT_PUBLIC_LOGIN_USERNAME || 'dengluzhanghao', // 登录用户名
	PASSWORD: process.env.NEXT_PUBLIC_LOGIN_PASSWORD || 'denglumima', // 登录密码
} as const
