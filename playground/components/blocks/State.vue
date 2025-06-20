<template>
  <div class="space-x-2">
    <NuxtBadge :color="gtmEnabled ? 'success' : 'warning'">
      <Icon name="lucide:loader" />
      GTM
    </NuxtBadge>

    <NuxtBadge :color="ga4Enabled ? 'success' : 'warning'">
      <Icon name="lucide:loader" />
      GA4
    </NuxtBadge>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const gtmEnabled = computed(() => {
  if (config.public.ganalytics.gtm) {
    if (config.public.ganalytics.gtm.enabled) {
      return true
    }
  }
  return false
})

const ga4Enabled = computed(() => {
  if (config.public.ganalytics.ga4) {
    if (config.public.ganalytics.ga4.enabled) {
      return true
    }
  }
  return false
})
</script>
