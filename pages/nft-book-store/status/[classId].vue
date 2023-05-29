<template>
  <div>
    <h1>NFT Book Status {{ classId }}</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="bookStoreApiStore.isAuthenticated">
      <h3>Status</h3>
      <table>
        <tr>
          <td>Price in USD</td>
          <td>Pending action</td>
          <td>Sold</td>
          <td>Remaining Stock</td>
        </tr>
        <tr>
          <td>{{ classListingInfo.prices?.map((p: any) => p.price).join(', ') }}</td>
          <td>{{ classListingInfo.pendingNFTCount }}</td>
          <td>{{ classListingInfo.sold }}</td>
          <td>{{ classListingInfo.stock }}</td>
        </tr>
      </table>
      <h3>Orders</h3>
      <table>
        <tr>
          <td>email</td>
          <td>status</td>
          <td>wallet</td>
          <td>buyer message</td>
          <td>sales channel</td>
          <td>Action</td>
        </tr>
        <tr v-for="p in purchaseList" :key="p.classId">
          <td>{{ p.email }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.wallet }}</td>
          <td>{{ p.message }}</td>
          <td>{{ p.from }}</td>
          <td>
            <NuxtLink
              v-if="p.status === 'pendingNFT'"
              :to="{
                name: 'nft-book-store-send-classId',
                params: {
                  classId: p.classId
                },
                query: {
                  payment_id: p.id
                }
              }"
            >
              Send NFT
            </NuxtLink>
            <a v-else-if="p.status === 'completed'" :href="`${chainExplorerURL}/${p.txHash}`" target="_blank">
              View Transaction
            </a>
            <span v-else>
              -
            </span>
          </td>
        </tr>
      </table>
      <h3>Sales Channel Summary</h3>
      <table>
        <tr>
          <td>Channel ID</td>
          <td>Count</td>
          <td>USD</td>
        </tr>
        <tr v-for="[key, value] in Object.entries(salesChannelMap)" :key="key">
          <td>{{ key }}</td>
          <td>{{ value.count }}</td>
          <td>{{ value.totalUSD }}</td>
        </tr>
      </table>
      <hr>
      <h3>Copy Purchase Link</h3>
      <p>
        <label>Price (Required)</label>
        <select v-model="priceIndex">
          <option v-for="p, i in classListingInfo?.prices" :key="p.price" :value="i">
            {{ `${p.name} - ${p.price}` }}
          </option>
        </select>
      </p>
      <p>
        <label>Sales channel for this link (Optional)</label>
        <input v-model="fromChannel" placeholder="Channel ID">
      </p>
      <br>
      <a :href="purchaseLink" target="_blank">
        {{ purchaseLink }}
      </a>
      <br>
      <button @click="copyPurchaseLink">Copy Purchase Link</button>
      <hr>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CHAIN_EXPLORER_URL, IS_TESTNET, LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'

const bookStoreApiStore = useBookStoreApiStore()
const { token } = storeToRefs(bookStoreApiStore)

const route = useRoute()

const error = ref('')
const isLoading = ref(false)
const classId = ref(route.params.classId)
const fromChannel = ref<string | undefined>(undefined)
const priceIndex = ref(0)
const classListingInfo = ref<any>({})
const purchaseList = ref<any[]>([])
const chainExplorerURL = CHAIN_EXPLORER_URL

const purchaseLink = computed(() => {
  const payload: Record<string, string> = {
    from: fromChannel.value || '',
    price_index: priceIndex.value.toString()
  }
  const queryString = `?${new URLSearchParams(payload).toString()}`
  return `https://api.${IS_TESTNET ? 'rinkeby.' : ''}like.co/likernft/book/purchase/${classId.value}/new${queryString}`
})
const salesChannelMap = computed(() => {
  if (!purchaseList.value.length) {
    return {}
  }
  const map: {
    [key in string]: {
      count: number,
      totalUSD: number
    };
  } = purchaseList.value.reduce((acc, cur) => {
    const from = cur.from || '(empty)'
    if (!acc[from]) {
      acc[from] = {
        count: 0,
        totalUSD: 0
      }
    }
    acc[from].count += 1
    acc[from].totalUSD += cur.price
    return acc
  }, {})
  return map
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(async () => {
  try {
    const { data: classData, error: classFetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    if (classFetchError.value) {
      throw classFetchError.value
    }
    classListingInfo.value = classData.value
    const { data: ordersData, error: fetchOrdersError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/orders`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    if (fetchOrdersError.value) {
      if (fetchOrdersError.value.statusCode === 403) {
        throw new Error('NOT_OWNER_OF_NFT_CLASS')
      } else {
        throw fetchOrdersError.value
      }
    }
    purchaseList.value = (ordersData.value as any).orders
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  }
})

async function copyPurchaseLink () {
  await navigator.clipboard.writeText(purchaseLink.value)
}

</script>
