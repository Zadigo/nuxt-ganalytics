<template>
  <ClientOnly>
    <div ref="ganalyticsEl" data-id="ganalytics-container">
      <slot :attrs="defaultAttrs" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineEvent, useAnalyticsEvent, useCounter, useDebounceFn } from '#imports'
import { computed, useTemplateRef, withDefaults } from 'vue'
import { dataLayerObject } from '#imports'
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
 * Method to send a Google Analytics event with 
 * the specified parameters
 */
async function sendTemplateEvent () {
  const parsedResult = sendEvent(defineEvent(props.event, props.params))
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

// onMounted(() => {
//   console.log(ganalyticsEl.value)
//   if (ganalyticsEl.value) {
//     console.log(ganalyticsEl.value)
//     // const children = ganalyticsEl.value.children
//     // console.log('NuxtAnalytics', children)

//     // if (children.length > 1) {
//     //   console.warn('NuxtAnalytics: Only one child element is allowed inside the NuxtAnalytics component.')
//     // } else if (children.length === 1) {
//     //   const child = children[0]
//     //   if (child instanceof HTMLElement) {
//     //     child.setAttribute('data-id', 'ganalytics-item')
//     //   }
//     // } else {
//     //   console.warn('NuxtAnalytics: No child element found inside the NuxtAnalytics component.')
//     // }
//   }
// })
</script>
