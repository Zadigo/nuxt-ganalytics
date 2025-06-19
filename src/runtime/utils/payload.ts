import type { CommandParameters, ConsentParameters, EventNames, EventParameters, TagCommand } from '../types'

/**
 * Entry function used to define a command for gtag
 * 
 * Reference:
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag List of events}
 * 
 * @param id The tag ID
 * @param params The command parameters
 */
export function defineCommand<K extends TagCommand, T extends (string | Date | CommandParameters)[]>(command: K, ...args: T): IArguments {
  return arguments
}

/**
 * 
 * @param id The tag ID
 * @param params The command parameters
 */
export function defineConfig(id: string | undefined, params?: CommandParameters) {
  if (id && params) {
    return defineCommand('config', id, params)
  }
}

/**
 * Function used to create an event
 * @param name Name of the event to send
 * @param params Parameters for the given event
 */
export function defineEvent(name: EventNames, params: EventParameters) {
  return defineCommand('event', name, params)
}

/**
 * Function used to configure consent on GA4
 * @example gtag("consent", "default", {})
 */
export function defineConsent(params: ConsentParameters) {
  return defineCommand('consent', 'default', params)
}
