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
      <input v-model="classIdInput" class="classIdInput" placeholder="likenft...." :disabled="isEditMode">
      <p>Total number of NFT for sale: {{ totalStock }}</p>
      <hr>

      <h3>
        Pricing and Availability
        <button v-if="!isEditMode" @click="addMorePrice">
          Add Edition
        </button>
      </h3>
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
          <p v-if="hasMultiplePrices">
            <button @click="deletePrice(index)">
              Delete
            </button>
          </p>
        </component>
      </component>

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
const prices = ref<any[]>([{
  price: MINIMAL_PRICE,
  stock: Number(route.query.count as string || 1),
  nameEn: 'Standard Edition',
  nameZh: '標準版',
  descriptionEn: '',
  descriptionZh: ''
}])
const hasMultiplePrices = computed(() => prices.value.length > 1)
const priceItemLabel = computed(() => hasMultiplePrices.value ? 'edition' : 'book')
const moderatorWallets = ref<string[]>([])
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
    if (isEditMode.value) {
      const { data: classData, error: classFetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`,
        {
          headers: {
            authorization: `Bearer ${token.value}`
          }
        })
      if (classFetchError.value) {
        throw classFetchError.value
      }

      classOwnerWallet.value = classData.value
      if (classOwnerWallet?.value?.ownerWallet !== wallet.value) {
        throw new Error('NOT_OWNER_OF_NFT_CLASS')
      }

      editionInfo.value = classData.value
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
        connectedWallets: classConnectedWallets
      } = classData.value as any
      moderatorWallets.value = classModeratorWallets
      notificationEmails.value = classNotificationEmails
      isStripeConnectChecked.value = !!(classConnectedWallets && Object.keys(classConnectedWallets).length)
      stripeConnectWallet.value = classConnectedWallets && Object.keys(classConnectedWallets)[0]
    }

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

async function onSubmit () {
  try {
    if (!isEditMode.value) {
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
    }

    isLoading.value = true
    const p = prices.value
      .filter(p => p.price > 0)
      .map(p => ({
        name: { en: p.nameEn, zh: p.nameZh },
        description: {
          en: escapeHtml(p.descriptionEn),
          zh: escapeHtml(p.descriptionZh)
        },
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

    if (isEditMode.value) {
      await updateEditionPrice(classId.value as string, editionIndex.value, {
        price: p[0]
      })
    } else {
      await newBookListing(classIdInput.value, {
        connectedWallets,
        moderatorWallets,
        notificationEmails,
        prices: p
      })
    }

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
