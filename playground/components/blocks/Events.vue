<template>
  <div class="py-5 space-x-2 flex">
    <NuxtAnalytics event="search" :params="{ search_term: 'My application' }" @ga-event="handleReceivedEvent">
      <template #default="{ attrs }">
        <NuxtButton @click="attrs.sendTemplateEvent()">
          Login
        </NuxtButton>
      </template>
    </NuxtAnalytics>
  </div>
</template>

<script setup lang="ts">
function handleReceivedEvent(data) {
  console.log('Received event data:', data)
  // You can handle the received event data here
  // For example, you might want to log it or send it to another service
}
</script>
