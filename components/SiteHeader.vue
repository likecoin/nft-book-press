<template>
  <header
    :class="[
      'shadow-md',
      'dark:shadow-none',
      'dark:border-b',
      'border-b-like-green-600',
      'print:hidden',
      { 'hidden': isHidden }
    ]"
  >
    <UContainer class="flex justify-between items-center gap-4 py-4">
      <h1 class="flex items-center">
        <UButton
          class="font-bold"
          variant="ghost"
          label="LikeCoin NFT Book Press"
          :to="{ name: 'index' }"
        />
        <UBadge
          v-if="IS_TESTNET"
          label="TESTNET"
          variant="subtle"
          color="amber"
          size="xs"
          :ui="{ rounded: 'rounded-full', font: 'font-mono' }"
        />
      </h1>

      <div class="flex items-center gap-2">
        <WalletHeader class="max-lg:hidden" />
        <ColorModeButton class="max-lg:hidden" />
        <UButton
          class="lg:hidden"
          icon="i-heroicons-bars-3"
          variant="ghost"
          @click="uiStore.toggleSiteMenuOpen"
        />
      </div>
    </UContainer>

    <!-- Mobile menu -->
    <nav class="lg:hidden">
      <USlideover v-model="isSiteMenuOpen" class="lg:hidden">
        <UCard
          class="flex flex-col flex-1"
          :ui="{
            body: { base: 'flex-1' },
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <WalletHeader />
          </template>

          <SiteMenu @click-link="uiStore.toggleSiteMenuOpen" />

          <template #footer>
            <ColorModeButton />
          </template>
        </UCard>
      </USlideover>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { IS_TESTNET } from '~/constant'

import { useUIStore } from '~/stores/ui'

const route = useRoute()

const uiStore = useUIStore()

const isHidden = computed(() => route.query.print === '1')

const isSiteMenuOpen = computed({
  get () {
    return uiStore.isSiteMenuOpen
  },
  set (value: boolean) {
    uiStore.setSiteMenuOpen(value)
  }
})
</script>
