<template>
  <div class="border border-slate-100 rounded-md h-[300px] overflow-y-scroll first:rounded-tl-md firt:rounded-tr-md last:rounded-bl-md last:rounded:br-md not-last:border-b not-last:border-b-slate-100">
      <div v-for="(item, i) in items" :key="i" class="p-3 transition-all ease-in-out hover:bg-slate-100 flex items-center space-x-3">
        <Icon :name="`lucide:${getEventIcon(item[0])}`" class="text-blue-400 text-2xl" />
        <span class="font-normal">
          {{ item }}
        </span>
      </div>
    </div>
</template>t

<script setup lang="ts">
import type { TagCommand } from '#ganalytics/types'

defineProps<{
  items: string[]
}>()

/**
 * The icon for the event based on the command name
 * @param name The name of the command
 */
function getEventIcon(name: TagCommand) {
  const icons: Record<TagCommand, string> = {
    'js': 'code-xml',
    'config': 'settings',
    'event': 'mouse-pointer-click',
    'set': 'text-cursor-input'
  }
  const icon = icons[name]

  if (icon) {
    return icon
  } else {
    return 'lucide:loader'
  }
}
</script>
