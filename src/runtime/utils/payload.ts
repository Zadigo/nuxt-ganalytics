import type { CommandParameters, ConsentParameters, CustomParameters, EventNames, EventParameters, PaymentEventParameters, TagCommand } from '../types'

/**
 * Entry function used to define a command for gtag
 * 
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag Events}
 * 
 * @param command The command to be used
 * @param args A set of arguments to be sent
 */
export function defineCommand<K extends TagCommand>(command: K, ...args: (string | Date | CommandParameters)[]): IArguments {
  return arguments
}

/**
 * 
 * @param id The tag ID to be used
 * @param params The config parameters for the tag
 * @returns The tokens to be sent
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

// TODO: Verify these remaining functions

export function definePaymentInfo(params: PaymentEventParameters | CustomParameters) {
  return defineEvent('add_payment_info', params)
}

export function defineAddShippingInfo(params: PaymentEventParameters | Pick<EventParameters, 'shipping_tier'> | CustomParameters) {
  return defineEvent('add_shipping_info', params)
}

export function defineAddToCart(params: Pick<EventParameters, 'currency' | 'value' | 'items'> | CustomParameters) {
  return defineEvent('add_to_cart', params)
}
