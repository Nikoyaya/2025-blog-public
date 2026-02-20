/**
 * 工具函数集合
 * 包含各种通用的工具函数
 */
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并Tailwind CSS类名
 * 用于处理条件类名和避免类名冲突
 * @param inputs 类名值
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * 为数字添加千位分隔符
 * @param n 要处理的数字或数字字符串
 * @param sign 分隔符，默认为逗号
 * @returns 添加了千位分隔符的字符串
 */
export function thousandsSeparator(n: string | number | any, sign: string = ',') {
	if (typeof n === 'string' || typeof n === 'number') {
		n = String(n)
		const reg = /\B(?=(\d{3})+($|\.))/g

		if (n.includes('.')) {
			const nArr = n.split('.')
			nArr[0] = nArr[0].replace(reg, `$&${sign}`)

			return nArr.join('.')
		}

		return n.replace(reg, `$&${sign}`)
	} else return 0
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 文件扩展名（带点）
 */
export function getFileExt(filename: string): string {
	const lower = filename.toLowerCase()
	if (lower.endsWith('.jpg')) return '.jpg'
	if (lower.endsWith('.jpeg')) return '.jpeg'
	if (lower.endsWith('.webp')) return '.webp'
	if (lower.endsWith('.png')) return '.png'
	if (lower.endsWith('.svg')) return '.svg'
	return '.png'
}

/**
 * 生成指定范围内的随机数
 * @param a 最小值
 * @param b 最大值
 * @returns [a, b) 范围内的随机数
 */
export function rand(a: number, b: number) {
	return a + Math.random() * (b - a)
}
