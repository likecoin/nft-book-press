<template>
  <div>
    <h1>New NFT Book Listing</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="bookStoreApiStore.isAuthenticated">
      <p><label>NFT Class ID:</label></p>
      <input v-model="classIdInput" placeholder="likenft....">
      <p>Total number of NFT for sale: {{ totalStock }}</p>
      <hr>
      <div v-for="p, index in prices" :key="index">
        <p><label>Price(USD) per NFT Book (Minimal ${{ MINIMAL_PRICE }})</label></p>
        <input :value="p.price" type="number" :min="MINIMAL_PRICE" @input="e => updatePrice(e, 'price', index)">
        <p><label>Total number of NFT for sale at this price</label></p>
        <input :value="p.stock" type="number" @input="e => updatePrice(e, 'stock', index)">
        <p><label>Product name of this price</label></p>
        <input placeholder="Product name in English" :value="p.nameEn" @input="e => updatePrice(e, 'nameEn', index)"><br>
        <input placeholder="產品中文名字" :value="p.nameZh" @input="e => updatePrice(e, 'nameZh', index)">
        <p><label>Product description of this price</label></p>
        <textarea placeholder="Product description in English" :value="p.descriptionEn" @input="e => updatePrice(e, 'descriptionEn', index)" /><br>
        <textarea placeholder="產品中文描述" :value="p.descriptionZh" @input="e => updatePrice(e, 'descriptionZh', index)" />
        <hr>
      </div>
      <button @click="addMorePrice">
        Add more prices
      </button>

      <hr>
      <div>
        <h3>Connect to your own Stripe Account</h3>
        <input v-model="isStripeConnectChecked" name="stripe" type="checkbox"><label>Use a stripe connect account for receiving all payment</label>
        <br>
        <template v-if="isStripeConnectChecked">
          <input v-model="stripeConnectWallet" type="radio" :disabled="!(connectStatus?.isReady)" :value="ownerWallet"><span v-if="connectStatus?.isReady">Use my account</span>
          <span v-else>
            No stripe account connected yet.
            <NuxtLink :to="{ name: 'nft-book-store-user' }">
              Create one here
            </NuxtLink>
          </span>
          <br>
          <input v-model="stripeConnectWallet" type="radio" :value="stripeConnectWalletInput"> Enter a wallet address with connected account:
          <input v-if="stripeConnectWallet !== ownerWallet" v-model="stripeConnectWalletInput" placeholder="like1..." @input="onStripeConnectWalletInput">
        </template>
        <div v-else>
          No stripe account connected yet.
          <NuxtLink :to="{ name: 'nft-book-store-user' }" target="_blank">
            Create one here
          </NuxtLink>
        </div>
      </div>

      <h3>Other Settings</h3>
      <p><label>Share sales data to wallets (moderator):</label></p>
      <ul>
        <li v-for="m, i in moderatorWallets" :key="m">
          {{ m }}<button style="margin-left: 4px" @click="() => moderatorWallets.splice(i, 1)">
            x
          </button>
        </li>
      </ul>
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
      <input v-model="notificationEmailInput"><button @click="addNotificationEmail">
        Add
      </button>
      <hr>
      <button :disabled="isLoading" @click="onSubmit">
        Submit
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LCD_URL, LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const { wallet } = storeToRefs(walletStore)
const { token } = storeToRefs(bookStoreApiStore)
const { newBookListing } = bookStoreApiStore
const router = useRouter()
const route = useRoute()

const MINIMAL_PRICE = 5

const error = ref('')
const isLoading = ref(false)
const connectStatus = ref<any>({})

const classIdInput = ref(route.query.class_id as string || '')
const prices = ref<any[]>([{
  price: 0,
  stock: Number(route.query.count as string || 0),
  nameEn: 'Standard Edition',
  nameZh: '標準版',
  descriptionEn: 'Content of standard edition',
  descriptionZh: '標準版內容'
}])
const moderatorWallets = ref<string[]>([])
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const stripeConnectWalletInput = ref('')
const totalStock = computed(() => prices.value.reduce((acc, p) => acc + Number(p.stock), 0))

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
    error.value = (e as Error).toString()
  } finally {
    isLoading.value = false
  }
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

function updatePrice (e: InputEvent, key: string, index: number) {
  prices.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMorePrice () {
  prices.value.push({
    price: 0,
    stock: 0,
    nameEn: `Tier ${prices.value.length}`,
    nameZh: `級別 ${prices.value.length}`
  })
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

async function onSubmit () {
  try {
    if (!classIdInput.value) {
      throw new Error('Please input NFT class ID')
    }
    if (moderatorWalletInput.value) {
      throw new Error('Please press "Add" button to add moderator wallet')
    }
    if (notificationEmailInput.value) {
      throw new Error('Please press "Add" button to add notification email')
    }

    const { data, error: fetchError } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${classIdInput.value}`)
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    const collectionId = (data?.value as any)?.class?.metadata?.nft_meta_collection_id || ''
    if (!collectionId.includes('nft_book') && !collectionId.includes('book_nft')) {
      throw new Error('NFT Class not in NFT BOOK meta collection')
    }

    isLoading.value = true
    const p = prices.value
      .filter(p => p.price > 0)
      .map(p => ({
        name: { en: p.nameEn, zh: p.nameZh },
        description: { en: p.descriptionEn, zh: p.descriptionZh },
        priceInDecimal: Math.round(Number(p.price) * 100),
        price: Number(p.price),
        stock: Number(p.stock)
      }))

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
    await newBookListing(classIdInput.value, {
      connectedWallets,
      moderatorWallets,
      notificationEmails,
      prices: p
    })
    router.push({ name: 'nft-book-store' })
  } catch (err) {
    const errorData = (err as any).data || err
    console.error(errorData)
    error.value = errorData
  } finally {
    isLoading.value = false
  }
}

</script>
