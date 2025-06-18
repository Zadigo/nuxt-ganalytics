import { useRuntimeConfig } from '#app'
import type { DataLayerObject } from '@gtm-support/vue-gtm'
import { computed, onMounted, ref } from 'vue'
import { dataLayerObject, tagInitializer } from '../utils'

// import { useAnalyticsTag } from '#imports'

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
  function sendEvent(payload: Record<string, unknown>) {
    dataLayerObject(payload)

    if (window.dataLayer) {
      dataLayer.value = window.dataLayer
    }
  }

  onMounted(() => {
    if (window.dataLayer) {
      dataLayer.value = window.dataLayer
    }
  })
  
  return {
    sendEvent,
    isEnabled,
    dataLayer
  }
}
