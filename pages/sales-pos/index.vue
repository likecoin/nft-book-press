<template>
  <PageContainer :key="route.path">
    <PageHeader title="LikerLand Book Store POS" />
    <PageBody class="flex flex-col items-stretch grow space-y-4">
      <UCard>
        <UFormGroup label="Edit">
          <UButton @click="toggleEditMode">
            Toggle Edit Mode
          </UButton>
        </UFormGroup>
        <UFormGroup v-if="isEditMode" label="Enter NFT Class ID">
          <UInput
            v-model="newProductId"
            class="font-mono"
            placeholder="likenft....,https://liker.land/nft/class/likenft...."
          />
          <UButton @click="addSaleItem">
            Add
          </UButton>
        </UFormGroup>
        <UFormGroup label="Sale Items">
          <UTable
            :columns="saleItemTableColumns"
            :rows="saleItemTableRows"
            :ui="{ td: { font: 'font-mono' } }"
            @select="onSelectTableRow"
          >
            <template #selected-data="{ row }">
              <UCheckbox :checked="row.selected.value" />
            </template>
            <template #image-data="{ row }">
              <img
                v-if="row.image"
                class="max-w-[100px] object-contain"
                :src="row.image"
              >
            </template>
            <template #delete-action-data="{ row }">
              <UButton @click="removeSaleItem(row)">
                Delete
              </UButton>
            </template>
          </UTable>
        </UFormGroup>

        <UFormGroup label="Direct Checkout">
          <UButton :disabled="!selectedItems.length" @click="generateQRCode">
            Generate QR Code
          </UButton>
          <UModal v-model="isOpenQRCodeModal">
            <QRCodeGenerator
              :data="checkoutUrl"
              file-name="likerland_checkout"
              :width="500"
              :height="500"
            >
              <template #header>
                <h3 class="font-bold font-mono">
                  Download QR Code
                </h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="gray"
                  variant="ghost"
                  @click="isOpenQRCodeModal = false"
                />
              </template>
            </QRCodeGenerator>
          </UModal>
        </UFormGroup>
        <UFormGroup label="Gift Checkout">
          <UInput v-model="giftToEmail" type="email" placeholder="Target Email" />
          <UButton
            :disabled="!selectedItems.length || !giftToEmail"
            @click="onClickGift"
          >
            Gift
          </UButton>
        </UFormGroup>
        <UFormGroup label="Checkout URL">
          <UInput
            v-model="checkoutUrl"
            class="font-mono"
            readonly
          />
          <UButton @click="copyCartUrl">
            Copy
          </UButton>
          <UButton @click="goToCartUrl">
            Go to Cart
          </UButton>
        </UFormGroup>
      </UCard>
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'

const route = useRoute()
const { LIKER_LAND_URL } = useRuntimeConfig().public
const nftStore = useNftStore()
const collectionStore = useCollectionStore()

const { lazyFetchClassMetadataById } = nftStore
const { lazyFetchCollectionById } = collectionStore

const newProductId = ref('')
const giftToEmail = ref('')
const saleItemList = ref<any[]>([])
const isOpenQRCodeModal = ref(false)
const isEditMode = ref(false)

const saleItemTableColumns = computed(() => {
  const columns = [
    { key: 'selected', label: 'Selected' },
    { key: 'image', label: 'Cover' },
    { key: 'name', label: 'Name' }
  ]
  if (isEditMode.value) {
    columns.push({ key: 'delete-action', label: 'Delete' })
  }
  return columns
})

const saleItemTableRows = computed(() => {
  return saleItemList.value.map((item) => {
    return item.collectionId
      ? {
          collectionId: item.collectionId,
          selected: { value: item.selected, class: item.selected ? 'bg-green-500/50 animate-pulse' : '' },
          name: collectionStore.getCollectionById(item.collectionId)?.name,
          image: parseImageURLFromMetadata(collectionStore.getCollectionById(item.collectionId)?.image)
        }
      : {
          classId: item.classId,
          selected: { value: item.selected, class: item.selected ? 'bg-green-500/50 animate-pulse' : '' },
          name: nftStore.getClassMetadataById(item.classId)?.name,
          image: parseImageURLFromMetadata(nftStore.getClassMetadataById(item.classId)?.data?.metadata?.image)
        }
  })
})

const selectedItems = computed(() => {
  return saleItemList.value.filter(item => item.selected)
})

const checkoutUrl = computed(() => {
  const params = new URLSearchParams()
  selectedItems.value.forEach(({ classId, collectionId }) => {
    if (classId) { params.append('class_id', classId) }
    if (collectionId) { params.append('collection_id', collectionId) }
  })
  return `${LIKER_LAND_URL}/shopping-cart/book?${params.toString()}`
})

const giftUrl = computed(() => {
  const params = new URLSearchParams({
    gift_to_email: giftToEmail.value,
    checkout: '1'
  })
  selectedItems.value.forEach(({ classId, collectionId }) => {
    if (classId) { params.append('class_id', classId) }
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
          selected: false
        }))
    }
  } catch (e) {
    console.error(e)
  }
  // useFetch fails on mount...
  nextTick(() => {
    saleItemList.value.forEach((item) => {
      if (item.classId) { lazyFetchClassMetadataById(item.classId) }
      if (item.collectionId) { lazyFetchCollectionById(item.collectionId) }
    })
  })
})

function addSaleItem () {
  const productId = newProductId.value
  productId.split(',').forEach((input) => {
    let productId = input.trim()
    if (productId.startsWith('http')) {
      const url = new URL(productId)
      productId = url.pathname.split('/').pop() || ''
    }
    if (productId.startsWith('likenft')) {
      saleItemList.value.push({ classId: productId, selected: false })
      lazyFetchClassMetadataById(productId)
    } else if (productId.startsWith('col_book_')) {
      saleItemList.value.push({ collectionId: productId, selected: false })
      lazyFetchCollectionById(productId)
    } else {
      alert('Invalid product ID:' + productId)
    }
  })
  newProductId.value = ''
  saveSaleProductIds()
}

function removeSaleItem ({ classId, collectionId }: { classId?: string, collectionId?: string }) {
  const productId = classId || collectionId
  saleItemList.value = saleItemList.value
    .filter(item => item.classId !== productId && item.collectionId !== productId)
  saveSaleProductIds()
}

function toggleEditMode () {
  isEditMode.value = !isEditMode.value
}

function onSelectTableRow (row: any) {
  saleItemList.value = saleItemList.value.map((item) => {
    if ((row.classId && item.classId === row.classId) ||
      (row.collectionId && item.collectionId === row.collectionId)) {
      item.selected = !item.selected
    }
    return item
  })
}

function saveSaleProductIds () {
  window.localStorage.setItem('nft_book_store_pos_items', JSON.stringify(saleItemList.value))
}

function copyCartUrl () {
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
