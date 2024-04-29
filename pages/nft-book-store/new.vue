<template>
  <div class="space-y-4 mb-[40px]">
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
        Loading...
      </template>
    </UProgress>

    <template v-if="bookStoreApiStore.isAuthenticated">
      <UCard :ui="{ body: { base: 'space-y-4' } }">
        <template #header>
          <h2 class="font-bold font-mono">
            {{ pageTitle }}
          </h2>
        </template>

        <UFormGroup label="NFT Class ID">
          <UInput
            v-if="!isEditMode"
            v-model="classIdInput"
            class="font-mono"
            placeholder="likenft...."
          />
          <UInput v-else :value="classId" :readonly="true" />
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
                  Pricing and Availability
                </h3>
              </template>
              <UFormGroup
                :label="`Unit Price in USD (Minimum ${MINIMAL_PRICE}, or 0 for free)`"
              >
                <UInput
                  :value="p.price"
                  type="number"
                  step="0.01"
                  :min="0"
                  @input="(e) => updatePrice(e, 'price', index)"
                />
              </UFormGroup>
              <UFormGroup
                :label="`Total number of NFT ${hasMultiplePrices ? 'edition' : 'ebook'} for sale`"
              >
                <UInput
                  :value="p.stock"
                  type="number"
                  step="1"
                  :min="0"
                  @input="(e) => updatePrice(e, 'stock', index)"
                />
              </UFormGroup>
              <URadioGroup
                v-model="p.deliveryMethod"
                :legend="`Delivery method of this ${priceItemLabel}`"
                :options="deliverMethodOptions"
              />
              <UFormGroup v-if="p.deliveryMethod === 'auto'">
                <template #label>
                  {{ `Memo of this ${priceItemLabel}` }}
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
                  :value="p.autoMemo"
                  @input="(e) => updatePrice(e, 'autoMemo', index)"
                />
              </UFormGroup>
              <UFormGroup
                v-else
                label="Is Physical only good"
              >
                <UCheckbox
                  v-model="p.isPhysicalOnly"
                  name="isPhysicalOnly"
                  label="This edition does not contain digital file/NFT"
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
                  v-model="p.isAllowCustomPrice"
                  name="isAllowCustomPrice"
                  label="Allow user to pay more than defined price"
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
                <UInput
                  placeholder="Product name in English"
                  :value="p.nameEn"
                  @input="(e) => updatePrice(e, 'nameEn', index)"
                />
                <span class="block text-[14px] text-[#374151] mt-[8px]">Description (Optional)</span>
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
                  placeholder="產品中文名字"
                  :value="p.nameZh"
                  @input="(e) => updatePrice(e, 'nameZh', index)"
                />
                <span class="block text-[14px] text-[#374151] mt-[8px]">描述 (選填)</span>
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
                label="Delete"
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
          label="Add Edition"
          @click="addMorePrice"
        />
      </div>

      <StripeConnectCard
        v-model:isStripeConnectChecked="isStripeConnectChecked"
        v-model:isUsingDefaultAccount="isUsingDefaultAccount"
        :stripe-connect-wallet="stripeConnectWallet"
        :stripe-connect-status-wallet-map="stripeConnectStatusWalletMap"
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

      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '12px' },
        }"
      >
        <div class="flex justify-between items-center w-full">
          <h3 class="font-bold font-mono">
            Advance Settings
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
            <!-- Default Currency -->
            <UCard
              :ui="{ header: { base: 'flex justify-between items-center gap-2' } }"
            >
              <template #header>
                <h3 class="font-bold font-mono">
                  Default Currency
                </h3>
              </template>

              <UFormGroup
                label="Default Display Currency at Checkout"
                help="Note that price setting is always in USD "
              >
                <URadio
                  v-model="defaultPaymentCurrency"
                  label="USD"
                  name="USD"
                  value="USD"
                />
                <URadio
                  v-model="defaultPaymentCurrency"
                  label="HKD"
                  name="HKD"
                  value="HKD"
                />
              </UFormGroup>
            </UCard>

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
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import DOMPurify from 'dompurify'

import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_PRICE, MINIMAL_PRICE, LCD_URL, SUPPORT_CURRENCY } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { getPortfolioURL, deliverMethodOptions } from '~/utils'
import { getNFTAuthzGrants, sendNFTsToAPIWallet } from '~/utils/cosmos'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const stripeStore = useStripeStore()
const { connect } = walletStore
const { wallet, signer } = storeToRefs(walletStore)
const { newBookListing, updateEditionPrice } = bookStoreApiStore
const { fetchStripeConnectStatus, stripeConnectStatusWalletMap } = stripeStore

const router = useRouter()
const route = useRoute()
// params.editingClassId and params.editionIndex is only available when editing an existing class
// query.class_id is only available when creating a new class
const classId = ref(
  route.params.editingClassId || (route.query.class_id as string)
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
const defaultPaymentCurrency = ref<string>(SUPPORT_CURRENCY.USD)
const mustClaimToView = ref(true)
const hideDownload = ref(false)
const prices = ref<any[]>([
  {
    price: DEFAULT_PRICE,
    deliveryMethod: 'auto',
    autoMemo: 'Thank you for your support. It means a lot to me.',
    stock: Number((route.query.count as string) || 1),
    nameEn: 'Standard Edition',
    nameZh: '標準版',
    descriptionEn: '',
    descriptionZh: '',
    hasShipping: false,
    isPhysicalOnly: false,
    isAllowCustomPrice: false
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
const moderatorWalletsGrants = ref<any>({})
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const shouldDisableStripeConnectSetting = ref(false)
const isUsingDefaultAccount = ref(true)

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

const isEditMode = computed(() =>
  Boolean(route.params.editingClassId && editionIndex.value)
)
const pageTitle = computed(() =>
  isEditMode.value ? 'Edit Current Edition' : 'New NFT Book Listing'
)
const submitButtonText = computed(() =>
  isEditMode.value ? 'Save Changes' : 'Submit'
)
const shouldShowAdvanceSettings = ref<boolean>(false)

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

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

onMounted(async () => {
  try {
    isLoading.value = true
    await fetchStripeConnectStatus(wallet.value)
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

function updatePrice (e: InputEvent, key: string, index: number) {
  prices.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMorePrice () {
  nextPriceIndex.value += 1
  prices.value.push({
    index: uuidv4(),
    price: DEFAULT_PRICE,
    deliveryMethod: 'auto',
    autoMemo: '',
    stock: 1,
    nameEn: `Tier ${nextPriceIndex.value}`,
    nameZh: `級別 ${nextPriceIndex.value}`,
    descriptionEn: '',
    descriptionZh: '',
    hasShipping: false,
    isPhysicalOnly: false,
    isAllowCustomPrice: false
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
    isAutoDeliver: p.deliveryMethod === 'auto',
    isAllowCustomPrice: p.isAllowCustomPrice || false,
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

    const { data, error: fetchError } = await useFetch(
      `${LCD_URL}/cosmos/nft/v1beta1/classes/${classIdInput.value}`
    )
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    const collectionId =
      (data?.value as any)?.class?.data?.metadata?.nft_meta_collection_id || ''
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

    if (p.some(price => price.isAutoDeliver)) {
      const ok = confirm(
        "NFT Book Press - Reminder\nOnce you choose automatic delivery, you can't switch it back to manual delivery.  Are you sure?"
      )
      if (!ok) {
        return
      }
    }

    const autoDeliverCount = p
      .filter(price => price.isAutoDeliver)
      .reduce((acc, price) => acc + price.stock, 0)

    let autoDeliverNFTsTxHash
    if (autoDeliverCount > 0) {
      if (!wallet.value || !signer.value) {
        await connect()
      }
      if (!wallet.value || !signer.value) {
        throw new Error('Unable to connect to wallet')
      }
      autoDeliverNFTsTxHash = await sendNFTsToAPIWallet(
        classIdInput.value as string,
        autoDeliverCount,
        signer.value,
        wallet.value
      )
    }

    await newBookListing(classIdInput.value as string, {
      defaultPaymentCurrency,
      connectedWallets,
      moderatorWallets,
      notificationEmails,
      prices: p,
      shippingRates: s,
      mustClaimToView,
      hideDownload,
      autoDeliverNFTsTxHash
    })
    router.push({ name: 'nft-book-store' })
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
