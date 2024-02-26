<template>
  <div>
    <UModal :model-value="true" :ui="{ width: 'sm:max-w-7xl' }">
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { base: 'space-y-4' },
          footer: { base: 'flex justify-end items-center' }
        }"
      >
        <template #header>
          <h2 class="font-bold font-mono">
            Edit collection info
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

        <UFormGroup label="NFT collection ID">
          <UInput class="font-mono" :value="collectionId" :readonly="true" :disabled="true" />
        </UFormGroup>

        <UFormGroup label="Books in Collection">
          <UTable
            :columns="[{ key: 'classId', label: 'Class ID' }]"
            :rows="classIds.map((classId, index) => ({ index, classId }))"
          />
        </UFormGroup>

        <UFormGroup :label="`Price(USD) of this collection (Minimal ${MINIMAL_PRICE} or free)`">
          <UInput v-model="price" type="number" step="0.01" :min="MINIMAL_PRICE" />
        </UFormGroup>

        <UFormGroup :label="`Total number of NFT for sale of this collection`">
          <UInput v-model="stock" type="number" step="0.01" :min="0" />
        </UFormGroup>

        <UFormGroup :label="`Product name of this collection`" :ui="{ container: 'space-y-2' }">
          <UInput placeholder="Product name in English" :value="nameEn" />
          <UInput placeholder="產品中文名字" :value="nameZh" />
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

        <h5 class="!mt-8 font-bold font-mono">
          Product description of this collection
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
          :read-only="true"
          :shipping-info="shippingRates"
        />

        <UFormGroup
          label="Is Physical only good"
          :ui="{ label: { base: 'font-mono font-bold' } }"
        >
          <UCheckbox
            v-model="isPhysicalOnly"
            name="isPhysicalOnly"
            label="This collection does not contain any digital file/NFT"
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
          <UButton label="Save Changes" :loading="isLoading" size="lg" :disabled="isLoading" @click="handleSubmit" />
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { MdEditor, config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import DOMPurify from 'dompurify'

import { useCollectionStore } from '~/stores/collection'

const collectionStore = useCollectionStore()
const collectionListingInfo = ref<any>({})

const router = useRouter()
const route = useRoute()
const toast = useToast()

const collectionId = ref(route.params.collectionId)

const MINIMAL_PRICE = 0.9

const isLoading = ref(false)

const classIds = ref<string[]>([])
const price = ref(MINIMAL_PRICE)
const stock = ref(1)
const nameEn = ref('Standard Edition')
const nameZh = ref('標準版')
const descriptionEn = ref('')
const descriptionZh = ref('')
const image = ref('')
const hasShipping = ref(false)
const isAllowCustomPrice = ref(false)
const isPhysicalOnly = ref(false)
const shippingRates = ref<any[]>([])

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

config({
  markdownItConfig (mdit: any) {
    mdit.options.html = false
  }
})

onMounted(async () => {
  try {
    isLoading.value = true

    collectionListingInfo.value = (await collectionStore.fetchCollectionById(collectionId.value as string)).value
    const typePayload = collectionListingInfo.value.typePayload
    if (typePayload) {
      collectionListingInfo.value = {
        ...collectionListingInfo.value,
        ...typePayload
      }
    }
    classIds.value = collectionListingInfo.value.classIds || []
    price.value = collectionListingInfo.value.priceInDecimal / 100 || 0
    stock.value = collectionListingInfo.value.stock || 0
    nameEn.value = collectionListingInfo.value.name?.en || ''
    nameZh.value = collectionListingInfo.value.name?.zh || ''
    image.value = collectionListingInfo.value.image || ''
    descriptionEn.value = collectionListingInfo.value.description?.en || ' '
    descriptionZh.value = collectionListingInfo.value.description?.zh || ' '
    hasShipping.value = collectionListingInfo.value.hasShipping || false
    shippingRates.value = collectionListingInfo.value.shippingRates || []
    isPhysicalOnly.value = collectionListingInfo.value.isPhysicalOnly || false
    isAllowCustomPrice.value = collectionListingInfo.value.isAllowCustomPrice || false
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
    name: 'nft-book-store-collection-status-collectionId',
    params: { collectionId: collectionId.value }
  })
}

async function handleSubmit () {
  try {
    const editedPrice = {
      classIds: classIds.value,
      name: {
        en: nameEn.value,
        zh: nameZh.value
      },
      description: {
        en: escapeHtml(descriptionEn.value),
        zh: escapeHtml(descriptionZh.value)
      },
      image: image.value,
      priceInDecimal: Math.round(Number(price.value) * 100),
      price: Number(price.value),
      stock: Number(stock.value),
      hasShipping: hasShipping.value || false,
      isPhysicalOnly: isPhysicalOnly.value || false,
      isAllowCustomPrice: isAllowCustomPrice.value || false
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

    await collectionStore.updateNFTBookCollectionById(collectionId.value as string, editedPrice)

    router.push({
      name: 'nft-book-store-collection-status-collectionId',
      params: { collectionId: collectionId.value }
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
