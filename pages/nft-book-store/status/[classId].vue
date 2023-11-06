<template>
  <div>
    <h1>NFT Book Status "{{ nftClassName || classId }}"</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="bookStoreApiStore.isAuthenticated">
      <h3>Editions</h3>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Name</th>
            <th>Price (USD)</th>
            <th v-if="userIsOwner">
              Sort
            </th>
            <th v-if="userIsOwner">
              Edit
            </th>
          </tr>
        </thead>
        <Draggable
          v-model="prices"
          tag="tbody"
          item-key="index"
          handle="td:last-child"
          :disabled="!userIsOwner || isUpdatingPricesOrder"
          @end="handlePriceReorder"
        >
          <template #item="{ element, index }">
            <tr>
              <td>{{ index + 1 }}</td>
              <td>{{ element.name }}</td>
              <td style="text-align: right;">
                {{ element.price }}
              </td>
              <td v-if="userIsOwner" style="text-align: center;cursor: grab">
                ::
              </td>
              <td>
                <NuxtLink
                  :to="{
                    name: 'nft-book-store-status-editingClassId-edit-editionIndex',
                    params: { editingClassId: classId, editionIndex: index }
                  }"
                >
                  ✏️
                </NuxtLink>
              </td>
            </tr>
          </template>
        </Draggable>
      </table>

      <template v-if="classListingInfo.shippingRates">
        <h3>Shipping Options</h3>
        <table>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Price (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(element, index) in classListingInfo.shippingRates" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ element.name }}</td>
              <td style="text-align: right;">
                {{ element.priceInDecimal / 100 }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <h3>Status</h3>
      <table>
        <tr>
          <th>Pending action</th>
          <th>Sold</th>
          <th>Remaining Stock</th>
        </tr>
        <tr>
          <td>{{ classListingInfo.pendingNFTCount }}</td>
          <td>{{ classListingInfo.sold }}</td>
          <td>{{ classListingInfo.stock }}</td>
        </tr>
      </table>
      <h3>Orders</h3>
      <table>
        <thead>
          <tr>
            <th>Buyer Email</th>
            <th>Status</th>
            <th>Order Date</th>
            <th v-if="orderHasShipping">
              Shipping Status
            </th>
            <th>Buyer Wallet</th>
            <th>Price Name</th>
            <th>Price</th>
            <th>Buyer message</th>
            <th>Sales channel</th>
            <th v-if="userCanSendNFT">
              Action
            </th>
          </tr>
        </thead>
        <tr v-for="p in purchaseList" :key="p.classId">
          <td>{{ p.email }}</td>
          <td>
            {{ p.status }}
            <button
              v-if="p.status === 'pendingNFT'"
              style="margin-top: 6px;"
              @click="hardSetStatusToCompleted(p)"
            >
              Mark Complete
            </button>
          </td>
          <td>{{ p.formattedDate }}</td>
          <td v-if="orderHasShipping">
            <NuxtLink
              v-if="p.shippingStatus === 'pending'"
              :to="{
                name: 'nft-book-store-send-shipping-classId',
                params: {
                  classId: p.classId
                },
                query: {
                  payment_id: p.id
                }
              }"
            >
              Pending, Handle Shipping
            </NuxtLink>
            <span v-else>
              {{ p.shippingStatus }}
            </span>
          </td>
          <td>{{ p.wallet }}</td>
          <td>{{ p.priceName }}</td>
          <td>{{ p.price }}</td>
          <td>{{ p.message }}</td>
          <td>{{ p.from }}</td>
          <td v-if="userCanSendNFT">
            <NuxtLink
              v-if="p.status === 'pendingNFT'"
              :to="{
                name: 'nft-book-store-send-classId',
                params: {
                  classId: p.classId
                },
                query: {
                  owner_wallet: ownerWallet,
                  payment_id: p.id
                }
              }"
            >
              Send NFT
            </NuxtLink>
            <a v-else-if="p.status === 'completed' && p.txHash" :href="`${chainExplorerURL}/${p.txHash}`" target="_blank">
              View Transaction
            </a>
            <span v-else>
              -
            </span>
          </td>
        </tr>
      </table>

      <hr>
      <div v-if="userIsOwner">
        <h3>Connect to your own Stripe Account</h3>
        <input v-model="isStripeConnectChecked" name="stripe" type="checkbox"><label>Use a Stripe Connect account for receiving all payment</label>
        <br>
        <template v-if="isStripeConnectChecked">
          <input v-model="stripeConnectWallet" type="radio" :disabled="!(connectStatus?.isReady)" :value="ownerWallet"><span v-if="connectStatus?.isReady">Use my account</span>
          <span v-else>
            No stripe account connected yet.
            <NuxtLink :to="{ name: 'nft-book-store-user' }" target="_blank">
              Create one here
            </NuxtLink>
          </span>
          <br>
          <input v-model="stripeConnectWallet" type="radio" :value="stripeConnectWalletInput"> Enter a wallet address with connected account:
          <input v-if="stripeConnectWallet !== ownerWallet" v-model="stripeConnectWalletInput" placeholder="like1..." @input="onStripeConnectWalletInput">
        </template>
      </div>

      <h3>Other Settings</h3>
      <p><label>Share sales data to wallets:</label></p>
      <table>
        <tr>
          <td>Wallet</td>
          <td v-if="userIsOwner">
            Send NFT grant Status
          </td>
          <td v-if="userIsOwner">
            Remove
          </td>
        </tr>
        <tr v-for="m, i in moderatorWallets" :key="m">
          <td>{{ m }}</td>
          <td v-if="userIsOwner">
            <NuxtLink :to="{ name: 'authz', query: { grantee: m } }" target="_blank">
              <span v-if="moderatorWalletsGrants[m]">
                Granted
              </span>
              <span v-else>
                Click to grant
              </span>
            </NuxtLink>
          </td>
          <td v-if="userIsOwner">
            <button @click="()=> moderatorWallets.splice(i, 1)">
              x
            </button>
          </td>
        </tr>
      </table>
      <input v-model="moderatorWalletInput" placeholder="like1..."><button style="margin-left: 4px" @click="addModeratorWallet">
        Add
      </button>
      <p><label>Email to receive sales notifications</label></p>
      <ul>
        <li v-for="e, i in notificationEmails" :key="e">
          {{ e }}<button style="margin-left: 4px" @click="() => notificationEmails.splice(i, 1)">
            x
          </button>
        </li>
      </ul>
      <input v-model="notificationEmailInput"><button style="margin-left: 4px" @click="addNotificationEmail">
        Add
      </button>
      <p>
        <button @click="updateSettings">
          Update
        </button>
      </p>
      <hr>
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
          <option v-for="p in classListingInfo?.prices" :key="p.index" :value="p.index">
            {{ `${p.name.en || p.name} - $${p.price}` }}
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
      <button @click="copyPurchaseLink">
        Copy Purchase Link
      </button>
      <hr>
      <h3>Purchase Link QRCode</h3>
      <QRCode
        :data="purchaseLink"
        :file-name="`${nftClassName || classId}-price_${priceIndex}-channel_${fromChannel || ''}`"
        :width="500"
        :height="500"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import { CHAIN_EXPLORER_URL, IS_TESTNET, LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useWalletStore } from '~/stores/wallet'
import { getNFTAuthzGrants } from '~/utils/cosmos'

const store = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const nftStore = useNftStore()
const { token } = storeToRefs(bookStoreApiStore)
const { wallet } = storeToRefs(store)
const { updateBookListingSetting } = bookStoreApiStore
const { lazyFetchClassMetadataById } = nftStore

const route = useRoute()

const error = ref('')
const isLoading = ref(false)
const classId = ref(route.params.classId)
const fromChannel = ref<string | undefined>(undefined)
const priceIndex = ref(0)
const classListingInfo = ref<any>({})
const prices = ref<any[]>([])
const isUpdatingPricesOrder = ref(false)
const ordersData = ref<any>({})
const connectStatus = ref<any>({})
const chainExplorerURL = CHAIN_EXPLORER_URL

const moderatorWallets = ref<string[]>([])
const moderatorWalletsGrants = ref<any>({})
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const stripeConnectWalletInput = ref('')

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)
const ownerWallet = computed(() => classListingInfo?.value?.ownerWallet)
const orderHasShipping = computed(() => purchaseList.value.find((p: any) => !!p.shippingStatus))
const userIsOwner = computed(() => wallet.value && ownerWallet.value === wallet.value)
const userCanSendNFT = computed(() => userIsOwner.value || (wallet.value && moderatorWalletsGrants.value[wallet.value]))
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
  } = purchaseList.value.reduce((acc: any, cur: any) => {
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

const purchaseList = computed(() => {
  if (ordersData.value?.orders) {
    return ordersData.value.orders.map((purchase: any) => {
      const timestamp = purchase.timestamp
      const date = new Date(timestamp)
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      return { ...purchase, formattedDate }
    }).sort((a: any, b: any) => b.timestamp - a.timestamp)
  }
  return []
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(moderatorWallets, (newModeratorWallets) => {
  newModeratorWallets.forEach(async (m) => {
    if (!moderatorWalletsGrants.value[m]) {
      try {
        moderatorWalletsGrants.value[m] = await getNFTAuthzGrants(ownerWallet.value, m)
      } catch {}
    }
  })
})

onMounted(async () => {
  isLoading.value = true
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
    prices.value = classListingInfo.value.prices
    const {
      moderatorWallets: classModeratorWallets,
      notificationEmails: classNotificationEmails,
      connectedWallets: classConnectedWallets
    } = classData.value as any
    moderatorWallets.value = classModeratorWallets
    notificationEmails.value = classNotificationEmails
    isStripeConnectChecked.value = !!(classConnectedWallets && Object.keys(classConnectedWallets).length)
    stripeConnectWallet.value = classConnectedWallets && Object.keys(classConnectedWallets)[0]
    if (stripeConnectWallet.value !== ownerWallet.value) {
      stripeConnectWalletInput.value = stripeConnectWallet.value
    }
    const { data: orders, error: fetchOrdersError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/orders`,
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

    ordersData.value = orders.value

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
    lazyFetchClassMetadataById(classId.value as string)
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
})

async function handlePriceReorder ({
  newIndex: newOrder,
  oldIndex: oldOrder
}: any) {
  if (newOrder === oldOrder) {
    return
  }
  try {
    isUpdatingPricesOrder.value = true
    const priceIndex = prices.value[newOrder].index
    const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}/price/${priceIndex}/order`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token.value}`
      },
      body: {
        order: newOrder
      }
    })
    if (fetchError.value && fetchError.value?.statusCode !== 200) {
      throw new Error(`${fetchError.value.data} ${fetchError.value.toString()}`)
    }
    prices.value = prices.value.map((p, order) => ({ ...p, order }))
    classListingInfo.value.prices = prices.value
  } catch (err) {
    prices.value = classListingInfo.value.prices
    error.value = (err as Error).toString()
  } finally {
    isUpdatingPricesOrder.value = false
  }
}

async function hardSetStatusToCompleted (purchase: any) {
  const userConfirmed = confirm('Do you want to skip the \'Send NFT\' action and override this payment status to \'completed\'?')
  if (!userConfirmed) {
    return
  }

  const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/sent/${purchase.id}`,
    {
      method: 'POST',
      body: { txHash: null },
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
  if (fetchError.value) {
    throw fetchError.value
  }
  purchase.status = 'completed'
  classListingInfo.value.pendingNFTCount -= 1
}

function addModeratorWallet () {
  moderatorWallets.value.push(moderatorWalletInput.value)
  moderatorWalletInput.value = ''
}

function addNotificationEmail () {
  notificationEmails.value.push(notificationEmailInput.value)
  notificationEmailInput.value = ''
}

function onStripeConnectWalletInput () {
  // force stripeConnectWallet to update when stripeConnectWalletInput is updated
  stripeConnectWallet.value = stripeConnectWalletInput.value.trim()
}

async function updateSettings () {
  try {
    if (moderatorWalletInput.value) {
      throw new Error('Please press "Add" button to add moderator wallet')
    }
    if (notificationEmailInput.value) {
      throw new Error('Please press "Add" button to add notification email')
    }
    isLoading.value = true

    if (isStripeConnectChecked.value && stripeConnectWallet.value) {
      const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${stripeConnectWallet.value}`)
      if (fetchError.value && fetchError.value?.statusCode !== 404) {
        throw new Error(fetchError.value.toString())
      }
      if (!(data?.value as any)?.isReady) {
        throw new Error('CONNECTED_WALLET_STRIPE_ACCOUNT_NOT_READY')
      }
    }

    const connectedWallets = (isStripeConnectChecked.value && stripeConnectWallet.value)
      ? {
          [stripeConnectWallet.value]: 100
        }
      : null
    await updateBookListingSetting(classId.value as string, {
      moderatorWallets,
      notificationEmails,
      connectedWallets
    })
  } catch (err) {
    const errorData = (err as any).data || err
    console.error(errorData)
    error.value = errorData
  } finally {
    isLoading.value = false
  }
}

async function copyPurchaseLink () {
  await navigator.clipboard.writeText(purchaseLink.value)
}

</script>
