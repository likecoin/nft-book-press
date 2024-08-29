<template>
  <PageContainer :key="route.path">
    <PageHeader :class="{ hidden: isHeaderHidden }" title="NFT Book Store Management Page" />

    <PageBody
      v-if="!wallet || !bookStoreApiStore.isAuthenticated"
      :ui="{ base: 'flex justify-center items-center grow' }"
    >
      <UCard :ui="{ body: { base: 'flex items-center gap-2' } }">
        <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
        <h2 class="text-lg font-medium">
          Please sign in to continue
        </h2>
      </UCard>
    </PageBody>
    <NuxtPage v-else />
  </PageContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'

const route = useRoute()
const bookStoreApiStore = useBookStoreApiStore()
const store = useWalletStore()
const { wallet } = storeToRefs(store)

const isHeaderHidden = computed(() => route.query.print === '1')
</script>
<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
