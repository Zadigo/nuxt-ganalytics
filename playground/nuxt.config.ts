export default defineNuxtConfig({
  compatibilityDate: '2025-06-19',
  modules: [
    '../src/module',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui'
  ],
  devtools: { enabled: true },
  css: [
    '~/assets/css/tailwind.css'
  ],
  ui: {
    prefix: 'Nuxt'
  },
  ganalytics: {

  },
  runtimeConfig: {
    public: {
      // ganalytics: {
      //   ga4: {
      //     id: 'G-CVKFG2XPVG', 
      //     // id: ['G-CVKFG2XPVG'],
      //     // TODO: Use initial in order allos the user to configure
      //     // tags that he wants with initial configuration values
      //     // initial: [
      //     //   {
      //     //     id: 'G-CVKFG2XPVG',
      //     //     configuration: [
      //     //       'consent',
      //     //       'default',
      //     //       {
      //     //         ad_user_data: 'denied',
      //     //         ad_personalization: 'denied',
      //     //         ad_storage: 'denied',
      //     //         analytics_storage: 'denied',
      //     //         wait_for_update: 500,
      //     //       }
      //     //     ]
      //     //   }
      //     // ],
      //     enabled: false,
      //     immediate: true,
      //     enableDebug: true
      //   },
      //   gtm: {
      //     id: 'GTM-TJZFHM5',
      //     // FIXME: When we do not explicitly set enabled
      //     // or other params in here they do not appear
      //     // in the userOptions in the plugin
      //     enabled: true
      //   }
      // }
    }
  },
  fonts: {
    provider: 'google',
    families: [
      {
        // Body
        name: 'Work Sans',
        weight: '100..900'
      },
      {
        // Titles
        name: 'Manrope',
        weight: '200..800'
      },
      {
        // Titles
        name: 'Fira Code',
        weight: '300..700'
      }
    ]
  }
})
