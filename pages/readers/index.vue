<template>
  <PageBody class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-lg font-bold font-mono" v-text="$t('menu.readers_list')" />
      <UButton
        icon="i-heroicons-arrow-path"
        variant="outline"
        :disabled="isLoading"
        :loading="isLoading"
        @click="loadReadersData"
      >
        {{ $t('common.refresh') }}
      </UButton>
    </div>

    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UCard>
      <template #header>
        <h3 class="font-medium" v-text="$t('readers.total_readers', { count: isLoading ? '...' : readersData.length })" />
      </template>

      <UTable
        :rows="readersData"
        :columns="columns"
        :loading="isLoading"
        :progress="{ color: 'primary', animation: 'carousel' }"
        :ui="{ th: { base: 'text-left' }, td: { base: 'text-right !min-w-[100px]' } }"
      >
        <!-- headers  -->
        <template
          v-for="column in baseColumnsConfig"
          :key="`header-${column.key}`"
          #[`${column.key}-header`]
        >
          <UButton
            color="gray"
            variant="ghost"
            :label="$t(column.label)"
            :trailing-icon="getSortIcon(column.key)"
            @click="() => sortByColumn(column.key)"
          />
        </template>
        <template
          v-for="book in Object.values(booksInfo)"
          :key="`header-${book.classId}`"
          #[`book_${book.classId}-header`]
        >
          <UTooltip :text="book.name || book.classId" class="cursor-help">
            <UButton
              color="gray"
              variant="ghost"
              :label="book.name?.slice(0, 1) || book.classId.slice(0, 1)"
              :trailing-icon="getSortIcon(`book_${book.classId}`)"
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
            :label="row.shortenWallet"
            :to="row.walletLink"
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
          <span class="font-medium" v-text="`$${row.lifetimeValue.toFixed(2)}`" />
        </template>

        <template #hasMessage-data="{ row }">
          <div class="flex justify-center w-full">
            <UBadge
              :color="row.hasMessage ? 'green' : 'gray'"
              :label="row.hasMessage ? $t('common.yes') : $t('common.no')"
              variant="soft"
            />
          </div>
        </template>
        <template
          v-for="book in Object.values(booksInfo)"
          :key="`template-${book.classId}`"
          #[`book_${book.classId}-data`]="{ row }"
        >
          <div class="flex justify-center w-full">
            <UBadge
              :color="row.purchasedBooks[book.classId] ? 'green' : 'gray'"
              :label="row.purchasedBooks[book.classId] ? $t('common.yes') : $t('common.no')"
              variant="soft"
              size="xs"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookstoreApiStore } from '~/stores/book-store-api'

const { t: $t } = useI18n()
const { CHAIN_EXPLORER_URL } = useRuntimeConfig().public

const bookstoreApiStore = useBookstoreApiStore()
const { token } = storeToRefs(bookstoreApiStore)
const { fetchBookListing, fetchModeratedBookList } = bookstoreApiStore

const isLoading = ref(false)
const error = ref('')
const readersData = ref<any[]>([])
const rawReadersData = ref<any[]>([])
const booksInfo = ref<Record<string, { name: string, classId: string }>>({})

const sortState = ref<{
  column: string | null
  direction: 'asc' | 'desc' | null
}>({
  column: null,
  direction: null
})

interface ReaderData {
  readerEmail: string
  readerWallet?: string
  shortenWallet?: string
  walletLink?: string
  firstPurchaseTime: string
  lastPurchaseTime: string
  lifetimeValue: number
  hasMessage: boolean
  purchasedBooks: Record<string, boolean>
  [key: string]: any
}

const baseColumnsConfig = [
  { key: 'readerEmail', label: 'table.reader_email' },
  { key: 'readerWallet', label: 'table.reader_wallet' },
  { key: 'firstPurchaseTime', label: 'table.first_purchase' },
  { key: 'lastPurchaseTime', label: 'table.last_purchase' },
  { key: 'lifetimeValue', label: 'table.lifetime_value' },
  { key: 'hasMessage', label: 'table.has_message' }
]

const columns = computed(() => {
  const baseColumns = baseColumnsConfig.map(col => ({ key: col.key }))

  const bookColumns = Object.values(booksInfo.value).map((book: any) => ({
    key: `book_${book.classId}`,
    sortable: true
  }))

  return [...baseColumns, ...bookColumns]
})

onMounted(() => {
  if (bookstoreApiStore.isAuthenticated) {
    loadReadersData()
  }
})

function formatDate (dateString: string | number) {
  if (!dateString) { return '-' }
  const date = new Date(dateString)

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function shortenWallet (wallet: string) {
  if (!wallet) { return '' }
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
}

function getWalletLink (wallet: string) {
  if (!wallet) { return '' }
  return `${CHAIN_EXPLORER_URL}/address/${wallet}`
}

async function loadReadersData () {
  try {
    isLoading.value = true
    error.value = ''

    await fetchBookListing()
    await fetchModeratedBookList()

    const allClassIds = [
      ...bookstoreApiStore.listingList.map((book: any) => book.classId),
      ...bookstoreApiStore.moderatedBookList.map((book: any) => book.classId)
    ]

    const uniqueClassIds = [...new Set(allClassIds)]

    if (uniqueClassIds.length === 0) {
      readersData.value = []
      booksInfo.value = {}
      return
    }

    const tempBooksInfo: Record<string, { name: string, classId: string }> = {}

    // Get book names from listingList
    bookstoreApiStore.listingList.forEach((book: any) => {
      if (uniqueClassIds.includes(book.classId)) {
        tempBooksInfo[book.classId] = {
          name: book.name || book.classId,
          classId: book.classId
        }
      }
    })

    // Get book names from moderatedBookList
    bookstoreApiStore.moderatedBookList.forEach((book) => {
      if (uniqueClassIds.includes(book.classId)) {
        tempBooksInfo[book.classId] = {
          name: book.name || book.classId,
          classId: book.classId
        }
      }
    })

    booksInfo.value = tempBooksInfo

    const allOrders: any[] = []

    for (const classId of uniqueClassIds) {
      try {
        const ordersData = await fetchBookOrders(classId, token.value)
        const orders = ordersData?.orders || []
        if (orders && Array.isArray(orders) && orders.length > 0) {
          allOrders.push(...orders.map(order => ({ ...order, classId })))
        }
      } catch (err) {
        console.error(`Failed to fetch orders for classId ${classId}:`, err)
      }
    }

    const readersMap = new Map<string, ReaderData>()

    allOrders.forEach((order) => {
      const readerEmail = order.email
      if (!readerEmail) { return }

      const purchaseTime = new Date(order.timestamp).toISOString()
      const amount = order.price || 0
      const hasMessage = !!(order.message && order.message.trim())
      const wallet = order.wallet

      if (readersMap.has(readerEmail)) {
        const existing = readersMap.get(readerEmail)!

        if (new Date(purchaseTime) < new Date(existing.firstPurchaseTime)) {
          existing.firstPurchaseTime = purchaseTime
        }
        if (new Date(purchaseTime) > new Date(existing.lastPurchaseTime)) {
          existing.lastPurchaseTime = purchaseTime
        }

        existing.lifetimeValue += amount

        if (hasMessage) {
          existing.hasMessage = true
        }

        existing.purchasedBooks[order.classId] = true

        if (wallet && !existing.readerWallet) {
          existing.readerWallet = wallet
          existing.shortenWallet = shortenWallet(wallet)
          existing.walletLink = getWalletLink(wallet)
        }
      } else {
        const purchasedBooks: Record<string, boolean> = {}
        uniqueClassIds.forEach((classId) => {
          purchasedBooks[classId] = false
        })
        purchasedBooks[order.classId] = true

        readersMap.set(readerEmail, {
          readerEmail,
          readerWallet: wallet,
          shortenWallet: wallet ? shortenWallet(wallet) : undefined,
          walletLink: wallet ? getWalletLink(wallet) : undefined,
          firstPurchaseTime: purchaseTime,
          lastPurchaseTime: purchaseTime,
          lifetimeValue: amount,
          hasMessage,
          purchasedBooks
        })
      }
    })
    const processedReaders = Array.from(readersMap.values()).map((reader) => {
      const bookSortFields: Record<string, number> = {}
      uniqueClassIds.forEach((classId) => {
        bookSortFields[`book_${classId}`] = reader.purchasedBooks[classId] ? 1 : 0
      })

      return {
        ...reader,
        ...bookSortFields
      }
    })

    rawReadersData.value = processedReaders
    readersData.value = processedReaders.sort((a, b) => b.lifetimeValue - a.lifetimeValue)

    sortState.value = { column: null, direction: null }
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load readers data'
  } finally {
    isLoading.value = false
  }
}

function sortByColumn (columnKey: string) {
  if (sortState.value.column === columnKey) {
    if (sortState.value.direction === 'asc') {
      sortState.value.direction = 'desc'
    } else if (sortState.value.direction === 'desc') {
      sortState.value.direction = null
      sortState.value.column = null
    } else {
      sortState.value.direction = 'asc'
    }
  } else {
    sortState.value.column = columnKey
    sortState.value.direction = 'asc'
  }

  if (sortState.value.column && sortState.value.direction) {
    const sorted = [...rawReadersData.value].sort((a, b) => {
      const aValue = a[sortState.value.column!]
      const bValue = b[sortState.value.column!]

      let comparison = 0

      if (columnKey.includes('Time')) {
        const aTime = new Date(aValue).getTime()
        const bTime = new Date(bValue).getTime()
        comparison = aTime - bTime
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = (aValue ? 1 : 0) - (bValue ? 1 : 0)
      } else if (aValue == null && bValue == null) {
        comparison = 0
      } else if (aValue == null) {
        comparison = -1
      } else if (bValue == null) {
        comparison = 1
      } else {
        comparison = String(aValue).localeCompare(String(bValue))
      }

      return sortState.value.direction === 'desc' ? -comparison : comparison
    })
    readersData.value = sorted
  } else {
    readersData.value = [...rawReadersData.value].sort((a, b) => b.lifetimeValue - a.lifetimeValue)
  }
}

function getSortIcon (columnKey: string) {
  if (sortState.value.column === columnKey) {
    return sortState.value.direction === 'asc'
      ? 'i-heroicons-chevron-up'
      : 'i-heroicons-chevron-down'
  }
  return 'i-heroicons-arrows-up-down'
}
</script>
