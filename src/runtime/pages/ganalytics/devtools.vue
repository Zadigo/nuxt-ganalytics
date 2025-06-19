<template>
  <div>
    This works

    {{ datalayer }}
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

let datalayer = null

onMounted(() => {
  datalayer = window.dataLayer
})
</script>
