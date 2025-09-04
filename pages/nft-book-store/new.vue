<template>
  <PageBody class="pb-[40px]">
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

    <UProgress v-if="isLoading" animation="carousel">
      <template #indicator>
        {{ $t('loading.progress') }}
      </template>
    </UProgress>

    <template v-if="bookstoreApiStore.isAuthenticated">
      <UCard :ui="{ body: { base: 'space-y-4' } }">
        <template #header>
          <h2 class="font-bold font-mono">
            {{ pageTitle }}
          </h2>
        </template>

        <UFormGroup :label="$t('form.nft_class_id')">
          <UInput
            v-if="!isEditMode"
            v-model="classIdInput"
            class="font-mono"
            placeholder="0x...."
          />
          <UInput v-else :model-value="classId" :readonly="true" />
        </UFormGroup>

        <UFormGroup :label="$t('form.table_of_content')">
          <UTextarea v-model="tableOfContents" />
        </UFormGroup>
      </UCard>

      <component
        :is="hasMultiplePrices ? 'ul' : 'div'"
        class="flex flex-col gap-[12px]"
      >
        <component
          :is="hasMultiplePrices ? 'li' : 'div'"
          v-for="(p, index) in prices"
          :key="p.index"
        >
          <UCard
            :ui="{
              body: { base: 'space-y-5 border-[4px] relative' },
              base: 'overflow-visible border-[2px]',
            }"
          >
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
                  {{ $t('form.pricing_availability') }}
                </h3>
              </template>
              <UFormGroup
                :label="$t('form.unit_price_label', { minPrice: MINIMAL_PRICE })"
              >
                <USelectMenu
                  v-model="p.price"
                  :options="USD_PRICING_OPTIONS"
                  value-attribute="value"
                  @update:model-value="(value) => handlePriceChange(value, index)"
                />
              </UFormGroup>
              <UFormGroup
                :label="$t('new_listing.total_nft_for_sale', { type: hasMultiplePrices ? 'edition' : 'ebook' })"
              >
                <UInput
                  :model-value="p.stock"
                  type="number"
                  step="1"
                  :min="0"
                  :max="Number(route.query.count) || undefined"
                  @input="(e: InputEvent) => updatePrice(e, 'stock', index)"
                />
              </UFormGroup>
              <URadioGroup
                v-model="p.deliveryMethod"
                :disabled="p.isPhysicalOnly"
                :legend="$t('form.delivery_method', { type: priceItemLabel })"
                :options="deliverMethodOptions"
                @change="handleDeliveryMethodChange"
              />
              <UFormGroup v-if="p.deliveryMethod === 'auto'">
                <template #label>
                  {{ $t('form.memo_delivery', { type: priceItemLabel }) }}
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
                  :model-value="p.autoMemo"
                  @input="(e: InputEvent) => updatePrice(e, 'autoMemo', index)"
                />
              </UFormGroup>
              <UFormGroup
                v-else
                :label="$t('form.is_physical_only')"
              >
                <UCheckbox
                  v-model="p.isPhysicalOnly"
                  name="isPhysicalOnly"
                  :label="$t('form.no_digital_files')"
                />
              </UFormGroup>

              <UFormGroup>
                <template #label>
                  {{ $t('form.allow_custom_price') }}
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
                  v-model="p.isAllowCustomPrice"
                  name="isAllowCustomPrice"
                  :label="$t('form.allow_pay_more')"
                />
              </UFormGroup>
              <UFormGroup :label="$t('form.unlist_edition')">
                <UCheckbox
                  v-model="p.isUnlisted"
                  name="isUnlisted"
                  :label="$t('form.pause_selling_edition')"
                />
              </UFormGroup>
            </UCard>

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
                  {{ $t('form.product_information') }}
                </h3>
              </template>
              <UFormGroup :label="$t('form.product_name')" :ui="{ container: 'space-y-2' }">
                <template #label>
                  {{ $t('form.product_name_english') }}
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
                  placeholder="Product Name"
                  :model-value="p.nameEn"
                  @input="(e: InputEvent) => updatePrice(e, 'nameEn', index)"
                />
                <span class="block text-[14px] text-[#374151] mt-[8px]">{{ $t('form.description_optional') }}</span>
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
              <UFormGroup :ui="{ container: 'space-y-2 my-[20px]' }">
                <template #label>
                  {{ $t('form.product_name_chinese') }}
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
                  placeholder="產品名稱"
                  :model-value="p.nameZh"
                  @input="(e: InputEvent) => updatePrice(e, 'nameZh', index)"
                />
                <span class="block text-[14px] text-[#374151] mt-[8px]">{{ $t('form.description_optional') }}</span>
                <md-editor
                  v-model="p.descriptionZh"
                  language="en-US"
                  :editor-id="`zh-${index}`"
                  :placeholder="mdEditorPlaceholder.zh"
                  :toolbars="toolbarOptions"
                  :sanitize="sanitizeHtml"
                  :style="{ height: '200px', width: '100%', marginTop: '0px' }"
                />
              </UFormGroup>
            </UCard>

            <ShippingRatesRateTable
              v-model="p.hasShipping"
              :is-show-physical-goods-checkbox="true"
              :is-show-setting-modal-button="true"
              :shipping-info="shippingRates"
            />
            <div class="flex justify-center items-center">
              <UButton
                v-if="hasMultiplePrices"
                :label="$t('common.delete')"
                color="red"
                @click="deletePrice(index)"
              />
            </div>
          </UCard>
        </component>
      </component>
      <div class="flex justify-center items-center">
        <UButton
          v-if="!isEditMode"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          icon="i-heroicons-plus-solid"
          :label="$t('form.add_edition')"
          @click="addMorePrice"
        />
      </div>

      <StripeConnectCard
        v-model:is-stripe-connect-checked="isStripeConnectChecked"
        v-model:is-using-default-account="isUsingDefaultAccount"
        :stripe-connect-wallet="stripeConnectWallet"
        :should-disable-setting="shouldDisableStripeConnectSetting"
        :login-address="wallet"

        @save="handleSaveStripeConnectWallet"
      />

      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '' },
        }"
      >
        <template #header>
          <h4 class="text-sm font-bold font-mono">
            {{ $t('form.email_notifications') }}
          </h4>

          <div class="flex gap-2">
            <UInput
              v-model="notificationEmailInput"
              placeholder="abc@example.com"
            />

            <UButton
              :label="$t('common.add')"
              :variant="notificationEmailInput ? 'outline' : 'solid'"
              :color="notificationEmailInput ? 'primary' : 'gray'"
              :disabled="!notificationEmailInput"
              @click="addNotificationEmail"
            />
          </div>
        </template>

        <UTable
          :columns="[
            { key: 'email', label: $t('table.email'), sortable: true },
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

      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '12px' },
        }"
      >
        <div class="flex justify-between items-center w-full">
          <h3 class="font-bold font-mono">
            {{ $t('nft_book_form.advanced_settings') }}
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
              :is-show-setting-modal-button="true"
              :shipping-info="shippingRates"
              @update-shipping-rates="updateShippingRate"
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
                  {{ $t('form.share_sales_data') }}
                </h4>
                <div class="flex gap-2">
                  <UInput
                    v-model="moderatorWalletInput"
                    class="font-mono"
                    placeholder="0x..."
                  />

                  <UButton
                    :label="$t('common.add')"
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

            <!-- DRM -->
            <UCard :ui="{ body: { base: 'space-y-8' } }">
              <template #header>
                <h3 class="font-bold font-mono">
                  {{ $t('form.drm_options') }}
                </h3>
              </template>

              <div class="grid md:grid-cols-2 gap-4">
                <UFormGroup
                  :label="$t('form.force_nft_claim')"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="mustClaimToView"
                    name="mustClaimToView"
                    :label="$t('form.must_claim_to_view')"
                  />
                </UFormGroup>

                <UFormGroup
                  :label="$t('form.disable_file_download')"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="hideDownload"
                    name="hideDownload"
                    :label="$t('form.disable_download')"
                  />
                </UFormGroup>

                <UFormGroup
                  :label="$t('form.custom_message_page')"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="enableCustomMessagePage"
                    name="enableCustomMessagePage"
                    :label="$t('form.enable_custom_message')"
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
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { MdEditor, config as editorConfig, type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import DOMPurify from 'dompurify'
import { v4 as uuidv4 } from 'uuid'

import { DEFAULT_PRICE, MINIMAL_PRICE, USD_PRICING_OPTIONS } from '~/constant'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { getPortfolioURL, deliverMethodOptions } from '~/utils'

const { getClassOwner, getClassMetadata } = useNFTContractReader()
const walletStore = useWalletStore()
const { t: $t } = useI18n()
const bookstoreApiStore = useBookstoreApiStore()
const stripeStore = useStripeStore()
const { wallet } = storeToRefs(walletStore)
const { newBookListing, updateEditionPrice } = bookstoreApiStore
const { fetchStripeConnectStatusByWallet } = stripeStore
const { getStripeConnectStatusByWallet } = storeToRefs(stripeStore)

const localeRoute = useLocaleRoute()
const route = useRoute()
// params.editingClassId and params.editionIndex is only available when editing an existing class
// query.class_id is only available when creating a new class
const classId = ref(
  (route.params.editingClassId || route.query.class_id || '') as string
)
const editionIndex = ref(route.params.editionIndex as string)

const error = ref('')
const isLoading = ref(false)

const mdEditorPlaceholder = ref({
  en: 'e.g.: This edition includes EPUB and PDF ebook files.',
  zh: '例：此版本包含 EPUB 及 PDF 電子書檔'
})

const classIdInput = ref(classId || '')
const nextPriceIndex = ref(1)
const tableOfContents = ref('')
const mustClaimToView = ref(true)
const enableCustomMessagePage = ref(false)
const hideDownload = ref(false)
const prices = ref<any[]>([
  {
    price: DEFAULT_PRICE.toString(),
    deliveryMethod: 'auto',
    autoMemo: 'Thank you for your support. It means a lot to me.',
    stock: Number((route.query.count as string) || 1),
    nameEn: 'Standard Edition',
    nameZh: '標準版',
    descriptionEn: '',
    descriptionZh: '',
    hasShipping: false,
    isPhysicalOnly: false,
    isAllowCustomPrice: false,
    isUnlisted: false
  }
])
const shippingRates = ref<any[]>([])
const hasMultiplePrices = computed(() => prices.value.length > 1)
const priceItemLabel = computed(() =>
  hasMultiplePrices.value ? 'edition' : 'book'
)
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
  Boolean(route.params.editingClassId && editionIndex.value)
)
const pageTitle = computed(() =>
  isEditMode.value ? $t('pages.edit_current_edition') : $t('pages.new_book_listing')
)
const submitButtonText = computed(() =>
  isEditMode.value ? $t('common.save') : $t('common.submit')
)
const shouldShowAdvanceSettings = ref<boolean>(false)

const moderatorWalletsTableColumns = computed(() => [
  { key: 'wallet', label: $t('table.wallet'), sortable: true },
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
  notificationEmails.value.map((email, index) => ({
    index,
    email
  }))
)

editorConfig({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

useSeoMeta({
  title: () => $t('seo_titles.new_book_listing'),
  ogTitle: () => $t('seo_titles.new_book_listing')
})

onMounted(async () => {
  try {
    isLoading.value = true
    if (wallet.value) {
      try {
        await fetchStripeConnectStatusByWallet(wallet.value)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }

      if (getStripeConnectStatusByWallet.value(wallet.value).isReady) {
        isStripeConnectChecked.value = true
        stripeConnectWallet.value = wallet.value
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  } finally {
    isLoading.value = false
  }
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) {
    error.value = ''
  }
})

function updatePrice (e: InputEvent, key: string, index: number) {
  prices.value[index][key] = (e.target as HTMLInputElement)?.value
}

function handlePriceChange (value: number, index: number) {
  prices.value[index].price = value
  if (Number(value) === 0) {
    prices.value[index].isAllowCustomPrice = true
  }
}

function addMorePrice () {
  nextPriceIndex.value += 1
  prices.value.push({
    index: uuidv4(),
    price: DEFAULT_PRICE.toString(),
    deliveryMethod: 'auto',
    autoMemo: '',
    stock: 1,
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

function mapPrices (prices: any) {
  return prices.map((p: any) => ({
    name: { en: p.nameEn, zh: p.nameZh },
    description: {
      en: escapeHtml(p.descriptionEn),
      zh: escapeHtml(p.descriptionZh)
    },
    priceInDecimal: Math.round(Number(p.price) * 100),
    price: Number(p.price),
    stock: Number(p.stock),
    isAutoDeliver: !p.isPhysicalOnly && p.deliveryMethod === 'auto',
    isAllowCustomPrice: p.isAllowCustomPrice ?? true,
    isUnlisted: p.isUnlisted ?? false,
    autoMemo: p.deliveryMethod === 'auto' ? p.autoMemo || '' : '',
    hasShipping: p.hasShipping || false,
    isPhysicalOnly: p.isPhysicalOnly || false
  }))
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
    const [data, owner] = await Promise.all([
      getClassMetadata(classIdInput.value as string),
      getClassOwner(classIdInput.value as string)
    ])
    if (owner !== wallet.value) {
      throw new Error('You are not the owner of this NFT Class')
    }
    if (!data) { throw new Error('Invalid NFT Class ID') }
    const collectionId = data.nft_meta_collection_id || ''
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

    if (p.some((price: any) => price.isAutoDeliver)) {
      const ok = confirm(
        "NFT Book Press - Reminder\nOnce you choose automatic delivery, you can't switch it back to manual delivery.  Are you sure?"
      )
      if (!ok) {
        return
      }
    }

    await newBookListing(classIdInput.value as string, {
      tableOfContents: tableOfContents.value,
      defaultPaymentCurrency: 'USD',
      connectedWallets,
      moderatorWallets: moderatorWallets.value,
      notificationEmails: notificationEmails.value,
      prices: p,
      shippingRates: s,
      mustClaimToView: mustClaimToView.value,
      enableCustomMessagePage: enableCustomMessagePage.value,
      hideDownload: hideDownload.value
    })
    await navigateTo(localeRoute({ name: 'nft-book-store' }))
  } catch (err) {
    const errorData = (err as any).data || err
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
    const price = p[0]

    if (!price || price.price === undefined) {
      throw new Error('Please input price of edition')
    }
    if (price.price !== 0 && price.price < MINIMAL_PRICE) {
      throw new Error(
        `Price of each edition must be at least $${MINIMAL_PRICE} or $0 (free)`
      )
    }

    if (!price.stock && price.stock !== 0) {
      throw new Error('Please input stock of edition')
    }

    if (price.stock < 0) {
      throw new Error('Stock cannot be negative')
    }

    if (!price.name.en || !price.name.zh) {
      throw new Error('Please input product name')
    }

    isLoading.value = true

    await updateEditionPrice(classId.value as string, editionIndex.value, {
      price
    })

    await navigateTo(localeRoute({ name: 'nft-book-store' }))
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

function handleDeliveryMethodChange (value: string) {
  if (value === 'manual') {
    enableCustomMessagePage.value = true
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
