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

    <template v-if="bookstoreApiStore.isAuthenticated">
      <ul
        class="flex flex-col gap-[12px]"
      >
        <UCard
          :ui="{
            body: { base: 'space-y-5 relative' },
            base: 'overflow-visible border-none !border-transparent',
          }"
        >
          <li
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
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="font-bold font-mono">
                    {{ `${$t('nft_book_form.edition_number', { number: index + 1 })} - ${p.name || $t('nft_book_form.product_name_placeholder')}` }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <UToggle v-model="p.isListed" />
                    <p class="text-sm">
                      {{ p.isListed ? $t('nft_book_form.selling') : $t('nft_book_form.pause_selling') }}
                    </p>
                  </div>
                </div>
              </template>
              <UFormGroup
                :label="$t('nft_book_form.unit_price_label')"
              >
                <USelectMenu
                  v-model="p.price"
                  :options="USD_PRICING_OPTIONS"
                  value-attribute="value"
                />
              </UFormGroup>
              <UFormGroup
                :label="$t('nft_book_form.copies_label')"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Auto Delivery Block -->
                  <div
                    class="border-2 rounded-lg p-4 cursor-pointer transition-all duration-200"
                    :class="p.deliveryMethod === 'auto' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
                    @click="p.deliveryMethod = 'auto'"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <URadio
                        v-model="p.deliveryMethod"
                        value="auto"
                        name="deliveryMethod"
                        :label="$t('nft_book_form.unlimited')"
                      />
                    </div>

                    <div class="space-y-3">
                      <UFormGroup
                        :label="$t('nft_book_form.auto_delivery_memo')"
                      >
                        <UInput
                          v-model="p.autoMemo"
                          :placeholder="$t('nft_book_form.memo_placeholder')"
                        />
                      </UFormGroup>
                    </div>
                  </div>

                  <!-- Manual Delivery Block -->
                  <div
                    class="border-2 rounded-lg p-4 cursor-pointer transition-all duration-200"
                    :class="p.deliveryMethod === 'manual' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
                    @click="p.deliveryMethod = 'manual'"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <URadio
                        v-model="p.deliveryMethod"
                        value="manual"
                        name="deliveryMethod"
                        :label="$t('nft_book_form.limited')"
                      />
                      <UTooltip
                        :text="$t('nft_book_form.manual_delivery_tooltip')"
                      >
                        <UIcon name="i-heroicons-question-mark-circle" />
                      </UTooltip>
                    </div>

                    <div class="space-y-3">
                      <UFormGroup :label="$t('nft_book_form.stock')">
                        <UInput
                          v-model="p.stock"
                          type="number"
                          step="1"
                          :min="1"
                          :max="maxSupply"
                          placeholder="100"
                        />
                      </UFormGroup>
                      <UFormGroup :ui="{ label: {base:'w-full flex justify-between items-center'} }">
                        <template #label>
                          <p class="block">
                            {{ $t('nft_book_form.autograph_image') }}
                          </p>
                          <span class="text-gray-500 text-[12px] block">
                            {{ $t('nft_book_form.image_requirements') }}
                          </span>
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
              </UFormGroup>

              <UFormGroup :ui="{ container: 'space-y-2' }">
                <template #label>
                  {{ $t('nft_book_form.product_name') }}
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
                  :placeholder="$t('nft_book_form.product_name_placeholder')"
                />
                <span class="block text-[14px] text-[#374151] mt-[8px]">{{ $t('nft_book_form.description_optional') }}</span>
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
            </UCard>

            <div class="flex justify-center items-center mt-2">
              <UButton
                v-if="hasMultiplePrices"
                :label="$t('common.delete')"
                color="gray"
                leading-icon="i-heroicons-trash"
                @click="deletePrice(index)"
              />
            </div>
          </li>
        </UCard>
      </ul>
      <div class="flex justify-center items-center">
        <UButton
          v-if="props.isNewClassPage && prices.length < 2"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          icon="i-heroicons-plus-solid"
          :label="$t('nft_book_form.add_edition')"
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
            {{ $t('nft_book_form.settings') }}
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
            <UFormGroup class="flex items-center">
              <UTooltip class="flex items-center gap-2" :text="$t('nft_book_form.accept_tipping_tooltip')">
                <UCheckbox
                  v-model="isAllowCustomPrice"
                  name="isAllowCustomPrice"
                  :label="$t('nft_book_form.accept_tipping')"
                />

                <UIcon name="i-heroicons-question-mark-circle" />
              </UTooltip>
            </UFormGroup>

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
            {{ $t('common.loading') }}
          </UBadge>
          <p class="text-xs text-gray-500">
            {{ $t('nft_book_form.loading_progress_text') }}
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
  USD_PRICING_OPTIONS,
  DEFAULT_MAX_SUPPLY
} from '~/constant'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { useNftStore } from '~/stores/nft'
import { escapeHtml, sanitizeHtml } from '~/utils/newClass'
import { getApiEndpoints } from '~/constant/api'
const { t: $t } = useI18n()

const { LIKE_CO_API } = useRuntimeConfig().public
const walletStore = useWalletStore()
const bookstoreApiStore = useBookstoreApiStore()
const stripeStore = useStripeStore()
const { wallet } = storeToRefs(walletStore)
const { newBookListing, updateEditionPrice, uploadSignImages } = bookstoreApiStore
const { fetchStripeConnectStatusByWallet } = stripeStore
const { getStripeConnectStatusByWallet } = storeToRefs(stripeStore)
const { token } = storeToRefs(bookstoreApiStore)
const nftStore = useNftStore()

const { getBalanceOf } = useNFTContractReader()

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
    autoMemo: '',
    stock: 100,
    name: $t('prices.standard_edition'),

    nameEn: 'Standard Edition',
    nameZh: '標準版',
    descriptionEn: '',
    descriptionZh: '',
    hasShipping: false,
    isPhysicalOnly: false,
    isAllowCustomPrice: isAllowCustomPrice.value,
    isListed: true
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

const maxSupply = ref(Number(DEFAULT_MAX_SUPPLY))

const otherExistingStock = ref(0)
const otherExistingManualStock = ref(0)
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
const submitButtonText = computed(() =>
  isEditMode.value ? $t('common.save') : $t('common.submit')
)
const shouldShowAdvanceSettings = ref<boolean>(true)

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
  title: () => $t('seo_titles.new_book_listing'),
  ogTitle: () => $t('seo_titles.new_book_listing')
})

onMounted(async () => {
  try {
    isLoading.value = true
    const balance = wallet.value ? (await getBalanceOf(classId.value as string, wallet.value)) : 0
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
              isListed: !currentEdition.isUnlisted,
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
        throw new Error($t('errors.nft_class_not_found'))
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
    if (fingerprints && isContentFingerprintEncrypted(fingerprints)) {
      hideDownload.value = true
    }
  }
}, { immediate: true })

function isContentFingerprintEncrypted (contentFingerprints: any[]) {
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
    error.value = $t('errors.png_only')
    return
  }
  if (file.size > UPLOAD_FILESIZE_MAX) {
    error.value = $t('errors.file_size_limit')
    return
  }

  if (key === 'signatureImage') {
    signatureImage.value = file
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Unknown upload key: ${key}`)
  }
}

function addMorePrice () {
  nextPriceIndex.value += 1
  prices.value.push({
    index: uuidv4(),
    price: DEFAULT_PRICE,
    deliveryMethod: 'auto',
    autoMemo: '',
    stock: 100,
    name: iscnDataLanguage.value === 'en'
      ? `Tier ${nextPriceIndex.value}`
      : '增訂版',
    nameEn: `Tier ${nextPriceIndex.value}`,
    nameZh: '增訂版',
    descriptionEn: '',
    descriptionZh: '',
    hasShipping: false,
    isPhysicalOnly: false,
    isAllowCustomPrice: true,
    isListed: true
  })
}

function deletePrice (index: number) {
  prices.value.splice(index, 1)
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
    stock: p.deliveryMethod === 'auto' ? 0 : Number(p.stock),
    isAutoDeliver: !p.isPhysicalOnly && p.deliveryMethod === 'auto',
    isAllowCustomPrice: p.isAllowCustomPrice,
    isUnlisted: !p.isListed,
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
        message: $t('errors.product_name_required')
      })
    }
    if (price.hasShipping && !shippingRates.value.length) {
      errors.push({
        path: 'shipping',
        message: $t('errors.shipping_rates_required')
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
      throw new Error($t('errors.nft_class_id_required'))
    }
    if (moderatorWalletInput.value) {
      throw new Error($t('errors.add_moderator_wallet'))
    }
    if (notificationEmailInput.value) {
      throw new Error($t('errors.add_notification_email'))
    }

    isLoading.value = true

    const data = await lazyFetchClassMetadataById(classId.value)
    const collectionId = data?.nft_meta_collection_id || ''
    if (
      !collectionId.includes('nft_book') &&
      !collectionId.includes('book_nft')
    ) {
      throw new Error($t('errors.not_nft_book_collection'))
    }

    const p = mapPrices(prices.value)

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
        $t('errors.missing_edition_data')
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
    await bookstoreApiStore.addEditionPrice(classId.value.toString(), (editionIndex.value || 0).toString(), {
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
