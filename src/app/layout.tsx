/**
 * 根布局组件
 * 应用的顶层布局，包含全局样式、元数据配置和安全脚本
 */
import '@/styles/globals.css'

import type { Metadata } from 'next'
import Layout from '@/layout'
import Head from '@/layout/head'
import siteContent from '@/config/site-content.json'
import { LanguageProvider } from '@/i18n/context'

// 从站点配置中获取元数据和主题设置
const {
	meta: { title, description },
	theme
} = siteContent

/**
 * 应用元数据配置
 * 包含页面标题、描述和社交媒体分享信息
 */
export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description
	},
	twitter: {
		title,
		description
	}
}

/**
 * HTML 样式配置
 * 包含自定义光标和主题颜色变量
 */
const htmlStyle = {
	cursor: 'url(/images/cursor.svg) 2 1, auto',
	'--color-brand': theme.colorBrand,
	'--color-primary': theme.colorPrimary,
	'--color-secondary': theme.colorSecondary,
	'--color-brand-secondary': theme.colorBrandSecondary,
	'--color-bg': theme.colorBg,
	'--color-border': theme.colorBorder,
	'--color-card': theme.colorCard,
	'--color-article': theme.colorArticle
}

/**
 * 根布局组件
 * @param children 子组件内容
 * @returns 完整的 HTML 布局结构
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en' suppressHydrationWarning style={htmlStyle}>
			<Head />

			<body>
				{/* 安全防护脚本 */}
				<script src="/scripts/security.js" />

				{/* 51LA统计代码 */}
				<script charSet="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
				<script dangerouslySetInnerHTML={{ __html: `LA.init({id:"3P6a7VyuRuBRzhjJ",ck:"3P6a7VyuRuBRzhjJ",autoTrack:true})` }} />

				<LanguageProvider>
					<Layout>{children}</Layout>
				</LanguageProvider>
			</body>
		</html>
	)
}
