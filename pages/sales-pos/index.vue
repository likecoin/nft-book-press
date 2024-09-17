<template>
  <PageContainer :key="route.path">
    <PageHeader title="Liker Land Bookstore POS" />
    <PageBody
      :ui="{
        base: 'flex flex-col items-stretch grow space-y-4',
        padding: 'max-md:!px-0 max-md:py-0',
      }"
    >
      <UCard
        :ui="{
          base: 'flex flex-col grow',
          rounded: 'max-md:rounded-none',
          header: { base: 'flex justify-between items-center gap-4' },
          body: { base: 'grow', padding: '' },
          footer: { base: 'sticky bottom-0 bg-white dark:bg-gray-900 rounded-b-[inherit]' },
        }"
      >
        <template #header>
          <h2
            class="text-xl font-bold"
            v-text="`Sales Items${selectedItems.length > 0 ? ` (${selectedItems.length} selected)` : ''}`"
          />

          <div class="flex items-center gap-2">
            <UButton
              v-if="saleItemTableRows.length"
              :icon="isEditMode ? 'i-heroicons-pencil-solid' : 'i-heroicons-pencil'"
              color="gray"
              @click="toggleEditMode"
            />

            <UButton icon="i-heroicons-plus" @click="toggleAddItemModal" />
          </div>
        </template>

        <UTable
          v-model="selectedSaleItemTableRows"
          :columns="saleItemTableColumns"
          :rows="saleItemTableRows"
        >
          <template #name-data="{ row }">
            <div class="flex items-start gap-4">
              <img
                v-if="row.image"
                class="w-[64px] object-contain rounded-sm"
                :src="row.image"
              >

              <div class="flex flex-col justify-start">
                <div v-text="row.name" />

                <USelect
                  v-if="!!row.classId && row.prices?.length > 1"
                  class="mt-2"
                  :model-value="saleItemList[row.index].priceIndex || 0"
                  :options="row.prices?.map((price: any) => ({
                    label: price.name?.zh || price.name?.en || price.name,
                    value: price.index
                  }))"
                  @update:model-value="changePriceIndex($event, row)"
                />
              </div>
            </div>
          </template>
          <template #delete-action-header>
            <div class="text-center">
              <UIcon name="i-heroicons-trash-solid" />
            </div>
          </template>
          <template #delete-action-data="{ row }">
            <UButton
              icon="i-heroicons-x-mark"
              color="red"
              variant="link"
              @click="removeSaleItem(row)"
            />
          </template>
        </UTable>

        <template #footer>
          <UTabs
            class="w-full"
            :items="[
              { key: 'direct', label: 'Direct Checkout' },
              { key: 'gift', label: 'Gift Checkout' },
            ]"
            :ui="{ base: 'flex flex-col space-y-4' }"
          >
            <template #item="{ item }">
              <template v-if="item.key === 'direct'">
                <UFormGroup label="Checkout URL">
                  <div class="flex items-center gap-2">
                    <UInput
                      v-model="checkoutUrl"
                      class="grow font-mono"
                      readonly
                    />
                    <UButton
                      icon="i-heroicons-clipboard-document"
                      variant="soft"
                      color="gray"
                      @click="copyCartUrl"
                    />
                  </div>
                </UFormGroup>

                <div class="flex justify-center items-center gap-4">
                  <UButton
                    label="View Cart"
                    size="lg"
                    @click="goToCartUrl"
                  />

                  <UButton
                    label="Generate QR Code"
                    :disabled="!selectedItems.length"
                    size="lg"
                    @click="generateQRCode"
                  />
                  <UModal
                    v-model="isOpenQRCodeModal"
                    :ui="{
                      padding: 'p-0',
                      rounded: 'max-sm:rounded-b-none'
                    }"
                  >
                    <QRCodeGenerator
                      :data="checkoutUrl"
                      mode="readonly"
                      file-name="likerland_checkout"
                      :width="280"
                      :height="280"
                    >
                      <template #header>
                        <h3 class="font-bold font-mono" v-text="'Scan to buy'" />
                        <UButton
                          icon="i-heroicons-x-mark"
                          color="gray"
                          variant="ghost"
                          @click="isOpenQRCodeModal = false"
                        />
                      </template>
                    </QRCodeGenerator>
                  </UModal>
                </div>
              </template>
              <template v-else-if="item.key === 'gift'">
                <UFormGroup label="Receiver Email">
                  <UInput v-model="giftToEmail" type="email" placeholder="example@liker.land" />
                </UFormGroup>

                <div class="flex justify-center items-center gap-4">
                  <UButton
                    label="Send Gift"
                    :disabled="!selectedItems.length || !giftToEmail"
                    size="lg"
                    @click="onClickGift"
                  />
                </div>
              </template>
            </template>
          </UTabs>
        </template>
      </UCard>

      <UModal
        v-model="isShowAddItemModal"
        :ui="{
          padding: 'p-0',
          rounded: 'max-sm:rounded-b-none',
        }"
      >
        <UCard
          :ui="{
            rounded: 'max-sm:rounded-b-none',
            header: { base: 'flex justify-between items-center gap-4' },
            body: { base: 'space-y-4' },
            footer: { base: 'flex justify-center items-center' }
          }"
        >
          <template #header>
            <h3 class="font-bold font-mono" v-text="'Add Item(s)'" />

            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="link"
              @click="toggleAddItemModal"
            />
          </template>
          <UFormGroup
            v-for="(input, index) in newProductIdInputs"
            :key="`input-${input.id}`"
            label="Enter Product ID/URL(s)"
            :required="true"
            :error="input.error?.message"
          >
            <div class="flex items-center gap-2">
              <UInput
                class="grow font-mono"
                :model-value="input.value"
                placeholder="https://liker.land/nft/class/likenft...."
                @update:model-value="handleNewItemInputUpdate(index, $event)"
              />

              <UButton
                v-if="newProductIdInputs.length > 1"
                icon="i-heroicons-x-circle"
                variant="link"
                @click="deleteNewItemInput(index)"
              />
            </div>
          </UFormGroup>

          <div class="flex justify-center gap-4">
            <UButton
              icon="i-heroicons-plus-circle"
              label="Add"
              variant="outline"
              @click="addNewItemInput"
            />
          </div>

          <template #footer>
            <UButton
              label="Confirm"
              @click="addSaleItem"
            />
          </template>
        </UCard>
      </UModal>
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'

const route = useRoute()
const toast = useToast()
const { LIKER_LAND_URL } = useRuntimeConfig().public
const nftStore = useNftStore()
const collectionStore = useCollectionStore()

const { lazyFetchClassMetadataById, lazyFetchClassListingInfoById } = nftStore
const { lazyFetchCollectionById } = collectionStore

const newProductIdInputs = ref<{ id: number; value: string, error?: Error }[]>([{ id: 0, value: '' }])
const newProductIdInputNextId = ref(1)
const giftToEmail = ref('')
const saleItemList = ref<any[]>([])
const isShowAddItemModal = ref(false)
const isOpenQRCodeModal = ref(false)
const isEditMode = ref(false)

watch(isShowAddItemModal, (value) => {
  if (!value) {
    newProductIdInputs.value = [{ id: 0, value: '' }]
    newProductIdInputNextId.value = 1
  }
})

const saleItemTableColumns = computed(() => {
  const columns = [
    { key: 'name', label: 'Product', class: '' }
  ]
  if (isEditMode.value) {
    columns.push({ key: 'delete-action', label: '', class: 'w-12' })
  }
  return columns
})

interface SaleItem {
  classId?: string;
  collectionId?: string;
  prices?: any[];
  name: string;
  image: string;
  index: number;
}

const saleItemTableRows = computed<SaleItem[]>(() => {
  return saleItemList.value?.map((item, index) => {
    if (item.collectionId) {
      return {
        collectionId: item.collectionId,
        name: collectionStore.getCollectionById(item.collectionId)?.name,
        image: parseImageURLFromMetadata(collectionStore.getCollectionById(item.collectionId)?.image),
        index
      }
    }
    return {
      classId: item.classId,
      name: nftStore.getClassMetadataById(item.classId)?.name,
      prices: nftStore.getClassListingInfoById(item.classId)?.prices?.map((price: any) => ({ ...price })),
      image: parseImageURLFromMetadata(nftStore.getClassMetadataById(item.classId)?.data?.metadata?.image),
      index
    }
  })
})
const selectedSaleItemTableRows = ref<SaleItem[]>([])

const selectedItems = computed(() => {
  const items = selectedSaleItemTableRows.value.map(row => saleItemList.value[row.index])
  return items.sort((a, b) => {
    if (a?.priceIndex !== undefined && !b?.priceIndex) {
      return -1
    } else if (!a?.priceIndex && b?.priceIndex !== undefined) {
      return 1
    } else {
      return 0
    }
  })
})

const checkoutUrl = computed(() => {
  const params = new URLSearchParams()
  selectedItems.value.forEach(({ classId, priceIndex, collectionId }) => {
    if (classId) { params.append('class_id', classId) }
    if (priceIndex) { params.append('price_index', priceIndex.toString()) }
    if (collectionId) { params.append('collection_id', collectionId) }
  })
  return `${LIKER_LAND_URL}/shopping-cart/book?${params.toString()}`
})

const giftUrl = computed(() => {
  const params = new URLSearchParams({
    gift_to_email: giftToEmail.value,
    checkout: '1'
  })
  selectedItems.value.forEach(({ classId, priceIndex, collectionId }) => {
    if (classId) { params.append('class_id', classId) }
    if (priceIndex) { params.append('price_index', priceIndex.toString()) }
    if (collectionId) { params.append('collection_id', collectionId) }
  })
  return `${LIKER_LAND_URL}/shopping-cart/book?${params.toString()}`
})

onMounted(() => {
  try {
    const storedString = window.localStorage.getItem('nft_book_store_pos_items')
    if (storedString) {
      const items = JSON.parse(storedString)
      saleItemList.value = items
        .map((item: any) => ({
          collectionId: item.collectionId,
          classId: item.classId,
          priceIndex: item.priceIndex
        }))
    }
  } catch (e) {
    console.error(e)
  }
  // useFetch fails on mount...
  nextTick(() => {
    saleItemList.value.forEach((item) => {
      if (item.classId) {
        lazyFetchClassMetadataById(item.classId)
        lazyFetchClassListingInfoById(item.classId)
      }
      if (item.collectionId) { lazyFetchCollectionById(item.collectionId) }
    })
  })
})

function addNewItemInput () {
  if (newProductIdInputs.value.length) {
    newProductIdInputs.value.push({ id: newProductIdInputNextId.value++, value: '' })
  }
}

function deleteNewItemInput (index: number) {
  newProductIdInputs.value.splice(index, 1)
}

function handleNewItemInputUpdate (index: number, value: string) {
  newProductIdInputs.value[index].error = undefined
  newProductIdInputs.value[index].value = value
}

function addSaleItem () {
  newProductIdInputs.value.forEach((input) => {
    input.error = undefined
    let productId = input.value.trim()
    if (productId.startsWith('http')) {
      const url = new URL(productId)
      productId = url.pathname.split('/').pop() || ''
    }
    if (productId.startsWith('likenft')) {
      saleItemList.value.push({ classId: productId, priceIndex: 0 })
      lazyFetchClassMetadataById(productId)
      lazyFetchClassListingInfoById(productId)
    } else if (productId.startsWith('col_book_')) {
      saleItemList.value.push({ collectionId: productId })
      lazyFetchCollectionById(productId)
    } else {
      input.error = new Error('Invalid product ID')
    }
  })
  if (newProductIdInputs.value.every(input => !input.error)) {
    isShowAddItemModal.value = false
    saveSaleProductIds()
  }
}

function changePriceIndex (value: number, { index }: { index: number }) {
  saleItemList.value[index].priceIndex = Number(value)
  saveSaleProductIds()
}

function removeSaleItem ({ index }: { index: number }) {
  saleItemList.value.splice(index, 1)
  selectedSaleItemTableRows.value = selectedSaleItemTableRows.value.filter(row => row.index !== index)
  saveSaleProductIds()
}

function toggleAddItemModal () {
  isShowAddItemModal.value = !isShowAddItemModal.value
}

function toggleEditMode () {
  isEditMode.value = !isEditMode.value
}

function saveSaleProductIds () {
  window.localStorage.setItem('nft_book_store_pos_items', JSON.stringify(saleItemList.value))
}

function copyCartUrl () {
  toast.add({ title: 'Copied URL to clipboard', timeout: 2000 })
  navigator.clipboard.writeText(checkoutUrl.value)
}

function goToCartUrl () {
  window.open(checkoutUrl.value)
}

function generateQRCode () {
  isOpenQRCodeModal.value = true
}

function onClickGift () {
  if (!giftToEmail.value) {
    alert('Please enter email')
    return
  }
  window.open(giftUrl.value)
}

</script>
