import { defu } from 'defu'
import { setupDevToolsUI } from './devtools'
import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

import type { VueGtmUseOptions } from '@gtm-support/vue-gtm'
import type { LoadingStrategy } from './types'

export interface GtmOptions extends Omit<VueGtmUseOptions, 'vueRouter'> {
  /**
   * @default false
   */
  enableRouterSync?: boolean
}

export interface GoogleAnalyticsOptions {
  /**
   * Single tag ID. To configure multiple IDs
   * use the `tags` option
   * @default undefined
   */
  id?: string
  /**
   * Enable GA4
   * @default true
   */
  enabled?: boolean
  /**
   * Initializes the Google Tag script immediately after the page has loaded
   * @default true
   */
  immediate?: boolean
  /**
   * Url pointing to the Google Analytics
   * @default "https://www.googletagmanager.com/gtag/js"
   */
  url?: string
  /**
   * TODO:
   * @default "defer"
   */
  loadingStrategy?: LoadingStrategy
  /**
   * Whether to enable the debug mode in GA4
   * @default false
   */
  enableDebug?: boolean
}

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable Nuxt Devtools integration
   * @default true
   */
  devtools?: boolean
  /**
   * Enable both GA4 and GTM
   * @default true
   */
  enabled?: boolean
  /**
   * GA4 options
   */
  ga4?: GoogleAnalyticsOptions
  /**
   * Google Tag Manager options
   */
  gtm?: GtmOptions
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    ganalytics: ModuleOptions
  }

  interface NuxtConfig {
    ganalytics?: ModuleOptions
  }
  
  interface NuxtOptions {
    ganalytics?: ModuleOptions
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
    enabled: true,
    ga4: {
      immediate: true,
      enabled: true,
      loadingStrategy: 'defer',
      url: 'https://www.googletagmanager.com/gtag/js'
    },
    gtm: {
      id: '',
      enabled: true
    }
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    // Deep-merge nuxt module options + user custom gtm optionss filling missing fields
    const moduleOptions: ModuleOptions = defu(nuxt.options.runtimeConfig.public.ganalytics, options)
    
    // Transpile and alias runtime
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.alias['#ganalytics'] = runtimeDir
    nuxt.options.build.transpile.push(runtimeDir)
    
    nuxt.options.runtimeConfig.public.ganalytics = moduleOptions

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin({ src: resolver.resolve('./runtime/plugin.client'), mode: 'client'})

    // We simply just make the useGtm composable available to Nuxt
    addImports({ name: 'useGtm', as: 'useGtm', from: '@gtm-support/vue-gtm' })
    
    const composablesPath = resolver.resolve('./runtime/composables')
    addImports([
      { name: 'useAnalyticsEvent', from: composablesPath },
      { name: 'useAnalyticsTag', from: composablesPath }
    ])

    const utilsPath = resolver.resolve('./runtime/utils')
    addImports([
      { name: 'defineCommand', from: utilsPath },
      { name: 'defineConfig', from: utilsPath },
      { name: 'defineEvent', from: utilsPath },
      { name: 'dataLayerObject', from: utilsPath },
      { name: 'hasTag', from: utilsPath },
      { name: 'tagInitializer', from: utilsPath }
    ])

    if (options.devtools) {
      setupDevToolsUI(nuxt, resolver)
    }
  }
})
