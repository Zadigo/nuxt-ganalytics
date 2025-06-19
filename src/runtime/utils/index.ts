import type { RuntimeConfig } from 'nuxt/schema'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { CommandParameters, EventNames, ScriptEventNames } from '~/src/runtime/types'
import { defineCommand, defineConfig } from './payload'

export * from './payload'

/**
 * Pushes arguments to the existing 
 * datalayer container
 * @param payload The pyaload to be used in the layer
 */
export function dataLayerObject<T extends IArguments>(payload: T | undefined) {
  if (window.dataLayer && payload) {
    console.log('arguments', payload)
    window.dataLayer?.push(payload)
  }
}

/**
 * Checks if the datalayer container contains
 * a given tag
 * @param name The name of the tag to check
 */
export function hasTag(name: EventNames | ScriptEventNames) {
  if (window.dataLayer) {
    const results = window.dataLayer.filter(x => x.event?.toLowerCase().includes(name))
    return results.length > 0
  } else {
    return false
  }
}

/**
 * Initializes GA4
 * @param config Nuxt runtime configuration
 * @example 
 * gtag("js", new Date())
 * gtag("config", "G-123", {})
 */
export function initializeAnalytics(config: RuntimeConfig): Ref<boolean> {
  const stateCompleted = ref<boolean>(false)

  window.dataLayer = window.dataLayer || []
  
  dataLayerObject(defineCommand('js', new Date()))

  if (config.public.ganalytics.ga4) {
    const defaultParams: CommandParameters = {'debug': 'true'}

    if (!config.public.ganalytics.ga4.enableDebug) {
      delete defaultParams['debug']
    }
    
    const id = config.public.ganalytics.ga4.id
    if (typeof id === 'string') {
      dataLayerObject(defineConfig(id, defaultParams))
    } else if (Array.isArray(id)) {
      id.forEach((item) => {
        if (typeof item === 'string') {
          dataLayerObject(defineConfig(item, defaultParams))
        }
      })
    }
    stateCompleted.value = true
  }

  return stateCompleted
}
