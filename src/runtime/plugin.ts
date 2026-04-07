import { defineNuxtPlugin, useHead, useRouter, useRuntimeConfig } from '#app'
import { createGtm, type VueGtmUseOptions } from '@gtm-support/vue-gtm'
import type { ResolvableArray, ResolvableScript } from '@unhead/vue'

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  const router = useRouter()
  const moduleOptions = useRuntimeConfig().public.ganalytics

  if (moduleOptions.ga4 && moduleOptions.enabled && moduleOptions.ga4.enabled) {
    const loadingStrategy = moduleOptions.ga4.loadingStrategy === 'async' ? 'async' : 'defer'

    let fullUrl = ''
    const script: ResolvableArray<ResolvableScript> = []

    if (typeof moduleOptions.ga4.id === 'string' && moduleOptions.ga4.id !== '') {
      fullUrl = moduleOptions.ga4.url + `?id=${moduleOptions.ga4.id}`
      script.push({
        'src': fullUrl,
        [loadingStrategy]: true,
        'data-ganalytics': '',
        'crossorigin': 'anonymous'
      })
    } else if (Array.isArray(moduleOptions.ga4.id) && moduleOptions.ga4.id.length > 0) {
      moduleOptions.ga4.id.forEach((item, _) => {
        fullUrl = moduleOptions.ga4?.url + `?id=${item}`
        script.push({
          'src': fullUrl,
          [loadingStrategy]: true,
          'data-ganalytics': '',
          'crossorigin': 'anonymous'
        })
      })
    }

    if (!moduleOptions.ga4.id || moduleOptions.ga4.id === '') {
      console.error('GA4 ID is not set. Please provide a valid GA4 ID in the module options')
    }

    // Manually inject the GA4 initialization script to ensure it runs after the GA4 library is loaded.
    // This is necessary because the GA4 library does not automatically initialize itself when loaded
    // with `async` or `defer`.
    // {
    //   innerHTML: `
    //     window.dataLayer = window.dataLayer || [];
    //     function gtag(){dataLayer.push(arguments);}
    //     gtag('js', new Date());
    //     gtag('config', 'G-CVKFG2XPVG');
    //   `,
    //   type: 'text/javascript',
    // }

    useHead({ script })
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
