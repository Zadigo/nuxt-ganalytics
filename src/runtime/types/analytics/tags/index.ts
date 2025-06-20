export * from './parameters'
export * from './items'

export type Currency = 
  | 'EUR'
  | 'JPY'
  | 'USN'
  | 'CNY'
  | 'INR'
  | 'KRW'
  | 'BRL'
  | 'CHF'
  | 'CHE'
  | 'CAD'
  | 'AUD'
  | (string & {})

/**
 * TODO: Rename: GA4EventCommand
 * @see {@link https://developers.google.com/tag-platform/gtagjs/reference Gtag References}
 * @example gtag("consent", "...", {})
 */
export type GACommand = 
  | 'config'
  | 'get' 
  | 'set'
  | 'event'
  | 'consent'
  | 'js'

  export type GTMCommand = 
  | 'gtm.js'
  | 'gtm.init'
  | 'gtm.consent'
  | 'gtm.start'
  | 'gtm.load'
  | 'gtm.linkClick'
  | 'gtm.click'
  | 'gtm.formSubmit'
  | 'gtm.dom'
  | 'gtm.scrollDepth'
  

// TODO: Move to src/runtime/types/analytics/tags/parameters.ts
export type ConsentNames = 
  | 'default'
  | 'update' 
  | 'default_with_ad_storage' 
  | 'default_without_ad_storage' 
  | 'default_with_analytics_storage' 
  | 'default_without_analytics_storage'

// TODO: Move to src/runtime/types/analytics/tags/parameters.ts
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
