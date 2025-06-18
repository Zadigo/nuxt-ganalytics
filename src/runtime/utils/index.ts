import type { RuntimeConfig } from 'nuxt/schema'
import type { AllConfigurationParameters, EventNames } from '~/src/types'
import { defineCommand, defineConfig } from './payload'

export * from './payload'

/**
 * Pushes arguments to the existing 
 * datalayer container
 * @param payload The pyaload to be used in the layer
 */
export function dataLayerObject<T extends Record<number, unknown>>(payload: T) {
  if (window.dataLayer) {
    console.log('arguments', payload)
    window.dataLayer?.push(payload)
  }
}

/**
 * Checks if the datalayer container contains
 * a given tag
 * @param name The name of the tag to check
 */
export function hasTag(name: EventNames) {
  if (window.dataLayer) {
    const results = window.dataLayer.filter(x => x.event?.toLowerCase().includes(name))
    return results.length > 0
  } else {
    return false
  }
}

/**
 * Function used to create a dictionnary of tags used 
 * in order to initialize GA4
 * @param config Nuxt runtime configuration
 */
export function tagInitializer(config: RuntimeConfig): boolean {
  window.dataLayer = window.dataLayer || []
  
  if (config.public.ganalytics.ga4?.enabled) {
    dataLayerObject(defineCommand('js', new Date()))
  
    if (config.public.ganalytics.ga4) {
      const defaultParams: AllConfigurationParameters = {}
  
      if (config.public.ganalytics.ga4.enableDebug) {
        defaultParams.debug = 'true'
      }
  
      dataLayerObject(defineConfig(config.public.ganalytics.ga4.id, defaultParams))
    } else {
      return false
    }
  }
  console.log(window.dataLayer)
  return true
}
