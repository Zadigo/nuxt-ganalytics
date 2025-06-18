import { useRuntimeConfig } from '#app'
import { computed, ref } from 'vue'
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

  const isEnabled = computed(() => state)
  const dataLayer = computed(() => window.dataLayer || [])

  /**
   * Function used to send an event to the datalayer
   * @param payload The parameters of the command
   */
  function sendEvent(payload: Record<string, unknown>) {
    dataLayerObject(payload)
  }
  
  return {
    sendEvent,
    isEnabled,
    dataLayer
  }
}
