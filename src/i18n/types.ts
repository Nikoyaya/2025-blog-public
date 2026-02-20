/**
 * 支持的语言类型
 */
export type Language = 'zh-CN' | 'en' | 'zh-TW' | 'ja' | 'ko';

/**
 * 翻译接口
 * 支持嵌套结构
 */
export interface Translation {
  [key: string]: string | Translation;
}

/**
 * 翻译集合接口
 * 包含所有支持语言的翻译
 */
export interface Translations {
  'zh-CN': Translation; // 简体中文
  'en': Translation; // 英语
  'zh-TW': Translation; // 繁体中文
  'ja': Translation; // 日语
  'ko': Translation; // 韩语
}