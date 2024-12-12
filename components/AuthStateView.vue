<template>
  <div class="flex flex-col items-stretch gap-4">
    <template v-if="bookStoreApiStore.isAuthenticated">
      <div class="w-full flex items-center gap-[8px] justify-between">
        <UTooltip class="flex w-full" :text="wallet">
          <UButton
            class="text-xs font-mono"
            :label="shortenWalletAddress(wallet)"
            :to="portfolioURL"
            variant="soft"
            block
            target="_blank"
          />
        </UTooltip>
        <UTooltip text="Copy address">
          <UButton
            icon="i-heroicons-document-duplicate"
            size="sm"
            square
            variant="soft"
            @click="onClickCopy"
          />
        </UTooltip>
      </div>

      <UButton
        label="Sign out"
        icon="i-heroicons-arrow-left-on-rectangle"
        color="primary"
        variant="outline"
        size="lg"
        block
        @click="onClickDisconnect"
      />
    </template>
    <UButton
      v-else
      label="Sign in"
      icon="i-heroicons-arrow-right-on-rectangle"
      color="primary"
      size="lg"
      :loading="isLoading"
      :disabled="isRestoringSession"
      block
      @click="onClickAuth"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { getPortfolioURL, copyToClipboard } from '~/utils/index'
import { shortenWalletAddress } from '~/utils/cosmos'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useAuth } from '~/composables/useAuth'

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { disconnect } = store
const bookStoreApiStore = useBookStoreApiStore()
const { clearSession } = bookStoreApiStore
const { isRestoringSession } = storeToRefs(bookStoreApiStore)
const { isLoading, onClickAuth } = useAuth()

const portfolioURL = computed(() => getPortfolioURL(wallet.value))

function onClickDisconnect () {
  disconnect()
  clearSession()
}

function onClickCopy () {
  copyToClipboard(wallet.value)
}
</script>
