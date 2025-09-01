// import { addCustomTab } from '@nuxt/devtools-kit'
// import { joinURL } from 'ufo'
import { existsSync } from 'node:fs'
import { DEVTOOLS_UI_PATH, DEVTOOLS_UI_PORT } from './constants'

import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'

export function setupDevToolsUI(nuxtApp: Nuxt, resolver: Resolver) {
  const clientPath = resolver.resolve('./client')
  const isProductionBuild = existsSync(clientPath)

  if (isProductionBuild) {
    nuxtApp.hook('vite:serverCreated', async (server) => {
      const sirv = await import('sirv').then(r => r.default || r)
      server.middlewares.use(
        DEVTOOLS_UI_PATH,
        sirv(clientPath, { dev: true, single: true })
      )
    })
  } else {
    nuxtApp.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_PATH] = {
        target: `http://localhost:${DEVTOOLS_UI_PORT}${DEVTOOLS_UI_PATH}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(DEVTOOLS_UI_PATH, ''),
      }
    })
  }

  // addCustomTab({
  //   name: 'g-analytics',
  //   title: 'G-Analytics',
  //   icon: 'carbon:analytics',
  //   view: {
  //     type: 'iframe',
  //     src: joinURL(nuxtApp.options.app?.baseURL || '/', DEVTOOLS_UI_PATH)
  //   }
  // })
}
