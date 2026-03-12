import type { ConfigurationParameters } from '../types'
import { dataLayerObject, defineAnalyticsConfig } from '../utils'

/**
 * Create and send events to GA4 using a specific tag for a specific given page
 * @param tag The tag to use for the event
 * @param params The parameters of the event to send
 */
export function useAnalyticsTag(tag: string, params: ConfigurationParameters) {
  if (import.meta.client) {
    dataLayerObject(defineAnalyticsConfig(tag, params))
  }
}
