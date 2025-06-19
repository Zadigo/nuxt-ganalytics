import { addComponent, addImports, addPlugin, createResolver, defineNuxtModule, installModule } from '@nuxt/kit'
import { defu } from 'defu'
import { setupDevToolsUI } from './devtools'
import type { GAModuleOptions, GtmModuleOptions } from './runtime/types/module'
import { addCustomTab } from '@nuxt/devtools-kit'

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
  ga4?: GAModuleOptions
  /**
   * GTM options
   */
  gtm?: GtmModuleOptions
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

export * from './runtime/types'

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
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    // Deep-merge nuxt module options + user custom gtm optionss filling missing fields
    const moduleOptions: ModuleOptions = defu(nuxt.options.runtimeConfig.public.ganalytics, options)
    
    // Transpile and alias runtime
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.alias['#ganalytics'] = runtimeDir
    nuxt.options.build.transpile.push(runtimeDir)
    
    nuxt.options.runtimeConfig.public.ganalytics = moduleOptions

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin({ src: resolver.resolve('./runtime/plugins/ganalytics.client'), mode: 'client'})

    // We simply just make the useGtm composable available to Nuxt
    addImports({ name: 'useGtm', as: 'useGtm', from: '@gtm-support/vue-gtm' })
    
    const composablesPath = resolver.resolve('./runtime/composables')
    addImports([
      { name: 'useAnalyticsEvent', from: composablesPath },
      { name: 'useAnalyticsTag', from: composablesPath },
      { name: 'useConsent', from: composablesPath }
    ])

    const utilsPath = resolver.resolve('./runtime/utils')
    addImports([
      { name: 'defineCommand', from: utilsPath },
      { name: 'defineConfig', from: utilsPath },
      { name: 'defineEvent', from: utilsPath },
      { name: 'dataLayerObject', from: utilsPath },
      { name: 'hasTag', from: utilsPath },
      { name: 'initializeAnalytics', from: utilsPath }
    ])

    addComponent({ name: 'NuxtAnalytics', filePath: resolver.resolve('./runtime/components/NuxtAnalytics.vue')})

    // nuxt.hook('pages:extend', (pages) => {
    //   pages.push({
    //     name: 'nuxt-ganalytics',
    //     path: '/pages/ganalytics/devtools.vue',
    //     file: resolver.resolve('./runtime/pages/ganalytics/devtools.vue')
    //   })
    // })

    // addCustomTab({
    //   name: 'nuxt-ganalytics',
    //   title: 'Nuxt GAnalytics',
    //   icon: 'i-heroicons-chart-bar-20-solid',
    //   view: {
    //     type: 'iframe',
    //     src: '/pages/ganalytics/devtools.vue'
    //   }
    // })

    await installModule('@vueuse/nuxt')

    // if (options.devtools) {
    //   setupDevToolsUI(nuxt, resolver)
    // }
  }
})
