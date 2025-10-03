export function useRouteQuery () {
  const route = useRoute()
  return function getRouteQuery (key: string, defaultValue = '') {
    const value = route.query[key]
    return (Array.isArray(value) ? value[0] : value) || defaultValue
  }
}
