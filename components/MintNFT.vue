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
    />
  </div>
</template>

<script setup lang="ts">

const {
  getClassOwner,
  getClassMetadata,
  checkNFTClassIsBookNFT
} = useNFTContractReader()

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
    if (iscnId.startsWith('0x')) {
      const isBookNFT = await checkNFTClassIsBookNFT(iscnId)
      if (!isBookNFT) {
        throw new Error('Invalid NFT Class ID')
      }
      const [data, owner] = await Promise.all([
        getClassMetadata(iscnId),
        getClassOwner(iscnId)
      ])
      if (!data) {
        throw new Error('Invalid NFT Class ID')
      }
      iscnData.value = { contentMetadata: data, owner, '@id': iscnId }
      iscnOwner.value = owner as string
      classId.value = iscnId
      step.value = 3
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

function handleFinishMintNFT ({ classId: newClassId, nftMintCount }: { classId?: string, nftMintCount?: number } = {}) {
  classId.value = newClassId || ''

  emit('submit', {
    classId: newClassId || '',
    nftMintCount
  })
}

defineExpose({
  startNFTMintFlow
})

</script>
