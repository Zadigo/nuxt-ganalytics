<template>
  <NuxtCard class="border-0 shadow-md">
    <template #default>
      <h1 class="text-3xl font-bold font-title">GA4 Analyzer</h1>

      <ClientOnly>
        {{ dataLayer }}
        
        <NuxtInput />
        <NuxtButton>
          Press me
        </NuxtButton>
      </ClientOnly>
    </template>

    <template #footer>
    </template>
  </NuxtCard>
</template>

<script setup lang="ts">
// import { useAnalyticsEvent, useAnalyticsTag } from '#imports'

const { dataLayer } = useAnalyticsEvent()
</script>
