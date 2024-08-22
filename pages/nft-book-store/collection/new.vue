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
      <!-- Collection Info -->
      <UCard :ui="{ body: { base: 'space-y-4' } }">
        <template #header>
          <h2 class="font-bold font-mono">
            Collection Info
          </h2>
        </template>
        <UFormGroup label="Books in Collection">
          <UCard :ui="{ body: { padding: '' } }">
            <UTable
              :columns="[{ key: 'classId', label: 'Class ID' }, { key: 'name', label: 'Book Name'}]"
              :rows="classIds.map((classId, index) => ({ index, classId, name: getClassMetadataById(classId)?.name }))"
            />
            <div class="flex items-start gap-[12px] w-full px-[12px] mb-[12px]">
              <UInput
                v-model="classIdInput"
                class="font-mono w-full"
                placeholder="likenft...."
              />
              <UButton @click="addMoreClassId">
                Add
              </UButton>
            </div>
          </UCard>
        </UFormGroup>
        <UFormGroup :label="`Total number of packages available for sale`">
          <UInput v-model="price.stock" type="number" step="0.01" :min="MINIMAL_PRICE" />
        </UFormGroup>
      </UCard>

      <!-- Pricing and Availability -->
      <UCard
        :ui="{
          body: {
            base: 'flex flex-col gap-[20px]',
          },
          base: 'overflow-visible'
        }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Pricing and Availability
          </h3>
        </template>
        <UFormGroup :label="`Price(USD) of this collection (Minimal ${MINIMAL_PRICE} or $0 (free))`">
          <UInput v-model="price.price" type="number" step="0.01" :min="MINIMAL_PRICE" @input="onPriceChange" />
        </UFormGroup>

        <URadioGroup
          v-model="price.deliveryMethod"
          :disabled="price.isPhysicalOnly"
          legend="Delivery method of this collection"
          :options="deliverMethodOptions"
        />
        <UFormGroup v-if="price.deliveryMethod === 'auto'">
          <template #label>
            Memo of this collection
            <ToolTips>
              <template #image>
                <img
                  src="~/assets/images/hint/memo.png"
                  class="object-cover"
                  alt=""
                >
              </template>
              <UIcon name="i-heroicons-question-mark-circle" />
            </ToolTips>
          </template>
          <UInput
            v-model="price.autoMemo"
          />
        </UFormGroup>
        <UFormGroup
          v-else
          label="Is Physical only good"
          :ui="{ label: { base: 'font-mono font-bold' } }"
        >
          <UCheckbox
            v-model="price.isPhysicalOnly"
            name="isPhysicalOnly"
            label="This collection does not contain any digital file/NFT"
          />
        </UFormGroup>
        <UFormGroup>
          <template #label>
            Allow custom price
            <ToolTips :image-style="{ width: '300px' }">
              <template #image>
                <img
                  src="~/assets/images/hint/tipping.png"
                  class="object-cover"
                  alt=""
                >
              </template>
              <UIcon name="i-heroicons-question-mark-circle" />
            </ToolTips>
          </template>
          <UCheckbox
            v-model="price.isAllowCustomPrice"
            name="isAllowCustomPrice"
            label="Allow user to pay more than defined price"
          />
        </UFormGroup>
      </UCard>

      <!-- Product Information -->
      <UCard
        :ui="{
          body: {
            base: 'flex flex-col gap-[20px]',
          },
          base: 'overflow-visible'
        }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Product Information
          </h3>
        </template>
        <UFormGroup label="Product Name" :ui="{ container: 'space-y-2' }">
          <template #label>
            Product Name
            <ToolTips :image-style="{ width: '250px' }">
              <template #image>
                <img
                  src="~/assets/images/hint/editionInfo-en.png"
                  class="object-cover"
                  alt=""
                >
              </template>
              <UIcon name="i-heroicons-question-mark-circle" />
            </ToolTips>
          </template>
          <UInput v-model="nameEn" placeholder="Product name in English" />
          <span class="block text-[14px] text-[#374151] mt-[8px]">Description (Optional)</span>
          <md-editor
            v-model="descriptionEn"
            language="en-US"
            :editor-id="`en`"
            :placeholder="mdEditorPlaceholder.en"
            :toolbars="toolbarOptions"
            :sanitize="sanitizeHtml"
            :style="{ height: '200px', width: '100%', marginTop: '0px' }"
          />
        </UFormGroup>
        <UFormGroup :ui="{ container: 'space-y-2 my-[20px]' }">
          <template #label>
            產品名稱
            <ToolTips :image-style="{ width: '250px' }">
              <template #image>
                <img
                  src="~/assets/images/hint/editionInfo-zh.png"
                  class="object-cover"
                  alt=""
                >
              </template>
              <UIcon name="i-heroicons-question-mark-circle" />
            </ToolTips>
          </template>
          <UInput
            v-model="nameZh"
            placeholder="產品中文名字"
          />
          <span class="block text-[14px] text-[#374151] mt-[8px]">描述 (選填)</span>
          <md-editor
            v-model="descriptionZh"
            language="en-US"
            :editor-id="`zh`"
            :placeholder="mdEditorPlaceholder.zh"
            :toolbars="toolbarOptions"
            :sanitize="sanitizeHtml"
            :style="{ height: '200px', width: '100%', marginTop: '0px' }"
          />
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
          <img v-if="image" :src="parseImageURLFromMetadata(image)" class="w-1/3">
        </UFormGroup>
        <ShippingRatesRateTable
          v-model="price.hasShipping"
          :is-show-physical-goods-checkbox="true"
          :is-show-setting-modal-button="true"
          :shipping-info="shippingRates"
        />
      </UCard>

      <StripeConnectCard
        v-model:is-stripe-connect-checked="isStripeConnectChecked"
        v-model:is-using-default-account="isUsingDefaultAccount"
        :stripe-connect-wallet="stripeConnectWallet"
        :stripe-connect-status-wallet-map="stripeConnectStatusWalletMap"
        :should-disable-setting="shouldDisableStripeConnectSetting"
        :login-address="wallet"

        @save="handleSaveStripeConnectWallet"
      />

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

      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '12px' },
        }"
      >
        <div class="flex justify-between items-center w-full">
          <h3 class="font-bold font-mono">
            Advanced Settings
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            :icon="
              shouldShowAdvanceSettings
                ? 'i-heroicons-chevron-up'
                : 'i-heroicons-chevron-down'
            "
            @click="
              () => {
                shouldShowAdvanceSettings = !shouldShowAdvanceSettings;
              }
            "
          />
        </div>
        <template v-if="shouldShowAdvanceSettings">
          <div class="mt-[24px] flex flex-col gap-[12px]">
            <!-- Shipping Rates -->
            <ShippingRatesRateTable
              :is-show-physical-goods-checkbox="false"
              :shipping-info="shippingRates"
              :is-show-setting-modal-button="true"
              @update-shipping-rates="updateShippingRate"
            >
              <template #header>
                <span class="text-[14px] text-gray-500">
                  (Includes physical good that requires shipping)
                </span>
              </template>
            </ShippingRatesRateTable>

            <!-- Share sales data -->
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

            <!-- DRM -->
            <UCard :ui="{ body: { base: 'space-y-8' } }">
              <template #header>
                <h3 class="font-bold font-mono">
                  DRM Options
                </h3>
              </template>

              <div class="grid md:grid-cols-2 gap-4">
                <UFormGroup
                  label="Force NFT claim before view"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="mustClaimToView"
                    name="mustClaimToView"
                    label="Must claim NFT to view"
                  />
                </UFormGroup>

                <UFormGroup
                  label="Disable File Download"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="hideDownload"
                    name="hideDownload"
                    label="Disable Download"
                  />
                </UFormGroup>
              </div>
            </UCard>
          </div>
        </template>
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

import { DEFAULT_PRICE, MINIMAL_PRICE, LCD_URL } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { useStripeStore } from '~/stores/stripe'
import { getPortfolioURL, deliverMethodOptions } from '~/utils'
import { getNFTAuthzGrants, sendNFTsToAPIWallet } from '~/utils/cosmos'
import { useCollectionStore } from '~/stores/collection'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const collectionStore = useCollectionStore()
const nftStore = useNftStore()
const stripeStore = useStripeStore()
const { wallet, signer } = storeToRefs(walletStore)
const { connect } = walletStore
const { newNFTBookCollection } = collectionStore
const { getClassMetadataById, lazyFetchClassMetadataById } = nftStore
const { fetchStripeConnectStatus, stripeConnectStatusWalletMap } = stripeStore

const router = useRouter()
const route = useRoute()

const error = ref('')
const isLoading = ref(false)

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
const price = ref({
  price: DEFAULT_PRICE,
  stock: Number(route.query.count as string || 1),
  hasShipping: false,
  isPhysicalOnly: false,
  isAllowCustomPrice: true,
  deliveryMethod: 'auto',
  autoMemo: 'Thank you for your support. It means a lot to me.'
})
const shippingRates = ref<any[]>([])
const moderatorWallets = ref<string[]>([])
const moderatorWalletsGrants = ref<any>({})
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')

const mustClaimToView = ref(true)
const hideDownload = ref(false)
const shouldShowAdvanceSettings = ref<boolean>(false)
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const shouldDisableStripeConnectSetting = ref(false)
const isUsingDefaultAccount = ref(true)

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
    await fetchStripeConnectStatus(wallet.value)

    if (stripeConnectStatusWalletMap[wallet.value]?.isReady) {
      isStripeConnectChecked.value = true
      stripeConnectWallet.value = wallet.value
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
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

function onPriceChange (event: InputEvent) {
  if (Number(event.data) === 0) {
    price.value.isAllowCustomPrice = true
  }
}

function addMoreClassId () {
  classIds.value.push(classIdInput.value as string)
  lazyFetchClassMetadataById(classIdInput.value)
  classIdInput.value = ''
}

function updateShippingRate (options: any) {
  shippingRates.value = options
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

function handleSaveStripeConnectWallet (wallet: any) {
  stripeConnectWallet.value = wallet
  shouldDisableStripeConnectSetting.value = true
}

function formatPrice (price: any) {
  return {
    priceInDecimal: Math.round(Number(price.price) * 100),
    stock: Number(price.stock),
    hasShipping: Boolean(price.hasShipping || shippingRates.value.length || false),
    isPhysicalOnly: Boolean(price.isPhysicalOnly || false),
    isAllowCustomPrice: Boolean(price.isAllowCustomPrice ?? true),
    isAutoDeliver: !price.isPhysicalOnly && price.deliveryMethod === 'auto',
    autoMemo: price.autoMemo
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

    isLoading.value = true

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

    if (Number(price.value.price) !== 0 && price.value.price < MINIMAL_PRICE) {
      throw new Error(`Price of each edition must be at least $${MINIMAL_PRICE} or $0 (free)`)
    }

    const connectedWallets = (isStripeConnectChecked.value && stripeConnectWallet.value)
      ? {
          [stripeConnectWallet.value]: 100
        }
      : null
    const s = shippingRates.value.length
      ? shippingRates.value
        .map(rate => ({
          name: { en: rate.nameEn, zh: rate.nameZh },
          priceInDecimal: Math.round(Number(rate.price) * 100),
          price: Number(rate.price)
        }))
      : undefined

    const formattedPrice = formatPrice(price.value)

    let autoDeliverNFTsTxHash
    if (formattedPrice.isAutoDeliver) {
      const ok = confirm(
        "NFT Book Press - Reminder\nOnce you choose automatic delivery, you can't switch it back to manual delivery. Are you sure?"
      )
      if (!ok) {
        return
      }

      if (formattedPrice.stock > 0) {
        if (!wallet.value || !signer.value) {
          await connect()
        }
        if (!wallet.value || !signer.value) {
          throw new Error('Unable to connect to wallet')
        }
        autoDeliverNFTsTxHash = await sendNFTsToAPIWallet(
          classIds.value,
          formattedPrice.stock,
          signer.value,
          wallet.value
        )
      }
    }

    await newNFTBookCollection({
      classIds: classIds.value,
      defaultPaymentCurrency: 'USD',
      connectedWallets,
      moderatorWallets,
      notificationEmails,
      shippingRates: s,
      name: { en: nameEn.value, zh: nameZh.value },
      description: {
        en: escapeHtml(descriptionEn.value),
        zh: escapeHtml(descriptionZh.value)
      },
      image: image.value,
      hideDownload,
      mustClaimToView,
      autoDeliverNFTsTxHash,
      ...formattedPrice
    })
    router.push({ name: 'nft-book-store-collection' })
  } catch (err) {
    const errorData = (err as any).data || err
    console.error(errorData)
    error.value = errorData
  } finally {
    shouldDisableStripeConnectSetting.value = false
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
