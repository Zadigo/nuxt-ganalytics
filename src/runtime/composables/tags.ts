import { dataLayerObject, defineConfig } from "#imports"
import type { ConfigurationParameters } from "../types"

/**
 * Creates a tag ID specific to the given page
 */
export function useAnalyticsTag(tag: string, params: ConfigurationParameters) {
  dataLayerObject(defineConfig(tag, params))
}
