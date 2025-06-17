<template>
  <section id="site">
    <h1>GTM Analyzer</h1>

    <ClientOnly>
      <p>Enabled: {{ isEnabled }}</p>
    </ClientOnly>
    
    <button @click="handleTestEvent">Test event</button>
  </section>
</template>

<script setup lang="ts">
const gtm = useGtm()

const isEnabled = computed(() => {
  return gtm?.enabled()
})

function handleTestEvent() {
  if (gtm) {
    gtm.trackEvent({ event: 'click', value: 'test-event' })
  }
}
</script>
