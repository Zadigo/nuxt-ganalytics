import type { AllConfigurationParameters, CustomParameters, EventNames, EventParameters, PaymentEventParameters, TagCommand } from '~/src/types'

/**
 * Entry function used to define a command for gtag
 * 
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag Events}
 * 
 * @param command The command to be used
 * @param args A set of arguments to be sent
 */
export function defineCommand<K extends TagCommand>(command: K, ...args: unknown[]): Record<number, unknown> {
  return Object.fromEntries([[0, command], ...args.map((arg, i) => [i + 1, arg])])
}

/**
 * 
 * @param id The tag ID to be used
 * @param params The config parameters for the tag
 * @returns The tokens to be sent
 */
export function defineConfig(id: string | undefined, params?: AllConfigurationParameters) {
  return defineCommand('config', id, params)
}

/**
 * Function used to create an event
 * @param name Name of the event to send
 * @param params Parameters for the given event
 */
export function defineEvent(name: EventNames | (string & {}), params: EventParameters) {
  return defineCommand('event', name, params)
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
