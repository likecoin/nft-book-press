<template>
  <div class="flex flex-col items-stretch grow space-y-4">
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <ISCNInfoCard
      :iscn-id="iscnId"
      :iscn-owner="iscnOwner"
      :iscn-data="iscnData"
      :show-edit-button="true"
      @edit="showEditISCNModal = true"
    />
    <LiteMintNFT
      ref="liteMintNFTRef"
      :iscn-data="iscnData"
      :should-show-submit="false"
      @form-valid-change="(valid) => (isFormValid = valid)"
      @submit="handleFinishMintNFT"
    />
    <EditISCNMetadataModal
      v-model="showEditISCNModal"
      :class-id="classId"
      @save="onSaveISCN"
    />
  </div>
</template>

<script setup lang="ts">

const { LCD_URL } = useRuntimeConfig().public
const router = useRouter()
const route = useRoute()

const step = ref(1)
const error = ref('')
const isLoading = ref(false)

const iscnOwner = ref('')
const iscnData = ref<any>(null)
const classId = ref('')
const liteMintNFTRef = ref<any>(null)

const iscnId = computed(() => iscnData.value?.['@id'])

const showEditISCNModal = ref(false)
const isFormValid = ref(false)

const emit = defineEmits(['submit', 'formValidChange', 'loadingChange'])

watch(isLoading, (val: boolean) => {
  emit('loadingChange', val)
  if (val) {
    error.value = ''
  }
}, { immediate: true })

watch(isFormValid, (val: boolean) => {
  console.log('isFormValid', val)
  emit('formValidChange', val)
}, { immediate: true })

useSeoMeta({
  title: 'Mint Liker Land NFT Book',
  ogTitle: 'Mint Liker Land NFT Book'
})

const props = defineProps({
  iscnId: {
    type: String,
    default: ''
  }
})

watch(() => props.iscnId, async (val: string) => {
  if (val) {
    await fetchISCNById(props.iscnId)
  }
}, { immediate: true })

async function fetchISCNById (iscnId?: string) {
  if (!iscnId) {
    return
  }
  try {
    isLoading.value = true
    if (iscnId.startsWith('iscn://')) {
      const data = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnId)}`)
      const { records, owner } = data as any
      iscnData.value = records[0].data
      iscnOwner.value = owner
      iscnData.value.owner = owner
      step.value = 2
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

function startNFTMintFlow () {
  liteMintNFTRef.value?.startNFTMintFlow()
}

function onSaveISCN (iscnId: string) {
  if (iscnId) {
    router.replace({ query: { ...route.query, iscn_id: iscnId } })
    fetchISCNById(iscnId)
  } else {
    window.location.reload()
  }
}

function handleFinishMintNFT (
  { classId: newClassId, nftMintCount, prefix }:
  { classId?: string, nftMintCount?: number, prefix?: string } = {}
) {
  classId.value = newClassId || ''

  emit('submit', {
    classId: newClassId || '',
    nftMintCount,
    prefix
  })
}

defineExpose({
  startNFTMintFlow
})

</script>
