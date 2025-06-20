import { useCookie, useRuntimeConfig } from '#app'
import type { DataLayerObject } from '@gtm-support/vue-gtm'
import { useArrayFilter } from '@vueuse/core'
import { computed, onBeforeMount, ref } from 'vue'
import type { ConfigurationParameters, ConsentParameters, CustomGAnalyticsCookie, GAnalyticsDatalayerObjects } from '../types'
import { dataLayerObject, defineCommand, defineConsent, defineEvent, hasTag, initializeAnalytics } from '../utils'

export interface EventClassificationCategory {
  category: 'ga4' | 'gtm' | 'other'
  value: DataLayerObject | GAnalyticsDatalayerObjects[keyof GAnalyticsDatalayerObjects]
}

export type ConsentArgs = keyof Omit<ConsentParameters, 'wait_for_update'>

export type SetNameArg = Pick<ConfigurationParameters, 'language' | 'user_id'> | 'currency' | string

/**
 * Composable used to create and send
 *  Analytics events
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

  /**
   * Function used to send an event to the datalayer
   * @example gtag("...", "add_payment_info", {})
   * @param payload The parameters of the command
   */
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

  /**
   * The set command lets you define parameters that will be associated with every subsequent event on the page
   * @example gtag("set", "language", "fr")
   */
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

  /**
   * Resets the datalayer container. Calls `initializeAnalytics`
   * to reload the default analytics tags
   */
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
    sendEvent,
    set,
    reset,
    disable,
    gaIds,
    tagIds,
    isEnabled,
    internalDatalayer
  }
}

export function useConsent() {
  if (!import.meta.client) {
    return {
      cookie: null,
      updateConsent: () => {},
      denyAll: () => {}
    }
  }
  
  const defaultCookie = ref<CustomGAnalyticsCookie>({
    consent: {
      wait_for_update: 5000
    }
  })

  const cookie = useCookie<CustomGAnalyticsCookie | undefined>('ganalytics', { sameSite: 'strict', secure: true })
  
  /**
   * Update the user's consent parameters
   * @param params The consent parameters
   */
  function updateConsent(params?: ConsentParameters) {
    if (params) {
      dataLayerObject(defineConsent(params, 'update'))

      if (!cookie.value) {
        cookie.value = defaultCookie.value
      }

      cookie.value.consent = params
    }
  }

  /**
   * Explicitly deny all user consent for GA4 by sending
   * a consent event to the layer
   * @param region The region to implement
   */
  function denyAll(region?: string[]) {
    updateConsent({
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      security_storage: 'denied',
      personalization_storage: 'denied',
      region
    })
  }
  
  return {
    cookie,
    updateConsent,
    denyAll
  }
}
