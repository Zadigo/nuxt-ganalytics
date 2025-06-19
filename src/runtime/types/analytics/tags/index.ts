import type { CommandParameters } from './parameters'

export * from './parameters'
export * from './items'

export type Currency = 'EUR' | 'JPY' | 'USN' | 'CNY' | 'INR' | 'KRW' | 'BRL' | 'CHF' | 'CHE' | 'CAD' | 'AUD' | (string & {})

/**
 * TODO: Rename
 * @example gtag("consent", "...", {})
 */
export type TagCommand = 'config' | 'get' | 'set' | 'event' | 'consent' | 'js'

/**
 * List of structured expected parameters for given commands
 * 
 * @example
 * gtag("consent", "default", {}) -> ['consent', 'default', {}]
 */
// export interface TagConfigurations {
//   consent: [command: TagCommand, 'default', params: CommandParameters]
// }

export type EventNames =
  | 'add_payment_info'
  | 'add_shipping_info'
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'begin_checkout'
  | 'checkout_progress'
  | 'earn_virtual_currency'
  | 'exception'
  | 'generate_lead'
  | 'join_group'
  | 'level_end'
  | 'level_start'
  | 'level_up'
  | 'login'
  | 'page_view'
  | 'post_score'
  | 'purchase'
  | 'refund'
  | 'remove_from_cart'
  | 'screen_view'
  | 'search'
  | 'select_content'
  | 'select_item'
  | 'select_promotion'
  | 'set_checkout_option'
  | 'share'
  | 'sign_up'
  | 'spend_virtual_currency'
  | 'tutorial_begin'
  | 'tutorial_complete'
  | 'unlock_achievement'
  | 'timing_complete'
  | 'view_cart'
  | 'view_item'
  | 'view_item_list'
  | 'view_promotion'
  | 'view_search_results'
  | 'disqualify_lead'
  | 'working_lead'
  | 'close_convert_lead'
