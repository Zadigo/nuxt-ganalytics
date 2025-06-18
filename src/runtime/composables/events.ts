import { computed } from 'vue'

// import { useAnalyticsTag } from '#imports'

/**
 * Composable used to create and send
 *  Analytics events
 * 
 * @returns Something
 */
export function useAnalyticsEvent() {
  // const {} = useAnalyticsTag()

  const dataLayer = computed(() => {
    return window.dataLayer || []
  })
  
  return {
    dataLayer
  }
}
