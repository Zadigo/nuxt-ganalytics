import type { CommandParameters, ConsentNames, ConsentParameters, EventNames, TagCommand } from './analytics'

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
  config: [command: TagCommand, id: string, parameters?: CommandParameters]
  consent: [command: TagCommand, name: ConsentNames, parameters?: ConsentParameters]
  event: [command: TagCommand, name: EventNames, parameters?: CommandParameters]
  set: [command: TagCommand, name: string, value?: string | number | boolean | CommandParameters]
  get: [command: TagCommand, name: string, parameters?: CommandParameters]
}
