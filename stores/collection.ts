import { defineStore, storeToRefs } from 'pinia'
import { useBookstoreApiStore } from './book-store-api'

export const useCollectionStore = defineStore('collection', () => {
  const { LIKE_CO_API } = useRuntimeConfig().public
  const bookstoreApiStore = useBookstoreApiStore()
  const { token, wallet: sessionWallet } = storeToRefs(bookstoreApiStore)

  const collectionList = ref([] as any[])
  const collectionByIdMap = ref({} as Record<string, any>)

  const getCollectionById = computed(() => (collectionId: string) => collectionByIdMap.value[collectionId])
  const getTotalPendingNFTCount = computed(() => collectionList.value.reduce((acc, item) => acc + (item.typePayload?.pendingNFTCount || 0), 0))

  async function fetchCollectionById (collectionId: string) {
    const data = await getNFTBookCollectionById(collectionId)
    collectionByIdMap.value[collectionId] = data
    return data
  }

  function lazyFetchCollectionById (collectionId: string) {
    if (getCollectionById.value(collectionId)) { return getCollectionById.value(collectionId) }
    return fetchCollectionById(collectionId)
  }

  async function listNFTBookCollections () {
    const data = await $fetch(`${LIKE_CO_API}/likernft/collection`, {
      query: {
        wallet: sessionWallet.value,
        type: 'book'
      },
      headers: token.value
        ? {
            authorization: `Bearer ${token.value}`
          }
        : undefined
    })
    collectionList.value = (data as any)?.list
    return data
  }

  async function listModeratedNFTBookCollections () {
    const data = await $fetch(`${LIKE_CO_API}/likernft/book/collection/store/list/moderated`, {
      query: {
        wallet: sessionWallet.value,
        type: 'book'
      },
      headers: token.value
        ? {
            authorization: `Bearer ${token.value}`
          }
        : undefined
    })
    return data
  }

  async function getNFTBookCollectionById (collectionId: string) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/collection/${collectionId}`, {
      headers: token.value
        ? {
            authorization: `Bearer ${token.value}`
          }
        : undefined
    })
    return data
  }

  function reduceListingPendingNFTCountById (collectionId: string, count: number) {
    const targetIndex = collectionList.value.findIndex(item => item.id === collectionId)
    if (targetIndex === -1) {
      return
    }
    const targetItem = collectionList.value[targetIndex]
    targetItem.pendingNFTCount -= count
  }

  async function newNFTBookCollection (payload: any) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/collection`, {
      method: 'POST',
      body: { type: 'book', ...payload },
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  async function updateNFTBookCollectionById (collectionId: string, payload: any) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/collection/${collectionId}`, {
      method: 'PATCH',
      body: payload,
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  async function deleteNFTBookCollectionById (collectionId: string) {
    const data = await $fetch(`${LIKE_CO_API}/likernft/collection/${collectionId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    return data
  }

  return {
    collectionList,
    collectionByIdMap,
    getCollectionById,
    fetchCollectionById,
    lazyFetchCollectionById,
    listNFTBookCollections,
    listModeratedNFTBookCollections,
    getTotalPendingNFTCount,
    reduceListingPendingNFTCountById,
    getNFTBookCollectionById,
    newNFTBookCollection,
    updateNFTBookCollectionById,
    deleteNFTBookCollectionById
  }
})
