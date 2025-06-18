import { defineNuxtPlugin, useHead, useRouter, useRuntimeConfig } from '#app'
import { createGtm, type VueGtmUseOptions } from '@gtm-support/vue-gtm'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const config = useRuntimeConfig()
  const userOptions = nuxtApp.$config.public.ganalytics
  
  console.log('userOptions', userOptions)
  console.log('userOptions.gtm && userOptions.gtm.enabled', userOptions.gtm && userOptions.gtm.enabled)
  console.log('userOptions.gtm && userOptions.gtm.enabled', userOptions.gtm, userOptions.gtm?.enabled)

  if (userOptions.ga4 && userOptions.ga4.enabled) {
    const loadingStrategy = userOptions.ga4.loadingStrategy === 'async' ? 'async' : 'defer'
    const fullUrl = userOptions.ga4.url + `?id=${userOptions.ga4.id}`

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
          src: fullUrl,
          [loadingStrategy]: true,
          'data-ganalytics': ''
        }
      ]
    })
  }

  // console.log(defu(userOptions.gtm, ))
  if (userOptions.gtm && userOptions.gtm.enabled) {
    const options: VueGtmUseOptions = {
      ...userOptions.gtm,
      vueRouter: userOptions.gtm.enableRouterSync && router ? router as VueGtmUseOptions['vueRouter'] : undefined
    }

    console.log('userOptions.gtm', userOptions.gtm, options)
    nuxtApp.vueApp.use(createGtm(options))
  }
})
