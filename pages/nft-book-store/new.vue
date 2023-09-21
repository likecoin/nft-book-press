<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="bookStoreApiStore.isAuthenticated">
      <p><label>NFT Class ID:</label></p>
      <input v-if="!isEditMode" v-model="classIdInput" class="classIdInput" placeholder="likenft....">
      <p v-else style="font-weight: bold">
        {{ classId }}
      </p>
      <p>Total number of NFT for sale: {{ totalStock }}</p>
      <hr>

      <h3>
        Pricing and Availability
        <button v-if="!isEditMode" @click="addMorePrice">
          Add Edition
        </button>
      </h3>
      <p><label>Default display currency when user checkout (note that prices setting below are always in USD)</label></p>
      <input v-model="defaultPaymentCurrency" name="USD" type="radio" value="USD">
      <label for="USD">USD</label>
      <input v-model="defaultPaymentCurrency" name="HKD" type="radio" value="HKD">
      <label for="HKD">HKD</label>
      <component :is="hasMultiplePrices ? 'ul' : 'div'">
        <component :is="hasMultiplePrices ? 'li' : 'div'" v-for="p, index in prices" :key="p.index">
          <hr v-if="index > 0">
          <p><label>Price(USD) of this {{ priceItemLabel }} (Minimal ${{ MINIMAL_PRICE }})</label></p>
          <input :value="p.price" type="number" step="0.01" :min="MINIMAL_PRICE" @input="e => updatePrice(e, 'price', index)">
          <p><label>Total number of NFT for sale of this {{ priceItemLabel }}</label></p>
          <input :value="p.stock" type="number" @input="e => updatePrice(e, 'stock', index)">
          <p><label>Product name of this {{ priceItemLabel }}</label></p>
          <input placeholder="Product name in English" :value="p.nameEn" @input="e => updatePrice(e, 'nameEn', index)"><br>
          <input placeholder="產品中文名字" :value="p.nameZh" @input="e => updatePrice(e, 'nameZh', index)">
          <p><label>Product description of this {{ priceItemLabel }}</label></p>
          <md-editor
            v-model="p.descriptionEn"
            language="en-US"
            :editor-id="`en-${index}`"
            :placeholder="mdEditorPlaceholder.en"
            :toolbars="toolbarOptions"
            :sanitize="sanitizeHtml"
          />
          <md-editor
            v-model="p.descriptionZh"
            language="en-US"
            :editor-id="`zh-${index}`"
            :placeholder="mdEditorPlaceholder.zh"
            :toolbars="toolbarOptions"
            :sanitize="sanitizeHtml"
          />
          <div>
            <h3>Physical Goods</h3>
            <input type="checkbox" @input="e => updatePrice(e, 'hasShipping', index)">
            <label>Includes physical good that requires shipping</label>
          </div>
          <p v-if="hasMultiplePrices">
            <button @click="deletePrice(index)">
              Delete
            </button>
          </p>
        </component>
      </component>
      <div v-if="hasShipping">
        <hr>
        <h3>Shipping Options and Prices</h3><button @click="addMoreShippingRate">
          Add Option
        </button>
        <component :is="hasMultipleShippingRates ? 'ul' : 'div'">
          <component :is="hasMultipleShippingRates ? 'li' : 'div'" v-for="s, index in shippingRates" :key="s.index">
            <hr v-if="index > 0">
            <p><label>Price(USD) of this shipping option</label></p>
            <input :value="s.price" type="number" step="0.01" :min="0" @input="e => updateShippingRate(e, 'price', index)">
            <p><label>Name of this shipping option</label></p>
            <input placeholder="Shipping option name" :value="s.nameEn" @input="e => updateShippingRate(e, 'nameEn', index)"><br>
            <input placeholder="運送選項名稱" :value="s.nameZh" @input="e => updateShippingRate(e, 'nameZh', index)">
          </component>
        </component>
      </div>
      <hr>
      <div>
        <h3>Connect to your own Stripe Account</h3>
        <input v-model="isStripeConnectChecked" name="stripe" type="checkbox"><label>Use a Stripe Connect account for receiving all payment</label>
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
      </div>

      <h3>Other Settings</h3>
      <p><label>Share sales data to wallets (moderator):</label></p>
      <table>
        <tr>
          <td>Wallet</td>
          <td>Send NFT grant Status</td>
          <td>Remove</td>
        </tr>
        <tr v-for="m, i in moderatorWallets" :key="m">
          <td>{{ m }}</td>
          <td>
            <NuxtLink :to="{ name: 'authz', query: { grantee: m } }" target="_blank">
              <span v-if="moderatorWalletsGrants[m]">
                Granted
              </span>
              <span v-else>
                Click to grant
              </span>
            </NuxtLink>
          </td>
          <td>
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
      <input v-model="notificationEmailInput"><button @click="addNotificationEmail">
        Add
      </button>
      <hr>
      <button :disabled="isLoading" @click="onSubmit">
        {{ submitButtonText }}
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import DOMPurify from 'dompurify'

import { v4 as uuidv4 } from 'uuid'
import { LCD_URL, LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { getNFTAuthzGrants } from '~/utils/cosmos'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const { wallet } = storeToRefs(walletStore)
const { token } = storeToRefs(bookStoreApiStore)
const { newBookListing, updateEditionPrice } = bookStoreApiStore

const router = useRouter()
const route = useRoute()
// params.editingClassId and params.editionIndex is only available when editing an existing class
// query.class_id is only available when creating a new class
const classId = ref(route.params.editingClassId || route.query.class_id as string)
const editionIndex = ref(route.params.editionIndex as string)

const MINIMAL_PRICE = 0.9

const error = ref('')
const isLoading = ref(false)
const connectStatus = ref<any>({})

const mdEditorPlaceholder = ref({
  en: 'Product description in English...',
  zh: '產品中文描述...'
})

const classIdInput = ref(classId || '')
const nextPriceIndex = ref(1)
const defaultPaymentCurrency = ref('USD')
const prices = ref<any[]>([{
  price: MINIMAL_PRICE,
  stock: Number(route.query.count as string || 1),
  nameEn: 'Standard Edition',
  nameZh: '標準版',
  descriptionEn: '',
  descriptionZh: ''
}])
const shippingRates = ref<any[]>([{
  price: 10.0,
  nameEn: 'Standard Shipping',
  nameZh: '標準寄送'
}])
const hasMultiplePrices = computed(() => prices.value.length > 1)
const hasShipping = computed(() => prices.value.find(p => p.hasShipping))
const hasMultipleShippingRates = computed(() => shippingRates.value.length > 1)
const priceItemLabel = computed(() => hasMultiplePrices.value ? 'edition' : 'book')
const moderatorWallets = ref<string[]>([])
const moderatorWalletsGrants = ref<any>({})
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const stripeConnectWalletInput = ref('')
const totalStock = computed(() => prices.value.reduce((acc, p) => acc + Number(p.stock), 0))

const toolbarOptions = ref<string[]>([
  'bold',
  'italic',
  'strikeThrough',
  'title',
  '-',
  'unorderedList',
  'orderedList',
  '-',
  'code',
  'link',
  '=',
  'preview'
])

const isEditMode = computed(() => route.params.editingClassId && editionIndex.value)
const pageTitle = computed(() => isEditMode.value ? 'Edit Current Edition' : 'New NFT Book Listing')
const submitButtonText = computed(() => isEditMode.value ? 'Save Changes' : 'Submit')
const editionInfo = ref<any>({})
const classOwnerWallet = ref<any>({})

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

onMounted(async () => {
  try {
    isLoading.value = true

    const fetchClassDataPromise = isEditMode.value
      ? useFetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`, {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
      : Promise.resolve({ data: null })

    const fetchConnectStatusPromise =
        useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet.value}`, {
          headers: {
            authorization: `Bearer ${token.value}`
          }
        })

    const [classData, connectStatusData] = await Promise.all([fetchClassDataPromise, fetchConnectStatusPromise])

    if (classData?.data?.value) {
      const data = classData.data?.value
      classOwnerWallet.value = data

      if (classOwnerWallet?.value?.ownerWallet !== wallet.value) {
        throw new Error('NOT_OWNER_OF_NFT_CLASS')
      }

      editionInfo.value = data
      const currentEdition = editionInfo.value.prices.filter(e => e.index.toString() === editionIndex.value)[0]
      if (currentEdition) {
        prices.value = [
          {
            price: currentEdition.price,
            stock: currentEdition.stock,
            nameEn: currentEdition.name?.en || '',
            nameZh: currentEdition.name?.zh || '',
            descriptionEn: currentEdition.description?.en || '',
            descriptionZh: currentEdition.description?.zh || ''
          }
        ]
      }
      const {
        moderatorWallets: classModeratorWallets,
        notificationEmails: classNotificationEmails,
        connectedWallets: classConnectedWallets,
        defaultPaymentCurrency: classDefaultPaymentCurrency
      } = data as any
      moderatorWallets.value = classModeratorWallets
      notificationEmails.value = classNotificationEmails
      isStripeConnectChecked.value = !!(classConnectedWallets && Object.keys(classConnectedWallets).length)
      stripeConnectWallet.value = classConnectedWallets && Object.keys(classConnectedWallets)[0]
      if (classDefaultPaymentCurrency) { defaultPaymentCurrency.value = classDefaultPaymentCurrency }
    }

    if (connectStatusData.error?.value && connectStatusData.error?.value?.statusCode !== 404) {
      throw new Error(connectStatusData.error.value.toString())
    }
    connectStatus.value = (connectStatusData?.data?.value as any) || {}
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

watch(moderatorWallets, (newModeratorWallets) => {
  newModeratorWallets.forEach(async (m) => {
    if (!moderatorWalletsGrants.value[m]) {
      try {
        moderatorWalletsGrants.value[m] = await getNFTAuthzGrants(wallet.value, m)
      } catch {}
    }
  })
})

function updatePrice (e: InputEvent, key: string, index: number) {
  prices.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMorePrice () {
  nextPriceIndex.value += 1
  prices.value.push({
    index: uuidv4(),
    price: MINIMAL_PRICE,
    stock: 1,
    nameEn: `Tier ${nextPriceIndex.value}`,
    nameZh: `級別 ${nextPriceIndex.value}`,
    descriptionEn: '',
    descriptionZh: ''
  })
}

function deletePrice (index: number) {
  prices.value.splice(index, 1)
}

function updateShippingRate (e: InputEvent, key: string, index: number) {
  shippingRates.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMoreShippingRate () {
  shippingRates.value.push({
    index: uuidv4(),
    price: 20,
    nameEn: 'International Shipping',
    nameZh: '國際寄送'
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

function escapeHtml (text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sanitizeHtml (html: string) {
  return DOMPurify.sanitize(html)
}

function mapPrices (prices:any) {
  return prices
    .filter(p => p.price > 0)
    .map(p => ({
      name: { en: p.nameEn, zh: p.nameZh },
      description: {
        en: escapeHtml(p.descriptionEn),
        zh: escapeHtml(p.descriptionZh)
      },
      priceInDecimal: Math.round(Number(p.price) * 100),
      price: Number(p.price),
      stock: Number(p.stock),
      hasShipping: p.hasShipping || false
    }))
}

async function checkStripeConnect () {
  if (isStripeConnectChecked.value && stripeConnectWallet.value) {
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${stripeConnectWallet.value}`)
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    if (!(data?.value as any)?.isReady) {
      throw new Error('CONNECTED_WALLET_STRIPE_ACCOUNT_NOT_READY')
    }
  }
}

async function submitNewClass () {
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
    const collectionId = (data?.value as any)?.class?.data?.metadata?.nft_meta_collection_id || ''
    if (!collectionId.includes('nft_book') && !collectionId.includes('book_nft')) {
      throw new Error('NFT Class not in NFT BOOK meta collection')
    }

    const p = mapPrices(prices.value)
    await checkStripeConnect()

    const connectedWallets = (isStripeConnectChecked.value && stripeConnectWallet.value)
      ? {
          [stripeConnectWallet.value]: 100
        }
      : null
    const s = hasShipping.value
      ? shippingRates.value
        .map(rate => ({
          name: { en: rate.nameEn, zh: rate.nameZh },
          priceInDecimal: Math.round(Number(rate.price) * 100),
          price: Number(rate.price)
        }))
      : undefined

    await newBookListing(classIdInput.value as string, {
      defaultPaymentCurrency,
      connectedWallets,
      moderatorWallets,
      notificationEmails,
      prices: p,
      shippingRates: s
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

async function submitEditedClass () {
  try {
    if (!isEditMode.value) {
      throw new Error('Unable to submit edit: Missing edition index or class ID')
    }
    const p = mapPrices(prices.value)
    const price = p[0]

    if (!price || !price.price) {
      throw new Error('Please input price of edition')
    }

    if (!price.stock) {
      throw new Error('Please input stock of edition')
    }

    if (!price.name.en || !price.name.zh) {
      throw new Error('Please input product name')
    }

    isLoading.value = true

    await updateEditionPrice(classId.value as string, editionIndex.value, {
      price
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

function onSubmit () {
  return isEditMode.value ? submitEditedClass() : submitNewClass()
}

</script>
<style scoped>
.classIdInput {
   width: 450px;
}
.md-editor {
  width: 60vw;
  min-width: 300px;
  height: 500px;
}
</style>
