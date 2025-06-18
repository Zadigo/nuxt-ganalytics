import type { Currency } from '.'

/**
 * Interface of an item object used in lists for this event
 *
 * Reference:
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_item_item view_item_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_item_list_item view_item_list_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#select_item_item select_item_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#add_to_cart_item add_to_cart_item}
 * @see {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_cart_item view_cart_item}
 */
export interface Item {
  item_id?: string
  item_name?: string
  affiliation?: string
  coupon?: string
  currency?: Currency
  creative_name?: string
  creative_slot?: string
  discount?: number
  index?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price?: number
  promotion_id?: string
  promotion_name?: string
  quantity?: number
}

/**
 * Interface of an item object used in lists containing promotions for this event
 */
export interface Promotion {
  creative_name?: string
  creative_slot?: string
  promotion_id?: string
  promotion_name?: string
}
