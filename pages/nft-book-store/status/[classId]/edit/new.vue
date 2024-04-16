<template>
  <div>
    <UModal
      :model-value="true"
      :ui="{ width: 'sm:max-w-7xl' }"
    >
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { base: 'space-y-4' },
          footer: { base: 'flex justify-end items-center' }
        }"
      >
        <template #header>
          <h2 class="font-bold font-mono">
            {{ pageTitle }}
          </h2>

          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="handleClickBack"
          />
        </template>

        <UProgress v-if="isLoading" animation="carousel">
          <template #indicator>
            Loading...
          </template>
        </UProgress>

        <!-- Class Info -->
        <UCard :ui="{ body: { base: 'space-y-4' } }">
          <template #header>
            <h2 class="font-bold font-mono">
              Class Info
            </h2>
          </template>
          <UFormGroup label="NFT Class ID">
            <UInput
              class="font-mono"
              :value="classId"
              :readonly="true"
              :disabled="true"
            />
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
          <UFormGroup :label="`Price(USD) of this ${priceItemLabel} (Minimal ${MINIMAL_PRICE} or $0 (free))`">
            <UInput v-model="price" type="number" step="0.01" :min="MINIMAL_PRICE" />
          </UFormGroup>
          <UFormGroup :label="`Total number of NFT for sale of this ${priceItemLabel}`">
            <UInput v-model="stock" type="number" step="1" :min="0" />
          </UFormGroup>

          <URadioGroup
            v-model="deliveryMethod"
            :legend="`Delivery method of this ${priceItemLabel}`"
            :options="deliverMethodOptions"
          />

          <UFormGroup v-if="deliveryMethod === 'auto'">
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
              :value="autoMemo"
              @input="(e) => updatePrice(e, 'autoMemo', index)"
            />
          </UFormGroup>
          <UFormGroup
            v-else
            label="Is Physical only good"
          >
            <UCheckbox
              v-model="isPhysicalOnly"
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
              v-model="isAllowCustomPrice"
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
            <UInput
              v-model="nameEn"
              placeholder="Product name in English"
            />
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
        </UCard>

        <!-- Shipping Rates -->
        <ShippingRatesRateTable
          v-model="hasShipping"
          :is-show-physical-goods-checkbox="true"
          :shipping-info="shippingRates"
          :is-loading="isUpdatingShippingRates"
          @update-shipping-rates="updateShippingRates"
        />

        <template #footer>
          <UButton
            label="Add Edition"
            :loading="isLoading"
            size="lg"
            :disabled="isLoading"
            @click="handleSubmit"
          />
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import DOMPurify from 'dompurify'

import { DEFAULT_PRICE, LIKE_CO_API, MINIMAL_PRICE } from '~/constant'

import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { deliverMethodOptions } from '~/utils'
import { sendNFTsToAPIWallet } from '~/utils/cosmos'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const { connect } = walletStore
const { wallet, signer } = storeToRefs(walletStore)
const { token } = storeToRefs(bookStoreApiStore)
const { updateBookListingSetting } = bookStoreApiStore

const router = useRouter()
const route = useRoute()
const toast = useToast()

const classId = ref(route.params.classId)
const priceIndex = ref(route.query.priceIndex as string)

const isLoading = ref(false)

const classData = ref<any>({})
const hasMultiplePrices = computed(() => classData?.value?.prices?.length > 1)

const price = ref(DEFAULT_PRICE)
const stock = ref(1)
const deliveryMethod = ref('auto')
const autoMemo = ref('Thanks for purchasing this NFT ebook.')
const nameEn = ref('Standard Edition')
const nameZh = ref('標準版')
const descriptionEn = ref('')
const descriptionZh = ref('')
const hasShipping = ref(false)
const shippingRates = ref<any[]>([])
const isPhysicalOnly = ref(false)
const isAllowCustomPrice = ref(false)
const isUpdatingShippingRates = ref(false)

const priceItemLabel = computed(() => hasMultiplePrices.value ? 'edition' : 'book')

const toolbarOptions = [
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

const mdEditorPlaceholder = {
  en: 'Product description in English...',
  zh: '產品中文描述...'
}

const pageTitle = computed(() => 'Add Edition')

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

onMounted(async () => {
  try {
    isLoading.value = true

    const classRes = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`, {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })

    const classResData = classRes?.data?.value
    if (classResData) {
      shippingRates.value = classResData.shippingRates
      if (classResData?.ownerWallet !== wallet.value) {
        throw new Error('NOT_OWNER_OF_NFT_CLASS')
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: (error as Error).toString(),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  } finally {
    isLoading.value = false
  }
})

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

function handleClickBack () {
  router.push({
    name: 'nft-book-store-status-classId',
    params: { classId: classId.value }
  })
}

async function updateShippingRates (value: any) {
  isUpdatingShippingRates.value = true
  try {
    await updateBookListingSetting(classId.value as string, {
      shippingRates: value
    })
    const { data: classData } = await useFetch(
      `${LIKE_CO_API}/likernft/book/store/${classId.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    shippingRates.value = classData.value?.shippingRates || []
  } catch (err) {
    const errorData = (err as any).data || err
    // eslint-disable-next-line no-console
    console.error(errorData)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: errorData,
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  } finally {
    isUpdatingShippingRates.value = false
  }
}

async function handleSubmit () {
  try {
    const editedPrice = {
      name: {
        en: nameEn.value,
        zh: nameZh.value
      },
      description: {
        en: escapeHtml(descriptionEn.value),
        zh: escapeHtml(descriptionZh.value)
      },
      priceInDecimal: Math.round(Number(price.value) * 100),
      price: Number(price.value),
      stock: Number(stock.value),
      isAutoDeliver: deliveryMethod.value === 'auto',
      autoMemo: deliveryMethod.value === 'auto' ? (autoMemo.value || '') : '',
      hasShipping: hasShipping.value || false,
      isPhysicalOnly: isPhysicalOnly.value || false,
      isAllowCustomPrice: isAllowCustomPrice.value || false
    }

    if (!editedPrice || editedPrice.price === undefined) {
      throw new Error('Please input price of edition')
    }
    if (editedPrice.price !== 0 && editedPrice.price < MINIMAL_PRICE) {
      throw new Error(`Price of each edition must be at least $${MINIMAL_PRICE} or $0 (free)`)
    }

    if (!editedPrice.stock && editedPrice.stock !== 0) {
      throw new Error('Please input stock of edition')
    }

    if (editedPrice.stock < 0) {
      throw new Error('Stock cannot be negative')
    }

    if (!editedPrice.name.en || !editedPrice.name.zh) {
      throw new Error('Please input product name')
    }

    if (editedPrice.isAutoDeliver) {
      const ok = confirm('NFT Book Press - Reminder\nOnce you choose automatic delivery, you can\'t switch it back to manual delivery.  Are you sure?')
      if (!ok) { return }
    }

    isLoading.value = true

    let autoDeliverNFTsTxHash
    if (editedPrice.isAutoDeliver && editedPrice.stock > 0) {
      if (!wallet.value || !signer.value) {
        await connect()
      }
      if (!wallet.value || !signer.value) {
        throw new Error('Unable to connect to wallet')
      }
      autoDeliverNFTsTxHash = await sendNFTsToAPIWallet(
        classId.value as string,
        editedPrice.stock,
        signer.value,
        wallet.value
      )
    }

    await bookStoreApiStore.addEditionPrice(classId.value as string, priceIndex.value, {
      price: editedPrice,
      autoDeliverNFTsTxHash
    })

    router.push({
      name: 'nft-book-store-status-classId',
      params: { classId: classId.value }
    })
  } catch (err) {
    const errorData = (err as any).data || err
    // eslint-disable-next-line no-console
    console.error(errorData)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: errorData,
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  } finally {
    isLoading.value = false
  }
}
</script>
