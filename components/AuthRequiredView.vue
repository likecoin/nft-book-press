<template>
  <PageBody
    v-if="!bookStoreApiStore.isAuthenticated"
    :ui="{ base: 'flex justify-center items-center grow' }"
  >
    <div class="flex flex-col items-center gap-[24px]">
      <UAlert
        icon="i-heroicons-light-bulb"
        color="amber"
        variant="subtle"
        title="Sign in required"
        description="Please sign in to continue."
        :ui="{ wrapper: 'w-auto', inner: 'w-auto', title: 'font-bold' }"
      />
      <UButton
        class="block lg:hidden"
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
  </PageBody>
  <slot v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const bookStoreApiStore = useBookStoreApiStore()
const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { connect, disconnect, signMessageMemo } = store
const { authenticate, clearSession } = bookStoreApiStore
const { isRestoringSession } = storeToRefs(bookStoreApiStore)
const toast = useToast()

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
</script>
