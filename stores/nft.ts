import { defineStore } from 'pinia'

export const useNftStore = defineStore('nft', () => {
  const { LCD_URL } = useRuntimeConfig().public
  const classMetadataByIdMap = ref({} as Record<string, any>)

  const getClassMetadataById = computed(() => (classId: string) => classMetadataByIdMap.value[classId])

  async function fetchClassMetadataById (classId: string) {
    const { error, data } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${classId}`)
    if (error.value) { throw error.value }
    const { class: classData } = data.value as any
    classMetadataByIdMap.value[classId] = classData
    return classData
  }

  function lazyFetchClassMetadataById (classId: string) {
    if (getClassMetadataById.value(classId)) { return getClassMetadataById.value(classId) }
    return fetchClassMetadataById(classId)
  }

  return {
    classMetadataByIdMap,
    getClassMetadataById,
    fetchClassMetadataById,
    lazyFetchClassMetadataById
  }
})
