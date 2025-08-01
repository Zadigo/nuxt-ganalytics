<template>
  <section id="site">
    <NuxtContainer>
      <div class="max-w-7xl mx-auto my-10">
        <NuxtCard>
          <template class="border-b" #header>
            <div class="grid grid-cols-12">
              <BlocksSearch v-model="searchParams" />

              <div class="col-span-1 flex items-center justify-center">
                <NuxtLink to="https://github.com/Zadigo/nuxt-ganalytics" as="button" color="neutral">
                  <Icon name="lucide:github" />
                </NuxtLink>
              </div>
            </div>
          </template>

          <div>
            <div class="py-3 flex justify-between items-center">
              <BlocksState />

              <ClientOnly>
                {{ tagIds }}

                {{ gaIds }}
              </ClientOnly>
              
              <div class="space-x-2 flex items-center">
                <NuxtButton color="error" @click="handleClearDatalayer">
                  <Icon name="lucide:trash" />
                  Clear
                </NuxtButton>

                <NuxtButton color="warning" @click="handleGtmEventClick">
                  <Icon name="lucide:pointer" />
                  Send test GTM event
                </NuxtButton>
                
                <NuxtButton color="warning" @click="handleEventOnClick">
                  <Icon name="lucide:pointer" />
                  Send test GA4 event
                </NuxtButton>
                <NuxtSwitch v-model="customizeEvent" label="Advanced" />
              </div>
            </div>

            <!-- Events -->
            <BlocksEvents v-if="customizeEvent" />

            <!-- List -->
            <ClientOnly>
              <BlocksList v-if="searchParams.showList" :items="internalDatalayer" />
              <div v-else class="p-5 bg-slate-100 rounded-md max-h-[300px] overflow-y-scroll">
                {{ internalDatalayer }}
              </div>
            </ClientOnly>
          </div>
        </NuxtCard>
      </div>
    </NuxtContainer>
  </section>
</template>

<script setup lang="ts">
import { BlocksSearch, BlocksState } from '#components'
import type { SearchParams } from '../types'
import { useAnalyticsEvent } from '../../src/runtime/composables/events'
import { useConsent } from '../../src/runtime/composables'

const config = useRuntimeConfig()

const gtm = useGtm()
const { sendEvent, internalDatalayer, set, reset, tagIds, gaIds } = useAnalyticsEvent()
const { acceptAll } = useConsent()

await set('language', 'fr-fr')
await set('currency', 'EUR')

const searchParams = ref<SearchParams>({
  search: '',
  onlyAnalytics: false,
  onlyGtm: false,
  showList: true
})

const customizeEvent = ref<boolean>(false)

/**
 * Sends an event on button click
 */
function handleEventOnClick() {
  sendEvent(defineEvent('login', { method: 'Google'}))
}

/**
 * Sends an event using the GTM composable
 */
function handleGtmEventClick() {
  if (gtm) {
    gtm.trackEvent({
      event: 'login',
      method: 'Google',
      customParam: 'Custom Value'
    })
  }
}

function handleClearDatalayer() {
  reset()
}

onMounted(async () => {
  await acceptAll()
})
</script>
