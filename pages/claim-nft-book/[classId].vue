<template>
  <div>
    <h1>Claim your NFT Book</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="isDone">
      Your wallet is recorded and the NFT book will been sent to you once its ready.
    </section>
    <section v-else>
      <p><label>Your Wallet</label></p>
      <input v-model="walletInput" placeholder="like1....">
      <button :disabled="isLoading" @click="connect">
        Connect Keplr
      </button>
      <p><label>Message to creator (optional)</label></p>
      <input v-model="buyerMessage">
      <button :disabled="isLoading" @click="onSubmit">
        Submit
      </button>
    </section>
  </div>
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
