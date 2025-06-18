<template>
  <ClientOnly>
    <div id="nuxt-ganalytics">
      <slot :attrs="defaultAttrs" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const defaultAttrs = computed(() => {
  return {
    triggerEvent: () => {
      return ''
    }
  }
})
</script>
