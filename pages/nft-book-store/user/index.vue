<template>
  <div>
    <h1>Stripe Connect status</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="bookStoreApiStore.isAuthenticated">
      <h2>Current status</h2>
      <table style="margin-bottom: 24px;">
        <tr>
          <td>Setup initiated</td>
          <td>Setup completed</td>
        </tr>
        <tr>
          <td>{{ connectStatus?.hasAccount || false }}</td>
          <td>{{ connectStatus?.isReady || false }}</td>
        </tr>
      </table>
      <div v-if="connectStatus?.isReady">
        <button @click="onLoginToStripe">
          Login to Stripe account
        </button>
      </div>
      <div v-else>
        <button @click="onSetupStripe">
          Setup Stripe Payment Recipient Account
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { LIKE_CO_API } from '~/constant'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const { wallet } = storeToRefs(walletStore)
const { token } = storeToRefs(bookStoreApiStore)

const error = ref('')
const isLoading = ref(false)
const connectStatus = ref<any>({})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(async () => {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    connectStatus.value = (data.value as any) || {}
  } catch (e) {
    console.error(e)
    error.value = e.toString()
  } finally {
    isLoading.value = false
  }
})

async function onLoginToStripe () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/login`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (fetchError.value) {
      throw new Error(fetchError.value.toString())
    }
    const url = (data.value as any).url
    if (url) {
      window.location.href = url
    } else {
      throw new Error('CANNOT_GET_STRIPE_CONNECT_RUL')
    }
  } catch (e) {
    console.error(e)
    error.value = e.toString()
  } finally {
    isLoading.value = false
  }
}

async function onSetupStripe () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/new`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (fetchError.value) {
      throw new Error(fetchError.value.toString())
    }
    const url = (data.value as any).url
    if (url) {
      window.location.href = url
    } else {
      throw new Error('CANNOT_GET_STRIPE_CONNECT_RUL')
    }
  } catch (e) {
    console.error(e)
    error.value = e.toString()
  } finally {
    isLoading.value = false
  }
}

</script>
