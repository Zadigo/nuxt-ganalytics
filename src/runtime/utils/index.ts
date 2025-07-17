import type { RuntimeConfig } from 'nuxt/schema'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { CommandParameters, GA4EventCommand, GAnalyticsDatalayerObjects, GTMCommand } from '~/src/runtime/types'
import { defineCommand, defineConfig } from './payload'

export * from './payload'

/**
 * Pushes arguments to the existing datalayer container
 * @param payload The pyaload to be used in the layer
 */
export function dataLayerObject<T extends IArguments, R extends GAnalyticsDatalayerObjects[keyof GAnalyticsDatalayerObjects]>(payload: T | undefined): R | undefined {
  // TODO: We need to ovrride the window.dataLayer type
  // in order to use the types from GAnalyticsDatalayerObjects
  if (import.meta.client && window.dataLayer && payload) {
    // console.log('arguments', payload)

    window.dataLayer?.push(payload)
    // TODO: Maybe return a reactive object that 
    // contains the payload
    return Array.from(payload) as R
  }
}

/**
 * Checks if the dataLayer already has a tag with the given name
 * @param name The name of the tag to check
 */
export function hasTag(name: GA4EventCommand | GTMCommand | string): boolean {
  if (import.meta.client && window.dataLayer) {
    // FIXME: Fix the type of window.dataLayer
    const results = window.dataLayer.filter(item => {
      const items = Array.from(item)
      return items.includes(name)
    })
    return results.length > 0
  } else {
    return false
  }
}

/**
 * Function to initialize the Google Analytics datalayer
 * @param config Nuxt runtime configuration
 * @example
 * gtag("js", new Date())
 * gtag("config", "G-123", {})
 */
export function initializeAnalytics(config: RuntimeConfig): Ref<boolean> {
  const stateCompleted = ref<boolean>(false)
  
  if (import.meta.client) {  
    window.dataLayer = window.dataLayer || []

    if (!hasTag('js')) {
      dataLayerObject(defineCommand('js', new Date()))
    }
  
    if (config.public.ganalytics.ga4) {
      const defaultParams: CommandParameters = {'debug': 'true'}
  
      if (!config.public.ganalytics.ga4.enableDebug) {
        delete defaultParams['debug']
      }
      
      const id = config.public.ganalytics.ga4.id

      if (typeof id === 'string') {
        if (!hasTag(id)) {
          dataLayerObject(defineConfig(id, defaultParams))
        }
      } else if (Array.isArray(id)) {
        id.forEach((item) => {
          if (typeof item === 'string') {
            if (!hasTag(item)) {
              dataLayerObject(defineConfig(item, defaultParams))
            }
          }
        })
      }
      stateCompleted.value = true
    }
  }
  
  // TODO: Maybe create a reactive object that returns the state and
  // the results from the datalayerObject function: { state: boolean, tags: [{ name: string, state: boolean }] }
  return stateCompleted
}
