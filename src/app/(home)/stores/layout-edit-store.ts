/**
 * 布局编辑状态管理
 * 用于管理卡片位置和尺寸的编辑功能
 */
'use client'

import { create } from 'zustand'
import { useConfigStore, type CardStyles } from './config-store'

/**
 * 卡片键类型
 */
type CardKey = keyof CardStyles

/**
 * 布局编辑状态接口
 */
interface LayoutEditState {
  // 状态
  editing: boolean // 是否处于编辑模式
  snapshot: CardStyles | null // 编辑前的卡片样式快照

  // 操作
  startEditing: () => void // 开始编辑
  cancelEditing: () => void // 取消编辑
  saveEditing: () => void // 保存编辑
  setOffset: (key: CardKey, offsetX: number | null, offsetY: number | null) => void // 设置卡片偏移
  setSize: (key: CardKey, width: number | undefined, height: number | undefined) => void // 设置卡片尺寸
}

/**
 * 布局编辑状态存储
 */
export const useLayoutEditStore = create<LayoutEditState>((set, get) => ({
  // 初始状态
  editing: false,
  snapshot: null,

  // 开始编辑
  startEditing: () => {
    const { cardStyles } = useConfigStore.getState()
    set({
      editing: true,
      snapshot: { ...cardStyles } // 创建快照，用于取消编辑时恢复
    })
  },

  // 取消编辑
  cancelEditing: () => {
    const { snapshot } = get()
    if (!snapshot) {
      set({ editing: false, snapshot: null })
      return
    }

    // 恢复到快照状态
    const { setCardStyles } = useConfigStore.getState()
    setCardStyles(snapshot)

    set({
      editing: false,
      snapshot: null
    })
  },

  // 保存编辑
  saveEditing: () => {
    set({
      editing: false,
      snapshot: null
    })
  },

  // 设置卡片偏移
  setOffset: (key, offsetX, offsetY) => {
    const { cardStyles, setCardStyles } = useConfigStore.getState()

    const next: CardStyles = {
      ...cardStyles,
      [key]: {
        ...cardStyles[key],
        offsetX,
        offsetY
      }
    }

    setCardStyles(next)
  },

  // 设置卡片尺寸
  setSize: (key, width, height) => {
    const { cardStyles, setCardStyles } = useConfigStore.getState()

    const next: CardStyles = {
      ...cardStyles,
      [key]: {
        ...cardStyles[key],
        width,
        height
      }
    }

    setCardStyles(next)
  }
}))

