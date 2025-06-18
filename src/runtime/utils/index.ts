import type { RuntimeConfig } from 'nuxt/schema'
import type { AllConfigurationParameters, EventNames, TagCommand } from '~/src/types'

/**
 * Entry function used to define a command for gtag
 * @param command The command to be used
 * @param args A set of arguments to be sent
 */
export function defineCommand<K extends TagCommand>(command: K, ...args: unknown[]): Record<number, unknown> {
  return Object.fromEntries([[0, command], ...args.map((arg, i) => [i + 1, arg])])
}

/**
 * 
 * @param id The tag ID to be used
 * @param params The config parameters for the tag
 * @returns The tokens to be sent
 */
export function defineConfig(id: string | undefined, params?: AllConfigurationParameters) {
  return defineCommand('config', id, params)
}

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
 * Function used to create a dictionnary tags used in order
 * to initialize GA4
 * @param config Nuxt runtime configuration
 */
export function tagInitializer(config: RuntimeConfig) {
  window.dataLayer = window.dataLayer || []
  
  dataLayerObject(defineCommand('js', new Date()))

  // Initialize default config objects
  // for the tags that were provided
  if (config.public.ganalytics.ga4) {
    const defaultParams: AllConfigurationParameters = {}

    if (config.public.ganalytics.ga4.enableDebug) {
      defaultParams.debug = 'true'
    }

    dataLayerObject(defineConfig(config.public.ganalytics.ga4.id, defaultParams))
  }

  console.log(window.dataLayer)
}
