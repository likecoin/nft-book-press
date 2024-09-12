import { defineStore, storeToRefs } from 'pinia'
import { useBookStoreApiStore } from './book-store-api'

export const useUserStore = defineStore('user', () => {
  const { LIKE_CO_API } = useRuntimeConfig().public

  const bookStoreApiStore = useBookStoreApiStore()
  const { token } = storeToRefs(bookStoreApiStore)

  const bookUser = ref(null as any)
  const isUpdatingBookUserProfile = ref(false)

  async function fetchBookUserProfile () {
    const { error, data } = await useFetch(
      `${LIKE_CO_API}/likernft/book/user/profile`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (error.value) {
      throw error.value
    }
    bookUser.value = data.value
    return bookUser.value
  }

  function lazyFetchBookUserProfile () {
    if (bookUser.value) {
      return bookUser.value
    }
    return fetchBookUserProfile()
  }

  async function updateBookUserProfile (payload: any) {
    try {
      isUpdatingBookUserProfile.value = true
      const { error } = await useFetch(`${LIKE_CO_API}/likernft/book/user/profile`, {
        method: 'POST',
        body: payload,
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
      if (error.value) {
        throw error.value
      }
      bookUser.value = { ...bookUser.value, ...payload }
      return bookUser.value
    } finally {
      isUpdatingBookUserProfile.value = false
    }
  }

  return {
    bookUser,
    isUpdatingBookUserProfile,
    fetchBookUserProfile,
    lazyFetchBookUserProfile,
    updateBookUserProfile
  }
})
