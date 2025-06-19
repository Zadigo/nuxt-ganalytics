# Nuxt G-Analytics

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Implement Google Analytics and Google Tag Manager functionnalities in your project

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features ✨

- ⛰ Nuxt 3 ready
- 🚠 SSR friendly
- 🌲 &nbsp;Baz

## Setup

Run the following command to add the module to your project:

```bash
npx nuxi module add ganalytics
```

That's it! You can now use G-Analytics in your Nuxt app ✨

<details>
  <summary>Manual Setup</summary>

  You can install the module manually with:

  ```bash
  npm i nuxt-ganalytics
  ```

  Update your `nuxt.config.ts`

  ```typescript
  export default defineNuxtConfig({
    modules: [
      'nuxt-ganalytics'
    ]
  })
  ```
</details>

## Usage 👌

## Contributing 🙏

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```
</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/Zadigo/nuxt-ganalytics/blob/main/LICENCE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
