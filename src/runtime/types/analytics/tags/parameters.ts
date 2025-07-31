import type { Currency, Item, Promotion } from '.'

export type CustomParameters = Record<string, unknown>

/**
 * Parameters for the "config" command
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
  /**
   * Specifies the path of the page, excluding the domain and query string
   */
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
  /**
   * Debug the tag in the analytics debug view
   */
  debug?: 'true' | 'false'
}

export interface ControlParameters {
  groups?: string | string[]
  send_to?: string | string[]
  event_callback?: () => void
  event_timeout?: number
}

/**
 * Parameters for the "event" command
 */
export interface EventParameters {
  checkout_option?: string
  /**
   * The step in the checkout process where the event occurred
   */
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
  /**
   * The description of the event
   */
  description?: string
  /**
   * Indicates whether the event excetion was fatal or not
   */
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
  /**
   * The name of the scenario where the event occurred
   */
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

/**
 * Consent states
 */
export type ConsentState = 'granted' | 'denied'

export type ConsentStateUndefined = ConsentState | undefined

/**
 * Parameters for the "consent" command
 * Reference:
 * @see {@link https://support.google.com/tagmanager/answer/10718549#consent-types consent-types}
 * @see {@link https://developers.google.com/tag-platform/security/guides/consent consent}
 */
export interface ConsentParameters {
  /**
   * The consent state for ad personalization
   * @description V2
   */
  ad_personalization?: ConsentStateUndefined
  /**
   * The consent state for ad user data
   * @description V2
   */
  ad_user_data?: ConsentStateUndefined
  /**
   * The consent state for ad storage
   */
  ad_storage?: ConsentState
  /**
   * The consent state for analytics storage
   */
  analytics_storage?: ConsentState
  /**
   * The consent state for functionality storage
   */
  functionality_storage?: ConsentState
  /**
   * The consent state for personalization storage
   */
  personalization_storage?: ConsentState
  /**
   * The consent state for security storage
   */
  security_storage?: ConsentState
  /**
   * Use this parameter to delay data collection until the user's consent status is updated,
   * especially when your consent banner loads asynchronously and may not execute before Google tags.
   * Set `wait_for_update` in your default consent settings to ensure consent is properly handled.
   */
  wait_for_update?: number
  /**
   * For optimal measurement, scope default consent settings to regions where consent banners are shown to users.
   * This ensures Google tags adjust behavior as needed and measurement is preserved in regions requiring consent.
   */
  region?: string[]
}

/**
 * List of all accepted parameters for gtag commands
 * @example gtag("...", "...", { method: "Google" })
 */
export type CommandParameters = ConfigurationParameters | ControlParameters | EventParameters | ConsentParameters | CustomParameters

/**
 * List of all parameters used for payment events
 */
export type PaymentEventParameters = Pick<EventParameters, 'currency' | 'value' | 'coupon' | 'payment_type' | 'items'>
