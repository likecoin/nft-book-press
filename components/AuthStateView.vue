<template>
  <div class="flex flex-col items-stretch gap-4">
    <template v-if="bookStoreApiStore.isAuthenticated">
      <UTooltip :text="wallet">
        <UButton
          class="text-xs font-mono"
          :label="shortenWalletAddress(wallet)"
          :to="portfolioURL"
          variant="soft"
          block
          target="_blank"
        />
      </UTooltip>
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
      block
      @click="onClickAuth"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { getPortfolioURL } from '~/utils'
import { shortenWalletAddress } from '~/utils/cosmos'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { connect, disconnect, signMessageMemo } = store
const bookStoreApiStore = useBookStoreApiStore()
const { authenticate } = bookStoreApiStore
const { token, wallet: sessionWallet } = storeToRefs(bookStoreApiStore)

const toast = useToast()

const portfolioURL = computed(() => getPortfolioURL(wallet.value))

const isLoading = ref(false)

async function onClickAuth () {
  try {
    isLoading.value = true
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
    try {
      window.localStorage.setItem('likecoin_nft_book_press_token', JSON.stringify({ wallet: sessionWallet.value, token: token.value }))
    } catch (err) {}
  } catch (err) {
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
  }
}

function onClickDisconnect () {
  disconnect()
  window.localStorage.removeItem('likecoin_nft_book_press_token')
}
</script>
