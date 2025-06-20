<template>
  <div class="py-5 space-x-2 flex">
    <NuxtAnalytics event="search" :params="{ search_term: 'My application' }">
      <template #default="{ attrs }">
        <NuxtButton @click="attrs.sendTemplateEvent()">
          Login
        </NuxtButton>
      </template>
    </NuxtAnalytics>
  </div>
</template>
