import { defineStore, storeToRefs } from 'pinia'
import { fetchBookOrders } from '~/utils/api'
import { useBookstoreApiStore } from '~/stores/book-store-api'

export interface ReaderData {
  readerEmail: string
  readerWallet?: string
  firstPurchaseTime: string
  lastPurchaseTime: string
  lifetimeValue: number
  hasMessage: boolean
  purchasedBooks: Record<string, boolean>
  [key: string]: any
}

export interface BookInfo {
  name: string
  classId: string
}

export const useReadersStore = defineStore('readers', () => {
  const bookstoreApiStore = useBookstoreApiStore()
  const { token, isAuthenticated } = storeToRefs(bookstoreApiStore)

  const readers = ref<ReaderData[]>([])
  const booksInfo = ref<Record<string, BookInfo>>({})
  const allOrders = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref('')
  const lastFetchTime = ref<number | null>(null)

  watch(isAuthenticated, () => {
    if (isAuthenticated.value) {
      lazyFetchReaders()
    } else {
      clearCache()
    }
  })

  async function fetchAllOrders (classIds: string[]) {
    const orders: any[] = []

    for (const classId of classIds) {
      try {
        const ordersData = await fetchBookOrders(classId, token.value)
        const classOrders = ordersData?.orders || []
        if (classOrders && Array.isArray(classOrders) && classOrders.length > 0) {
          orders.push(...classOrders.map(order => ({ ...order, classId })))
        }
      } catch (err) {
        console.error(`Failed to fetch orders for classId ${classId}:`, err)
      }
    }

    allOrders.value = orders
    return orders
  }

  async function lazyFetchAllOrders (classIds: string[], force = false) {
    if (!force && allOrders.value.length > 0 && !shouldRefetch.value) {
      return allOrders.value
    }
    return await fetchAllOrders(classIds)
  }

  function processOrdersToReaders (orders: any[], uniqueClassIds: string[]) {
    const readersMap = new Map<string, ReaderData>()

    orders.forEach((order) => {
      const readerEmail = order.email
      if (!readerEmail) { return }

      const purchaseTime = new Date(order.timestamp).toISOString()
      const amount = order.price || 0
      const hasMessage = !!(order.message && order.message.trim())
      const wallet = order.wallet

      if (readersMap.has(readerEmail)) {
        const existing = readersMap.get(readerEmail)
        if (!existing) { return }

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

    return processedReaders
  }

  async function fetchReaders (force = false) {
    if (!force && !shouldRefetch.value && readers.value.length > 0) {
      return
    }

    try {
      isLoading.value = true
      error.value = ''

      await bookstoreApiStore.fetchBookListing()
      await bookstoreApiStore.fetchModeratedBookList()

      const allClassIds = [
        ...bookstoreApiStore.listingList.map((book: any) => book.classId),
        ...bookstoreApiStore.moderatedBookList.map((book: any) => book.classId)
      ]

      const uniqueClassIds = [...new Set(allClassIds)]

      if (uniqueClassIds.length === 0) {
        readers.value = []
        booksInfo.value = {}
        return
      }

      const tempBooksInfo: Record<string, BookInfo> = {}

      bookstoreApiStore.listingList.forEach((book: any) => {
        if (uniqueClassIds.includes(book.classId)) {
          tempBooksInfo[book.classId] = {
            name: book.name || book.classId,
            classId: book.classId
          }
        }
      })

      bookstoreApiStore.moderatedBookList.forEach((book) => {
        if (uniqueClassIds.includes(book.classId)) {
          tempBooksInfo[book.classId] = {
            name: book.name || book.classId,
            classId: book.classId
          }
        }
      })

      booksInfo.value = tempBooksInfo

      const orders = await lazyFetchAllOrders(uniqueClassIds, force)

      const processedReaders = processOrdersToReaders(orders, uniqueClassIds)

      readers.value = processedReaders
      lastFetchTime.value = Date.now()
    } catch (err) {
      error.value = (err as Error).message || 'Failed to load readers data'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function lazyFetchReaders () {
    if (readers.value.length > 0 && !shouldRefetch.value) {
      return readers.value
    }
    await fetchReaders()
    return readers.value
  }

  const ordersByClassIdMap = computed(() => {
    const map = new Map<string, any[]>()
    allOrders.value.forEach((order) => {
      const classId = order.classId
      if (!map.has(classId)) {
        map.set(classId, [])
      }
      map.get(classId)!.push(order)
    })
    return map
  })

  const shouldRefetch = computed(() => {
    const CACHE_DURATION = 120 * 60 * 1000 // 120 minutes
    return !lastFetchTime.value || (Date.now() - lastFetchTime.value > CACHE_DURATION)
  })

  function clearError () {
    error.value = ''
  }

  function clearCache () {
    readers.value = []
    allOrders.value = []
    booksInfo.value = {}
    lastFetchTime.value = null
  }

  return {
    readers: readonly(readers),
    booksInfo: readonly(booksInfo),
    allOrders: readonly(allOrders),
    ordersByClassIdMap: readonly(ordersByClassIdMap),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastFetchTime: readonly(lastFetchTime),

    shouldRefetch,

    fetchReaders,
    lazyFetchReaders,
    fetchAllOrders,
    lazyFetchAllOrders,
    clearError,
    clearCache
  }
})
