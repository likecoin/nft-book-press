<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-if="wallet">
      <UTooltip :text="wallet">
        <UButton
          class="text-xs font-mono"
          :label="shortenWalletAddress(wallet)"
          :to="portfolioURL"
          variant="soft"
          target="_blank"
        />
      </UTooltip>
      <UButton
        label="Disconnect Wallet"
        icon="i-heroicons-arrow-left-on-rectangle"
        color="primary"
        variant="outline"
        @click="onClickDisconnect"
      />
    </template>
    <UButton
      v-else
      label="Connect Wallet"
      icon="i-heroicons-arrow-right-on-rectangle"
      color="primary"
      @click="connect"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { getPortfolioURL } from '~/utils'
import { shortenWalletAddress } from '~/utils/cosmos'

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { connect, disconnect } = store

const portfolioURL = computed(() => getPortfolioURL(wallet.value))

onMounted(async () => {
  try {
    const payload = window.localStorage.getItem('likecoin_nft_book_press_token')
    if (payload) {
      const { wallet: storedWallet } = JSON.parse(payload)
      if (storedWallet) { await connect() }
    }
  } catch {}
})

function onClickDisconnect () {
  disconnect()
  window.localStorage.removeItem('likecoin_nft_book_press_token')
}
</script>
