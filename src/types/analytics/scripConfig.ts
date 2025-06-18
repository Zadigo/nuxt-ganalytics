export type LoadingStrategy = 'async' | 'defer'

export const eventNames = [
  'gtm.js',
  'gtm.load',
  'gtm.dom',
  'gtm.click'
] as const

export type EventNames = (typeof eventNames)[number]

export type TagCommand = 'config' | 'get' | 'set' | 'event' | 'consent' | 'js'
