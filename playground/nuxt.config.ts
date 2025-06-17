export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui'
  ],
  myModule: {},
  devtools: { enabled: true },
  css: [
    '~/assets/css/tailwind.css'
  ],
  ui: {
    prefix: 'Nuxt'
  },
  runtimeConfig: {
    public: {
      gtm: {
        id: process.env.NUXT_GTM_ID,
        enabled: true,
        debug: true
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
