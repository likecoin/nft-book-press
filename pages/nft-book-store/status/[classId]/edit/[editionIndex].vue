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
          <UInput placeholder="Product name in English" :value="nameEn" />
          <UInput placeholder="產品中文名字" :value="nameZh" />
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

        <UCard
          :ui="{
            divide: '',
            header: { base: 'flex flex-wrap justify-between items-center gap-2' },
            body: { padding: '' },
            footer: { base: 'grid lg:grid-cols-2 gap-4' },
          }"
        >
          <template #header>
            <h3 class="font-bold font-mono">
              Physical Goods
            </h3>

            <UCheckbox
              v-model="hasShipping"
              label="Includes physical good that requires shipping"
            />
          </template>

          <UCard
            v-if="hasShipping"
            :ui="{
              header: { base: 'flex flex-wrap justify-between items-center gap-2' },
              rounded: 'rounded-t-none',
            }"
          >
            <template #header>
              <h4 class="text-sm font-bold font-mono">
                Shipping Options and Prices
              </h4>

              <UButton
                label="Add Option"
                variant="outline"
                @click="addMoreShippingRate"
              />
            </template>

            <component :is="hasMultipleShippingRates ? 'ul' : 'div'" class="space-y-4">
              <component :is="hasMultipleShippingRates ? 'li' : 'div'" v-for="s, index in shippingRates" :key="s.index">
                <UCard
                  :ui="{
                    body: { base: 'space-y-4' },
                    footer: { base: 'flex justify-end items-center' },
                  }"
                >
                  <UFormGroup
                    label="Name of this shipping option"
                    :ui="{ container: 'space-y-2' }"
                  >
                    <UInput
                      :value="s.nameEn"
                      placeholder="Shipping option name"
                      @input="e => updateShippingRate(e, 'nameEn', index)"
                    />
                    <UInput
                      placeholder="運送選項名稱"
                      :value="s.nameZh"
                      @input="e => updateShippingRate(e, 'nameZh', index)"
                    />
                  </UFormGroup>

                  <UFormGroup label="Price(USD) of this shipping option">
                    <UInput
                      :value="s.price"
                      type="number"
                      step="0.01"
                      :min="0"
                      @input="e => updateShippingRate(e, 'price', index)"
                    />
                  </UFormGroup>

                  <template
                    v-if="hasMultipleShippingRates"
                    #footer
                  >
                    <UButton
                      label="Delete"
                      variant="outline"
                      color="red"
                      @click="deleteShippingRate(index)"
                    />
                  </template>
                </UCard>
              </component>
            </component>
          </UCard>
        </UCard>

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
const editionIndex = ref(route.params.editionIndex as string)

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
const shippingRates = ref<any[]>([{
  price: 10.0,
  nameEn: 'Standard Shipping',
  nameZh: '標準寄送'
}])
const hasMultipleShippingRates = computed(() => shippingRates.value.length > 1)

const priceItemLabel = computed(() => hasMultiplePrices.value ? 'edition' : 'book')

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
      if (classResData?.ownerWallet !== wallet.value) {
        throw new Error('NOT_OWNER_OF_NFT_CLASS')
      }

      classData.value = classResData
      const currentEdition = classData.value.prices.filter(e => e.index.toString() === editionIndex.value)[0]
      if (currentEdition) {
        price.value = currentEdition.price || 0
        stock.value = currentEdition.stock || 0
        nameEn.value = currentEdition.name?.en || currentEdition.name || ''
        nameZh.value = currentEdition.name?.zh || currentEdition.name || ''
        descriptionEn.value = currentEdition.description?.en || currentEdition.description || ''
        descriptionZh.value = currentEdition.description?.zh || currentEdition.description || ''
        hasShipping.value = currentEdition.hasShipping || false
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

function updateShippingRate (e: InputEvent, key: string, index: number) {
  shippingRates.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMoreShippingRate () {
  shippingRates.value.push({
    index: uuidv4(),
    price: 20,
    nameEn: 'International Shipping',
    nameZh: '國際寄送'
  })
}

function deleteShippingRate (index: number) {
  shippingRates.value.splice(index, 1)
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

    await bookStoreApiStore.updateEditionPrice(classId.value as string, editionIndex.value, {
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
