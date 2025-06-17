<template>
  <section id="site" class="px-20">
    <NuxtContainer>
      <div class="max-w-xl mx-auto my-20">
        <NuxtCard class="border-0 shadow-md">
          <template #default>
            <h1 class="text-3xl font-bold font-title">GTM Analyzer</h1>

            <ClientOnly>
              <div class="py-5">
                <NuxtBadge v-if="isEnabled" color="success" icon="i-lucide-circle">
                  Enabled
                </NuxtBadge>
                
                <div class="my-5">
                  <p class="font-bold">Datalayer</p>

                  <NuxtInput v-model="search" placeholder="Search by event name..." />
                  <div class="p-5 h-[300px] overflow-y-scroll space-y-1">
                    <div v-for="(item, i) in filteredEvents" :key="i" class="p-5 bg-secondary-50 rounded-md">
                      {{ item }}
                    </div>
                  </div>
                </div>
              </div>
            </ClientOnly>
          </template>

          <template #footer>
            <NuxtButton @click="handleTestEvent">
              Test event
            </NuxtButton>
          </template>
        </NuxtCard>
      </div>
    </NuxtContainer>
  </section>
</template>

<script setup lang="ts">
import type { DataLayerObject } from '@gtm-support/vue-gtm'

interface CustomDataLayerObject extends DataLayerObject {
  target?: string | null
}

const gtm = useGtm()

const search = ref<string>('')

const isEnabled = computed(() => {
  return gtm?.enabled()
})

const datalayer = computed((): CustomDataLayerObject[] => {
  if (gtm) {
    const result = gtm.dataLayer()

    if (result) {
      return result
    }
  }
  return []
})

const filteredEvents = computed(() => {
  if (search.value) {
    return datalayer.value.filter(x => x.event?.toLowerCase().includes(search.value.toLowerCase()))
  } else {
    return datalayer.value
  }
})

/**
 * Send a test event using the underlying
 * GTM datalayer container
 */
function handleTestEvent() {
  if (gtm) {
    gtm.trackEvent({ event: 'Test click', action: 'click', value: 'Nuxt' })
  }
}
</script>
