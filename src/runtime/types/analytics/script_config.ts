export type LoadingStrategy = 'async' | 'defer'

export const scriptEventNames = [
  'gtm.js',
  'gtm.load',
  'gtm.dom',
  'gtm.click'
] as const

export type ScriptEventNames = (typeof scriptEventNames)[number]

export type TagCommand = 'config' | 'get' | 'set' | 'event' | 'consent' | 'js'
