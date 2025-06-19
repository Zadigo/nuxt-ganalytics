import type { Currency, Item, Promotion } from '.'

export type CustomParameters = Record<string, unknown>

/**
 * Reference:
 * @see {@link https://developers.google.com/tag-platform/gtagjs/reference?hl=fr#config Analytics configuration parameters}
 */
export interface ConfigurationParameters {
  /**
   * The title of the page or document. 
   * Defaults to the user's `document.title` value
   */
  page_title?: string
  /**
   * Specifies the full URL of the page. 
   * Defaults to the user's `document.location` value
   */
  page_location?: string
  page_path?: string
  /**
   * Set to false to prevent the default snippet from sending a page_view
   */
  send_page_view?: boolean
  /**
   * Specifies the language preference of the user. 
   * Defaults to the user's navigator.language value.
   */
  language?: string
  /**
   * Specifies a known identifier for a user provided by the site 
   * owner/library user. It must not itself be PII (personally identifiable information). 
   * The value should never be persisted in Google Analytics cookies or other 
   * Analytics provided storage
   */
  user_id?: string | number
  debug?: 'true' | 'false'
}

export interface ControlParameters {
  groups?: string | string[]
  send_to?: string | string[]
  event_callback?: () => void
  event_timeout?: number
}

/**
 * List of parameters for an event command
 */
export interface EventParameters {
  checkout_option?: string
  checkout_step?: number
  /**
   * An identifier for the content that was selected
   */
  content_id?: string
  /**
   * The type of selected content
   */
  content_type?: string
  /**
   * The coupon name/code associated with the event
   */
  coupon?: string
  /**
   * Currency of the value of the event, in 3-letter ISO 4217 format
   * @see {@link https://en.wikipedia.org/wiki/ISO_4217#Active_codes Three letter currency codes}
   * @example
   * "EUR"
   */
  currency?: Currency
  description?: string
  fatal?: boolean
  /**
   * The items for the event
   */
  items?: Item[]
  /**
   * The method used to login
   * @example
   * "Google"
   */
  method?: string
  number?: string
  promotions?: Promotion[]
  screen_name?: string
  /**
   * The term that was searched for
   */
  search_term?: string
  /**
   * Shipping cost associated with a transaction
   */
  shipping?: number
  /**
   * Tax cost associated with a transaction
   */
  tax?: Currency
  /**
   * The unique identifier of a transaction. The `transaction_id` parameter 
   * helps you avoid getting duplicate events for a purchase
   */
  transaction_id?: string
  /**
   * The monetary value of the event
   */
  value?: number
  event_label?: string
  event_category?: string
  /**
   * The shipping tier selected for delivery of the purchased item
   * @example
   * "Ground"
   */
  shipping_tier?: 'Ground' | 'Air' | 'Next-day' | (string & {})
  /**
   * The chosen method of payment
   */
  payment_type?: 'Credit card' | 'Paypal' | (string & {})
  /**
   * The reason a lead was marked as disqualified
   */
  disqualified_lead_reason?: string
  /**
   * The source of the lead
   * @example
   * "Trade show"
   */
  lead_source?: string
  /**
   * The status of the lead
   */
  lead_status?: string
  /**
   * The reason the lead was unconverted
   */
  unconvert_lead_reason?: string
}

export type ConsentState = 'granted' | 'denied'

export type ConsentStateUndefined = ConsentState | undefined

/**
 * Reference:
 * @see {@link https://support.google.com/tagmanager/answer/10718549#consent-types consent-types}
 * @see {@link https://developers.google.com/tag-platform/security/guides/consent consent}
 */
export interface ConsentParameters {
  ad_personalization?: ConsentStateUndefined
  ad_user_data?: ConsentStateUndefined
  ad_storage?: ConsentState
  analytics_storage?: ConsentState
  functionality_storage?: ConsentState
  personalization_storage?: ConsentState
  security_storage?: ConsentState
  wait_for_update?: number
  region?: string[]
}

export type PaymentEventParameters = Pick<EventParameters, 'currency' | 'value' | 'coupon' | 'payment_type' | 'items'>

/**
 * List of parameters for a given command
 * @example gtag("...", "...", { method: "Google" })
 */
export type CommandParameters = ConfigurationParameters
  | ControlParameters
  | CustomParameters
  | EventParameters
  | ConsentParameters
