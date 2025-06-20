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
            
              <div class="space-x-2 flex items-center">
                <!-- <NuxtAnalytics event="search" :params="{ search_term: 'My application' }">
                  <template #default="{ attrs }">
                    <NuxtButton @click="attrs.sendTemplateEvent()">
                      Wrapped Analytics
                    </NuxtButton>
                  </template>
                </NuxtAnalytics> -->

                <NuxtButton color="warning" @click="handleGtmEventClick">
                  <Icon name="lucide:pointer" />
                  Send test GTM event
                </NuxtButton>
                <NuxtButton color="warning" @click="handleEventOnClick">
                  <Icon name="lucide:pointer" />
                  Send test GA4 event
                </NuxtButton>
                <NuxtSwitch v-model="customizeEvent" label="Customize" />
              </div>
            </div>

            <div v-if="customizeEvent" class="py-5 space-x-2 flex justify-end">
              <NuxtInputMenu />
              <NuxtInput placeholder="Parameter" />
              <NuxtInput placeholder="Value" />
            </div>

            <!-- List -->
            <ClientOnly>
              <BlocksList :items="internalDatalayer" />
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
import { hasTag } from '../../src/runtime/utils'

const config = useRuntimeConfig()

const gtm = useGtm()
const { sendEvent, internalDatalayer } = useAnalyticsEvent()

const searchParams = ref<SearchParams>({
  search: '',
  onlyAnalytics: false,
  onlyGtm: false
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
</script>
