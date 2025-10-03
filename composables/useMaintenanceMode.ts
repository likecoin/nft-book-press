const WHITELISTED_ROUTE_NAMES = [
  'batch-short-links',
  'batch-qrcode'
]

export function useMaintenanceMode () {
  const config = useRuntimeConfig()
  const route = useRoute()
  const getRouteQuery = useRouteQuery()
  const getRouteBaseName = useRouteBaseName()

  const shouldOverrideMaintenancePage = computed(() => {
    return getRouteQuery('maintenance') === '0'
  })

  const isWhitelistedRoute = computed(() => {
    const routeName = getRouteBaseName(route)
    return !!routeName && typeof routeName === 'string' && WHITELISTED_ROUTE_NAMES.includes(routeName)
  })

  const isShowMaintenancePage = computed(() => (
    config.public.IS_MAINTENANCE &&
    !shouldOverrideMaintenancePage.value &&
    !isWhitelistedRoute.value
  ))

  return {
    isShowMaintenancePage
  }
}
