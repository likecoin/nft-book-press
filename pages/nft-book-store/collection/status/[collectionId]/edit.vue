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

        <!-- Class Info -->
        <UCard :ui="{ body: { base: 'space-y-4' } }">
          <template #header>
            <h2 class="font-bold font-mono">
              Class Info
            </h2>
          </template>
          <UFormGroup label="NFT collection ID">
            <UInput class="font-mono" :value="collectionId" :readonly="true" :disabled="true" />
          </UFormGroup>
          <UFormGroup label="Books in Collection">
            <UCard :ui="{ body: { padding: '' } }">
              <UTable
                :columns="[{ key: 'classId', label: 'Class ID' }, { key: 'name', label: 'Book Name'}]"

                :rows="classIds.map((classId, index) => ({ index, classId, name: getClassMetadataById(classId)?.name }))"
              />
            </UCard>
          </UFormGroup>
          <UFormGroup :label="`Total number of NFT for sale of this collection`">
            <UInput v-model="stock" type="number" step="0.01" :min="0" />
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
            <UInput v-model="price" type="number" step="0.01" :min="MINIMAL_PRICE" />
          </UFormGroup>
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
              placeholder="產品中文名字"
              :value="nameZh"
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
        </UCard>

        <ShippingRatesRateTable
          v-model="hasShipping"
          :is-show-physical-goods-checkbox="true"
          :shipping-info="shippingRates"
          :is-loading="isUpdatingShippingRates"
          @update-shipping-rates="updateShippingRates"
        />

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

import { DEFAULT_PRICE, MINIMAL_PRICE } from '~/constant'
import { useCollectionStore } from '~/stores/collection'
import { useNftStore } from '~/stores/nft'

const collectionStore = useCollectionStore()
const collectionListingInfo = ref<any>({})

const nftStore = useNftStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const collectionId = ref(route.params.collectionId)

const isLoading = ref(false)

const classIds = ref<string[]>([])
const price = ref(DEFAULT_PRICE)
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
const isUpdatingShippingRates = ref(false)

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

const { getClassMetadataById } = nftStore

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

async function updateShippingRates (value: any) {
  isUpdatingShippingRates.value = true
  try {
    await collectionStore.updateNFTBookCollectionById(collectionId.value as string, {
      shippingRates: value
    })

    const updatedCollectionData = (await collectionStore.fetchCollectionById(collectionId.value as string)).value
    shippingRates.value = updatedCollectionData?.typePayload?.shippingRates
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
