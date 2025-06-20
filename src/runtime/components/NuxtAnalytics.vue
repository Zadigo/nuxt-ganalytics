<template>
  <ClientOnly>
    <div ref="ganalyticsEl" data-id="ganalytics-item">
      <slot :attrs="defaultAttrs" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineEvent, useAnalyticsEvent } from '#imports'
import { computed, useTemplateRef } from 'vue'
import type { EventNames, EventParameters, GAnalyticsDatalayerObject } from '../types'

interface Props {
  event: EventNames
  params: EventParameters
}

const ganalyticsEl = useTemplateRef('ganalyticsEl')
const props = defineProps<Props>()
const emit = defineEmits<{ 'ga-event': [ data: GAnalyticsDatalayerObject | undefined ] }>()

const { sendEvent } = useAnalyticsEvent()

const defaultAttrs = computed(() => {
  return {
    sendTemplateEvent () {
      const parsedResult = sendEvent(defineEvent(props.event, props.params))
      emit('ga-event', parsedResult)
    }
  }
})
</script>
