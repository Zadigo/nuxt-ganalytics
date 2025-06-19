<template>
  <NuxtCard class="border-0 shadow-md">
    <template #default>
      <h1 class="text-3xl font-bold font-title">GA4 Analyzer</h1>

      <ClientOnly>
        <NuxtBadge v-if="isEnabled" color="success" icon="i-lucide-circle">
          Enabled
        </NuxtBadge>

        {{ dataLayer }}
        
        <NuxtInput />
        <NuxtButton @click="handleEventOnClick">
          Send event
        </NuxtButton>

        <NuxtButton @click="handleConsent">
          User consent
        </NuxtButton>

        <NuxtAnalytics event="search" :params="{ search_term: 'My application' }">
          <template #default="{ attrs }">
            <NuxtButton @click="attrs.sendTemplateEvent()">
              Nuxt Analytics button
            </NuxtButton>
          </template>
        </NuxtAnalytics>
      </ClientOnly>
    </template>

    <template #footer>
    </template>
  </NuxtCard>
</template>

<script setup lang="ts">
import { useConsent } from '#ganalytics/composables'
import { defineEvent } from '#ganalytics/utils'

const { updateConsent, denyAll } = useConsent()
const { dataLayer, isEnabled, sendEvent, set } = useAnalyticsEvent()

/**
 * Sends an event on button click
 */
function handleEventOnClick() {
  sendEvent(defineEvent('login', { method: 'Google'}))
}

/**
 * Handle user consent
 */
function handleConsent() {
  updateConsent({
    ad_personalization: 'granted',
    ad_storage: 'granted',
    personalization_storage: 'granted'
  })
}

onMounted(() => denyAll())
</script>
