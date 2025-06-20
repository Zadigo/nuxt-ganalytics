<template>
  <div class="py-5 space-x-2 flex">
    <NuxtAnalytics event="search" :params="{ search_term: 'My application' }" :debounce="3000" @ga-event="handleReceivedEvent">
      <template #default="{ attrs }">
        <NuxtButton @click="attrs.sendTemplateEvent()">
          Search - {{ attrs.count }}
        </NuxtButton>
      </template>
    </NuxtAnalytics>
  </div>
</template>

<script setup lang="ts">
import type { GAnalyticsDatalayerObject } from '#ganalytics/types'

function handleReceivedEvent(data: GAnalyticsDatalayerObject) {
  console.log('Received event data:', data)
  if (data[0] === 'event') {
    const params = data[2]
    if (params) {
      console.log('Event parameters:', params)
    }
  }
  // You can handle the received event data here
  // For example, you might want to log it or send it to another service
}
</script>
