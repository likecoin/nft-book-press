<template>
  <div class="flex flex-col items-stretch gap-4">
    <template v-if="bookStoreApiStore.isAuthenticated">
      <div class="w-full flex items-center gap-[8px] justify-between">
        <UTooltip class="flex w-full" :text="wallet">
          <UButton
            class="text-xs font-mon"
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
import { getPortfolioURL, copyToClipboard } from '~/utils'
import { shortenWalletAddress } from '~/utils/cosmos'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { connect, disconnect, signMessageMemo } = store
const bookStoreApiStore = useBookStoreApiStore()
const { authenticate, clearSession } = bookStoreApiStore
const { isRestoringSession } = storeToRefs(bookStoreApiStore)

const toast = useToast()

const portfolioURL = computed(() => getPortfolioURL(wallet.value))

const isLoading = ref(false)

async function onClickAuth () {
  try {
    isLoading.value = true
    setupPostAuthRedirect()

    if (!wallet.value || !signer.value) {
      await connect()
    }
    if (!wallet.value || !signer.value) { return }
    const signature = await signMessageMemo(
      'authorize',
      ['read:nftbook', 'write:nftbook', 'read:nftcollection', 'write:nftcollection']
    )
    if (!signature) { return }
    await authenticate(wallet.value, signature)
  } catch (err) {
    disconnect()
    clearSession()
    // eslint-disable-next-line no-console
    console.error(err)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: (err as Error).toString(),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  } finally {
    isLoading.value = false
    clearPostAuthRedirect()
  }
}

function onClickDisconnect () {
  disconnect()
  clearSession()
}

function onClickCopy () {
  copyToClipboard(wallet.value)
}
</script>
