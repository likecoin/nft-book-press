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

        <UFormGroup label="NFT Class ID">
          <UInput
            class="font-mono"
            :value="classId"
            :readonly="true"
            :disabled="true"
          />
        </UFormGroup>

        <UFormGroup :label="`Price(USD) of this ${priceItemLabel} (Minimal ${MINIMAL_PRICE} or $0 (free))`">
          <UInput v-model="price" type="number" step="0.01" :min="MINIMAL_PRICE" />
        </UFormGroup>

        <UFormGroup :label="`Total number of NFT for sale of this ${priceItemLabel}`">
          <UInput v-model="stock" type="number" step="1" :min="minStock" />
        </UFormGroup>

        <URadioGroup
          v-model="deliveryMethod"
          :disabled="oldIsAutoDeliver"
          :legend="`Delivery method of this ${priceItemLabel}`"
          :options="deliverMethodOptions"
        />

        <UFormGroup
          v-if="isAutoDeliver"
          :label="`Memo of this ${priceItemLabel}`"
        >
          <UInput v-model="autoMemo" />
        </UFormGroup>

        <UFormGroup
          :label="`Product name of this ${priceItemLabel}`"
          :ui="{ container: 'space-y-2' }"
        >
          <UInput v-model="nameEn" placeholder="Product name in English" />
          <UInput v-model="nameZh" placeholder="產品中文名字" />
        </UFormGroup>

        <h5 class="!mt-8 font-bold font-mono">
          Product description of this {{ priceItemLabel }}
        </h5>
        <md-editor
          v-model="descriptionEn"
          language="en-US"
          editor-id="en"
          :placeholder="mdEditorPlaceholder.en"
          :toolbars="toolbarOptions"
          :sanitize="sanitizeHtml"
        />
        <md-editor
          v-model="descriptionZh"
          language="en-US"
          editor-id="zh"
          :placeholder="mdEditorPlaceholder.zh"
          :toolbars="toolbarOptions"
          :sanitize="sanitizeHtml"
        />

        <ShippingRatesRateTable
          v-model="hasShipping"
          :is-class-view="false"
          :shipping-info="shippingRates"
          :is-loading="isUpdatingShippingRates"
          @update-shipping-rates="updateShippingRates"
        />

        <UFormGroup
          label="Is Physical only good"
          :ui="{ label: { base: 'font-mono font-bold' } }"
        >
          <UCheckbox
            v-model="isPhysicalOnly"
            name="isPhysicalOnly"
            label="This edition does not contain digital file/NFT"
          />
        </UFormGroup>

        <UFormGroup
          label="Allow custom price"
          :ui="{ label: { base: 'font-mono font-bold' } }"
        >
          <UCheckbox
            v-model="isAllowCustomPrice"
            name="isAllowCustomPrice"
            label="Allow user to pay more than defined price"
          />
        </UFormGroup>

        <template #footer>
          <UButton
            label="Save Changes"
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
const editionIndex = ref(route.params.editionIndex as string)

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
const isPhysicalOnly = ref(false)
const isAllowCustomPrice = ref(false)
const shippingRates = ref<any[]>([])
const isUpdatingShippingRates = ref(false)
const oldStock = ref(0)
const oldIsAutoDeliver = ref(false)

const priceItemLabel = computed(() => hasMultiplePrices.value ? 'edition' : 'book')
const isAutoDeliver = computed(() => deliveryMethod.value === 'auto')
const minStock = computed(() => oldIsAutoDeliver.value ? oldStock.value : 0)

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

const mdEditorPlaceholder = ref({
  en: 'Product description in English...',
  zh: '產品中文描述...'
})

const pageTitle = computed(() => `Edit ${priceItemLabel.value} ${hasMultiplePrices.value ? `#${editionIndex.value}` : 'price'} info`)

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

watch(isAutoDeliver, (newValue) => {
  if (newValue) {
    const ok = confirm('NFT Book Press - Reminder\nOnce you choose automatic delivery, you can\'t switch it back to manual delivery.  Are you sure?')
    if (!ok) {
      nextTick(() => {
        deliveryMethod.value = 'manual'
      })
    } else if (!autoMemo.value) {
      autoMemo.value = 'Thanks for purchasing this NFT ebook.'
    }
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

    const classResData: any = classRes?.data?.value
    if (classResData) {
      shippingRates.value = classResData?.shippingRates || []
      if (classResData?.ownerWallet !== wallet.value) {
        throw new Error('NOT_OWNER_OF_NFT_CLASS')
      }

      classData.value = classResData
      const currentEdition = classData.value.prices.filter(e => e.index.toString() === editionIndex.value)[0]
      if (currentEdition) {
        price.value = currentEdition.price || 0
        stock.value = currentEdition.stock || 0
        deliveryMethod.value = currentEdition.isAutoDeliver ? 'auto' : 'manual'
        autoMemo.value = currentEdition.autoMemo || ''
        nameEn.value = currentEdition.name?.en || currentEdition.name || ''
        nameZh.value = currentEdition.name?.zh || currentEdition.name || ''
        const legacyDescription = typeof currentEdition.description === 'string' ? currentEdition.description : undefined
        descriptionEn.value = currentEdition.description?.en || legacyDescription || ' '
        descriptionZh.value = currentEdition.description?.zh || legacyDescription || ' '
        hasShipping.value = !!(currentEdition.hasShipping) || false
        isPhysicalOnly.value = currentEdition.isPhysicalOnly || false
        isAllowCustomPrice.value = currentEdition.isAllowCustomPrice || false

        oldStock.value = currentEdition.stock
        oldIsAutoDeliver.value = currentEdition.isAutoDeliver
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
    error.value = errorData
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
      isAutoDeliver: isAutoDeliver.value,
      autoMemo: autoMemo.value || '',
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

    if (editedPrice.stock < minStock.value) {
      throw new Error(`Stock cannot be less than ${minStock.value}`)
    }

    if (oldIsAutoDeliver.value && !editedPrice.isAutoDeliver) {
      throw new Error('Cannot change automatic delivery to manual delivery')
    }

    if (!editedPrice.name.en || !editedPrice.name.zh) {
      throw new Error('Please input product name')
    }

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
        await connect()
      }
      if (!wallet.value || !signer.value) {
        throw new Error('Unable to connect to wallet')
      }
      autoDeliverNFTsTxHash = await sendNFTsToAPIWallet(
        classId.value as string,
        newAutoDeliverNFTsCount,
        signer.value,
        wallet.value
      )
    }

    await bookStoreApiStore.updateEditionPrice(classId.value as string, editionIndex.value, {
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
