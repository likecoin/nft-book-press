<template>
  <UModal
    :model-value="true"
    :ui="{ width: 'sm:max-w-7xl', padding: 'p-4 sm:p-8' }"
  >
    <UCard
      :ui="{ body: { base: 'space-y-4 sm:p-8' } }"
    >
      <template #header>
        <div class="flex justify-end">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="handleClickBack"
          />
        </div>
      </template>

      <NewNFTBook
        class="flex flex-col gap-4"
        :class-id="classId"
        :edition-index="newEditionIndex"
        @submit="handleNewBookSubmit"
      />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">

const route = useRoute()
const localeRoute = useLocaleRoute()
const toast = useToast()

const classId = ref(route.params.classId?.toString() || '')
const newEditionIndex = computed(() => {
  return route.query.price_index?.toString() || ''
})

const isLoading = ref(false)

async function handleNewBookSubmit () {
  try {
    await navigateTo(localeRoute({
      name: 'my-books-status-classId',
      params: { classId: classId.value }
    }))
  } catch (err) {
    const errorData = (err as any).data || err
    // eslint-disable-next-line no-console
    console.error(errorData)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: errorData,
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  } finally {
    isLoading.value = false
  }
}

async function handleClickBack () {
  await navigateTo(localeRoute({
    name: 'my-books-status-classId',
    params: { classId: classId.value }
  }))
}

</script>
