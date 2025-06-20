import type { CommandParameters, ConsentNames, ConsentParameters, EventNames, GACommand } from './analytics'

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
export interface GAnalyticsDatalayerObject {
  config: [command: GACommand, id: string, parameters?: CommandParameters]
  consent: [command: GACommand, name: ConsentNames, parameters?: ConsentParameters]
  event: [command: GACommand, name: EventNames, parameters?: CommandParameters]
  set: [command: GACommand, name: string, value?: string | number | boolean | CommandParameters]
  get: [command: GACommand, name: string, parameters?: CommandParameters]
}
