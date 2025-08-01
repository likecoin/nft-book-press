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
        {{ $t('common.loading') }}
      </template>
    </UProgress>

    <UCard :ui="{ header: { base: 'flex justify-between items-center gap-4' } }">
      <template #header>
        <h2 class="text-xl font-bold font-mono">
          {{ $t('collection.liker_land_collections') }}
        </h2>

        <UButton icon="i-heroicons-plus-circle" :label="$t('collection.new_collection_btn')" :to="localeRoute({ name: 'nft-book-store-collection-new' })" />
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
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'

const route = useRoute()
const localeRoute = useLocaleRoute()
const nftStore = useNftStore()
const bookstoreApiStore = useBookstoreApiStore()
const collectionStore = useCollectionStore()
const { listNFTBookCollections, listModeratedNFTBookCollections } = collectionStore
const { getClassMetadataById, lazyFetchClassMetadataById } = nftStore
const { token } = storeToRefs(bookstoreApiStore)

const error = ref('')
const isLoading = ref(false)
const collectionList = ref<any[]>([])
const moderatedCollectionList = ref<any[]>([])

// Tabs
const { t: $t } = useI18n()

const tabItems = computed(() => [
  { label: $t('collection.current_collection_listing'), key: 'current' },
  { label: $t('collection.viewable_collection_listing'), key: 'viewable' }
])

const selectedTabItemIndex = computed({
  get () {
    const index = tabItems.value.findIndex(item => item.key === route.query.tab)
    if (index === -1) {
      return 0
    }

    return index
  },
  set (value) {
    navigateTo(localeRoute({ query: { tab: tabItems.value[value].key } }), { replace: true })
  }
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

const tableColumns = computed(() => [
  {
    key: 'name',
    label: $t('collection.collection_name'),
    sortable: true
  },
  {
    key: 'priceInUSD',
    label: $t('table.price_in_usd'),
    sortable: true
  },
  {
    key: 'pendingAction',
    label: $t('collection.pending_action'),
    sortable: true
  },
  {
    key: 'sold',
    label: $t('table.sold'),
    sortable: true
  }
])

onMounted(async () => {
  const promises = [listNFTBookCollections()]
  if (token.value) {
    promises.push(listModeratedNFTBookCollections())
  }
  const [collectionData, moderatedData] = await Promise.all(promises)
  collectionList.value = (collectionData as any)?.list
  collectionList.value.forEach((b :any) => {
    b.classIds.forEach((classId: string) => lazyFetchClassMetadataById(classId))
  })
  moderatedCollectionList.value = (moderatedData as any)?.list || []
  moderatedCollectionList.value.forEach((b :any) => {
    b.classIds.forEach((classId: string) => lazyFetchClassMetadataById(classId))
  })
})

const tableRows = computed(() => (tabItems.value[selectedTabItemIndex.value].key === 'viewable' ? moderatedCollectionList : collectionList).value.map(b => ({
  collectionId: b.id,
  name: b.name?.en,
  priceInUSD: b.typePayload?.priceInDecimal / 100,
  classIds: b.classIds,
  classNames: b.classIds?.map((classId :string) => getClassMetadataById(classId)?.name),
  pendingAction: b.typePayload?.pendingNFTCount || 0,
  sold: b.typePayload?.sold || 0
})))

useSeoMeta({
  title: () => $t('collection.collection_management'),
  ogTitle: () => $t('collection.collection_management')
})

async function selectTableRow (row: any) {
  await navigateTo(localeRoute({
    name: 'nft-book-store-collection-status-collectionId',
    params: { collectionId: row.collectionId }
  }))
}

</script>
