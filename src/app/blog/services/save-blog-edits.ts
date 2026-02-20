/**
 * 保存博客编辑服务
 * 用于保存博客编辑操作，包括删除文章、更新索引和分类
 */
import { toast } from 'sonner'
import { GITHUB_CONFIG } from '@/consts'
import { getAuthToken } from '@/lib/auth'
import { createBlob, createCommit, createTree, getRef, listRepoFilesRecursive, toBase64Utf8, type TreeItem, updateRef } from '@/lib/github-client'
import type { BlogIndexItem } from '@/lib/blog-index'

/**
 * 保存博客编辑操作
 * @param originalItems 原始博客索引项数组
 * @param nextItems 更新后的博客索引项数组
 * @param categories 分类数组
 */
export async function saveBlogEdits(originalItems: BlogIndexItem[], nextItems: BlogIndexItem[], categories: string[]): Promise<void> {
	// 获取被删除的文章 slug
	const removedSlugs = originalItems.filter(item => !nextItems.some(next => next.slug === item.slug)).map(item => item.slug)
	const uniqueRemoved = Array.from(new Set(removedSlugs.filter(Boolean)))

	const token = await getAuthToken()

	toast.info('正在获取分支信息...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, GITHUB_CONFIG.BRANCH)
	const latestCommitSha = refData.sha

	const treeItems: TreeItem[] = []

	// 处理被删除的文章文件
	for (const slug of uniqueRemoved) {
		toast.info(`正在收集 ${slug} 文件...`)
		const basePath = `public/blogs/${slug}`
		const files = await listRepoFilesRecursive(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, basePath, GITHUB_CONFIG.BRANCH)

		for (const path of files) {
			treeItems.push({
				path,
				mode: '100644',
				type: 'blob',
				sha: null // null 表示删除文件
			})
		}
	}

	// 更新博客索引
	toast.info('正在更新索引...')
	const sortedItems = [...nextItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	const indexJson = JSON.stringify(sortedItems, null, 2)
	const indexBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(indexJson), 'base64')
	treeItems.push({
		path: 'public/blogs/index.json',
		mode: '100644',
		type: 'blob',
		sha: indexBlob.sha
	})

	// 更新分类
	toast.info('正在更新分类...')
	const uniqueCategories = Array.from(new Set(categories.map(c => c.trim()).filter(Boolean)))
	const categoriesJson = JSON.stringify({ categories: uniqueCategories }, null, 2)
	const categoriesBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(categoriesJson), 'base64')
	treeItems.push({
		path: 'public/blogs/categories.json',
		mode: '100644',
		type: 'blob',
		sha: categoriesBlob.sha
	})

	// 创建提交
	toast.info('正在创建提交...')
	const treeData = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, latestCommitSha)
	const actionLabels: string[] = []
	if (uniqueRemoved.length > 0) {
		actionLabels.push(`删除:${uniqueRemoved.join(',')}`)
	}
	actionLabels.push('更新索引')
	if (uniqueCategories.length > 0) {
		actionLabels.push('更新分类')
	}
	const commitLabel = actionLabels.join(' | ')
	const commitData = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, commitLabel, treeData.sha, [latestCommitSha])

	// 更新分支
	toast.info('正在更新分支...')
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, GITHUB_CONFIG.BRANCH, commitData.sha)

	toast.success('保存成功！请等待页面部署后刷新')
}

