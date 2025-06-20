import type { ConfigurationParameters } from "../types"
import { dataLayerObject, defineConfig } from "../utils"

/**
 * Creates a tag ID specific to the given page
 */
export function useAnalyticsTag(tag: string, params: ConfigurationParameters) {
  if (import.meta.client) {
    dataLayerObject(defineConfig(tag, params))
  }
}
