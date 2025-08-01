import { useCookie } from '#app'
import { ref } from 'vue'
import { dataLayerObject, defineConsent } from '../utils'

import type { ConsentParameters, CustomGAnalyticsCookie } from '../types'

export * from './events'
export * from './tags'

export type ConsentArgs = keyof Omit<ConsentParameters, 'wait_for_update'>

/**
 * This composable provides methods to update consent parameters and manage user consent preferences
 */
export function useConsent() {
  if (!import.meta.client) {
    return {
      cookie: ref(null),
      updateConsent: () => {},
      acceptAll: () => {},
      denyAll: () => {}
    }
  }

  const defaultCookie = ref<CustomGAnalyticsCookie>({
    consent: {
      wait_for_update: 5000
    }
  })

  const cookie = useCookie<CustomGAnalyticsCookie | undefined>('ganalytics', { sameSite: 'strict', secure: true })

  async function updateConsent(params?: ConsentParameters) {
    if (params) {
      dataLayerObject(defineConsent(params, 'update'))

      if (!cookie.value) {
        cookie.value = defaultCookie.value
      }

      cookie.value.consent = params
    }
  }

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
    /**
     * The cookie used to store consent parameters
     * for the user
     */
    cookie,
    /**
     * Acceps all consent for the user
     * @param region The region for which consent is accepted
     */
    acceptAll,
    /**
     * Accept or update consent parameters for the user
     * @param params The consent parameters to update
     */
    updateConsent,
    /**
     * Denies all consent for the user
     * @param region The region for which consent is denied
     */
    denyAll
  }
}
