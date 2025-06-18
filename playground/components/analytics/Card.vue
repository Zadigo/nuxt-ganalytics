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
          Press me
        </NuxtButton>
      </ClientOnly>
    </template>

    <template #footer>
    </template>
  </NuxtCard>
</template>

<script setup lang="ts">
import { defineEvent } from '#ganalytics/utils';

// import { useAnalyticsEvent, useAnalyticsTag } from '#imports'

const { dataLayer, isEnabled, sendEvent } = useAnalyticsEvent()

/**
 * Sends an event on button click
 */
function handleEventOnClick() {
  sendEvent(defineEvent('something', { a: 1 }))
}
</script>
