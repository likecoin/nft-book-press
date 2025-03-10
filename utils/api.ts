export interface FetchLikerInfoResult {
  user: string
  displayName: string
  avatar: string
  wallet: string
  cosmosWallet: string
  likeWallet: string
  isSubscribedCivicLiker: boolean
  civicLikerSince: number
  description: string
}

export async function useFetchLikerInfoById (likerId: string) {
  const { LIKE_CO_API } = useRuntimeConfig().public
  const url = `${LIKE_CO_API}/users/id/${likerId}/min`
  const result = await $fetch<FetchLikerInfoResult>(url)
  return result
}

export async function useFetchLikerInfoByWallet (wallet: string, { nocache = false } = {}) {
  const { LIKE_CO_API } = useRuntimeConfig().public
  const timestamp = nocache ? `?ts=${Math.round(new Date().getTime() / 1000)}` : ''
  const url = `${LIKE_CO_API}/users/addr/${wallet}/min${timestamp}`
  const result = await $fetch<FetchLikerInfoResult>(url)
  return result
}
