export interface FetchLikerInfoResult {
  user: string
  displayName: string
  avatar: string
  wallet: string
  cosmosWallet: string
  likeWallet: string
  evmWallet: string
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

export async function fetchUserRegisterCheck ({
  accountId,
  walletAddress,
  email,
  magicDIDToken
}: {
  accountId?: string
  walletAddress?: string
  email?: string
  magicDIDToken?: string
}) {
  const { LIKE_CO_API } = useRuntimeConfig().public
  const url = `${LIKE_CO_API}/users/new/check`

  const result = await $fetch(url, {
    method: 'POST',
    body: {
      accountId,
      walletAddress,
      email,
      magicDIDToken
    }
  })
  return result
}

export function getLikeCoinAPIFetch () {
  const config = useRuntimeConfig()
  return $fetch.create({ baseURL: config.public.LIKE_CO_API })
}
