export function useOneTimePopup (key: string) {
  const show = ref(false)

  onMounted(() => {
    try {
      if (!localStorage.getItem(key)) {
        show.value = true
      }
    } catch (e) {
      show.value = true
    }
  })

  function close () {
    show.value = false
    try {
      localStorage.setItem(key, 'true')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to set localStorage item:', e)
    }
  }

  return { show, close }
}
