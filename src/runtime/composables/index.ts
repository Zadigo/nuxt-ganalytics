import { useCookie } from '#app'
import { ref } from 'vue'
import type { ConsentParameters, CustomGAnalyticsCookie } from '../types'
import { dataLayerObject, defineConsent } from '../utils'

export * from './events'
export * from './tags'

export type ConsentArgs = keyof Omit<ConsentParameters, 'wait_for_update'>

/**
 * Composable used to manage user consent
 */
export function useConsent() {
  if (!import.meta.client) {
    return {
      cookie: null,
      updateConsent: () => { },
      denyAll: () => { }
    }
  }

  const defaultCookie = ref<CustomGAnalyticsCookie>({
    consent: {
      wait_for_update: 5000
    }
  })

  const cookie = useCookie<CustomGAnalyticsCookie | undefined>('ganalytics', { sameSite: 'strict', secure: true })

  /**
   * Accept or deny a specific consent parameter
   * @param params The consent parameters to update
   */
  async function updateConsent(params?: ConsentParameters) {
    if (params) {
      dataLayerObject(defineConsent(params, 'update'))

      if (!cookie.value) {
        cookie.value = defaultCookie.value
      }

      cookie.value.consent = params
    }
  }

  /**
   * Denies all consent for the user
   * @param region The region to implement
   */
  async function acceptAll(region?: string[]) {
    await updateConsent({
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted',
      personalization_storage: 'granted',
      region
    })
  }

  /**
   * Denies all consent for the user
   * @param region The region to implement
   */
  async function denyAll(region?: string[]) {
    await updateConsent({
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
    acceptAll,
    updateConsent,
    denyAll
  }
}
