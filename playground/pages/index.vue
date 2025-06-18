<template>
  <section id="site">
    <NuxtContainer>
      <div class="max-w-xl mx-auto my-20">
        <GtmCard v-if="showGtm" />
        <AnalyticsCard v-else />
      </div>
    </NuxtContainer>
  </section>
</template>

<script setup lang="ts">
const showGtm = ref<boolean>(false)
</script>
