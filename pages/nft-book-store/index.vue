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
          Liker Land Book Listing
        </h2>

        <UButton
          icon="i-heroicons-plus-circle"
          label="New Listing"
          :to="localeRoute({ name: 'nft-book-store-new' })"
        />
      </template>

      <UTabs
        v-if="bookStoreApiStore.isAuthenticated"
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
              <UInput v-model="searchInput" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
            </template>

            <!-- Header and Action buttons -->
            <div class="flex justify-between items-center w-full px-4 py-3">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">Rows per page</span>

                <USelect
                  v-model="tableRowsPerPage"
                  :options="tableRowsPerPageOptions"
                  class="me-2 w-20"
                  size="xs"
                />
              </div>

              <div class="flex gap-1.5 items-center">
                <USelectMenu
                  v-model="selectedTableColumns"
                  :options="tableColumns"
                  multiple
                >
                  <UButton
                    class="min-w-[180px]"
                    label="Columns"
                    icon="i-heroicons-view-columns"
                    color="gray"
                    size="xs"
                  />
                </USelectMenu>

                <UButton
                  icon="i-heroicons-funnel"
                  label="Reset"
                  color="gray"
                  size="xs"
                  :disabled="!searchInput"
                  @click="searchInput = ''"
                />
              </div>
            </div>

            <!-- Number of rows & Pagination -->
            <div class="flex flex-wrap justify-between items-center w-full px-4 py-3">
              <div>
                <span class="text-sm leading-5">
                  Showing
                  <span class="font-medium">{{ tablePageRowFrom }}</span>
                  to
                  <span class="font-medium">{{ tablePageRowTo }}</span>
                  of
                  <span class="font-medium">{{ tableRows.length }}</span>
                  rows
                </span>
              </div>

              <UPagination
                v-model="tablePage"
                :page-count="tableRowsPerPage"
                :total="tableRows.length"
              />
            </div>

            <!-- Table -->
            <UTable
              v-model:sort="sort"
              :columns="selectedTableColumns"
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
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'

const route = useRoute()
const localeRoute = useLocaleRoute()
const bookStoreApiStore = useBookStoreApiStore()
const nftStore = useNftStore()
const { listingList: bookList, moderatedBookList, token } = storeToRefs(bookStoreApiStore)
const { lazyFetchClassMetadataById } = nftStore
const { fetchBookListing, fetchModeratedBookList } = bookStoreApiStore

const error = ref('')
const isLoading = ref(false)

// Tabs
const tabItems = [
  { label: 'Current Listing', key: 'current' },
  { label: 'Viewable Listing', key: 'viewable' }
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
    navigateTo(localeRoute({ query: { tab: tabItems[value].key } }), { replace: true })
  }
})

// Search
const searchInput = ref('')

const sort = ref({
  column: 'pendingAction',
  direction: 'desc' as 'asc' | 'desc'
})

// Pagination
const tableRowsPerPageOptions = [5, 10, 20, 50]
const tableRowsPerPage = ref(tableRowsPerPageOptions[1])

const tablePage = ref(1)
const tablePageRowFrom = computed(() => (tablePage.value - 1) * tableRowsPerPage.value + 1)
const tablePageRowTo = computed(() => Math.min(tablePage.value * tableRowsPerPage.value, tableRows.value.length))

// Rows
const tableRows = computed(() => (tabItems[selectedTabItemIndex.value].key === 'viewable' ? moderatedBookList : bookList).value.map(b => ({
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
const tableColumns = [
  {
    key: 'classId',
    label: 'Class Id',
    sortable: true,
    class: 'font-mono'
  },
  {
    key: 'className',
    label: 'Class Name',
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
  }
]

const selectedTableColumns = ref(tableColumns.slice(1, tableColumns.length))

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
    name: 'nft-book-store-status-classId',
    params: { classId: row.classId }
  }))
}
</script>
