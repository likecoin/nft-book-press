import { defineStore, storeToRefs } from 'pinia'
import { useBookStoreApiStore } from './book-store-api'

export const useCollectionStore = defineStore('collection', () => {
  const { LIKE_CO_API } = useRuntimeConfig().public
  const bookStoreApiStore = useBookStoreApiStore()
  const { token, wallet: sessionWallet } = storeToRefs(bookStoreApiStore)

  const collectionByIdMap = ref({} as Record<string, any>)

  const getCollectionById = computed(() => (collectionId: string) => collectionByIdMap.value[collectionId])

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
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/collection`, {
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
    if (error.value) {
      throw error.value
    }
    return data
  }

  async function listModeratedNFTBookCollections () {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/book/collection/store/list/moderated`, {
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
    if (error.value) {
      throw error.value
    }
    return data
  }

  async function getNFTBookCollectionById (collectionId: string) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/collection/${collectionId}`, {
      headers: token.value
        ? {
            authorization: `Bearer ${token.value}`
          }
        : undefined
    })
    if (error.value) {
      throw error.value
    }
    return data
  }

  async function newNFTBookCollection (payload: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/collection`, {
      method: 'POST',
      body: { type: 'book', ...payload },
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    if (error.value) {
      throw error.value
    }
    return data
  }

  async function updateNFTBookCollectionById (collectionId: string, payload: any) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/collection/${collectionId}`, {
      method: 'PATCH',
      body: payload,
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    if (error.value) {
      throw error.value
    }
    return data
  }

  async function deleteNFTBookCollectionById (collectionId: string) {
    const { error, data } = await useFetch(`${LIKE_CO_API}/likernft/collection/${collectionId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    if (error.value) {
      throw error.value
    }
    return data
  }

  return {
    collectionByIdMap,
    getCollectionById,
    fetchCollectionById,
    lazyFetchCollectionById,
    listNFTBookCollections,
    listModeratedNFTBookCollections,
    getNFTBookCollectionById,
    newNFTBookCollection,
    updateNFTBookCollectionById,
    deleteNFTBookCollectionById
  }
})
