<template>
  <main class="space-y-4">
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UCard
      v-if="bookStoreApiStore.isAuthenticated"
      :ui="{
        header: { base: 'flex justify-between items-center' },
        body: { padding: '' },
        footer: { base: 'text-center' },
      }"
    >
      <template #header>
        <h1 class="text-center font-bold font-mono">
          Stripe Connect Status
        </h1>

        <UTooltip
          text="Refresh Status"
          :popper="{ placement: 'left' }"
        >
          <UButton
            icon="i-heroicons-arrow-path"
            variant="outline"
            :disabled="isLoading"
            @click="loadStripeConnectStatus"
          />
        </UTooltip>
      </template>

      <UTable
        :columns="[
          { key: 'initiated', label: 'Setup Initiated' },
          { key: 'completed', label: 'Setup Completed' }
        ]"
        :rows="[{
          initiated: connectStatus?.hasAccount || false,
          completed: connectStatus?.isReady || false
        }]"
        :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' } }"
      >
        <template #initiated-data="{ row }">
          <UBadge v-if="row.initiated" label="Yes" color="green" variant="outline" />
          <UBadge v-else label="No" color="red" variant="outline" />
        </template>
        <template #completed-data="{ row }">
          <UBadge v-if="row.completed" label="Yes" color="green" variant="outline" />
          <UBadge v-else label="No" color="red" variant="outline" />
        </template>
      </UTable>

      <template #footer>
        <UButton
          v-if="isLoading"
          label="Loading"
          size="lg"
          :loading="true"
          @click="onLoginToStripe"
        />
        <UButton
          v-else-if="connectStatus?.isReady"
          label="Login to Stripe account"
          size="lg"
          @click="onLoginToStripe"
        />
        <UButton
          v-else
          label="Setup Stripe Payment Recipient Account"
          size="lg"
          @click="onSetupStripe"
        />
      </template>
    </UCard>
  </main>
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

async function loadStripeConnectStatus () {
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
    error.value = (e as Error).toString()
  } finally {
    isLoading.value = false
  }
}

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
      window.open(url)
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
      window.open(url)
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
