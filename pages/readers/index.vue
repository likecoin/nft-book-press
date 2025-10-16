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
        <h3 class="font-medium" v-text="$t('readers.total_readers', { count: readersData.length })" />
      </template>

      <UTable
        :rows="readersData"
        :columns="columns"
        :loading="isLoading"
        :progress="{ color: 'primary', animation: 'carousel' }"
        :ui="{ th: { base: 'text-left' }, td: { base: 'text-left !min-w-[100px]' } }"
      >
        <template #readerEmail-data="{ row }">
          <UButton
            :label="row.readerEmail"
            :to="`mailto:${row.readerEmail}`"
            variant="link"
            size="sm"
          />
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
          <UBadge
            :color="row.hasMessage ? 'green' : 'gray'"
            :label="row.hasMessage ? $t('common.yes') : $t('common.no')"
            variant="soft"
          />
        </template>
        <template v-for="book in Object.values(booksInfo)" :key="`template-${book.classId}`" #[`book_${book.classId}-data`]="{ row }">
          <UBadge
            :color="row.purchasedBooks[book.classId] ? 'green' : 'gray'"
            :label="row.purchasedBooks[book.classId] ? $t('common.yes') : $t('common.no')"
            variant="soft"
            size="xs"
          />
        </template>
        <template v-for="book in Object.values(booksInfo)" :key="`header-${book.classId}`" #[`book_${book.classId}-header`]="{ column }">
          <UTooltip :text="book.name || book.classId" class="cursor-help">
            <UButton color="gray" variant="ghost" :label="book.name?.slice(0, 1) || book.classId.slice(0, 1)" trailing-icon="i-heroicons-arrows-up-down" />
          </UTooltip>
        </template>
      </UTable>
    </UCard>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookstoreApiStore } from '~/stores/book-store-api'

const { t: $t } = useI18n()
const { LIKE_CO_API, CHAIN_EXPLORER_URL } = useRuntimeConfig().public

const bookstoreApiStore = useBookstoreApiStore()
const { token } = storeToRefs(bookstoreApiStore)
const { fetchBookListing, fetchModeratedBookList } = bookstoreApiStore

const isLoading = ref(false)
const error = ref('')
const readersData = ref<any[]>([])
const booksInfo = ref<Record<string, { name: string, classId: string }>>({})

interface OrderData {
  id: string
  email: string
  wallet: string
  classId: string
  price: number
  timestamp: number
  message: string
}

interface OrdersResponse {
  orders: OrderData[]
}

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
  [key: string]: any // for purchasedBooks sorting
}

const columns = computed(() => {
  const baseColumns = [
    { key: 'readerEmail', label: $t('table.reader_email'), sortable: true },
    { key: 'readerWallet', label: $t('table.reader_wallet'), sortable: true },
    { key: 'firstPurchaseTime', label: $t('table.first_purchase'), sortable: true },
    { key: 'lastPurchaseTime', label: $t('table.last_purchase'), sortable: true },
    { key: 'lifetimeValue', label: $t('table.lifetime_value'), sortable: true },
    { key: 'hasMessage', label: $t('table.has_message'), sortable: true }
  ]

  const bookColumns = Object.values(booksInfo.value).map((book: any) => ({
    key: `book_${book.classId}`,
    label: book.name.slice(0, 1) || book.classId.slice(0, 8) + '...',
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
        const ordersData = await $fetch<OrdersResponse>(`${LIKE_CO_API}/likernft/book/purchase/${classId}/orders`, {
          headers: {
            authorization: `Bearer ${token.value}`
          }
        })

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

    readersData.value = processedReaders.sort((a, b) => b.lifetimeValue - a.lifetimeValue)
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load readers data'
  } finally {
    isLoading.value = false
  }
}
</script>
