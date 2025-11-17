import type { CommandParameters, ConfigurationParameters, ConsentNames, ConsentParameters, EventNames, EventParameters } from './analytics'

export type * from './analytics'

export type Nullable<T> = T | null

export type Undefinable<T> = T | undefined

export type MaybeType<T> = T | null | undefined

export interface CustomGAnalyticsCookie {
  consent: ConsentParameters
}

/**
 * List of structured expected parameters for given commands
 *
 * @example
 * gtag("consent", "default", {}) -> ['consent', 'default', {}]
 */
export interface GAnalyticsDatalayerObjects {
  config: [command: 'config', id: string, parameters?: ConfigurationParameters]
  consent: [command: 'consent', name: ConsentNames, parameters?: ConsentParameters]
  event: [command: 'event', name: EventNames, parameters?: EventParameters]
  set: [command: 'set', name: string, value?: string | number | boolean | CommandParameters]
  get: [command: 'get', name: string, parameters?: CommandParameters | (string & {})]
}

export type GAnalyticsDatalayerObject = GAnalyticsDatalayerObjects[keyof GAnalyticsDatalayerObjects]
