<template>
  <ClientOnly>
    <div ref="ganalyticsEl" data-id="ganalytics-container">
      <slot :attrs="defaultAttrs" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useCounter, useDebounceFn } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import { useAnalyticsEvent } from '../composables'
import { dataLayerObject, defineAnalyticsEvent } from '../utils'

import type { EventNames, EventParameters } from '../types'

interface Props {
  event: EventNames
  params: EventParameters
  debounce?: number
}

const ganalyticsEl = useTemplateRef<HTMLElement>('ganalyticsEl')
const props = withDefaults (defineProps<Props>(), { debounce: 0 })
const emit = defineEmits<{ 'ga-event': [ data: ReturnType<typeof dataLayerObject>  | undefined ] }>()

const { sendEvent } = useAnalyticsEvent()
const { inc: increment, count } = useCounter()

/**
 * Funtion that wraps `sendEvent` in order to send events
 * directly from the template.
 */
async function sendTemplateEvent () {
  const parsedResult = await sendEvent(defineAnalyticsEvent(props.event, props.params))
  increment(1)
  emit('ga-event', parsedResult)
}

const debouncedSendTemplateEvent = useDebounceFn(sendTemplateEvent, props.debounce)

const defaultAttrs = computed(() => {
  return {
    count,
    sendTemplateEvent: debouncedSendTemplateEvent
  }
})
</script>
