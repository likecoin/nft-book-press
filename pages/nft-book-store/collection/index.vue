<template>
  <PageBody :ui="{ constrained: '' }">
    <UAlert
      v-if="error"
      class="mt-4"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UProgress v-if="isLoading" animation="carousel">
      <template #indicator>
        Loading...
      </template>
    </UProgress>

    <UCard :ui="{ header: { base: 'flex justify-between items-center gap-4' } }">
      <template #header>
        <h2 class="text-xl font-bold font-mono">
          NFT Book Collections
        </h2>

        <UButton icon="i-heroicons-plus-circle" label="New Collection" :to="{ name: 'nft-book-store-collection-new' }" />
      </template>

      <UTabs
        v-model="selectedTabItemIndex"
        class="w-full"
        :items="tabItems"
      >
        <template #item="{ item }">
          <UCard
            :key="item.key"
            :ui="{
              header: { base: 'flex justify-between items-center gap-4' },
              body: {
                base: 'divide-y divide-gray-200 dark:divide-gray-700',
                padding: '',
              },
            }"
          >
            <template #header>
              <h2 class="font-bold font-mono">
                {{ item.label }}
              </h2>
            </template>

            <!-- Table -->
            <UTable
              :columns="tableColumns"
              :rows="tableRows"
              @select="selectTableRow"
            />
          </UCard>
        </template>
      </UTabs>
    </UCard>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'

const route = useRoute()
const router = useRouter()
const nftStore = useNftStore()
const bookStoreApiStore = useBookStoreApiStore()
const collectionStore = useCollectionStore()
const { listNFTBookCollections, listModeratedNFTBookCollections } = collectionStore
const { getClassMetadataById, lazyFetchClassMetadataById } = nftStore
const { token } = storeToRefs(bookStoreApiStore)

const error = ref('')
const isLoading = ref(false)
const collectionList = ref<any[]>([])
const moderatedCollectionList = ref<any[]>([])

// Tabs
const tabItems = [
  { label: 'Current Collection Listing', key: 'current' },
  { label: 'Viewable Collection Listing', key: 'viewable' }
]

const selectedTabItemIndex = computed({
  get () {
    const index = tabItems.findIndex(item => item.key === route.query.tab)
    if (index === -1) {
      return 0
    }

    return index
  },
  set (value) {
    router.replace({ query: { tab: tabItems[value].key } })
  }
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

const tableColumns = [
  {
    key: 'name',
    label: 'Collection Name',
    sortable: true
  },
  {
    key: 'priceInUSD',
    label: 'Price in USD',
    sortable: true
  },
  {
    key: 'pendingAction',
    label: 'Pending Action',
    sortable: true
  },
  {
    key: 'sold',
    label: 'Sold',
    sortable: true
  },
  {
    key: 'stock',
    label: 'Remaining Stock',
    sortable: true
  }
]

onMounted(async () => {
  const promises = [listNFTBookCollections()]
  if (token.value) {
    promises.push(listModeratedNFTBookCollections())
  }
  const [collectionData, moderatedData] = await Promise.all(promises)
  collectionList.value = (collectionData?.value as any)?.list
  collectionList.value.forEach((b :any) => {
    b.classIds.forEach((classId: string) => lazyFetchClassMetadataById(classId))
  })
  moderatedCollectionList.value = (moderatedData?.value as any)?.list || []
  moderatedCollectionList.value.forEach((b :any) => {
    b.classIds.forEach((classId: string) => lazyFetchClassMetadataById(classId))
  })
})

const tableRows = computed(() => (tabItems[selectedTabItemIndex.value].key === 'viewable' ? moderatedCollectionList : collectionList).value.map(b => ({
  collectionId: b.id,
  name: b.name?.en,
  priceInUSD: b.typePayload?.priceInDecimal / 100,
  classIds: b.classIds,
  classNames: b.classIds?.map((classId :string) => getClassMetadataById(classId)?.name),
  pendingAction: b.typePayload?.pendingNFTCount || 0,
  sold: b.typePayload?.sold || 0,
  stock: b.typePayload?.stock || 0
})))

function selectTableRow (row: any) {
  router.push({
    name: 'nft-book-store-collection-status-collectionId',
    params: { collectionId: row.collectionId }
  })
}

</script>
