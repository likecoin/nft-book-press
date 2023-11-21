<template>
  <main class="space-y-4">
    <h1 class="text-lg font-bold font-mono">
      Claim your NFT Book
    </h1>

    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UProgress v-if="isLoading" animation="carousel">
      <template #indicator>
        Loading...
      </template>
    </UProgress>

    <UCard v-if="isDone">
      Your wallet is recorded and the NFT book will been sent to you once its ready.
    </UCard>
    <UCard v-else :ui="{ body: { base: 'space-y-4' } }">
      <UFormGroup label="Your Wallet">
        <div class="flex gap-2">
          <UInput
            v-model="walletInput"
            class="font-mono flex-grow"
            placeholder="like1...."
          />
          <UButton
            label="Connect Keplr"
            :disabled="isLoading"
            variant="outline"
            @click="connect"
          />
        </div>
      </UFormGroup>

      <UFormGroup label="Message to creator" hint="(optional)">
        <UInput v-model="buyerMessage" />
      </UFormGroup>

      <template #footer>
        <UButton
          label="Submit"
          :disabled="isLoading"
          @click="onSubmit"
        />
      </template>
    </UCard>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LIKE_CO_API } from '~/constant'
import { useWalletStore } from '~/stores/wallet'

definePageMeta({
  layout: 'page'
})
const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { connect } = store

const route = useRoute()

const error = ref('')
const isDone = ref(false)
const isLoading = ref(false)

const walletInput = ref(wallet.value)
const buyerMessage = ref('')

watch(wallet, (wallet) => {
  if (wallet) { walletInput.value = wallet }
})
watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})
const classId = computed(() => route.params.classId)
const paymentId = computed(() => route.query.payment_id)
const claimToken = computed(() => route.query.token)

async function onSubmit () {
  try {
    isLoading.value = true
    const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/claim/${paymentId.value}`, {
      method: 'POST',
      body: {
        paymentId: paymentId.value,
        wallet: walletInput.value,
        message: buyerMessage.value
      },
      query: {
        token: claimToken.value
      }
    })
    if (fetchError.value) {
      throw fetchError.value
    }
    isDone.value = true
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

</script>
