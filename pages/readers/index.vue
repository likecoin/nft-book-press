<template>
  <PageBody class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-bold font-mono" v-text="$t('menu.readers_list')" />
      <div class="flex gap-2">
        <UButton
          icon="i-hugeicons-csv-02"
          :color="hasSelection ? 'primary' : 'gray'"
          :disabled="!hasSelection"
          variant="outline"
          @click="exportSelectedToCSV"
        >
          {{ $t('common.export_csv',{ length: selectionCount }) }}
        </UButton>
        <UButton
          icon="i-heroicons-arrow-path"
          variant="outline"
          :disabled="readersStore.isLoading"
          :loading="readersStore.isLoading"
          @click="refreshData"
        />
      </div>
    </div>

    <UAlert
      v-if="readersStore.error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="readersStore.error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="readersStore.clearError()"
    />

    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="font-medium" v-text="$t('readers.total_readers', { count: readersStore.isLoading ? '...' : readersStore.readers.length })" />
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500" v-text="$t('common.page_size')" />
            <USelect
              v-model="pageSize"
              :options="pageSizeOptions"
              size="sm"
              @change="onPageSizeChange"
            />
          </div>
        </div>
      </template>

      <UTable
        :model-value="selectedRows"
        :rows="paginatedReaders"
        :columns="columns"
        :loading="readersStore.isLoading"
        :progress="{ color: 'primary', animation: 'carousel' }"
        :ui="{
          th: { base: 'text-left' },
          td: { base: 'text-right' },
          tr: {
            // Prevent JSON.stringify error when user clicks a row
            base: 'cursor-default [&>td]:pointer-events-none [&>td>*]:pointer-events-auto [&>td>input]:pointer-events-auto hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-200',
            selected: 'bg-gray-50 dark:bg-gray-800/50',
            active: ''
          }
        }"
        @select="onSelect"
        @update:model-value="onSelect"
      >
        <!-- headers  -->
        <template
          v-for="column in baseColumnsConfig"
          :key="`header-${column.key}`"
          #[`${column.key}-header`]
        >
          <UButton
            v-if="column.key !== 'lifetimeValue'"
            color="gray"
            variant="ghost"
            :label="column.label"
            :trailing-icon="getSortIcon(sortState.column, sortState.direction, column.key)"
            @click="() => sortByColumn(column.key)"
          />
          <UTooltip v-else text="USD">
            <UButton
              color="gray"
              variant="ghost"
              :label="column.label"
              :trailing-icon="getSortIcon(sortState.column, sortState.direction, column.key)"
              @click="() => sortByColumn(column.key)"
            />
          </UTooltip>
        </template>
        <template
          v-for="book in Object.values(readersStore.booksInfo)"
          :key="`header-${book.classId}`"
          #[`book_${book.classId}-header`]
        >
          <UTooltip :text="book.name || book.classId" class="cursor-help">
            <UButton
              color="gray"
              variant="ghost"
              :label="book.name?.slice(0, 1) || book.classId.slice(0, 1)"
              :trailing-icon="getSortIcon(sortState.column, sortState.direction, `book_${book.classId}`)"
              @click="() => sortByColumn(`book_${book.classId}`)"
            />
          </UTooltip>
        </template>

        <!-- rows -->
        <template #readerEmail-data="{ row }">
          <div class="w-full flex justify-start">
            <UButton
              :label="row.readerEmail"
              :to="`mailto:${row.readerEmail}`"
              variant="link"
              size="sm"
            />
          </div>
        </template>

        <template #readerWallet-data="{ row }">
          <UButton
            v-if="row.readerWallet"
            class="font-mono"
            :label="shortenWallet(row.readerWallet)"
            :to="getWalletLink(row.readerWallet)"
            variant="link"
            size="sm"
            target="_blank"
          />
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #firstPurchaseTime-data="{ row }">
          <span class="text-sm" v-text="formatDate(row.firstPurchaseTime)" />
        </template>

        <template #lastPurchaseTime-data="{ row }">
          <span class="text-sm" v-text="formatDate(row.lastPurchaseTime)" />
        </template>

        <template #lifetimeValue-data="{ row }">
          <span class="font-medium" v-text="`$${formatValue(row.lifetimeValue)}`" />
        </template>

        <template #hasMessage-data="{ row }">
          <div class="flex justify-center w-full">
            <UBadge
              :color="row.hasMessage ? 'primary' : 'gray'"
              :label="row.hasMessage ? 'Y' : 'N'"
              variant="soft"
            />
          </div>
        </template>
        <template
          v-for="book in Object.values(readersStore.booksInfo)"
          :key="`template-${book.classId}`"
          #[`book_${book.classId}-data`]="{ row }"
        >
          <div class="flex justify-center w-full">
            <UBadge
              :color="row[`book_${book.classId}`] ? 'green' : 'gray'"
              :label="row[`book_${book.classId}`] ? 'Y' : 'N'"
              variant="soft"
              size="xs"
            />
          </div>
        </template>
      </UTable>

      <template #footer>
        <div class="flex justify-end items-center">
          <UPagination
            v-model="currentPage"
            :page-count="pagination.limit"
            :total="readersStore.readers.length"
            :max="7"
            show-last
            show-first
          />
        </div>
      </template>
    </UCard>
  </PageBody>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()

const bookstoreApiStore = useBookstoreApiStore()

const {
  readersStore,
  paginatedReaders,
  columns,
  pagination,
  sortState,
  selectedRows,
  hasSelection,
  selectionCount,
  setSortState,
  setPage,
  setPageSize,
  onSelect,
  clearSelection,
  formatDate,
  formatCurrency: formatValue,
  shortenWallet,
  getWalletLink,
  getSortIcon,
  baseColumnsConfig,
  pageSizeOptions,
  exportReadersToCSV
} = useReaders()

const pageSize = ref(100)
const currentPage = ref(1)

watch(currentPage, (newPage: number) => {
  setPage(newPage)
})

onMounted(async () => {
  if (bookstoreApiStore.isAuthenticated) {
    await loadReadersData()
  }
})

async function loadReadersData () {
  await readersStore.fetchReaders()
}

async function refreshData () {
  await readersStore.fetchReaders(true)
  clearSelection()
}

function onPageSizeChange (newSize: number) {
  setPageSize(newSize)
  currentPage.value = 1
}

function sortByColumn (columnKey: string) {
  const currentSort = sortState.value

  if (currentSort.column === columnKey) {
    if (currentSort.direction === 'asc') {
      setSortState(columnKey, 'desc')
    } else if (currentSort.direction === 'desc') {
      setSortState(null, null)
    } else {
      setSortState(columnKey, 'asc')
    }
  } else {
    setSortState(columnKey, 'asc')
  }
}

function exportSelectedToCSV () {
  exportReadersToCSV()
}
</script>
