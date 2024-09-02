<template>
  <PageBody
    v-if="!bookStoreApiStore.isAuthenticated"
    :ui="{ base: 'flex justify-center items-center grow' }"
  >
    <UAlert
      icon="i-heroicons-light-bulb"
      color="amber"
      variant="subtle"
      title="Sign in required"
      description="Please sign in to continue."
      :ui="{ wrapper: 'w-auto', inner: 'w-auto', title: 'font-bold' }"
    />
  </PageBody>
  <slot v-else />
</template>

<script setup lang="ts">
import { useBookStoreApiStore } from '~/stores/book-store-api'

const bookStoreApiStore = useBookStoreApiStore()
</script>
