/**
 * 颜色转换工具函数
 * 用于处理不同颜色格式之间的转换
 */

/**
 * HSVA颜色接口
 */
export interface HSVA {
	h: number // 色相 (0-360)
	s: number // 饱和度 (0-1)
	v: number // 明度 (0-1)
	a: number // 透明度 (0-1)
}

/**
 * HSL颜色接口
 */
export interface HSL {
	h: number // 色相 (0-360)
	s: number // 饱和度 (0-1)
	l: number // 亮度 (0-1)
}

/**
 * RGB颜色接口
 */
export interface RGB {
	r: number // 红色通道 (0-255)
	g: number // 绿色通道 (0-255)
	b: number // 蓝色通道 (0-255)
}

/**
 * RGBA颜色接口
 */
export interface RGBA extends RGB {
	a: number // 透明度 (0-1)
}

/**
 * 将6位十六进制颜色转换为RGB
 * @param hex 十六进制颜色字符串
 * @returns RGB颜色对象
 */
export function hexToRgb(hex: string): RGB {
	const cleaned = hex.replace('#', '')
	const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleaned)
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
		: { r: 0, g: 0, b: 0 }
}

/**
 * 将十六进制颜色转换为RGBA
 * 支持6位或8位十六进制格式
 * @param hex 十六进制颜色字符串
 * @returns RGBA颜色对象
 */
export function hexToRgba(hex: string): RGBA {
	const cleaned = hex.replace('#', '')

	if (cleaned.length === 6) {
		const r = parseInt(cleaned.slice(0, 2), 16)
		const g = parseInt(cleaned.slice(2, 4), 16)
		const b = parseInt(cleaned.slice(4, 6), 16)

		return { r, g, b, a: 1 }
	}

	if (cleaned.length === 8) {
		const r = parseInt(cleaned.slice(0, 2), 16)
		const g = parseInt(cleaned.slice(2, 4), 16)
		const b = parseInt(cleaned.slice(4, 6), 16)
		const a = parseInt(cleaned.slice(6, 8), 16) / 255

		return { r, g, b, a }
	}

	//  fallback
	return { r: 0, g: 0, b: 0, a: 1 }
}

/**
 * 将RGB转换为十六进制颜色
 * @param r 红色通道 (0-255)
 * @param g 绿色通道 (0-255)
 * @param b 蓝色通道 (0-255)
 * @returns 十六进制颜色字符串
 */
export function rgbToHex(r: number, g: number, b: number): string {
	return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
}

/**
 * 将RGB转换为HSL
 * @param r 红色通道 (0-255)
 * @param g 绿色通道 (0-255)
 * @param b 蓝色通道 (0-255)
 * @returns HSL颜色对象
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
	r /= 255
	g /= 255
	b /= 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6
				break
			case g:
				h = ((b - r) / d + 2) / 6
				break
			case b:
				h = ((r - g) / d + 4) / 6
				break
		}
	}

	return {
		h: h * 360,
		s: s,
		l: l
	}
}

/**
 * 将HSL转换为RGB
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-1)
 * @param l 亮度 (0-1)
 * @returns RGB颜色对象
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
	h /= 360
	let r, g, b

	if (s === 0) {
		r = g = b = l
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q

		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	}
}

/**
 * 将HSL转换为HSVA
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-1)
 * @param l 亮度 (0-1)
 * @returns HSVA颜色对象
 */
export function hslToHsv(h: number, s: number, l: number): HSVA {
	const v = l + s * Math.min(l, 1 - l)
	const s2 = v === 0 ? 0 : 2 * (1 - l / v)

	return {
		h: h,
		s: s2,
		v: v,
		a: 1
	}
}

/**
 * 将HSV转换为HSL
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-1)
 * @param v 明度 (0-1)
 * @returns HSL颜色对象
 */
export function hsvToHsl(h: number, s: number, v: number) {
	let l = (v * (2 - s)) / 2
	if (l != 0) {
		if (l == 1) {
			s = 0
		} else if (l < 0.5) {
			s = (s * v) / (l * 2)
		} else {
			s = (s * v) / (2 - l * 2)
		}
	}

	return { h, s, l }
}

/**
 * 将十六进制颜色转换为HSVA
 * @param hex 十六进制颜色字符串
 * @returns HSVA颜色对象
 */
export function hexToHsva(hex: string): HSVA {
	const rgba = hexToRgba(hex)
	const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b)
	const hsv = hslToHsv(hsl.h, hsl.s, hsl.l)

	return {
		h: hsv.h,
		s: hsv.s,
		v: hsv.v,
		a: rgba.a
	}
}

/**
 * 将HSVA转换为十六进制颜色
 * 当alpha < 1时输出#RRGGBBAA格式，否则输出#RRGGBB格式
 * @param h 色相 (0-360)
 * @param s 饱和度 (0-1)
 * @param v 明度 (0-1)
 * @param a 透明度 (0-1)，默认为1
 * @returns 十六进制颜色字符串
 */
export function hsvaToHex(h: number, s: number, v: number, a: number = 1): string {
	const hsl = hsvToHsl(h, s, v)
	const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
	const baseHex = rgbToHex(rgb.r, rgb.g, rgb.b)

	// 归一化alpha到0-1范围
	const alpha = clamp(a, 0, 1)

	// 如果完全不透明，保持传统的6位十六进制格式以兼容
	if (alpha >= 1) {
		return baseHex
	}

	const alphaHex = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, '0')

	return `${baseHex}${alphaHex}`
}

/**
 * 将数字限制在最小和最大值之间
 * @param value 要限制的数字
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数字
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}

/**
 * 将数字格式化为指定小数位数
 * @param value 要格式化的数字
 * @param decimals 小数位数，默认为2
 * @returns 格式化后的数字
 */
export function toFixed(value: number, decimals: number = 2): number {
	return Number(value.toFixed(decimals))
}
