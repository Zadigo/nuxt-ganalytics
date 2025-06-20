export type LoadingStrategy = 'async' | 'defer'

export const scriptEventNames = [
  'js',
  'gtm.js',
  'gtm.load',
  'gtm.dom',
  'gtm.click'
] as const

export type ScriptEventNames = (typeof scriptEventNames)[number]
