import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true,
    testTimeout: 30000,
    silent: true,
    coverage: {
      enabled: true
    },
    include: [
      './test/components/**.spec.ts',
      './test/unit/**.test.ts',
    ],
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('test/nuxt/', import.meta.url))
      }
    },
    setupFiles: fileURLToPath(new URL('test/nuxt/setup.ts', import.meta.url))
  }
})
