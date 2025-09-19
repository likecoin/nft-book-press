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

    <UCard
      :ui="{ header: { base: 'flex justify-between items-center gap-4' } }"
    >
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
              <div v-if="tableRows.length > 0" class="flex justify-between items-center w-full">
                <div class="flex gap-2 items-center">
                  <UPagination
                    v-model="tablePage"
                    :page-count="tableRowsPerPage"
                    :total="tableRows.length"
                  />
                  <span class="text-sm leading-5">
                    {{ $t('table.showing_rows', { from: tablePageRowFrom, to: tablePageRowTo, total: tableRows.length }) }}
                  </span>
                </div>
                <UInput v-model="searchInput" icon="i-heroicons-magnifying-glass-20-solid" :placeholder="$t('table.search_placeholder')" />
              </div>
            </template>
            <!-- Table -->
            <UTable
              v-model:sort="sort"
              :columns="tableColumns"
              :rows="paginatedTableRows"
              @select="selectTableRow"
            >
              <template #priceInUSD-data="{ row }">
                <ul class="flex gap-1">
                  <li
                    v-for="price in row.prices"
                    :key="price"
                  >
                    <UBadge
                      :label="`$${price}`"
                      variant="solid"
                      size="xs"
                      color="gray"
                      :ui="{ rounded: 'rounded-full' }"
                    />
                  </li>
                </ul>
              </template>
              <template #className-data="{ row }">
                <NFTClassMetadataLoader :class-id="row.classId">
                  <template #default="{ isLoading: isLoadingMetadata }">
                    <UProgress v-if="isLoadingMetadata || !row.className" />
                    <div v-else class="max-w-xs truncate">
                      {{ row.className }}
                    </div>
                  </template>
                </NFTClassMetadataLoader>
              </template>
            </UTable>
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

const route = useRoute()
const localeRoute = useLocaleRoute()
const { t: $t } = useI18n()
const bookstoreApiStore = useBookstoreApiStore()
const nftStore = useNftStore()
const { listingList: bookList, moderatedBookList, token } = storeToRefs(bookstoreApiStore)
const { lazyFetchClassMetadataById } = nftStore
const { fetchBookListing, fetchModeratedBookList } = bookstoreApiStore

const error = ref('')
const isLoading = ref(false)

useSeoMeta({
  title: () => $t('seo_titles.book_listing_management'),
  ogTitle: () => $t('seo_titles.book_listing_management')
})

// Tabs
const tabItems = computed(() => [
  { label: $t('bookstore.current_listing'), key: 'current' },
  { label: $t('bookstore.viewable_listing'), key: 'viewable' }
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

// Search
const searchInput = ref('')

const sort = ref({
  column: 'pendingAction',
  direction: 'desc' as 'asc' | 'desc'
})

// Pagination
const tableRowsPerPage = ref(50)

const tablePage = ref(1)
const tablePageRowFrom = computed(() => (tablePage.value - 1) * tableRowsPerPage.value + 1)
const tablePageRowTo = computed(() => Math.min(tablePage.value * tableRowsPerPage.value, tableRows.value.length))

// Rows
const tableRows = computed(() => (tabItems.value[selectedTabItemIndex.value].key === 'viewable' ? moderatedBookList : bookList).value.map(b => ({
  classId: b.classId,
  className: nftStore.getClassMetadataById(b.classId)?.name,
  priceInUSD: b.prices?.[0].price,
  prices: b.prices?.map((p :any) => p.price),
  pendingAction: b.pendingNFTCount,
  sold: b.sold
})).filter((b) => {
  if (!searchInput.value) { return true }
  const normalizedSearchInput = searchInput.value.toLowerCase()
  return b.classId.toLowerCase().includes(normalizedSearchInput) || b.className.toLowerCase().includes(normalizedSearchInput)
}))

const sortedTableRows = computed(() => {
  const { column, direction } = sort.value
  return tableRows.value.sort((a: any, b: any) => {
    if (a[column] < b[column]) {
      return direction === 'asc' ? -1 : 1
    }
    if (a[column] > b[column]) {
      return direction === 'asc' ? 1 : -1
    }
    return 0
  })
})

const paginatedTableRows = computed(() => {
  return sortedTableRows.value.slice((tablePage.value - 1) * tableRowsPerPage.value, tablePage.value * tableRowsPerPage.value)
})

// Columns
const tableColumns = computed(() => [
  {
    key: 'pendingAction',
    label: $t('table.pending_action'),
    sortable: true
  },
  {
    key: 'className',
    label: $t('table.class_name'),
    sortable: true
  },
  {
    key: 'priceInUSD',
    label: $t('table.price_in_usd'),
    sortable: true
  },
  {
    key: 'sold',
    label: $t('table.sold'),
    sortable: true
  },
  {
    key: 'classId',
    label: $t('bookstore.class_id'),
    sortable: true,
    class: 'font-mono'
  }
])

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(selectedTabItemIndex, () => {
  searchInput.value = ''
  tablePage.value = 1
})

watch(tableRowsPerPage, () => {
  tablePage.value = 1
})

onMounted(async () => {
  const promises = [fetchBookListing()]
  if (token.value) {
    promises.push(fetchModeratedBookList())
  }
  await Promise.all(promises)

  const classIds: Set<string> = new Set(bookList.value.map(b => b.classId).concat(moderatedBookList.value.map(m => m.classId)))
  classIds.forEach(classId => lazyFetchClassMetadataById(classId))
})

async function selectTableRow (row: any) {
  await navigateTo(localeRoute({
    name: 'my-books-status-classId',
    params: { classId: row.classId }
  }))
}
</script>
