import { defu } from 'defu'
import { setupDevToolsUI } from './devtools'
import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

import type { VueGtmUseOptions } from '@gtm-support/vue-gtm'

// Module options TypeScript interface definition
export interface ModuleOptions extends Omit<VueGtmUseOptions, 'vueRouter'> {
  enableRouterSync?: boolean
  /**
   * Enable Nuxt Devtools integration
   * @default true
   */
  devtools?: boolean
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    gtm: ModuleOptions
  }

  interface NuxtConfig {
    gtm?: ModuleOptions
  }

  interface NuxtOptions {
    gtm?: ModuleOptions
  }
}

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-ganalytics',
    configKey: 'ganalytics',
    compatibility: { nuxt: '^3.0.0' }
  },
  // Default configuration options of the Nuxt module
  defaults: {
    devtools: true,

    // gtmEnabled: false,
    // analyticsEnabled: false,
    // analyticsUrl: 'https://www.googletagmanager.com/gtag/js',
    // loadingStrategy: 'defer'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    // Deep-merge nuxt module options + user custom gtm optionss filling missing fields
    const moduleOptions: ModuleOptions = defu(nuxt.options.runtimeConfig.public.gtm, options)

    nuxt.options.runtimeConfig.public.gtm = moduleOptions

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin({ src: resolver.resolve('./runtime/plugin.client'), mode: 'client'})

    console.log('enableRouterSync', options.enableRouterSync)

    // NOTE: To write
    addImports({ name: 'useGtm', as: 'useGtm', from: '@gtm-support/vue-gtm' })
    addImports({ name: 'useAnalyticsEvent', as: 'useAnalyticsEvent', from: './composables/useAnalyticsEvent'})
    addImports({ name: 'useAnalyticsTag', as: 'useAnalyticsTag', from: './composables/useAnalyticsTag'})

    if (options.devtools) {
      setupDevToolsUI(nuxt, resolver)
    }
  }
})
