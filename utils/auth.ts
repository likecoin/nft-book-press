import { jwtDecode } from 'jwt-decode'

const AUTH_SESSION_KEY = 'likecoin_nft_book_press_token'
const POST_AUTH_REDIRECT_ROUTE_KEY = 'likecoin_nft_book_press_post_auth_redirect'

export function loadAuthSession () {
  try {
    if (window.localStorage) {
      const data = window.localStorage.getItem(AUTH_SESSION_KEY)
      if (data) {
        const { wallet, token } = JSON.parse(data)
        return {
          wallet,
          token
        }
      }
    }
  } catch {}

  return null
}

export function saveAuthSession (session: { wallet: string, token: string }) {
  try {
    if (!window.localStorage) { return }

    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  } catch {}
}

export function clearAuthSession () {
  try {
    if (!window.localStorage) { return }

    window.localStorage.removeItem(AUTH_SESSION_KEY)
  } catch {}
}

export function setupPostAuthRedirect () {
  try {
    if (!window.sessionStorage) { return }

    const route = useRoute()
    window.sessionStorage.setItem(POST_AUTH_REDIRECT_ROUTE_KEY, route.fullPath)
  } catch {}
}

export async function executePostAuthRedirect () {
  try {
    if (!window.sessionStorage) { return }

    const route = window.sessionStorage.getItem(POST_AUTH_REDIRECT_ROUTE_KEY)
    const localeRoute = useLocaleRoute()
    await navigateTo(localeRoute(route || '/'), { replace: true })
  } finally {
    clearPostAuthRedirect()
  }
}

export function clearPostAuthRedirect () {
  try {
    if (!window.sessionStorage) { return }

    window.sessionStorage.removeItem(POST_AUTH_REDIRECT_ROUTE_KEY)
  } catch {}
}

export const SIGN_AUTHORIZATION_PERMISSIONS = [
  'read:nftbook',
  'write:nftbook',
  'read:nftcollection',
  'write:nftcollection',
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
