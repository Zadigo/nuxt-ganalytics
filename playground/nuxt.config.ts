export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/eslint', '@nuxt/fonts'],
  myModule: {},
  devtools: { enabled: true },
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
