<template>
  <div class="pb-[40px]">
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'red',
        variant: 'link',
        padded: false,
      }"
      @close="error = ''"
    />

    <template v-if="bookStoreApiStore.isAuthenticated">
      <UCard :ui="{ body: { base: 'space-y-4' } }">
        <template #header>
          <h2 class="font-bold font-mono">
            {{ pageTitle }}
          </h2>
        </template>

        <UFormGroup label="NFT Class ID">
          <UInput
            :value="classIdInput"
            disabled
            class="font-mono"
          />
        </UFormGroup>
        <UFormGroup class="flex items-center">
          <ToolTips
            tool-tip-text="This option is only available when uploading files / 僅能在上傳檔案時決定"
          >
            <UCheckbox
              v-model="hideDownload"
              name="hideDownload"
              :disabled="true"
              label="DRM: encrypt content & disable download / 加密文本、禁止下載"
            />
          </ToolTips>
        </UFormGroup>
        <UFormGroup>
          <UCheckbox
            v-model="isAllowCustomPrice"
            name="isAllowCustomPrice"
            label="Accept tipping / 接受打賞"
          />
        </UFormGroup>
      </UCard>

      <component
        :is="hasMultiplePrices ? 'ul' : 'div'"
        class="flex flex-col gap-[12px]"
      >
        <UCard
          :ui="{
            body: { base: 'space-y-5 relative' },
            base: 'overflow-visible border-none !border-transparent',
          }"
        >
          <component
            :is="hasMultiplePrices ? 'li' : 'div'"
            v-for="(p, index) in prices"
            :key="p.index"
          >
            <UCard
              :ui="{
                body: {
                  base: 'flex flex-col gap-[20px]',
                },
                base: 'overflow-visible border-[4px]'
              }"
            >
              <template v-if="hasMultiplePrices" #header>
                <h3 class="font-bold font-mono">
                  {{ `Edition #${index + 1} / 版本 #${index + 1}` }}
                </h3>
              </template>
              <UFormGroup
                :label="`Unit Price in USD (Minimum ${MINIMAL_PRICE}, or 0 for free) / 版本定價（美元）`"
              >
                <UInput
                  v-model="p.price"
                  type="number"
                  step="0.01"
                  :min="0"
                />
              </UFormGroup>
              <UFormGroup
                label="No of copies / 數量"
              >
                <UInput
                  v-model="p.stock"
                  type="number"
                  step="1"
                  :min="0"
                  :max="Number(route.query.count) || undefined"
                />
              </UFormGroup>
              <UFormGroup label="Product Name" :ui="{ container: 'space-y-2' }">
                <template #label>
                  Product Name / 產品名稱
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
                <UInput
                  v-model="p.name"
                  placeholder="Product name"
                />
                <span class="block text-[14px] text-[#374151] mt-[8px]">Description (Optional) / 描述（選填）</span>
                <md-editor
                  v-model="p.descriptionEn"
                  language="en-US"
                  :editor-id="`en-${index}`"
                  :placeholder="mdEditorPlaceholder.en"
                  :toolbars="toolbarOptions"
                  :sanitize="sanitizeHtml"
                  :style="{ height: '200px', width: '100%', marginTop: '0px' }"
                />
              </UFormGroup>

              <div class="flex flex-col gap-2">
                <!-- Auto delivery option -->
                <div class="space-y-2">
                  <URadio
                    v-model="p.deliveryMethod"
                    value="auto"
                    :disabled="isEditMode && oldIsAutoDeliver"
                    name="deliveryMethod"
                    label="Auto delivery / 自動發書"
                  />

                  <div v-if="p.deliveryMethod === 'auto'" class="pl-8 space-y-2">
                    <UFormGroup label="Start ID (optional) / 起始 ID（選填）">
                      <UInput
                        v-model="autoDeliverNftIdInput"
                        class="font-mono"
                        placeholder="BOOKSN-0000"
                      />
                    </UFormGroup>

                    <UFormGroup label="Memo / 發書留言">
                      <UInput
                        v-model="p.autoMemo"
                        placeholder="Thank you for your support. It means a lot to me."
                      />
                    </UFormGroup>
                  </div>
                </div>

                <!-- Manual delivery option -->
                <div class="space-y-2">
                  <URadio
                    v-model="p.deliveryMethod"
                    value="manual"
                    :disabled="p.isPhysicalOnly"
                    name="deliveryMethod"
                    label="Manual delivery / 手動發書"
                  />
                  <div v-if="p.deliveryMethod === 'manual'" class="pl-8 space-y-2">
                    <UFormGroup>
                      <template #label>
                        <p>Autograph image / 簽名圖</p>
                        <span class="text-gray-500 text-[12px]">僅限 png 圖檔，檔案大小不超過 10MB</span>
                      </template>
                      <UInput
                        type="file"
                        accept="image/*"
                        @change="(e)=>onFileUpload(e, 'autographImage', index)"
                      />
                    </UFormGroup>
                  </div>
                </div>
              </div>

              <UFormGroup>
                <UCheckbox
                  v-model="p.isUnlisted"
                  name="isUnlisted"
                  label="Pause selling of this Edition / 暫停此版本的銷售"
                />
              </UFormGroup>
              <div class="flex flex-col gap-2">
                <UCheckbox
                  v-model="p.hasShipping"
                  name="hasShipping"
                  :disabled="(isEditMode && !p.hasShipping)"
                  label="Includes physical good that requires shipping / 包含需要運送的實體商品"
                />
                <ShippingRatesRateTable
                  v-if="p.hasShipping"
                  :is-show-physical-goods-checkbox="false"
                  :is-show-setting-modal-button="true"
                  :shipping-info="shippingRates"
                  @update-shipping-rates="updateShippingRate"
                />
              </div>
            </UCard>

            <div class="flex justify-center items-center">
              <UButton
                v-if="hasMultiplePrices"
                label="Delete"
                color="red"
                @click="deletePrice(index)"
              />
            </div>
          </component>
        </UCard>
      </component>
      <div class="flex justify-center items-center">
        <UButton
          v-if="props.isNewClassPage"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          icon="i-heroicons-plus-solid"
          label="Add Edition"
          @click="addMorePrice"
        />
      </div>

      <!-- Advanced settings -->
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
            <!-- Notification Email -->
            <UCard
              :ui="{
                header: { base: 'flex justify-between items-center' },
                body: { padding: '' },
              }"
            >
              <template #header>
                <h4 class="text-sm font-bold font-mono">
                  Email to receive sales notifications / 欲收到銷售通知的電郵
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
                :columns="[
                  { key: 'email', label: 'Email', sortable: true },
                  { key: 'action' },
                ]"
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

            <!-- Stripe connect -->
            <StripeConnectCard
              v-if="isEditMode"
              v-model:is-stripe-connect-checked="isStripeConnectChecked"
              v-model:is-using-default-account="isUsingDefaultAccount"
              :stripe-connect-wallet="stripeConnectWallet"
              :should-disable-setting="shouldDisableStripeConnectSetting"
              :login-address="wallet"

              @save="handleSaveStripeConnectWallet"
            />

            <!-- Share sales data -->
            <UCard
              :ui="{
                header: { base: 'flex justify-between items-center' },
                body: { padding: '', base: 'space-y-8' },
              }"
            >
              <template #header>
                <h4 class="text-sm font-bold font-mono">
                  Share sales data to wallets / 分享銷售數據給特定地址
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
          </div>
        </template>
      </UCard>

      <div class="w-full flex justify-center">
        <UButton
          :label="submitButtonText"
          :loading="isLoading"
          size="lg"
          :disabled="isLoading"
          @click="onSubmit"
        />
      </div>
    </template>

    <UModal
      :model-value="!!isLoading"
      :prevent-close="true"
      :ui="{ base: 'p-4 gap-2' }"
    >
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <UBadge color="Badge" variant="soft">
            Loading...
          </UBadge>
          <p class="text-xs text-gray-500">
            請勿關閉此視窗，直到操作完成。
          </p>
        </div>
        <UProgress animation="carousel" color="primary" class="w-full" />
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { MdEditor, config, type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

import { v4 as uuidv4 } from 'uuid'
import type { FormError } from '#ui/types'

import { DEFAULT_PRICE, MINIMAL_PRICE } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { useNftStore } from '~/stores/nft'
import { getPortfolioURL } from '~/utils'
import { getNFTAuthzGrants, sendNFTsToAPIWallet } from '~/utils/cosmos'
import { escapeHtml, sanitizeHtml, getFileInfo } from '~/utils/newClass'
import { getApiEndpoints } from '~/constant/api'

const { LCD_URL, LIKE_CO_API } = useRuntimeConfig().public
const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const stripeStore = useStripeStore()
const { initIfNecessary } = walletStore
const { wallet, signer } = storeToRefs(walletStore)
const { newBookListing, updateEditionPrice } = bookStoreApiStore
const { fetchStripeConnectStatusByWallet } = stripeStore
const { getStripeConnectStatusByWallet } = storeToRefs(stripeStore)
const { token } = storeToRefs(bookStoreApiStore)
const nftStore = useNftStore()

const UPLOAD_FILESIZE_MAX = 20 * 1024 * 1024

const emit = defineEmits(['submit'])
const router = useRouter()
const route = useRoute()
const classId = ref(
  route.params.classId || (route.query.class_id as string)
)
const editionIndex = ref(route.params.editionIndex as string) || ref(route.query.price_index as string)
const newEditionIndex = ref(route.query.price_index)

const error = ref('')
const isLoading = ref(false)

const mdEditorPlaceholder = ref({
  en: 'e.g.: This edition includes EPUB and PDF ebook files.',
  zh: '例：此版本包含 EPUB 及 PDF 電子書檔'
})

const classIdInput = ref(classId || '')
const nextPriceIndex = ref(1)
const hideDownload = ref(false)
const autoDeliverNftIdInput = ref('')
const isAllowCustomPrice = ref(true)

const prices = ref<any[]>([
  {
    price: DEFAULT_PRICE,
    deliveryMethod: 'auto',
    autoMemo: 'Thank you for your support. It means a lot to me.',
    stock: Number((route.query.count as string) || 1),
    name: '標準版',

    nameEn: 'Standard Edition',
    nameZh: '標準版',
    descriptionEn: '',
    descriptionZh: '',
    hasShipping: false,
    isPhysicalOnly: false,
    isAllowCustomPrice: isAllowCustomPrice.value,
    isUnlisted: false
  }
])
const shippingRates = ref<any[]>([])
const hasMultiplePrices = computed(() => prices.value.length > 1)
const moderatorWallets = ref<string[]>([
  'like1rclg677y2jqt8x4ylj0kjlqjjmnn6w63uflpgr'
])
const moderatorWalletsGrants = ref<any>({})
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const shouldDisableStripeConnectSetting = ref(false)
const isUsingDefaultAccount = ref(true)
const iscnData = ref<any>(null)
const oldIsAutoDeliver = ref(false)
const oldStock = ref(0)

const toolbarOptions = ref<ToolbarNames[]>([
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

const isEditMode = computed(() =>
  Boolean(route.params.classId && editionIndex.value)
)
const pageTitle = computed(() =>
  isEditMode.value ? 'Edit Current Edition' : 'General settings / 一般選項'
)
const submitButtonText = computed(() =>
  isEditMode.value ? 'Save Changes' : 'Submit'
)
const shouldShowAdvanceSettings = ref<boolean>(false)
const iscnId = ref('')

const moderatorWalletsTableColumns = computed(() => [
  { key: 'wallet', label: 'Wallet', sortable: true },
  { key: 'authz', label: 'Send NFT Grant', sortable: false },
  { key: 'remove', label: '', sortable: false }
])

const moderatorWalletsTableRows = computed(() =>
  moderatorWallets.value.map((wallet, index) => {
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
  })
)

const notificationEmailsTableRows = computed(() =>
  notificationEmails.value.map((email, index) => ({
    index,
    email
  }))
)

const iscnDataLanguage = computed(() => {
  return iscnData.value?.contentMetadata?.inLanguage
})

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

const props = defineProps<{
 isNewClassPage: boolean
}>()

useSeoMeta({
  title: 'New Book Listing',
  ogTitle: 'New Book Listing'
})

onMounted(async () => {
  try {
    isLoading.value = true

    if (isEditMode.value) {
      await fetchStripeConnectStatusByWallet(wallet.value)
      const classResData: any = await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`, {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
      if (classResData) {
        shippingRates.value = classResData?.shippingRates || []
        if (classResData?.ownerWallet !== wallet.value) {
          throw new Error('NOT_OWNER_OF_NFT_CLASS')
        }
        if (classResData.prices.length) {
          const currentEdition = classResData.prices.find((e: any) => e.index.toString() === editionIndex.value)
          if (!currentEdition) {
            throw new Error('Edition not found')
          }
          prices.value = [{
            price: currentEdition.price,
            deliveryMethod: currentEdition.isAutoDeliver ? 'auto' : 'manual',
            autoMemo: currentEdition.autoMemo,
            stock: currentEdition.stock,
            name: classResData.inLanguage === 'en'
              ? currentEdition.name.en
              : currentEdition.name.zh,

            nameEn: currentEdition.name.en,
            nameZh: currentEdition.name.zh,
            descriptionEn: currentEdition.description.en,
            descriptionZh: currentEdition.description.zh,
            hasShipping: currentEdition.hasShipping,
            isPhysicalOnly: currentEdition.isPhysicalOnly,
            isAllowCustomPrice: currentEdition.isAllowCustomPrice,
            isUnlisted: currentEdition.isUnlisted
          }]
          isAllowCustomPrice.value = currentEdition.isAllowCustomPrice
          oldIsAutoDeliver.value = currentEdition.isAutoDeliver
          oldStock.value = currentEdition.stock
        } else {
          throw new Error('No prices found')
        }
      } else {
        throw new Error('NFT Class not found')
      }
    }

    if (getStripeConnectStatusByWallet.value(wallet.value).isReady) {
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

watch(isAllowCustomPrice, (newValue) => {
  prices.value.forEach((price) => {
    price.isAllowCustomPrice = newValue
  })
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) {
    error.value = ''
  }
})

watch(moderatorWallets, (newModeratorWallets) => {
  newModeratorWallets?.forEach(async (m) => {
    if (!moderatorWalletsGrants.value[m]) {
      try {
        moderatorWalletsGrants.value[m] = await getNFTAuthzGrants(
          wallet.value,
          m
        )
      } catch {}
    }
  })
})

watch(classId, async (newClassId) => {
  if (newClassId && !iscnId.value) {
    // Fetch ISCN data
    if (!iscnId.value) {
      iscnId.value = await getIscnId()
    }
    if (!iscnId.value) { return }
    const data = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnId.value)}`)
    const { records } = data as any

    if (!records?.[0]?.data) { return }

    iscnData.value = records[0].data
    const fingerprints = iscnData?.value.contentFingerprints
    if (fingerprints && isContentFingerPrintEncrypted(fingerprints)) {
      hideDownload.value = true
    }
  }
}, { immediate: true })

function isContentFingerPrintEncrypted (contentFingerprints: any[]) {
  const apiEndpoints = getApiEndpoints()
  const arweaveLinkEndpoint = apiEndpoints.API_GET_ARWEAVE_V2_LINK
  return contentFingerprints.some((fingerprint) => {
    return !!fingerprint.startsWith(arweaveLinkEndpoint) || fingerprint.includes('?key=')
  })
}

async function onFileUpload (files: FileList, key: string, index: number) {
  try {
    if (files?.length) {
      const file = files[0]
      if (file.size < UPLOAD_FILESIZE_MAX) {
        const info = await getFileInfo(file)
        if (info) {
          const { ipfsHash } = info
          prices.value[index][key] = ipfsHash
        }
      } else {
        error.value = 'File size exceeds 20MB'
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('File upload error:', err)
    error.value = 'Failed to upload file'
  }
}

function addMorePrice () {
  nextPriceIndex.value += 1
  prices.value.push({
    index: uuidv4(),
    price: DEFAULT_PRICE,
    deliveryMethod: 'auto',
    autoMemo: '',
    stock: 1,
    name: iscnDataLanguage.value === 'en'
      ? `Tier ${nextPriceIndex.value}`
      : `級別 ${nextPriceIndex.value}`,
    nameEn: `Tier ${nextPriceIndex.value}`,
    nameZh: `級別 ${nextPriceIndex.value}`,
    descriptionEn: '',
    descriptionZh: '',
    hasShipping: false,
    isPhysicalOnly: false,
    isAllowCustomPrice: true,
    isUnlisted: false
  })
}

function deletePrice (index: number) {
  prices.value.splice(index, 1)
}

function updateShippingRate (options: any) {
  shippingRates.value = options
}

function addModeratorWallet () {
  if (!moderatorWalletInput.value) {
    return
  }
  moderatorWallets.value.push(moderatorWalletInput.value)
  moderatorWalletInput.value = ''
}

function addNotificationEmail () {
  if (!notificationEmailInput.value) {
    return
  }
  notificationEmails.value.push(notificationEmailInput.value)
  notificationEmailInput.value = ''
}

function handleSaveStripeConnectWallet (wallet: any) {
  stripeConnectWallet.value = wallet
  shouldDisableStripeConnectSetting.value = true
}

function mapPrices (prices: any) {
  const isEnglish = iscnDataLanguage.value === 'en'

  return prices.map((p: any) => ({
    name: isEnglish
      ? { en: p.name, zh: p.nameZh }
      : { en: p.nameEn, zh: p.name },
    description: isEnglish
      ? {
          en: escapeHtml(p.description),
          zh: escapeHtml(p.descriptionZh)
        }
      : {
          en: escapeHtml(p.descriptionEn),
          zh: escapeHtml(p.description)
        },
    priceInDecimal: Math.round(Number(p.price) * 100),
    price: Number(p.price),
    stock: Number(p.stock),
    isAutoDeliver: !p.isPhysicalOnly && p.deliveryMethod === 'auto',
    isAllowCustomPrice: p.isAllowCustomPrice,
    isUnlisted: p.isUnlisted ?? false,
    autoMemo: p.deliveryMethod === 'auto' ? p.autoMemo || '' : '',
    hasShipping: p.hasShipping || false,
    isPhysicalOnly: p.isPhysicalOnly || false,
    autographImage: p.autographImage || ''
  }))
}

function validate (prices: any[]) {
  const errors: FormError[] = []
  prices.forEach((price: any) => {
    if (!price.name.en || !price.name.zh) {
      errors.push({
        path: 'name',
        message: 'Please input product name'
      })
    }
    if (!price.isAutoDeliver && !price.autographImage) {
      errors.push({
        path: 'autographImage',
        message: 'Please upload autograph image'
      })
    }
    if (price.isAutoDeliver && !price.autoMemo) {
      errors.push({
        path: 'autoMemo',
        message: 'Please input auto delivery memo'
      })
    }
    if (price.hasShipping && !shippingRates.value.length) {
      errors.push({
        path: 'shipping',
        message: 'Please input shipping rates'
      })
    }
  })

  if (errors.length > 0) {
    error.value = errors.map(e => e.message).join('\n')
    return false
  }
  return true
}

async function onSubmit () {
  try {
    const p = mapPrices(prices.value)
    if (!validate(p)) {
      return
    }

    if (isEditMode.value) {
      await submitEditedClass()
    } else if (props.isNewClassPage) { // in /publish-nft-book
      await submitNewClass()
    } else {
      const existingListing = await fetch(`${LIKE_CO_API}/likernft/book/store/${classIdInput.value}`)
      if (!existingListing.ok) {
        await submitNewClass()
      } else {
        await addNewEdition()
      }
    }
  } catch (error) {

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

    isLoading.value = true

    const data = await $fetch(
      `${LCD_URL}/cosmos/nft/v1beta1/classes/${classIdInput.value}`
    )
    const collectionId =
      (data as any)?.class?.data?.metadata?.nft_meta_collection_id || ''
    if (
      !collectionId.includes('nft_book') &&
      !collectionId.includes('book_nft')
    ) {
      throw new Error('NFT Class not in NFT BOOK meta collection')
    }

    const p = mapPrices(prices.value)
    if (
      p.find((price: any) => price.price !== 0 && price.price < MINIMAL_PRICE)
    ) {
      throw new Error(
        `Price of each edition must be at least $${MINIMAL_PRICE} or $0 (free)`
      )
    }

    const connectedWallets =
      isStripeConnectChecked.value && stripeConnectWallet.value
        ? {
            [stripeConnectWallet.value]: 100
          }
        : null
    const s = shippingRates.value.length
      ? shippingRates.value.map(rate => ({
        name: { en: rate.name.en, zh: rate.name.zh },
        priceInDecimal: rate.priceInDecimal,
        price: rate.priceInDecimal / 100
      }))
      : undefined

    const autoDeliverCount = p
      .filter((price: any) => price.isAutoDeliver)
      .reduce((acc: number, price: any) => acc + price.stock, 0)

    let autoDeliverNFTsTxHash
    if (autoDeliverCount > 0) {
      if (!wallet.value || !signer.value) {
        await initIfNecessary()
      }
      if (!wallet.value || !signer.value) {
        throw new Error('Unable to connect to wallet')
      }
      autoDeliverNFTsTxHash = await sendNFTsToAPIWallet(
        [classIdInput.value as string],
        [autoDeliverNftIdInput.value as string],
        autoDeliverCount,
        signer.value,
        wallet.value
      )
    }

    const shouldEnableCustomMessagePage =
      prices.value.some(price => price.deliveryMethod === 'manual')

    await newBookListing(classIdInput.value as string, {
      defaultPaymentCurrency: 'USD',
      connectedWallets,
      moderatorWallets: moderatorWallets.value,
      notificationEmails: notificationEmails.value,
      prices: p,
      shippingRates: s,
      mustClaimToView: true,
      enableCustomMessagePage: shouldEnableCustomMessagePage,
      hideDownload: hideDownload.value,
      autoDeliverNFTsTxHash
    })
    emit('submit')
  } catch (err) {
    const errorData = (err as any).data || err
    // eslint-disable-next-line no-console
    console.error(errorData)
    error.value = errorData
  } finally {
    shouldDisableStripeConnectSetting.value = false
    isLoading.value = false
  }
}

async function submitEditedClass () {
  try {
    if (!isEditMode.value) {
      throw new Error(
        'Unable to submit edit: Missing edition index or class ID'
      )
    }
    const p = mapPrices(prices.value)
    const editedPrice = p[0]

    isLoading.value = true

    let newAutoDeliverNFTsCount = 0
    if (editedPrice.isAutoDeliver) {
      newAutoDeliverNFTsCount = oldIsAutoDeliver.value
        ? editedPrice.stock - oldStock.value
        : editedPrice.stock
    }

    let autoDeliverNFTsTxHash
    if (newAutoDeliverNFTsCount > 0) {
      if (!wallet.value || !signer.value) {
        await initIfNecessary()
      }
      if (!wallet.value || !signer.value) {
        throw new Error('Unable to connect to wallet')
      }
      autoDeliverNFTsTxHash = await sendNFTsToAPIWallet(
        [classIdInput.value as string],
        [autoDeliverNftIdInput.value as string],
        newAutoDeliverNFTsCount,
        signer.value,
        wallet.value
      )
    }

    await updateEditionPrice(classId.value as string, editionIndex.value, {
      autoDeliverNFTsTxHash,
      price: editedPrice
    })

    router.push({ name: 'nft-book-store' })
  } catch (err) {
    const errorData = (err as any).data || err
    // eslint-disable-next-line no-console
    console.error(errorData)
    error.value = errorData
  } finally {
    isLoading.value = false
  }
}

async function addNewEdition () {
  try {
    isLoading.value = true
    const p = mapPrices(prices.value)
    const autoDeliverCount = p
      .filter((price: any) => price.isAutoDeliver)
      .reduce((acc: number, price: any) => acc + price.stock, 0)

    let autoDeliverNFTsTxHash

    if (autoDeliverCount > 0) {
      if (!wallet.value || !signer.value) {
        await initIfNecessary()
      }
      if (!wallet.value || !signer.value) {
        throw new Error('Unable to connect to wallet')
      }
      autoDeliverNFTsTxHash = await sendNFTsToAPIWallet(
        [classIdInput.value as string],
        [autoDeliverNftIdInput.value as string],
        autoDeliverCount,
        signer.value,
        wallet.value
      )
    }
    const price = p[0]
    await bookStoreApiStore.addEditionPrice(classId.value as string, newEditionIndex.value as string, {
      price,
      autoDeliverNFTsTxHash
    })

    emit('submit')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function updateClassId ({ classId: newClassId, nftMintCount } : {
  classId: string
  nftMintCount?: number
}) {
  classId.value = newClassId
  classIdInput.value = newClassId
  if (nftMintCount) {
    prices.value[0].stock = nftMintCount
  }
  if (!iscnId.value) {
    iscnId.value = await getIscnId()
  }
}

async function getIscnId () {
  const classData = await nftStore.lazyFetchClassMetadataById(
    classId.value as string
  )
  if (classData?.data?.parent) {
    const parent = classData.data.parent
    return parent?.iscn_id_prefix
  }

  return ''
}

defineExpose({
  updateClassId
})

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
