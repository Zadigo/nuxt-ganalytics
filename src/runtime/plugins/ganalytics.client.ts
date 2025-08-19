import { createGtm, type VueGtmUseOptions } from '@gtm-support/vue-gtm'
import type { NuxtApp } from 'nuxt/app'
import { defineNuxtPlugin, useHead, useRouter, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  const router = useRouter()
  // const moduleOptions = nuxtApp.$config.public.ganalytics
  const moduleOptions = useRuntimeConfig().public.ganalytics

  // console.log('defineNuxtPlugin - moduleOptions', moduleOptions)

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
          'data-ganalytics': ''
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
      // console.log('moduleOptions.gtm', moduleOptions.gtm, options)
      nuxtApp.vueApp.use(createGtm(gtmOptions))
    }
  }
})
