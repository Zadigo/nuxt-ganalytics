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
- ✨ Track events with [composables](#sending-events) and built in [components](#sending-events)
- 🕸️ Use one or multiple [tag IDs](#using-multiple-tag-ids)
- 🌳 Send event parameter or values to [third-party API url](#api-url)
- 🌐 Use [Google Consent Mode](#using-google-consent-mode) to manage user consent
- 🧩 Use [Nuxt Analytics](#nuxtanalytics) component to send events from your templates

## Setup 🚀

Run the following command to add the module to your project:

```bash
npx nuxi module add nuxt-ganalytics
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
    ],
    
    ganalytics: {
      ga4: {
        // Your GA4 ID
        id: 'G-XXXXXXXXXX'
      },
      gtm: {
        // Your GTM ID
        id: 'GTM-XXXXXXXXXX'
      }
    }
  })
  ```
</details>

## Configuration ⚙️

### Enable GA4 on all pages

You can enable Google Analytics 4 on all pages by providing the `gtag.id` property in your `nuxt.config.ts` file.

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-ganalytics'],

  ganalytics: {
    id: 'G-XXXXXXXXXX'
  }
})
```

### Partial disable of GA4

You can disable Google Analytics 4 on specific pages by setting the `gtag` property to `false` in the page's configuration by calling
the `disable` function within the `useAnalyticsEvent` composable.

### Using multiple tag IDs

You can use multiple tag IDs by providing an array of IDs in the `gtag.id` property.

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-ganalytics'],

  ganalytics: {
    id: ['G-XXXXXXXXXX', 'G-YYYYYYYYYY']
  }
})
```

## Usage 👌

Once the module is installed, you can use it in your Nuxt app. This will automatically inject the necessary script and configuration for GA4.

### Sending events

#### useAnalyticsEvent

Events can be sent using the `useAnalyticsEvent`. This composable allows you to send events to GA4 directly without the need for GTM.

```vue
<script setup lang="ts">
import { useAnalyticsEvent } from 'nuxt-ganalytics'

const { sendEvent } = useAnalyticsEvent()

function handleLogin() {
  sendEvent(defineEvent('login', { method: 'Google' }))
}
```

`sendEvent`

This is the main function used to send events to Google Analytics. It takes an event object created with the `defineEvent` function or any other function that
uses it under the hood.

`set`

You can set global properties by using the `set` function from the `useAnalyticsEvent` composable. This allows you to set properties that will be sent with every event.

> [!NOTE]
> Calling set is not retroactive. In other words, if you want global properties at initialization then you can need to provide these parapeters directly in the
> module options. Calling set from the composable will always apply the provideed properties to future events

`reset`

Clears the window datalayer and rests the global properties.

### Structuring events

Events are built using the `defineEvent` function, which allows you correctly structure the [name and parameters](https://event) required in certain events.
As the example shows above, combined with the `sendEvent` function, you can then trigger an event to the layer.


#### NuxtAnalytics

Another way to trigger events is by using the `NuxtAnalytics` component. You can wrap elements and then use `sendTemplateEvent` to trigger and event. 
Associated with template event generators like `@click`, an event will then be triggered when the element is interracted with.

```vue
<template>
  <NuxtAnalytics event="login" :params="{ method: 'Google' }">
    <template #default="{ attrs }">
      <button @click="() => attrs.sendTemplateEvent()">
        Login with Google
      </button>
    </template>
  </NuxtAnalytics>
</template>
```
The example above will send a `login` event with the parameter `method: 'Google'` when the button is clicked.

> [!NOTE]
> ⚠️ Events are sent only on the client-side. This means that the component will not render on the server-side and will not send events during SSR.

Sending events can be also be debounced. This can be done by passing the `debounce` option:

```vue
<template>
  <NuxtAnalytics event="login" :params="{ method: 'Google' }" :debounce="500">
    <template #default="{ attrs }">
      <button @click="() => attrs.sendTemplateEvent()">
        Login with Google
      </button>
    </template>
  </NuxtAnalytics>
</template>
```

The commponent will also track the amount of iterractions with the wrapped element and expose the value via `attrs.count` prop in the template slot.

### Using Google Consent Mode

By default the _default_ no consent mode is used. You can enable consent using the builtin composable `useConsent`
which provides functions to update or deny the user consent values.

The example below shows how to use the composable in your app:

```vue
<script setup lang="ts">
const { updateConsent, denyAll } = useConsent()

onMounted(() => {
  denyAll()
})
</script>
```

This above code denies all consent values until the the user has accepted the cookies. You can then use the `updateConsent` 
function to update the consent values for specific categories:

```vue
<template>
  <div>
    <button @click="() => handleConsentChange()">
      Accept Cookies
    </button>
  </div>
</template>

<script setup lang="ts">
const { updateConsent } = useConsent()

function handleConsentChange() {
  updateConsent({
    ad_storage: 'granted'
  })
}
</script>
```

Under the hood, the module will automatically update the consent values in the Google Consent Mode API and save them in the local cookies. 
This way, you can ensure that the user has control over their consent preferences. 

In peculiar cases, you can also use the `acceptAll` function to accept all consent values at once:

```vue
<script setup lang="ts">
const { acceptAll } = useConsent()
</script>
```

## Do I need to enable both GA4 and GTM? 🧐

No. You can use either Google Analytics 4 (GA4) or Google Tag Manager (GTM) in your Nuxt app. The main difference between GA4 and GTM resides in the 
fact that you can use custom events and parameters to be sent. You will need to create the trigers and containers in your Google Tag Manager 
account in order to handle thes events.

Be default GA4 is enabled in the module.

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

## Thanks 🌸

This project wa inspired by the following awesome projects:

* [Nuxt GTM](https://github.com/zadigetvoltaire/nuxt-gtm)
* [Nuxt GTAG](https://github.com/johannschopplich/nuxt-gtag)

[npm-version-src]: https://img.shields.io/npm/v/nuxt-ganalytics/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-ganalytics

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-ganalytics.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-ganalytics

[license-src]: https://img.shields.io/npm/l/nuxt-ganalytics.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/Zadigo/nuxt-ganalytics/blob/main/LICENCE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
