import { useStorage } from '@vueuse/core'

export function useOneTimePopup (key: string) {
  const storage = useStorage<boolean>(key, false)
  const show = ref(false)

  onMounted(() => {
    if (!storage.value) {
      show.value = true
    }
  })

  function close () {
    show.value = false
    storage.value = true
  }

  return { show, close }
}
