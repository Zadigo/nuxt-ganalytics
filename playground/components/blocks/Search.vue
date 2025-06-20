<template>
  <div class="flex justify-start items-center gap-2 col-span-11">
    <NuxtInput v-model="value.search" icon="lucide:search" size="lg" placeholder="Search datalayer..." />
    <NuxtCheckbox v-model="value.onlyAnalytics" label="Only GA4" />
    <NuxtCheckbox v-model="value.onlyGtm" label="Only GTM" />

    <NuxtButton color="info" @click="() => { props.modelValue.showList = !props.modelValue.showList}">
      <Icon v-if="props.modelValue.showList" name="lucide:file-json" />
      <Icon v-else name="lucide:list" />
    </NuxtButton>
  </div>
</template>

<script setup lang="ts">
import type { SearchParams } from '~/types'

const props = defineProps<{ modelValue: SearchParams }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: SearchParams): void
}>()

const value = useVModel(props, 'modelValue', emit, {
  defaultValue: {
    search: '',
    onlyAnalytics: false,
    onlyGtm: false,
    showList: true
  }
})
</script>
