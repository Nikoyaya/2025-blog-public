/**
 * 代码块组件
 * 用于显示代码并提供复制功能
 */
'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

/**
 * 代码块属性接口
 */
type CodeBlockProps = {
	children: React.ReactNode // 子组件，通常是代码内容
	code: string // 代码文本，用于复制
}

/**
 * 代码块组件
 * @param children 子组件，通常是代码内容
 * @param code 代码文本，用于复制
 * @returns 代码块组件
 */
export function CodeBlock({ children, code }: CodeBlockProps) {
	const [copied, setCopied] = useState(false) // 复制状态

	/**
	 * 处理复制代码
	 * 复制代码到剪贴板，并显示复制成功状态
	 */
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code) // 复制代码到剪贴板
			setCopied(true) // 设置复制成功状态
			setTimeout(() => setCopied(false), 2000) // 2秒后重置状态
		} catch (error) {
			console.error('Failed to copy code:', error) // 复制失败时打印错误
		}
	}

	return (
		<div className='code-block-wrapper'>
			{/* 复制按钮 */}
			<button
				type='button'
				onClick={handleCopy}
				className='code-block-copy-btn'
				aria-label='Copy code'
			>
				{copied ? <Check size={16} /> : <Copy size={16} />} {/* 复制状态图标 */}
			</button>
			{children} {/* 代码内容 */}
		</div>
	)
}

