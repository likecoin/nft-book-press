<template>
  <UModal
    :model-value="true"
    :ui="{ width: 'sm:max-w-7xl', padding: 'p-4 sm:p-8' }"
  >
    <UCard
      ui="{ body: { base: 'space-y-4 sm:p-8' } }"
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

const router = useRouter()
const route = useRoute()
const toast = useToast()

const classId = ref(route.params.classId)
const newEditionIndex = ref(route.query.price_index)

const isLoading = ref(false)

function handleNewBookSubmit () {
  try {
    router.push({
      name: 'nft-book-store-status-classId',
      params: { classId: classId.value }
    })
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

function handleClickBack () {
  router.push({
    name: 'nft-book-store-status-classId',
    params: { classId: classId.value }
  })
}

</script>
