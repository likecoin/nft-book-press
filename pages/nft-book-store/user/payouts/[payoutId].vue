<template>
  <PageBody class="space-y-10 pb-10">
    <div class="flex justify-between gap-4">
      <h1 class="text-lg font-bold font-mono flex-wrap">
        Payout Details - {{ payoutId }}
      </h1>
    </div>

    <UProgress v-if="isLoading" animation="carousel">
      <template #indicator>
        Loading...
      </template>
    </UProgress>

    <UCard
      v-if="bookStoreApiStore.isAuthenticated"
      :ui="{ body: { padding: '' } }"
    >
      <template #header>
        <h3 class="font-bold font-mono">
          Payout Information
        </h3>
      </template>

      <UTable
        :columns="[
          { key: 'id', label: 'ID' },
          { key: 'createdTs', label: 'Created' },
          { key: 'currency', label: 'Currency' },
          { key: 'amount', label: 'Payout Amount' },
          { key: 'status', label: 'Status' },
          { key: 'arrivalTs', label: 'Arrived' },
        ]"
        :rows="payoutDataRows"
        :loading="isLoading"
        :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' } }"
      />
    </UCard>

    <UCard :ui="{ body: { padding: '' } }">
      <template #header>
        <h3 class="text-sm font-bold font-mono">
          Payout Commission Item Details
        </h3>
      </template>
      <UTable
        :columns="[
          { key: 'commissionId', label: 'Commission ID' },
          { key: 'createdTs', label: 'Created' },
          { key: 'currency', label: 'Currency' },
          { key: 'amount', label: 'Commission Amount' },
          { key: 'description', label: 'Description' },
          { key: 'status', label: 'Status' },
          { key: 'metadata', label: 'Metadata' },
        ]"
        :rows="payoutItemRows"
        :loading="isLoading"
        :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' } }"
      >
        <template #metadata-data="{ row }">
          <UButton
            label="View"
            color="gray"
            @click="modalMetadata = row.metadata"
          />
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalMetadataOpen">
      <UCard
        :ui="{
          header: { base: 'flex items-center justify-between gap-2' },
          body: { base: 'overflow-auto text-sm' }
        }"
      >
        <template #header>
          <h4 class="font-mono font-bold" v-text="'Metadata'" />

          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            square
            padded
            @click="isModalMetadataOpen = false"
          />
        </template>

        <pre v-text="modalMetadata" />
      </UCard>
    </UModal>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const { LIKE_CO_API } = useRuntimeConfig().public
const bookStoreApiStore = useBookStoreApiStore()
const { token } = storeToRefs(bookStoreApiStore)

const route = useRoute()
const payoutData = ref<any>({})
const payoutItemDetails = ref<any>([])

const error = ref('')
const isLoading = ref(false)
const payoutId = ref(route.params.payoutId as string)

const modalMetadata = ref('')
const isModalMetadataOpen = computed({
  get: () => !!modalMetadata.value,
  set: (value) => {
    if (!value) {
      modalMetadata.value = ''
    }
  }
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

const payoutDataRows = computed(() => {
  if (!payoutData.value) { return [] }
  const {
    id,
    createdTs,
    amount,
    status,
    currency,
    arrivalTs
  } = payoutData.value
  return [
    {
      id,
      createdTs: new Date(createdTs * 1000).toLocaleString(),
      amount: formatNumberWithCurrency(amount / 100, currency),
      status,
      currency: formatCurrency(currency),
      arrivalTs: arrivalTs ? new Date(arrivalTs * 1000).toLocaleString() : ''
    }
  ]
})

const payoutItemRows = computed(() => {
  return payoutItemDetails.value.map((row: any) => {
    const {
      commissionId,
      createdTs,
      amount,
      currency,
      description,
      status,
      metadata
    } = row
    return {
      commissionId,
      createdTs: new Date(createdTs * 1000).toLocaleString(),
      amount: formatNumberWithCurrency(amount / 100, currency),
      currency: formatCurrency(currency),
      description,
      status,
      metadata: JSON.stringify(metadata, null, 2)
    }
  })
})

onMounted(async () => {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/payouts/${payoutId.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    if (fetchError.value) {
      if (fetchError.value.statusCode === 403) {
        error.value = 'NOT_OWNER_OF_NFT_CLASS'
      } else {
        error.value = fetchError.value.toString()
      }
    } else {
      payoutData.value = (data.value as any)
      if (payoutData.value.items) {
        payoutItemDetails.value = payoutData.value.items
      }
    }
  } finally {
    isLoading.value = false
  }
})
</script>
