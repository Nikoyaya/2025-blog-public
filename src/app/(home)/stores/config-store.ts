/**
 * 全局配置状态管理
 * 用于管理站点配置、卡片样式和配置对话框状态
 */
import { create } from 'zustand'
import siteContent from '@/config/site-content.json'
import cardStyles from '@/config/card-styles.json'

/**
 * 站点内容类型
 */
export type SiteContent = typeof siteContent

/**
 * 卡片样式类型
 */
export type CardStyles = typeof cardStyles

/**
 * 配置状态接口
 */
interface ConfigStore {
  // 状态
  siteContent: SiteContent // 站点配置内容
  cardStyles: CardStyles // 卡片样式配置
  regenerateKey: number // 用于触发背景气泡重新生成的密钥
  configDialogOpen: boolean // 配置对话框是否打开

  // 操作
  setSiteContent: (content: SiteContent) => void // 设置站点配置
  setCardStyles: (styles: CardStyles) => void // 设置卡片样式
  resetSiteContent: () => void // 重置站点配置到默认值
  resetCardStyles: () => void // 重置卡片样式到默认值
  regenerateBubbles: () => void // 重新生成背景气泡
  setConfigDialogOpen: (open: boolean) => void // 设置配置对话框状态
}

/**
 * 配置状态存储
 */
export const useConfigStore = create<ConfigStore>((set, get) => ({
  // 初始状态
  siteContent: { ...siteContent },
  cardStyles: { ...cardStyles },
  regenerateKey: 0,
  configDialogOpen: false,

  // 设置站点配置
  setSiteContent: (content: SiteContent) => {
    set({ siteContent: content })
  },

  // 设置卡片样式
  setCardStyles: (styles: CardStyles) => {
    set({ cardStyles: styles })
  },

  // 重置站点配置到默认值
  resetSiteContent: () => {
    set({ siteContent: { ...siteContent } })
  },

  // 重置卡片样式到默认值
  resetCardStyles: () => {
    set({ cardStyles: { ...cardStyles } })
  },

  // 重新生成背景气泡
  regenerateBubbles: () => {
    set(state => ({ regenerateKey: state.regenerateKey + 1 }))
  },

  // 设置配置对话框状态
  setConfigDialogOpen: (open: boolean) => {
    set({ configDialogOpen: open })
  }
}))

