import { useRuntimeConfig } from '#app'
import { useArrayFilter } from '@vueuse/core'
import { computed, onBeforeMount, ref } from 'vue'
import { dataLayerObject, defineCommand, defineEvent, hasTag, initializeAnalytics } from '../utils'

import type { DataLayerObject } from '@gtm-support/vue-gtm'
import type { ConfigurationParameters, GAnalyticsDatalayerObjects } from '../types'

export interface EventClassificationCategory {
  category: 'ga4' | 'gtm' | 'other'
  value: DataLayerObject | GAnalyticsDatalayerObjects[keyof GAnalyticsDatalayerObjects]
}

export type SetNameArg = Pick<ConfigurationParameters, 'language' | 'user_id'> | 'currency' | string

/**
 * Composable to send events to the Google Analytics datalayer
 * and manage the datalayer state
 */
export function useAnalyticsEvent() { 
  if (import.meta.server) {
    return {
      sendEvent: () => undefined,
      isEnabled: false,
      internalDatalayer: [],
      set: () => {},
      reset: () => {},
      disable: () => {}
    }
  }

  const config = useRuntimeConfig()
  const state = initializeAnalytics(config)

  const internalDatalayer = ref<EventClassificationCategory[]>([])

  const isEnabled = computed(() => state)

  const tagIds = computed(() => {
    const objs = [config.public.ganalytics.ga4?.id, config.public.ganalytics.gtm?.id]
    const cleanObjs = objs.map(obj => {
      if (typeof obj === 'string') {
        return [obj]
      } else if (typeof obj === 'object' && 'id' in obj) {
        return obj.id as string
      } else if (Array.isArray(obj)) {
        return obj as string[]
      } else {
        return obj || []
      }
    })
    return cleanObjs.flat()
  })

  const gaIds = useArrayFilter(tagIds, (id) => {
    if (typeof id === 'string') {
      if (id.startsWith('G-')) {
        return true
      }
    }
    return false
  })

  async function sendEvent(payload: ReturnType<typeof defineEvent>): Promise<ReturnType<typeof dataLayerObject>> {
    const parsedResult = dataLayerObject(payload)

    console.log('sendEvent', parsedResult)

    if (parsedResult) {
      internalDatalayer.value.push({
        category: 'ga4',
        value: parsedResult
      })
    }

    return parsedResult
  }

  /**
   *
   */
  async function disable() {
    if (hasTag('gtm.js')) {
      // Do something
    }
  }

  async function set(name: SetNameArg, value: string) {
    if (config.public.ganalytics.ga4) {
      const id = config.public.ganalytics.ga4.id

      if (id && typeof id === 'string') {
        dataLayerObject(defineCommand('set', id, name, value))
      } else if (Array.isArray(id)) {
        id.forEach(tagId => {
          dataLayerObject(defineCommand('set', tagId, name, value))
        })
      }
    }
    // ENHANCE: Implment this for the above
    // gaIds.value.forEach(tagId => {
    //   dataLayerObject(defineCommand('set', tagId, name, value))
    // })
  }

  async function reset() {
    window.dataLayer = []
    internalDatalayer.value = []
    initializeAnalytics(config)
  }

  onBeforeMount(() => {
    if (window.dataLayer) {
      window.dataLayer.forEach(item => {
        const keys = Object.keys(item)
        
        if (keys.includes('event')) {
          internalDatalayer.value.push({
            category: 'gtm',
            value: item
          })
        } else {
          internalDatalayer.value.push({
            category: 'ga4',
            value: Array.from(item as GAnalyticsDatalayerObjects[]) 
          })
        }
      })
    }
  })

  return {
    /**
     * Function used to send an event to the datalayer
     * @param payload The parameters of the command
     * @param payload.event The event name to send
     * @param payload.params The parameters of the event to send
     * @example gtag("...", "add_payment_info", {})
     */
    sendEvent,
    /**
     * Sets a configuration parameter for the Google Analytics tag
     * @param name The name of the parameter to set, can be a string or an object with parameters
     * @param value The value of the parameter to set, if `name` is a string
     * @example gtag("set", "language", "fr")
     */
    set,
    /**
     * Resets the datalayer container. Calls `initializeAnalytics`
     * to reload the default analytics tags
     */
    reset,
    /**
     * Disables the analytics tags
     */
    disable,
    /**
     * The list of GA4 iDs used in the project
     * @example ['G-XXXXXXXXXX', 'G-YYYYYYYYYY']
     */
    gaIds,
    /**
     * The list of GTM IDs used in the project
     * @example ['GTM-XXXXXXXXXX', 'GTM-YYYYYYYYYY']
     */
    tagIds,
    /**
     * Whether the analytics tags are enabled or not
     */
    isEnabled,
    /**
     * The internal datalayer used to store events
     * and commands for debugging purposes
     */
    internalDatalayer
  }
}
