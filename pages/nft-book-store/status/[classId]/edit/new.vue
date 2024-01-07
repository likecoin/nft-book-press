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

        <UFormGroup :label="`Price(USD) of this ${priceItemLabel} (Minimal ${MINIMAL_PRICE} or free)`">
          <UInput v-model="price" type="number" step="0.01" :min="MINIMAL_PRICE" />
        </UFormGroup>

        <UFormGroup :label="`Total number of NFT for sale of this ${priceItemLabel}`">
          <UInput v-model="stock" type="number" step="0.01" :min="0" />
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

        <ShippingRates
          v-model="hasShipping"
          mode="view"
          :shipping-info="shippingRates"
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

import { v4 as uuidv4 } from 'uuid'

import { LIKE_CO_API } from '~/constant'

import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'

const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const { wallet } = storeToRefs(walletStore)
const { token } = storeToRefs(bookStoreApiStore)

const router = useRouter()
const route = useRoute()
const toast = useToast()

const classId = ref(route.params.classId)
const priceIndex = ref(route.query.priceIndex)

const MINIMAL_PRICE = 0.9

const isLoading = ref(false)

const classData = ref<any>({})
const hasMultiplePrices = computed(() => classData?.value?.prices?.length > 1)

const price = ref(MINIMAL_PRICE)
const stock = ref(1)
const nameEn = ref('Standard Edition')
const nameZh = ref('標準版')
const descriptionEn = ref('')
const descriptionZh = ref('')
const hasShipping = ref(false)
const shippingRates = ref<any[]>([])

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
      hasShipping: hasShipping.value || false
    }

    if (!editedPrice || editedPrice.price === undefined) {
      throw new Error('Please input price of edition')
    }
    if (editedPrice.price !== 0 && editedPrice.price < MINIMAL_PRICE) {
      throw new Error(`Price of each edition must be at least $${MINIMAL_PRICE} or free`)
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

    isLoading.value = true

    await bookStoreApiStore.addEditionPrice(classId.value as string, priceIndex.value, {
      price: editedPrice
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
