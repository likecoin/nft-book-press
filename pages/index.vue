<template>
  <main class="flex flex-col justify-center items-center py-44">
    <div class="space-y-4">
      <div class="text-primary text-3xl font-bold font-mono">
        🎉 Welcome!
      </div>
      <SiteMenu :is-large="true" />
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'page' })
</script>
