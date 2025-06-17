import { defineNuxtPlugin, useRouter } from '#app'
import { createGtm, type VueGtmUseOptions } from '@gtm-support/vue-gtm'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const router = useRouter()
    const userOptions = nuxtApp.$config.public.gtm
    const options: VueGtmUseOptions = {
      ...userOptions,
      vueRouter: userOptions.enableRouterSync && router ? router as VueGtmUseOptions['vueRouter'] : undefined
    }

    // Create a new GTM instance to be used
    nuxtApp.vueApp.use(createGtm(options))
  }
})
