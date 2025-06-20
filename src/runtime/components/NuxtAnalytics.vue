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
import { dataLayerObject } from '#imports'
import type { EventNames, EventParameters } from '../types'

interface Props {
  event: EventNames
  params: EventParameters
}

const ganalyticsEl = useTemplateRef<HTMLElement>('ganalyticsEl')
const props = defineProps<Props>()
const emit = defineEmits<{ 'ga-event': [ data: ReturnType<typeof dataLayerObject>  | undefined ] }>()

const { sendEvent } = useAnalyticsEvent()

const defaultAttrs = computed(() => {
  return {
    sendTemplateEvent () {
      // FIXME: There is a type mismatch here, need to fix it
      // sendEvent returns type void????
      const parsedResult = sendEvent(defineEvent(props.event, props.params))
      emit('ga-event', parsedResult)
    }
  }
})
</script>
