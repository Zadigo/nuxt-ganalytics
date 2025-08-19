// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: [
      './playground'
    ]
  }
})
  .append(
    {
      rules: {
        '@stylistic/comma-dangle': ['off', 'always-multiline']
        // '@typescript-eslint/unified-signatures': 'error',
        // '@typescript-eslint/related-getter-setter-pairs': 'warn',
        // '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
        // '@typescript-eslint/no-unnecessary-template-expression': 'warn',
        // '@typescript-eslint/no-unnecessary-condition': 'warn',
        // '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
        // '@typescript-eslint/no-non-null-assertion': 'warn',
        // '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'warn',
        // '@typescript-eslint/no-misused-spread': 'warn',
        // '@typescript-eslint/no-extraneous-class': 'warn'
      }
    }
  )
