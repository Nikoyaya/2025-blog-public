/**
 * 文件项类型
 * 可以是本地文件或URL
 */
export type FileItem = 
	/** 本地文件 */
	{ type: 'file'; file: File; previewUrl: string; hash?: string } | 
	/** URL文件 */
	{ type: 'url'; url: string }

/**
 * 艺术图片上传记录
 * 键为图片标识，值为文件项
 */
export type ArtImageUploads = Record<string, FileItem>

/**
 * 背景图片上传记录
 * 键为图片标识，值为文件项
 */
export type BackgroundImageUploads = Record<string, FileItem>

/**
 * 社交按钮图片上传记录
 * 键为图片标识，值为文件项
 */
export type SocialButtonImageUploads = Record<string, FileItem>
