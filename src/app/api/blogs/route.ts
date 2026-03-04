import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || ''
    const tag = searchParams.get('tag') || ''
    const displayMode = (searchParams.get('displayMode') || 'year') as 'day' | 'week' | 'month' | 'year' | 'category'

    // 读取文章索引
    const indexPath = path.join(process.cwd(), 'public', 'blogs', 'index.json')
    const indexContent = fs.readFileSync(indexPath, 'utf-8')
    let allItems = JSON.parse(indexContent)

    // 过滤隐藏文章
    allItems = allItems.filter((item: any) => !item.hidden)

    // 按分类过滤
    if (category) {
      allItems = allItems.filter((item: any) => item.category === category)
    }

    // 按标签过滤
    if (tag) {
      allItems = allItems.filter((item: any) => item.tags?.includes(tag))
    }

    // 按日期排序（最新的在前）
    allItems.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const total = allItems.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const items = allItems.slice(startIndex, endIndex)

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages
    })
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}
