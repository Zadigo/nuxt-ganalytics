import { useRuntimeConfig } from '#app'
import type { DataLayerObject } from '@gtm-support/vue-gtm'
import { computed, onMounted, ref } from 'vue'
import type { ConfigurationParameters } from '../types'
import { dataLayerObject, defineCommand, defineEvent, hasTag, initializeAnalytics } from '../utils'

/**
 * Composable used to create and send
 *  Analytics events
 * 
 * @returns Something
 */
export function useAnalyticsEvent() { 
  if (import.meta.server) {
    return {
      sendEvent: () => {},
      isEnabled: false,
      dataLayer: [],
      set: () => {},
      reset: () => {},
      disable: () => {}
    }
  }

  const config = useRuntimeConfig()
  const state = initializeAnalytics(config)

  const dataLayer = ref<DataLayerObject[]>([])

  const isEnabled = computed(() => state)

  /**
   * Function used to send an event to the datalayer
   * @param payload The parameters of the command
   */
  function sendEvent(payload: ReturnType<typeof defineEvent>) {
    dataLayerObject(payload)

    if (window.dataLayer) {
      dataLayer.value = window.dataLayer
    }
  }

  /**
   *
   */
  function disable() {
    if (hasTag('gtm.js')) {
      // Do something
    }
  }

  /**
   * Set a specific configuration for this page for
   * the given tag ID
   * @example gtag("set", "language", "fr")
   */
  function set(name: Pick<ConfigurationParameters, 'language' | 'user_id'>, value: string) {
    if (config.public.ganalytics.ga4) {
      const id = config.public.ganalytics.ga4?.id
      if (id && typeof id === 'string') {
        defineCommand('set', id, name, value)
      }
    }
  }

  /**
   * Resets the datalayer container. Calls `initializeAnalytics`
   * to reload the default analytics tags
   */
  function reset() {
    window.dataLayer = []
    initializeAnalytics(config)
  }

  onMounted(() => {
    if (window.dataLayer) {
      dataLayer.value = window.dataLayer
    }
  })
  
  return {
    sendEvent,
    set,
    reset,
    disable,
    isEnabled,
    dataLayer
  }
}
