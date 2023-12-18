<template>
  <div class="space-y-4">
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

    <template v-if="bookStoreApiStore.isAuthenticated">
      <UCard :ui="{ body: { base: 'space-y-4' } }">
        <template #header>
          <h2 class="font-bold font-mono">
            New Book Collection
          </h2>
        </template>

        <UFormGroup label="Books in Collection">
          <UTable
            :columns="[{ key: 'classId', label: 'Class ID' }, { key: 'name', label: 'Book Name'}]"
            :rows="classIds.map((classId, index) => ({ index, classId, name: getClassMetadataById(classId)?.name }))"
          />
          <UInput
            v-model="classIdInput"
            class="font-mono"
            placeholder="likenft...."
          />
          <UButton @click="addMoreClassId">
            Add
          </UButton>
        </UFormGroup>

        <UFormGroup
          :label="`Name of this book collection`"
          :ui="{ container: 'space-y-2' }"
        >
          <UInput v-model="nameEn" placeholder="Product name in English" />
          <UInput v-model="nameZh" placeholder="產品中文名字" />
        </UFormGroup>

        <UFormGroup
          :label="`Image of this book collection`"
          :ui="{ container: 'space-y-2' }"
        >
          <UInput
            v-model="image"
            class="font-mono"
            placeholder="https://, ar://, ipfs://...."
          />
          <img v-if="image" :src="parseImageURLFromMetadata(image)" class="w-1/2">
        </UFormGroup>

        <UFormGroup
          :label="`Description of this book collection`"
          :ui="{ container: 'space-y-2' }"
        >
          <md-editor
            v-model="descriptionEn"
            language="en-US"
            :editor-id="'en'"
            :placeholder="mdEditorPlaceholder.en"
            :toolbars="toolbarOptions"
            :sanitize="sanitizeHtml"
          />
          <md-editor
            v-model="descriptionZh"
            language="en-US"
            :editor-id="'zh'"
            :placeholder="mdEditorPlaceholder.zh"
            :toolbars="toolbarOptions"
            :sanitize="sanitizeHtml"
          />
        </UFormGroup>
      </UCard>

      <UCard :ui="{ header: { base: 'flex justify-between items-center gap-2' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            Pricing and Availability
          </h3>
        </template>

        <UFormGroup
          label="Default display currency when user checkout"
          help="note that prices setting are always in USD"
        >
          <URadio v-model="defaultPaymentCurrency" label="USD" name="USD" value="USD" />
          <URadio v-model="defaultPaymentCurrency" label="HKD" name="HKD" value="HKD" />
        </UFormGroup>
      </UCard>

      <div>
        <div class="space-y-4">
          <UFormGroup :label="`Price(USD) of this book collection (Minimal ${MINIMAL_PRICE} or free)`">
            <UInput v-model="price.price" type="number" step="0.01" :min="0" />
          </UFormGroup>

          <UFormGroup :label="`Total number of packages available for sale`">
            <UInput v-model="price.stock" type="number" step="0.01" :min="0" />
          </UFormGroup>

          <UCard
            :ui="{
              divide: isStripeConnectChecked ? undefined : '',
              header: { base: 'flex flex-wrap justify-between items-center gap-2' },
              body: { padding: isStripeConnectChecked ? undefined : '', base: 'grid lg:grid-cols-2 gap-4' }
            }"
          >
            <template #header>
              <h3 class="font-bold font-mono">
                Physical Goods
              </h3>

              <UCheckbox
                v-model="price.hasShipping"
                label="Includes physical good that requires shipping"
              />
            </template>
          </UCard>
        </div>
      </div>

      <UCard
        v-if="hasShipping"
        :ui="{
          divide: isStripeConnectChecked ? undefined : '',
          header: { base: 'flex flex-wrap justify-between items-center gap-2' },
          body: { padding: isStripeConnectChecked ? undefined : '', base: 'grid lg:grid-cols-2 gap-4' }
        }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Shipping Options and Prices
          </h3>

          <UButton
            label="Add Option"
            variant="outline"
            @click="addMoreShippingRate"
          />
        </template>

        <component :is="hasMultipleShippingRates ? 'ul' : 'div'">
          <component :is="hasMultipleShippingRates ? 'li' : 'div'" v-for="s, index in shippingRates" :key="s.index" class="space-y-2 px-5 py-4">
            <UDivider v-if="index > 0" />
            <UFormGroup label="Price(USD) of this shipping option">
              <UInput :value="s.price" type="number" step="0.01" :min="0" @input="e => updateShippingRate(e, 'price', index)" />
            </UFormGroup>

            <UFormGroup label="Name of this shipping option" :ui="{ container: 'space-y-2' }">
              <UInput placeholder="Shipping option name" :value="s.nameEn" @input="e => updateShippingRate(e, 'nameEn', index)" />
              <UInput placeholder="運送選項名稱" :value="s.nameZh" @input="e => updateShippingRate(e, 'nameZh', index)" />
            </UFormGroup>
          </component>
        </component>
      </UCard>

      <UCard
        :ui="{
          divide: isStripeConnectChecked ? undefined : '',
          header: { base: 'flex flex-wrap justify-between items-center gap-2' },
          body: { padding: isStripeConnectChecked ? undefined : '', base: 'grid lg:grid-cols-2 gap-4' }
        }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Connect to your own Stripe Account
          </h3>
          <UToggle v-model="isStripeConnectChecked" name="stripe" label="Use a Stripe Connect account for receiving all payment" />
        </template>

        <template v-if="isStripeConnectChecked">
          <URadio v-model="stripeConnectWallet" :disabled="!(connectStatus?.isReady)" :value="classOwnerWallet?.value?.ownerWallet">
            <template #label>
              <span v-if="connectStatus?.isReady">Use my account</span>
              <span v-else>
                No stripe account connected yet.<br>
                <UButton
                  class="mt-2"
                  label="Create one here"
                  :to="{ name: 'nft-book-store-user' }"
                  target="_blank"
                  variant="outline"
                />
              </span>
            </template>
          </URadio>
          <URadio v-model="stripeConnectWallet" :value="stripeConnectWalletInput">
            <template #label>
              <UFormGroup label="Enter a wallet address with connected account">
                <UInput
                  v-if="stripeConnectWallet !== classOwnerWallet?.value?.ownerWallet"
                  v-model="stripeConnectWalletInput"
                  class="font-mono"
                  placeholder="like1..."
                  @input="onStripeConnectWalletInput"
                />
              </UFormGroup>
            </template>
          </URadio>
        </template>
      </UCard>

      <UCard :ui="{ body: { base: 'space-y-8' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            Other Settings
          </h3>
        </template>

        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '', base: 'space-y-8' }
          }"
        >
          <template #header>
            <h4 class="text-sm font-bold font-mono">
              Share sales data to wallets
            </h4>
            <div class="flex gap-2">
              <UInput
                v-model="moderatorWalletInput"
                class="font-mono"
                placeholder="like1..."
              />

              <UButton
                label="Add"
                :variant="moderatorWalletInput ? 'outline' : 'solid'"
                :color="moderatorWalletInput ? 'primary' : 'gray'"
                :disabled="!moderatorWalletInput"
                @click="addModeratorWallet"
              />
            </div>
          </template>

          <UTable
            :columns="moderatorWalletsTableColumns"
            :rows="moderatorWalletsTableRows"
          >
            <template #wallet-data="{ row }">
              <UButton
                class="font-mono"
                :label="row.wallet"
                :to="row.walletLink"
                variant="link"
                :padded="false"
              />
            </template>
            <template #authz-data="{ row }">
              <UButton
                :label="row.grantLabel"
                :to="row.grantRoute"
                :variant="row.isGranted ? 'outline' : 'solid'"
                color="green"
              />
            </template>
            <template #remove-data="{ row }">
              <div class="flex justify-end items-center">
                <UButton
                  icon="i-heroicons-x-mark"
                  variant="soft"
                  color="red"
                  @click="() => moderatorWallets.splice(row.index, 1)"
                />
              </div>
            </template>
          </UTable>
        </UCard>

        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '' }
          }"
        >
          <template #header>
            <h4 class="text-sm font-bold font-mono">
              Email to receive sales notifications
            </h4>

            <div class="flex gap-2">
              <UInput
                v-model="notificationEmailInput"
                placeholder="abc@example.com"
              />

              <UButton
                label="Add"
                :variant="notificationEmailInput ? 'outline' : 'solid'"
                :color="notificationEmailInput ? 'primary' : 'gray'"
                :disabled="!notificationEmailInput"
                @click="addNotificationEmail"
              />
            </div>
          </template>

          <UTable
            :columns="[{ key: 'email', label: 'Email', sortable: true }, { key: 'action' }]"
            :rows="notificationEmailsTableRows"
          >
            <template #email-data="{ row }">
              <UButton
                :label="row.email"
                :to="`mailto:${row.email}`"
                variant="link"
                :padded="false"
              />
            </template>

            <template #action-data="{ row }">
              <div class="flex justify-end items-center">
                <UButton
                  icon="i-heroicons-x-mark"
                  variant="soft"
                  color="red"
                  @click="() => notificationEmails.splice(row.index, 1)"
                />
              </div>
            </template>
          </UTable>
        </UCard>
      </UCard>

      <UButton
        :label="submitButtonText"
        :loading="isLoading"
        size="lg"
        :disabled="isLoading"
        @click="onSubmit"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { MdEditor, ToolbarNames, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import DOMPurify from 'dompurify'

import { v4 as uuidv4 } from 'uuid'
import { LCD_URL, LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { getPortfolioURL } from '~/utils'
import { getNFTAuthzGrants } from '~/utils/cosmos'
import { useCollectionStore } from '~/stores/collection'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const collectionStore = useCollectionStore()
const nftStore = useNftStore()
const { wallet } = storeToRefs(walletStore)
const { token } = storeToRefs(bookStoreApiStore)
const { newNFTBookCollection } = collectionStore
const { getClassMetadataById, lazyFetchClassMetadataById } = nftStore

const router = useRouter()
const route = useRoute()

const MINIMAL_PRICE = 0.9

const error = ref('')
const isLoading = ref(false)
const connectStatus = ref<any>({})

const mdEditorPlaceholder = ref({
  en: 'Collection description in English...',
  zh: '套裝中文描述...'
})

const nameEn = ref('New Book Collection Name')
const nameZh = ref('新書集名稱')
const descriptionEn = ref('')
const descriptionZh = ref('')
const image = ref('')

const classIdInput = ref('')
const classIds = ref<string[]>([])
const defaultPaymentCurrency = ref('USD')
const price = ref({
  price: MINIMAL_PRICE,
  stock: Number(route.query.count as string || 1),
  hasShipping: false
})
const shippingRates = ref<any[]>([{
  price: 10.0,
  nameEn: 'Standard Shipping',
  nameZh: '標準寄送'
}])
const hasShipping = computed(() => price.value.hasShipping)
const hasMultipleShippingRates = computed(() => shippingRates.value.length > 1)
const moderatorWallets = ref<string[]>([])
const moderatorWalletsGrants = ref<any>({})
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const stripeConnectWalletInput = ref('')

const toolbarOptions: ToolbarNames[] = [
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
]

const submitButtonText = computed(() => 'Submit')
const classOwnerWallet = ref<any>({})

const moderatorWalletsTableColumns = computed(() => [
  { key: 'wallet', label: 'Wallet', sortable: true },
  { key: 'authz', label: 'Send NFT Grant', sortable: false },
  { key: 'remove', label: '', sortable: false }
])

const moderatorWalletsTableRows = computed(() => moderatorWallets.value.map((wallet, index) => {
  const isGranted = !!moderatorWalletsGrants.value[wallet]
  return {
    index,
    wallet,
    walletLink: getPortfolioURL(wallet),
    isGranted,
    grantLabel: isGranted ? 'Granted' : 'Grant',
    grantRoute: {
      name: 'authz',
      query: {
        grantee: wallet
      }
    }
  }
}))

const notificationEmailsTableRows = computed(() => notificationEmails.value.map((email, index) => ({
  index,
  email
})))

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

onMounted(async () => {
  try {
    isLoading.value = true

    const fetchConnectStatusPromise =
        useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet.value}`, {
          headers: {
            authorization: `Bearer ${token.value}`
          }
        })

    const [connectStatusData] = await Promise.all([fetchConnectStatusPromise])

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
  newModeratorWallets?.forEach(async (m) => {
    if (!moderatorWalletsGrants.value[m]) {
      try {
        moderatorWalletsGrants.value[m] = await getNFTAuthzGrants(wallet.value, m)
      } catch {}
    }
  })
})

function addMoreClassId () {
  classIds.value.push(classIdInput.value as string)
  lazyFetchClassMetadataById(classIdInput.value)
  classIdInput.value = ''
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
  if (!moderatorWalletInput.value) { return }
  moderatorWallets.value.push(moderatorWalletInput.value)
  moderatorWalletInput.value = ''
}

function addNotificationEmail () {
  if (!notificationEmailInput.value) { return }
  notificationEmails.value.push(notificationEmailInput.value)
  notificationEmailInput.value = ''
}

function onStripeConnectWalletInput () {
  // force stripeConnectWallet to update when stripeConnectWalletInput is updated
  stripeConnectWallet.value = stripeConnectWalletInput.value.trim()
}

function formatPrice (price: any) {
  return {
    priceInDecimal: Math.round(Number(price.price) * 100),
    stock: Number(price.stock),
    hasShipping: price.hasShipping || false
  }
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

async function submitNewCollection () {
  try {
    if (classIdInput.value) {
      throw new Error('Please press "Add" button to add NFT class ID')
    }
    if (!classIds.value.length) {
      throw new Error('Please press "Add" button to add NFT class ID')
    }
    if (moderatorWalletInput.value) {
      throw new Error('Please press "Add" button to add moderator wallet')
    }
    if (notificationEmailInput.value) {
      throw new Error('Please press "Add" button to add notification email')
    }

    await Promise.all(classIds.value.map(async (classId) => {
      const { data, error: fetchError } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${classId}`)
      if (fetchError.value && fetchError.value?.statusCode !== 404) {
        throw new Error(fetchError.value.toString())
      }
      const collectionId = (data?.value as any)?.class?.data?.metadata?.nft_meta_collection_id || ''
      if (!collectionId.includes('nft_book') && !collectionId.includes('book_nft')) {
        throw new Error('NFT Class not in NFT BOOK meta collection')
      }
    }))

    if (price.value.price !== 0 && price.value.price < MINIMAL_PRICE) {
      throw new Error(`Price of each edition must be at least $${MINIMAL_PRICE} or free`)
    }
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

    await newNFTBookCollection({
      classIds: classIds.value,
      defaultPaymentCurrency,
      connectedWallets,
      moderatorWallets,
      notificationEmails,
      shippingRates: s,
      name: { en: nameEn.value, zh: nameZh.value },
      description: {
        en: escapeHtml(descriptionEn.value),
        zh: escapeHtml(descriptionZh.value)
      },
      image,
      ...formatPrice(price.value)
    })
    router.push({ name: 'nft-book-store-collection' })
  } catch (err) {
    const errorData = (err as any).data || err
    console.error(errorData)
    error.value = errorData
  } finally {
    isLoading.value = false
  }
}

function onSubmit () {
  return submitNewCollection()
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