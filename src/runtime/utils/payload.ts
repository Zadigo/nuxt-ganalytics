import type { CommandParameters, ConsentNames, ConsentParameters, EventNames, EventParameters, GA4EventCommand, Undefinable } from '../types'

/**
 * Function to structure the command parameters for the Google Analytics datalayer
 *
 * Reference:
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag List of events}
 *
 * @param _command The command name
 * @param _args The command parameters
 */
export function defineAnalyticsCommand<K extends GA4EventCommand, T extends (string | Date | CommandParameters)[]>(_command: K, ..._args: T): IArguments {
  return arguments
}

/**
 * Function used to structure configuration parameters for the Google Analytics tag
 * @param id The tag ID
 * @param params The command parameters
 */
export function defineAnalyticsConfig(id: string | undefined, params?: CommandParameters): Undefinable<IArguments> {
  if (id && params) {
    return defineAnalyticsCommand('config', id, params)
  }
}

/**
 * Function used to structure event parameters
 * @param name Name of the event to send
 * @param params Parameters for the given event
 */
export function defineAnalyticsEvent(name: EventNames, params: EventParameters): ReturnType<typeof defineAnalyticsCommand> {
  return defineAnalyticsCommand('event', name, params)
}

/**
 * Function used to structure consent parameters for the Google Analytics tag
 * @param params The consent parameters
 * @param command The consent command name, defaults to 'default'
 * @example gtag("consent", "default", {})
 */
export function defineAnalyticsConsent(params: ConsentParameters, command: ConsentNames = 'default'): ReturnType<typeof defineAnalyticsCommand> {
  return defineAnalyticsCommand('consent', command, params)
}
