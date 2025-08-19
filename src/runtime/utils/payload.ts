import type { CommandParameters, ConsentNames, ConsentParameters, EventNames, EventParameters, GA4EventCommand } from '../types'

/**
 * Function to structure the command parameters
 *
 * Reference:
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag List of events}
 *
 * @param command The command name
 * @param args The command parameters
 */
export function defineAnalyticsCommand<K extends GA4EventCommand, T extends (string | Date | CommandParameters)[]>(command: K, ...args: T): IArguments {
  return arguments
}

/**
 * Function used to structure configuration parameters for tag
 * @param id The tag ID
 * @param params The command parameters
 */
export function defineAnalyticsConfig(id: string | undefined, params?: CommandParameters): IArguments | undefined {
  if (id && params) {
    return defineAnalyticsCommand('config', id, params)
  }
}

/**
 * Function used to structure event parameters
 * @param name Name of the event to send
 * @param params Parameters for the given event
 */
export function defineAnalyticsEvent(name: EventNames, params: EventParameters): IArguments {
  return defineAnalyticsCommand('event', name, params)
}

/**
 * Function used to structure conset parameters
 * @param params The consent parameters
 * @param command The consent command name, defaults to 'default'
 * @example gtag("consent", "default", {})
 */
export function defineAnalyticsConsent(params: ConsentParameters, command: ConsentNames = 'default'): IArguments {
  return defineAnalyticsCommand('consent', command, params)
}
