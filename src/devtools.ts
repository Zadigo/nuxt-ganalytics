import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'

const DEVTOOLS_UI_ROUTE = '/__nuxt-gtm'
const DEVTOOLS_UI_LOCAL_PORT = 3300

export function setupDevToolsUI(nuxtApp: Nuxt, resolver: Resolver) {
  nuxtApp.hook('vite:extendConfig', (config) => {
    config.server = config.server || {}
    config.server.proxy = config.server.proxy || {}
    config.server.proxy[DEVTOOLS_UI_ROUTE] = {
      target: 'http://localhost:' + DEVTOOLS_UI_LOCAL_PORT + DEVTOOLS_UI_ROUTE,
      changeOrigin: true,
      followRedirects: true,
      rewrite: path => path.replace(DEVTOOLS_UI_ROUTE, '')
    }
  })

  nuxtApp.hook('devtools:customTabs', (tabs) => {
    tabs.push({
      // Unique identifier
      name: 'nuxt-ganalytics',
      // Title of the tab
      title: 'Nuxt G-Analytics',
      // any icon from Iconify, or a URL to an image
      icon: 'carbon:text-link-analysis',
      // iframe view
      view: {
        type: 'iframe',
        src: DEVTOOLS_UI_ROUTE
      }
    })
  })
}
