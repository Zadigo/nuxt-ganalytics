import { defineNuxtPlugin, useHead, useRouter, useRuntimeConfig } from '#app'
import { createGtm, type VueGtmUseOptions } from '@gtm-support/vue-gtm'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) {
    return
  }

  const router = useRouter()
  const moduleOptions = useRuntimeConfig().public.ganalytics

  if (moduleOptions.ga4 && moduleOptions.enabled && moduleOptions.ga4.enabled) {
    const loadingStrategy = moduleOptions.ga4.loadingStrategy === 'async' ? 'async' : 'defer'
    const fullUrl = moduleOptions.ga4.url + `?id=${moduleOptions.ga4.id}`

    if (!moduleOptions.ga4.id || moduleOptions.ga4.id === '') {
      console.error('GA4 ID is not set. Please provide a valid GA4 ID in the module options')
    }

    useHead({
      link: [
        {
          rel: 'preload',
          as: 'script',
          href: fullUrl
        }
      ],
      script: [
        {
          'src': fullUrl,
          [loadingStrategy]: true,
          'data-ganalytics': '',
          'crossorigin': 'anonymous'
        }
      ]
    })
  }

  if (moduleOptions.gtm && moduleOptions.enabled && moduleOptions.gtm.enabled) {
    if (!moduleOptions.gtm.id || moduleOptions.gtm.id === '') {
      console.error('GTM ID is not set. Please provide a valid GTM ID in the module options.')
    } else {
      const gtmOptions: VueGtmUseOptions = {
        ...moduleOptions.gtm,
        vueRouter: moduleOptions.gtm.enableRouterSync && router ? router as VueGtmUseOptions['vueRouter'] : undefined
      }

      nuxtApp.vueApp.use(createGtm(gtmOptions))
    }
  }

  return {
    provide: {}
  }
})
