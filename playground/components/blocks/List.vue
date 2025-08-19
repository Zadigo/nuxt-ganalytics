<template>
  <div class="border border-slate-100 rounded-md h-[300px] overflow-x-scroll overflow-y-scroll first:rounded-tl-md firt:rounded-tr-md last:rounded-bl-md last:rounded:br-md not-last:border-b not-last:border-b-slate-100">
    <div v-for="(item, i) in items" :key="i" class="p-3 transition-all ease-in-out hover:bg-slate-100 grid grid-cols-6 auto-cols-min">
      <div class="col-span-1">
        <Icon :name="`lucide:${getEventIcon(item)}`" class="text-blue-400 text-2xl" />
      </div>

      <div class="col-span-1">
        <NuxtBadge v-if="item.category == 'ga4'" color="warning">
          {{ item.category.toUpperCase() }}
        </NuxtBadge>
        <NuxtBadge v-else color="success">
          {{ item.category.toUpperCase() }}
        </NuxtBadge>
      </div>

      <div class="font-normal text-nowrap col-span-4">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>t

<script setup lang="ts">
import type { EventClassificationCategory } from '#ganalytics/composables'
import type { GTMCommand, GA4EventCommand } from '#ganalytics/types'

defineProps<{
  items: EventClassificationCategory[]
}>()

/**
 * The icon for the event based on the command name
 * @param item The name of the command
 */
function getEventIcon(item: EventClassificationCategory): string {
  const icons: Record<GA4EventCommand | GTMCommand, string> = {
    'js': 'code-xml',
    'config': 'settings',
    'event': 'mouse-pointer-click',
    'set': 'text-cursor-input',
    'get': 'hand-helping',
    'consent': 'check-check',
    'gtm.dom': 'computer',
    'gtm.click': 'mouse-pointer-click',
    'gtm.consent': 'check-check',
    'gtm.formSubmit': 'form-input',
    'gtm.init': 'text-cursor-input',
    'gtm.js': 'code-xml',
    'gtm.linkClick': 'link',
    'gtm.load': 'loader',
    'gtm.start': 'text-cursor-input',
    'gtm.scrollDepth': 'mouse'
  }

  let icon

  if (item.category === 'ga4') {
    icon = icons[item.value[0]]
  } else {
    icon = icons[item.value.event]
  }

  return icon || 'circle-help'
}
</script>
