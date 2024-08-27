<template>
  <PageBody>
    <h1 class="text-lg font-bold font-mono">
      NFT Book Physical Good shipping status "{{ nftClassName || classId }}"
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

    <UCard
      v-if="bookStoreApiStore.isAuthenticated"
      :ui="{ footer: { base: 'space-y-4' } }"
    >
      <template #header>
        <h3 class="font-bold font-mono">
          Order status
        </h3>
      </template>

      <UCard :ui="{ body: { padding: '' } }">
        <table class="divide-y w-full">
          <tr>
            <th class="text-left px-4 py-3">
              Buyer Email
            </th><td class="px-4 py-3">
              {{ orderInfo.email }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Buyer Phone Number
            </th><td class="px-4 py-3">
              {{ orderInfo.phone }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Reader Email
            </th><td class="px-4 py-3">
              {{ orderInfo.giftInfo?.toEmail || orderInfo.email }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Shipping Status
            </th><td class="text-left px-4 py-3">
              {{ orderInfo.shippingStatus }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Shipping cost paid
            </th><td class="text-left px-4 py-3">
              {{ orderInfo.shippingCost }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Buyer Wallet
            </th><td class="text-left px-4 py-3 font-mono text-sm">
              {{ orderInfo.wallet }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Price Name
            </th><td class="text-left px-4 py-3">
              {{ orderInfo.priceName }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Price
            </th><td class="text-left px-4 py-3">
              {{ orderInfo.price }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Quantity
            </th><td class="text-left px-4 py-3">
              {{ orderInfo.quantity }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Buyer message
            </th><td class="text-left px-4 py-3">
              {{ orderInfo.message }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Sales channel
            </th><td class="text-left px-4 py-3">
              {{ orderInfo.from }}
            </td>
          </tr>
        </table>
      </UCard>

      <UCard v-if="orderInfo.shippingDetails?.address">
        <template #header>
          <h3 class="text-sm font-bold font-mono">
            Shipping Details
          </h3>
        </template>
        <table class="divide-y w-full">
          <tr v-if="orderInfo.shippingDetails?.name">
            <td class="text-left px-4 py-3">
              Name
            </td>
            <td class="text-left px-4 py-3">
              {{ orderInfo.shippingDetails.name }}
            </td>
          </tr>
          <tr v-for="[key, value] in Object.entries(orderInfo.shippingDetails?.address)" :key="key">
            <td class="text-left px-4 py-3">
              {{ key }}
            </td>
            <td class="text-left px-4 py-3">
              {{ value }}
            </td>
          </tr>
        </table>
      </UCard>

      <template #footer>
        <UFormGroup label="Enter shipping information and message emailed to buyer">
          <UTextarea
            v-model="message"
            :disabled="isShipped"
            placeholder="shipping tracking ID, ETA..."
          />
        </UFormGroup>
        <UButton
          label="Set as Shipped and send email"
          :disabled="isSendButtonDisabled"
          @click="onSetShipped"
        />
      </template>
    </UCard>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'

const bookStoreApiStore = useBookStoreApiStore()
const { token } = storeToRefs(bookStoreApiStore)

const nftStore = useNftStore()
const { lazyFetchClassMetadataById } = nftStore

const route = useRoute()
const router = useRouter()

const error = ref('')
const isLoading = ref(false)
const classId = ref(route.params.classId as string)
const paymentId = ref(route.query.payment_id as string)
const message = ref('')
const orderInfo = ref<any>({})

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)
const isSendButtonDisabled = computed(() => isShipped.value || !message.value || isLoading.value)
const isShipped = computed(() => orderInfo.value.shippingStatus === 'shipped')

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(async () => {
  const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/status/${paymentId.value}`,
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
    orderInfo.value = (data.value as any)
    if (orderInfo.value.shippingMessage) {
      message.value = orderInfo.value.shippingMessage
    }
  }
  lazyFetchClassMetadataById(classId.value as string)
})

async function onSetShipped () {
  if (isSendButtonDisabled.value) { return }
  try {
    isLoading.value = true

    const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/shipping/sent/${paymentId.value}`,
      {
        method: 'POST',
        body: { message: message.value },
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    if (fetchError.value) {
      throw fetchError.value
    }
    router.push({
      name: 'nft-book-store-status-classId',
      params: {
        classId: classId.value
      }
    })
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

</script>
