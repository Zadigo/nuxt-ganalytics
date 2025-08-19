import type { CommandParameters, ConfigurationParameters, ConsentNames, ConsentParameters, EventNames, EventParameters } from './analytics'

export * from './analytics'

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
