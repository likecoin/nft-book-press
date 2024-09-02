const AUTH_SESSION_KEY = 'likecoin_nft_book_press_token'
const POST_AUTH_REDIRECT_KEY = 'likecoin_nft_book_press_post_auth_redirect'

export function loadAuthSession () {
  try {
    const data = window.localStorage.getItem(AUTH_SESSION_KEY)
    if (data) {
      const { wallet, token } = JSON.parse(data)
      return {
        wallet,
        token
      }
    }
  } catch {}

  return null
}

export function saveAuthSession (session: { wallet: string, token: string }) {
  try {
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
  } catch {}
}

export function clearAuthSession () {
  try {
    window.localStorage.removeItem(AUTH_SESSION_KEY)
  } catch {}
}

export function savePostAuthRedirect () {
  try {
    const route = useRoute()
    window.sessionStorage.setItem(POST_AUTH_REDIRECT_KEY, route.fullPath)
  } catch {}
}

export function executePostAuthRedirect () {
  try {
    const route = window.sessionStorage.getItem(POST_AUTH_REDIRECT_KEY)
    const router = useRouter()
    router.replace(route || '/')
  } finally {
    clearPostAuthRedirect()
  }
}

export function clearPostAuthRedirect () {
  try {
    window.sessionStorage.removeItem(POST_AUTH_REDIRECT_KEY)
  } catch {}
}
