import type { DataLayerObject } from '@gtm-support/vue-gtm'
import { isDefined, useArrayFilter } from '@vueuse/core'
import { computed, onBeforeMount, readonly, ref } from 'vue'
import type { ConfigurationParameters, GAnalyticsDatalayerObjects } from '../types'
import type { defineAnalyticsEvent } from '../utils'
import { dataLayerObject, defineAnalyticsCommand, initializeAnalytics } from '../utils'

import { useRuntimeConfig } from '#app'

export interface EventClassificationCategory {
  category: 'ga4' | 'gtm' | 'other'
  value: DataLayerObject | GAnalyticsDatalayerObjects[keyof GAnalyticsDatalayerObjects]
}

export interface WindowWithGADisable extends Window {
  [key: `ga-disable-${string}`]: boolean | undefined
}

export type SetNameArg = Pick<ConfigurationParameters, 'language' | 'user_id'> | 'currency' | string

const MAX_EVENTS = 100

const GA4_PREFIX = 'G-'

// const GTM_PREFIX = 'GTM-'

const GA_DISABLE_PREFIX = 'ga-disable-'

/**
 * Composable to send events to the Google Analytics datalayer
 * and manage its state
 */
export function useAnalyticsEvent() {
  if (import.meta.server) {
    return {
      sendEvent: () => undefined,
      set: () => {},
      reset: () => {},
      enable: () => {},
      disable: () => {},
      gaIds: ref([]),
      tagIds: ref([]),
      isEnabled: ref(false),
      internalDatalayer: ref([]),
    }
  }

  const config = useRuntimeConfig()
  const ganalyticsConfig = config.public.ganalytics
  const state = initializeAnalytics(config)

  // TODO: Instead of relying on Window datalayer, create a class that
  // will store and centralize events that were sent to the window.dataLayer
  const internalDatalayer = ref<EventClassificationCategory[]>([])

  const isEnabled = computed(() => state.value)

  const tagIds = computed(() => {
    const ids: string[] = []

    const processId = (obj: unknown): string[] => {
      if (typeof obj === 'string') return [obj]
      if (Array.isArray(obj)) return obj.filter(id => typeof id === 'string')
      if (obj && typeof obj === 'object' && 'id' in obj) {
        return processId(obj.id)
      }
      return []
    }

    if (ganalyticsConfig.ga4?.id) {
      ids.push(...processId(ganalyticsConfig.ga4.id))
    }
    if (ganalyticsConfig.gtm?.id) {
      ids.push(...processId(ganalyticsConfig.gtm.id))
    }

    return ids
  })

  const gaIds = useArrayFilter(tagIds, (id) => {
    if (typeof id === 'string') {
      return id.startsWith(GA4_PREFIX)
    }
    return false
  })

  function sendEvent(payload: ReturnType<typeof defineAnalyticsEvent>): ReturnType<typeof dataLayerObject> | undefined {
    try {
      const parsedResult = dataLayerObject(payload)
      
      // Prevent the internal datalayer from growing indefinitely and 
      // consuming too much memory
      if (internalDatalayer.value.length >= MAX_EVENTS) {
        internalDatalayer.value.shift()
      }
  
      if (parsedResult) {
        internalDatalayer.value.push({
          category: 'ga4',
          value: parsedResult
        })
      }
  
      return parsedResult
    } catch (error) {
      console.error('[G-Analytics]: Error sending event to dataLayer:', error)
      return undefined
    }
  }

  function enable(id: string) {
    if (typeof window === 'undefined') return
    if (!isDefined(id) && typeof id !== 'string') {
      console.error('[G-Analytics]: ID is required to enable analytics tags')
      return
    }
    delete (window as unknown as WindowWithGADisable)[`${GA_DISABLE_PREFIX}${id}`]
  }

  function disable(id: string) {
    if (typeof window === 'undefined') return
    (window as unknown as WindowWithGADisable)[`${GA_DISABLE_PREFIX}${id}`] = true
  }

  // FIXME: Does this only for one single IDs but not
  // if the user provides multiple IDs
  // ENHANCE: Allow setting only one iD
  function set(name: SetNameArg, value: string) {
    if (config.public.ganalytics.ga4) {
      const id = config.public.ganalytics.ga4.id

      if (id && typeof id === 'string') {
        dataLayerObject(defineAnalyticsCommand('set', id, name, value))
      } else if (Array.isArray(id)) {
        id.forEach((tagId) => {
          dataLayerObject(defineAnalyticsCommand('set', tagId, name, value))
        })
      }
    }
    // ENHANCE: Implement this for the above
    // gaIds.value.forEach(tagId => {
    //   dataLayerObject(defineCommand('set', tagId, name, value))
    // })
  }

  function reset() {
    if (typeof window === 'undefined') {
      throw new Error('[G-Analytics]: Window is not defined')
    }

    window.dataLayer = []
    internalDatalayer.value = []
    initializeAnalytics(config)
  }

  onBeforeMount(() => {
    if (typeof window === 'undefined' || !window.dataLayer) return

    window.dataLayer.forEach((item) => {
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
  })

  if (import.meta.dev && !config.public.ganalytics) {
    console.warn('[G-Analytics]: No analytics configuration found')
  }

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
     * Enables analytics tags
     * @param id The ID of the tag to enable, if not provided, all tags are enabled
     */
    enable,
    /**
     * Disables analytics tags
     * @param id The ID of the tag to disable, if not provided, all tags are disabled
     */
    disable,
    /**
     * List of GA4 iDs currently used in the project
     * @example ['G-XXXXXXXXXX', 'G-YYYYYYYYYY']
     */
    gaIds: readonly(gaIds),
    /**
     * List of GTM IDs currently used in the project
     * @example ['GTM-XXXXXXXXXX', 'GTM-YYYYYYYYYY']
     */
    tagIds: readonly(tagIds),
    /**
     * Whether the analytics tags are enabled
     */
    isEnabled: readonly(isEnabled),
    /**
     * The internal datalayer used to store events
     * and commands for debugging purposes
     */
    internalDatalayer: readonly(internalDatalayer),
  }
}
