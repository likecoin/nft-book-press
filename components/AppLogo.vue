<template>
  <NuxtLink to="/my-books" class="inline-block">
    <img
      src="~/assets/images/3ook-store.png"
      alt="3ook.com Logo"
      :style="`height: ${props.height}px`"
      class="h-auto max-w-full rounded-md"
    >
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  height: {
    type: Number,
    default: 40
  }
})
</script>
