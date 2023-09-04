<template>
  <div>
    <h1>NFT Book Physical Good shipping status "{{ nftClassName || classId }}"</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="bookStoreApiStore.isAuthenticated">
      <h3>Order status</h3>
      <table>
        <tr><th>Buyer Email</th><td>{{ orderInfo.email }}</td></tr>
        <tr><th>Shipping Status</th><td>{{ orderInfo.shippingStatus }}</td></tr>
        <tr><th>Shipping cost paid</th><td>{{ orderInfo.shippingCost }}</td></tr>
        <tr><th>Buyer Wallet</th><td>{{ orderInfo.wallet }}</td></tr>
        <tr><th>Price Name</th><td>{{ orderInfo.priceName }}</td></tr>
        <tr><th>Price</th><td>{{ orderInfo.price }}</td></tr>
        <tr><th>Buyer message</th><td>{{ orderInfo.message }}</td></tr>
        <tr><th>Sales channel</th><td>{{ orderInfo.from }}</td></tr>
      </table>
      <div v-if="orderInfo.shippingDetails?.address">
        <h3>Shipping Details</h3>
        <table>
          <tr v-for="[key, value] in Object.entries(orderInfo.shippingDetails?.address)" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </table>
      </div>
      <div>
        <p><label>Enter shipping information and message emailed to buyer</label></p>
        <p><textarea v-model="message" placeholder="shipping tracking ID, ETA..." /></p>
      </div>
      <div>
        <button :disabled="isSendButtonDisabled" @click="onSetShipped">
          Set as Shipped and send email
        </button>
      </div>
    </section>
  </div>
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
const isSendButtonDisabled = computed(() => !message.value || isLoading.value)

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
