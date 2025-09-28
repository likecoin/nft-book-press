import { jwtDecode } from 'jwt-decode'

export const SIGN_AUTHORIZATION_PERMISSIONS = [
  'read:nftbook',
  'write:nftbook',
  'write:iscn',
  'read:iscn'
] as const

export function checkJwtTokenValidity (token: string) {
  const decoded = jwtDecode(token)
  if (!decoded) {
    return false
  }
  const isExpired = decoded.exp && decoded.exp * 1000 < Date.now()
  const isMatchPermissions =
      Array.isArray((decoded as any).permissions) &&
      (decoded as any).permissions.length === SIGN_AUTHORIZATION_PERMISSIONS.length &&
      (decoded as any).permissions.every((perm: typeof SIGN_AUTHORIZATION_PERMISSIONS[number]) =>
        SIGN_AUTHORIZATION_PERMISSIONS.includes(perm)
      )
  return !isExpired && isMatchPermissions
}

export function getEmailAlreadyUsedErrorMessage ({
  email,
  evmWallet,
  likeWallet
}: {
    email: string
    evmWallet?: string
    likeWallet?: string
  }) {
  if (evmWallet) {
    return $t('account_register_error_email_already_used_with_evm_wallet', { email, evmWallet })
  }
  if (likeWallet) {
    return $t('account_register_error_email_already_used_with_like_wallet', { email, likeWallet })
  }
  return $t('account_register_error_email_already_used', { email })
}

export interface MigrateMagicEmailUserResponseData {
  isMigratedBookUser: boolean
  isMigratedBookOwner: boolean
  isMigratedLikerId: boolean
  isMigratedLikerLand: boolean
}

export async function migrateMagicEmailUser ({
  wallet,
  signature,
  message
}: {
    wallet: string
    signature: string
    message: string
  }) {
  const { LIKE_CO_API } = useRuntimeConfig().public

  const url = `${LIKE_CO_API}/users/new/migrate`
  const result = await $fetch<MigrateMagicEmailUserResponseData>(url, {
    method: 'POST',
    body: {
      wallet,
      signature,
      message
    }
  })
  return result
}
