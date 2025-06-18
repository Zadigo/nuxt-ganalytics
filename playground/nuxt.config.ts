export default defineNuxtConfig({
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
  runtimeConfig: {
    public: {
      ganalytics: {
        ga4: {
          id: 'G-CVKFG2XPVG',
          enabled: true,
          immediate: true,
          enableDebug: true
        },
        gtm: {
          id: 'GTM-TJZFHM5',
          // FIXME: When we do not explicitly set enabled
          // or other params in here they do not appear
          // in the useOptions in the plugin
          enabled: false
        }
      }
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
