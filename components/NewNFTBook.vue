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
            :value="classId"
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
                  :max="maxSupply"
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
                    :disabled="isEditMode && p.oldIsAutoDeliver"
                    name="deliveryMethod"
                    label="Auto delivery / 自動發書"
                  />

                  <div v-if="p.deliveryMethod === 'auto'" class="pl-8 space-y-2">
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
                    :disabled="isEditMode && p.oldIsAutoDeliver"
                    name="deliveryMethod"
                    label="Manual delivery / 手動發書"
                    @click="onClickManualDelivery(p)"
                  />
                  <div v-if="p.deliveryMethod === 'manual'" class="pl-8 space-y-2">
                    <UFormGroup>
                      <template #label>
                        <p>Autograph image / 簽名圖</p>
                        <span class="text-gray-500 text-[12px]">僅限 png 圖檔，檔案大小不超過 1MB，建議尺寸為 600 x 200 </span>
                      </template>
                      <UInput
                        type="file"
                        accept="image/png"
                        @change="(e) => onImgUpload(e, 'signatureImage')"
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
          <UBadge variant="soft">
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

import {
  DEFAULT_PRICE,
  MINIMAL_PRICE,
  DEFAULT_MAX_SUPPLY,
  DEFAULT_STOCK
} from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { useNftStore } from '~/stores/nft'
import { getPortfolioURL } from '~/utils'
import { escapeHtml, sanitizeHtml } from '~/utils/newClass'
import { getApiEndpoints } from '~/constant/api'

const { LIKE_CO_API } = useRuntimeConfig().public
const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const stripeStore = useStripeStore()
const { wallet } = storeToRefs(walletStore)
const { newBookListing, updateEditionPrice, uploadSignImages } = bookStoreApiStore
const { fetchStripeConnectStatusByWallet } = stripeStore
const { getStripeConnectStatusByWallet } = storeToRefs(stripeStore)
const { token } = storeToRefs(bookStoreApiStore)
const nftStore = useNftStore()

const { getNFTClassConfig, getBalanceOf } = useNFTContractReader()

const UPLOAD_FILESIZE_MAX = 1 * 1024 * 1024

const emit = defineEmits(['submit'])
const editionIndex = computed(() => {
  return props.editionIndex
})
const { lazyFetchClassMetadataById } = nftStore
const error = ref('')
const isLoading = ref(false)

const mdEditorPlaceholder = ref({
  en: 'e.g.: This edition includes EPUB and PDF ebook files.',
  zh: '例：此版本包含 EPUB 及 PDF 電子書檔'
})

const classId = computed(() => {
  return props.classId
})
const nextPriceIndex = ref(1)
const hideDownload = ref(false)
const isAllowCustomPrice = ref(true)

const prices = ref<any[]>([
  {
    price: DEFAULT_PRICE,
    deliveryMethod: 'auto',
    autoMemo: 'Thank you for your support. It means a lot to me.',
    stock: DEFAULT_STOCK,
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
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const shouldDisableStripeConnectSetting = ref(false)
const isUsingDefaultAccount = ref(true)
const iscnData = ref<any>(null)

const signatureImage = ref<File | null>(null)

const maxSupply = computed(() => {
  if (isEditMode.value || editionIndex.value !== undefined) {
    return classMaxSupply.value - otherExistingStock.value
  }
  return classMaxSupply.value
})
const availableManualStock = computed(() => {
  return Math.max(ownedCount.value - otherExistingManualStock.value, 0)
})
const otherExistingStock = ref(0)
const otherExistingManualStock = ref(0)
const classMaxSupply = ref(DEFAULT_MAX_SUPPLY)
const ownedCount = ref(0)

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
  props.isEditMode
)
const pageTitle = computed(() =>
  isEditMode.value ? 'Edit Current Edition' : 'General settings / 一般選項'
)
const submitButtonText = computed(() =>
  isEditMode.value ? 'Save Changes' : 'Submit'
)
const shouldShowAdvanceSettings = ref<boolean>(false)

const moderatorWalletsTableColumns = computed(() => [
  { key: 'wallet', label: 'Wallet', sortable: true },
  { key: 'remove', label: '', sortable: false }
])

const moderatorWalletsTableRows = computed(() =>
  moderatorWallets.value.map((wallet, index) => {
    return {
      index,
      wallet,
      walletLink: getPortfolioURL(wallet)
    }
  })
)

const notificationEmailsTableRows = computed(() =>
  notificationEmails.value.map((email: string, index: number) => ({
    index,
    email
  }))
)

const iscnDataLanguage = computed(() => {
  return iscnData.value?.contentMetadata?.inLanguage
})

watch(isLoading, (val: boolean) => {
  if (val) {
    error.value = ''
  }
}, { immediate: true })

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

const props = defineProps({
  isNewClassPage: { type: Boolean, default: false },
  classId: { type: String, default: '' },
  editionIndex: { type: [String, Number], default: undefined },
  isEditMode: { type: Boolean, default: false }
})

useSeoMeta({
  title: 'New Book Listing',
  ogTitle: 'New Book Listing'
})

onMounted(async () => {
  try {
    isLoading.value = true
    const [bookConfig, balance] = await Promise.all([
      getNFTClassConfig(classId.value as string),
      wallet.value ? getBalanceOf(classId.value as string, wallet.value) : 0
    ])
    classMaxSupply.value = Number((bookConfig as any)?.max_supply) || DEFAULT_MAX_SUPPLY
    ownedCount.value = Number(balance) || 0

    if (isEditMode.value || editionIndex.value !== undefined) {
      if (wallet.value) {
        try {
          await fetchStripeConnectStatusByWallet(wallet.value)
          if (getStripeConnectStatusByWallet.value(wallet.value).isReady) {
            isStripeConnectChecked.value = true
            stripeConnectWallet.value = wallet.value
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
        }
      }
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
        if (editionIndex.value !== undefined) {
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
              isUnlisted: currentEdition.isUnlisted,
              oldIsAutoDeliver: currentEdition.isAutoDeliver,
              oldStock: currentEdition.stock
            }]
            isAllowCustomPrice.value = currentEdition.isAllowCustomPrice
          } else {
            throw new Error('No prices found')
          }
        }
        otherExistingStock.value = classResData.prices.reduce((acc: number, price: any) => {
          if (price.index.toString() !== editionIndex.value) {
            return acc + price.stock
          }
          return acc
        }, 0)
        otherExistingManualStock.value = classResData.prices.reduce((acc: number, price: any) => {
          if (price.index.toString() !== editionIndex.value && !price.isAutoDeliver) {
            return acc + price.stock
          }
          return acc
        }, 0)
      } else {
        throw new Error('NFT Class not found')
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

watch(isAllowCustomPrice, (newValue: boolean) => {
  prices.value.forEach((price: any) => {
    price.isAllowCustomPrice = newValue
  })
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) {
    error.value = ''
  }
})

watch(classId, async (newClassId) => {
  if (newClassId) {
    const data = await lazyFetchClassMetadataById(newClassId as string)
    const fingerprints = data?.contentFingerprints
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

function onImgUpload (
  files: FileList | null,
  key: 'signatureImage' | 'memoImage' = 'signatureImage'
) {
  if (!files?.length) { return }

  const file = files[0]
  if (file.type !== 'image/png') {
    error.value = '僅支援 PNG 檔案'
    return
  }
  if (file.size > UPLOAD_FILESIZE_MAX) {
    error.value = '檔案超過 1MB 限制'
    return
  }

  if (key === 'signatureImage') {
    signatureImage.value = file
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Unknown upload key: ${key}`)
  }
}

function onClickManualDelivery (price: any) {
  price.stock = Math.min(availableManualStock.value, price.stock)
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
    isPhysicalOnly: p.isPhysicalOnly || false
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
      const existingListing = await fetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`)
      if (!existingListing.ok) {
        await submitNewClass()
      } else {
        await addNewEdition()
      }
    }
    // Upload signature image
    if (signatureImage.value) {
      const form = new FormData()

      if (signatureImage.value) {
        form.append('signImage', signatureImage.value)
      }

      await uploadSignImages(form, classId.value)
    }
    emit('submit')
  } catch (error) {

  }
}

async function submitNewClass () {
  try {
    if (!classId.value) {
      throw new Error('Please input NFT class ID')
    }
    if (moderatorWalletInput.value) {
      throw new Error('Please press "Add" button to add moderator wallet')
    }
    if (notificationEmailInput.value) {
      throw new Error('Please press "Add" button to add notification email')
    }

    isLoading.value = true

    const data = await lazyFetchClassMetadataById(classId.value)
    const collectionId = data?.nft_meta_collection_id || ''
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
      ? shippingRates.value.map((rate: any) => ({
        name: { en: rate.name.en, zh: rate.name.zh },
        priceInDecimal: rate.priceInDecimal,
        price: rate.priceInDecimal / 100
      }))
      : undefined

    const shouldEnableCustomMessagePage =
      prices.value.some((price: any) => price.deliveryMethod === 'manual')

    await newBookListing(classId.value as string, {
      defaultPaymentCurrency: 'USD',
      connectedWallets,
      moderatorWallets: moderatorWallets.value,
      notificationEmails: notificationEmails.value,
      prices: p,
      shippingRates: s,
      mustClaimToView: true,
      enableCustomMessagePage: shouldEnableCustomMessagePage,
      hideDownload: hideDownload.value
    })
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

    await updateEditionPrice(classId.value as string, editionIndex.value, {
      price: editedPrice
    })
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

    const price = p[0]
    await bookStoreApiStore.addEditionPrice(classId.value.toString(), (editionIndex.value || 0).toString(), {
      price
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

</script>
<style scoped>
.md-editor {
  width: 60vw;
  min-width: 300px;
  height: 500px;
}
</style>
