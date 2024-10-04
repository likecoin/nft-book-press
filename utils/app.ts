export function useAppLayout () {
  const route = useRoute()
  const isNavigationCollapsed = computed(() => route.query.nav === '0')
  return { isNavigationCollapsed }
}
