import type { DataLayerObject } from '@gtm-support/vue-gtm'
import { useArrayFilter } from '@vueuse/core'
import { computed, onBeforeMount, ref } from 'vue'
import { dataLayerObject, defineAnalyticsCommand, defineAnalyticsEvent, initializeAnalytics } from '../utils'

import type { ConfigurationParameters, GAnalyticsDatalayerObjects } from '../types'

import { useRuntimeConfig } from '#app'

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
      gaIds: [],
      tagIds: [],
      internalDatalayer: [],
      set: () => {},
      reset: () => {},
      enable: () => {},
      disable: () => {}
    }
  }

  const config = useRuntimeConfig()
  const state = initializeAnalytics(config)

  // TODO: Instead of relying on Window datalayer, create a class that
  // will store and centralize events that were sent to the window.dataLayer
  const internalDatalayer = ref<EventClassificationCategory[]>([])

  const isEnabled = computed(() => state)

  const tagIds = computed(() => {
    const objs = [config.public.ganalytics.ga4?.id, config.public.ganalytics.gtm?.id]
    const cleanObjs = objs.map((obj) => {
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
      return id.startsWith('G-')
    }
    return false
  })

  async function sendEvent(payload: ReturnType<typeof defineAnalyticsEvent>): Promise<ReturnType<typeof dataLayerObject>> {
    const parsedResult = dataLayerObject(payload)

    // console.log('sendEvent', parsedResult)

    if (parsedResult) {
      internalDatalayer.value.push({
        category: 'ga4',
        value: parsedResult
      })
    }

    return parsedResult
  }

  async function enable(id: string) {
    if (window) {
      // @ts-expect-error "Id is returned as any from the Window"
      delete (window as Window)[`ga-disable-${id}`]
    }
  }

  async function disable(id: string) {
    if (window) {
      // @ts-expect-error "Id is returned as any from the Window"
      (window as Window)[`ga-disable-${id}`] = true
    }
  }

  // FIXME: Does this only for one single IDs but not
  // if the user provides multiple IDs
  // ENHANCE: Allow setting only one iD
  async function set(name: SetNameArg, value: string) {
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

  async function reset() {
    window.dataLayer = []
    internalDatalayer.value = []
    initializeAnalytics(config)
  }

  onBeforeMount(() => {
    if (window.dataLayer) {
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
    gaIds,
    /**
     * List of GTM IDs currently used in the project
     * @example ['GTM-XXXXXXXXXX', 'GTM-YYYYYYYYYY']
     */
    tagIds,
    /**
     * Whether the analytics tags are enabled
     */
    isEnabled,
    /**
     * The internal datalayer used to store events
     * and commands for debugging purposes
     */
    internalDatalayer
  }
}
