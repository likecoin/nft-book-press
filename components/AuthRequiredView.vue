<template>
  <PageBody
    v-if="!wallet || !bookStoreApiStore.isAuthenticated"
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
import { storeToRefs } from 'pinia'

import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'

const bookStoreApiStore = useBookStoreApiStore()
const store = useWalletStore()
const { wallet } = storeToRefs(store)
</script>
