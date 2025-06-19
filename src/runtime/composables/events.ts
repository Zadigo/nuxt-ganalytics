import { useRuntimeConfig } from '#app'
import type { DataLayerObject } from '@gtm-support/vue-gtm'
import { computed, onMounted, ref } from 'vue'
import { dataLayerObject, defineCommand, hasTag, tagInitializer } from '../utils'
import type { ConfigurationParameters } from '../types'

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
      isEnabled: ref(false),
      dataLayer: []
    }
  }

  const config = useRuntimeConfig()
  const state = tagInitializer(config)

  const dataLayer = ref<DataLayerObject[]>([])

  const isEnabled = computed(() => state)

  /**
   * Function used to send an event to the datalayer
   * @param payload The parameters of the command
   */
  function sendEvent(payload: IArguments) {
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
   *
   */
  function set(name: Pick<ConfigurationParameters, 'language' | 'user_id'>, value: string | number) {
    if (config.public.ganalytics.ga4) {
      defineCommand('set', config.public.ganalytics.ga4?.id, name, value)
    }
  }

  /**
   * Resets the datalayer container. Calls `tagInitializer`
   * to reload the default analytics tags
   */
  function reset() {
    window.dataLayer = []
    tagInitializer(config)
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
